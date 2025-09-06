import React, { useState } from "react";

export default function Home({ setCity, setLastSearch }) {
  const [q, setQ] = useState("");

  function go() {
    const city = q.trim();
    if (!city) return alert("Please enter a city (e.g., Rishikesh)");
    setCity(city);
    setLastSearch(city);
    window.location.hash = "#experiences";
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div
        className="hero relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=1600&q=80&auto=format&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(240, 248, 231, 0.65)" }} // pastel overlay
        />
        <div className="relative z-10 text-center max-w-3xl px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#2f4f4f] leading-tight drop-shadow-md">
            Travel with Intention. <br /> Rejuvenate with Culture.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-700">
            Mindful Miles curates authentic wellness experiences — from
            riverside yoga to ayurvedic retreats and mindful cooking classes.
          </p>

          {/* Search Row */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Enter city (e.g., Rishikesh, Kochi)"
              className="px-4 py-3 rounded-lg w-full sm:w-80 focus:outline-none border border-gray-300 bg-white text-gray-800 shadow-sm"
            />
            <button
              className="px-6 py-3 rounded-lg font-semibold bg-[#d9f2d9] text-[#2f4f4f] shadow-md hover:bg-[#c9e9c9] transition"
              onClick={go}
            >
              Explore
            </button>
            <a
              href="#planner"
              className="px-6 py-3 rounded-lg font-semibold bg-[#fdf6e4] text-[#444] shadow-md hover:bg-[#faedcd] transition"
            >
              View Planner
            </a>
          </div>
        </div>
      </div>

      {/* Concept Section */}
      <div className="concept-section" style={{ backgroundColor: "#fdfdf9" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#2f4f4f]">
            What Makes Mindful Miles Special?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-[#e6eed6] shadow-sm rounded-2xl p-6 hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-3 text-[#4a6c4f]">
                🌿 Local Wellness
              </h3>
              <p className="text-gray-600">
                Discover yoga traditions, meditation retreats, and herbal
                therapies deeply rooted in local culture.
              </p>
            </div>
            <div className="bg-white border border-[#e6eed6] shadow-sm rounded-2xl p-6 hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-3 text-[#4a6c4f]">
                🍲 Mindful Living
              </h3>
              <p className="text-gray-600">
                Join cooking classes, eat fresh, and embrace the healthy
                lifestyle of the community you visit.
              </p>
            </div>
            <div className="bg-white border border-[#e6eed6] shadow-sm rounded-2xl p-6 hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-3 text-[#4a6c4f]">
                🌍 Immersive Travel
              </h3>
              <p className="text-gray-600">
                Go beyond sightseeing — recharge your body and mind while
                connecting with nature and traditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
