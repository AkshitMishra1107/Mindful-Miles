import React from "react";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 shadow-sm"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 28px",
        backgroundColor: "#fdfdf9", // very light off-white with warmth
        color: "#374151", // soft dark gray
        borderBottom: "1px solid #e6eed6", // pale greenish border
      }}
    >
      {/* Logo Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            backgroundColor: "#d9f2d9", // pastel green
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "16px",
            color: "#4a6c4f", // muted forest green
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          MM
        </div>
        <div>
          <div
            style={{
              fontWeight: "600",
              fontSize: "20px",
              letterSpacing: "0.5px",
              color: "#2f4f4f",
            }}
          >
            Mindful Miles
          </div>
          <div style={{ fontSize: "13px", color: "#6b7280" }}>
            Discover wellness
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav>
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            padding: 0,
            margin: 0,
            gap: "14px",
          }}
        >
          {[
            { label: "Home", href: "#/" },
            { label: "Experiences", href: "#experiences" },
            { label: "Planner", href: "#planner" },
          ].map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                style={{
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  backgroundColor: "#f0f8e7", // pale green-yellow
                  color: "#374151",
                  fontWeight: "500",
                  textDecoration: "none",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                  transition: "all 0.3s ease",
                  display: "inline-block",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#e4f3d4"; // softer hover
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#f0f8e7";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
