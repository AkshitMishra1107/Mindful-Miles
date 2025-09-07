import React, { useEffect, useState } from "react";

export default function PlannerPage() {
  const [planner, setPlanner] = useState([]);

  // Load planner from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("planner");
    setPlanner(saved ? JSON.parse(saved) : []);
  }, []);

  // Remove an item
  function remove(id) {
    const updated = planner.filter(item => item.id !== id);
    setPlanner(updated);
    localStorage.setItem("planner", JSON.stringify(updated));
  }

  return (
    <div style={{ marginTop: 24 }}>
      <div className="itinerary p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Your Wellness Planner</h2>
            <p className="text-sm text-gray-600">
              Simple itinerary of your selected experiences
            </p>
          </div>
        </div>

        {planner.length === 0 ? (
          <p className="text-gray-500 mt-4">No experiences added yet.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {planner.map(item => (
              <li
                key={item.id}
                className="p-4 bg-white shadow rounded-lg flex justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.location}</p>
                </div>
                <button
                  onClick={() => remove(item.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
