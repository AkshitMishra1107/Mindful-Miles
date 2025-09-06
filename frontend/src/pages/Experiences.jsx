import React, { useEffect, useState } from "react";
import axios from "axios";

const TYPES = ["All", "Meditation", "Herbal Therapy", "Cooking", "Nature"];

function normalizeType(t) {
  if (!t) return "Other";
  const s = t.toLowerCase();
  if (s.includes("yoga") || s.includes("meditat")) return "Meditation";
  if (s.includes("ayur") || s.includes("spa") || s.includes("herbal")) return "Herbal Therapy";
  if (s.includes("cook") || s.includes("cooking")) return "Cooking";
  if (s.includes("park") || s.includes("forest") || s.includes("nature")) return "Nature";
  return "Other";
}

export default function Experiences({ city }) {
  const [spots, setSpots] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const c = city || prompt("Enter city to search experiences (e.g., Rishikesh)");

  useEffect(() => {
    if (!c) return;
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/experiences/${encodeURIComponent(c)}`)
      .then((res) => {
        const mapped = (res.data || []).map((s) => ({
          ...s,
          _category: normalizeType(s.type),
        }));
        setSpots(mapped);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch experiences. Is backend running?");
      })
      .finally(() => setLoading(false));
  }, [c]);

  // ✅ Save to localStorage so PlannerPage can read it
  function addToPlanner(item) {
    const saved = JSON.parse(localStorage.getItem("planner") || "[]");
    if (!saved.some((p) => p.id === item.id)) {
      saved.push({
        id: item.id,
        name: item.name,
        location: item.location,
        type: item._category,
      });
      localStorage.setItem("planner", JSON.stringify(saved));
      alert("Added to planner!");
    } else {
      alert("This experience is already in your planner.");
    }
  }

  const visible = spots.filter((s) => filter === "All" || s._category === filter);

  return (
    <div style={{ marginTop: 20 }}>
      <div
        className="p-6 rounded-xl shadow-sm"
        style={{ background: "#fdfdf9", border: "1px solid #e6eed6" }}
      >
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[#2f4f4f]">
              Wellness experiences in {c}
            </h2>
            <p className="text-sm text-gray-600">Filtered: {filter}</p>
          </div>

          {/* Filter Row */}
          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-gray-700"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <a
              href="#planner"
              className="px-4 py-2 rounded-lg font-medium bg-[#fdf6e4] text-[#444] shadow-sm hover:bg-[#faedcd] transition"
            >
              Open Planner
            </a>
          </div>
        </div>

        {/* Experiences Grid */}
        <div style={{ marginTop: 20 }}>
          {loading && <p className="text-gray-500">Loading experiences...</p>}
          {!loading && visible.length === 0 && (
            <p className="text-gray-500">
              No experiences found for {c} with selected filter.
            </p>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {visible.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl overflow-hidden shadow-sm border border-[#e6eed6] hover:shadow-md transition bg-white flex flex-col"
              >
                <img
                  src={s.image}
                  alt={s.name}
                  onError={(e) => {
                    e.target.src = "/images/yoga.svg";
                  }}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 text-xs rounded-full bg-[#d9f2d9] text-[#2f4f4f] font-medium">
                      {s._category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {s.duration || "30-60 mins"}
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold text-lg text-[#2f4f4f]">
                    {s.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 flex-grow">
                    {s.description}
                  </p>
                  <p className="text-sm text-[#059669] font-medium mt-2">
                    Benefits: {s.benefits}
                  </p>

                  {/* Buttons */}
                  <div className="mt-4 flex gap-3">
                    <button
                      className="px-4 py-2 rounded-lg bg-[#d9f2d9] text-[#2f4f4f] shadow hover:bg-[#c9e9c9] transition font-medium"
                      onClick={() => addToPlanner(s)}
                    >
                      Add to Planner
                    </button>
                    <a
                      className="px-4 py-2 rounded-lg border border-[#059669] text-[#059669] font-medium hover:bg-[#e6f8f1] transition"
                      href={`https://www.google.com/maps/search/?api=1&query=${s.lat || ""},${s.lon || ""}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open Map
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
