/**
 * Mindful Miles - Backend (Hybrid image flow)
 * - Express server
 * - Overpass API for POIs
 * - Image resolution: Google Places photo -> Pixabay search -> local fallback SVGs
 * - Planner persistence in planner.json
 * - Chat endpoint with Gemini API
 *
 * Put your API keys in backend/.env (see .env.example)
 */

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const plannerFile = path.join(__dirname, "planner.json");
const publicUrlBase =
  process.env.PUBLIC_URL_BASE || "http://localhost:5173"; // for local fallbacks

// === Helpers ===
function readPlanner() {
  try {
    if (!fs.existsSync(plannerFile)) return [];
    return JSON.parse(fs.readFileSync(plannerFile));
  } catch (e) {
    return [];
  }
}
function writePlanner(d) {
  fs.writeFileSync(plannerFile, JSON.stringify(d, null, 2));
}

function buildGooglePhotoUrl(photo_reference, maxwidth = 800) {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key || !photo_reference) return null;
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${photo_reference}&key=${key}`;
}

async function googlePlacePhotoForName(name, city) {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key || !name) return null;
  try {
    const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      name + " " + city
    )}&inputtype=textquery&fields=place_id&key=${key}`;
    const findRes = await axios.get(findUrl);
    const place_id =
      (findRes.data.candidates &&
        findRes.data.candidates[0] &&
        findRes.data.candidates[0].place_id) ||
      null;
    if (!place_id) return null;

    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=photo&key=${key}`;
    const detailsRes = await axios.get(detailsUrl);
    const photos = detailsRes.data.result && detailsRes.data.result.photos;
    if (photos && photos.length > 0) {
      return buildGooglePhotoUrl(photos[0].photo_reference, 1000);
    }
    return null;
  } catch (e) {
    console.error("Google Places error", e.message || e);
    return null;
  }
}

async function pixabaySearch(query) {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) return null;

  try {
    const url = `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(
      query
    )}&image_type=photo&per_page=20&safesearch=true`;
    const res = await axios.get(url);
    const results = res.data && res.data.hits;

    if (results && results.length > 0) {
      const randomIndex = Math.floor(Math.random() * results.length);
      return results[randomIndex].webformatURL;
    }
    return null;
  } catch (e) {
    console.error("Pixabay error", e.message || e);
    return null;
  }
}

function fallbackLocalImageForCategory(cat) {
  const map = {
    Meditation: "/images/yoga.svg",
    "Herbal Therapy": "/images/herbal.svg",
    Cooking: "/images/cooking.svg",
    Nature: "/images/nature.svg",
    Other: "/images/yoga.svg",
  };
  return (
    (process.env.PUBLIC_URL_BASE || publicUrlBase) +
    (map[cat] || map["Other"])
  );
}

function normalizeType(t) {
  if (!t) return "Other";
  const s = (t || "").toLowerCase();
  if (s.includes("yoga") || s.includes("meditat")) return "Meditation";
  if (s.includes("ayur") || s.includes("spa") || s.includes("herbal"))
    return "Herbal Therapy";
  if (s.includes("cook") || s.includes("cooking")) return "Cooking";
  if (s.includes("park") || s.includes("forest") || s.includes("nature"))
    return "Nature";
  return "Other";
}

async function fetchWellnessSpots(city) {
  try {
    const query = `
[out:json][timeout:25];
area["name"="${city}"]["boundary"="administrative"]->.searchArea;
(
  node["leisure"="park"](area.searchArea);
  node["amenity"="spa"](area.searchArea);
  node["healthcare"="clinic"](area.searchArea);
  node["leisure"="fitness_centre"](area.searchArea);
  node["name"~"yoga|ashram|meditation|ayurveda|spa", i](area.searchArea);
);
out center 50;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
      query
    )}`;
    const resp = await axios.get(url, { timeout: 30000 });
    return resp.data.elements || [];
  } catch (e) {
    console.error("Overpass error", e.message || e);
    return [];
  }
}

// === Routes ===
// Experiences
app.get("/api/experiences/:city", async (req, res) => {
  const city = req.params.city;
  if (!city) return res.status(400).json({ error: "City required" });

  const elements = await fetchWellnessSpots(city);
  const items = [];

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const tags = el.tags || {};
    const name = tags.name || "Wellness Spot";
    const rawType =
      tags.amenity || tags.leisure || tags.shop || "Wellness";
    const category = normalizeType(rawType);

    let imageUrl = null;
    try {
      imageUrl = await googlePlacePhotoForName(name, city);
    } catch (e) {
      imageUrl = null;
    }
    if (!imageUrl) {
      const q = `${category} ${city} India`;
      imageUrl = await pixabaySearch(q);
    }
    if (!imageUrl) {
      imageUrl = fallbackLocalImageForCategory(category);
    }

    items.push({
      id: `osm-${el.type}-${el.id}`,
      name,
      type: rawType,
      category,
      description:
        tags.description || tags["name:en"] || "A local wellness spot",
      benefits: "Stress reduction, mindfulness, cultural immersion",
      duration: ["30 mins", "45 mins", "1 hour", "90 mins", "2 hours"][i % 5],
      image: imageUrl,
      lat: el.lat || (el.center && el.center.lat) || null,
      lon: el.lon || (el.center && el.center.lon) || null,
      location: city,
    });
  }

  if (items.length === 0) {
    const curated = [
      {
        id: "cur-1",
        name: `Morning Yoga by the Ganges`,
        type: "yoga",
        category: "Meditation",
        description: "Guided riverside yoga",
        benefits: "Stress reduction",
        duration: "1 hour",
        image: fallbackLocalImageForCategory("Meditation"),
        location: city,
        lat: null,
        lon: null,
      },
      {
        id: "cur-2",
        name: `Ayurvedic Therapy`,
        type: "spa",
        category: "Herbal Therapy",
        description: "Traditional ayurveda",
        benefits: "Detox",
        duration: "90 mins",
        image: fallbackLocalImageForCategory("Herbal Therapy"),
        location: city,
        lat: null,
        lon: null,
      },
    ];
    return res.json(curated);
  }

  res.json(items);
});

// Planner
app.get("/api/planner", (req, res) => res.json(readPlanner()));
app.post("/api/planner", (req, res) => {
  const item = req.body;
  if (!item || !item.id)
    return res.status(400).json({ error: "Planner item with id required" });
  const planner = readPlanner();
  if (!planner.find((p) => p.id === item.id)) {
    planner.push(item);
    writePlanner(planner);
  }
  res.json({ message: "Added", planner });
});
app.delete("/api/planner/:id", (req, res) => {
  const id = req.params.id;
  let planner = readPlanner();
  planner = planner.filter((p) => p.id !== id);
  writePlanner(planner);
  res.json({ message: "Removed", planner });
});

// Chat (Gemini)
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

app.post("/api/chat", async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: "message required" });
  if (!genAI) {
    return res.status(500).json({
      error:
        "GEMINI_API_KEY not set in backend/.env. Chat requires a Gemini API key.",
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    const reply = result.response.text();
    res.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err.message || err);
    res.status(500).json({ error: "Failed to fetch Gemini response" });
  }
});

// Start
app.listen(PORT, () =>
  console.log(`Mindful Miles backend listening on ${PORT}`)
);

