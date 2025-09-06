import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Experiences from "./pages/Experiences";
import PlannerPage from "./pages/PlannerPage";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  const [city, setCity] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [hash, setHash] = useState(window.location.hash.replace("#", ""));

  // Update hash state when browser hash changes
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash.replace("#", ""));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto px-4">
        {(!hash || hash === "/") && <Home setCity={setCity} setLastSearch={setLastSearch} />}
        {hash === "experiences" && <Experiences city={city || lastSearch} />}
        {hash === "planner" && <PlannerPage />}
      </main>
      <ChatWidget />
    </div>
  );
}
