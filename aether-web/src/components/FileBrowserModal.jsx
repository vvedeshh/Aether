/**
 * FileBrowserModal.jsx
 * ---------------------
 * Author: Vedesh Panday
 * Description:
 *   Modal window for browsing and viewing saved particle configurations.
 *   Supports sorting by timestamp or particle count, filtering via search input,
 *   and displays each config’s name, particle count, and timestamp.
 */

import { useEffect, useState } from "react";

export default function FileBrowserModal({ onClose }) {
  const [configs, setConfigs] = useState([]);
  const [sortMode, setSortMode] = useState("recent");
  const [search, setSearch] = useState("");

  // Fetch sorted config list on mount or sort mode change
  useEffect(() => {
    const fetchSorted = async () => {
      try {
        let endpoint = "http://localhost:5291/api/ParticleConfig/sorted/";

        if (sortMode.startsWith("recent")) {
          endpoint += "recent";
        } else {
          endpoint += "count";
        }

        const res = await fetch(endpoint);
        let data = await res.json();

        // Reverse array if ascending is selected
        if (sortMode.endsWith("asc")) {
          data = data.reverse();
        }

        setConfigs(data);
      } catch (err) {
        console.error("❌ Failed to fetch sorted configs", err);
      }
    };

    fetchSorted();
  }, [sortMode]);

  // Filter configs by name
  const filtered = configs.filter((cfg) => cfg.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={backdrop}>
      <div style={modal}>
        {/* Header */}
        <div style={header}>
          <h2 style={{ margin: 0 }}>📁 Particle Files</h2>
          <button onClick={onClose} style={closeBtn}>
            ✖
          </button>
        </div>

        {/* Search + Sort Controls */}
        <div style={{ margin: "1rem 0", display: "flex", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={input}
          />
          <select value={sortMode} onChange={(e) => setSortMode(e.target.value)} style={input}>
            <option value="recent">Sort by Recent (Newest)</option>
            <option value="recent-asc">Sort by Recent (Oldest)</option>
            <option value="count">Sort by Count (High → Low)</option>
            <option value="count-asc">Sort by Count (Low → High)</option>
          </select>
        </div>

        {/* Config Cards */}
        <div style={cardGrid}>
          {filtered.map((cfg) => (
            <div key={cfg.name} style={card}>
              <h3 style={{ margin: "0 0 0.5rem" }}>{cfg.name}</h3>
              <p style={{ margin: 0 }}>🧱 {cfg.particleCount} particles</p>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#aaa" }}>
                ⏱️ {new Date(cfg.savedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Styles ----------

const backdrop = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modal = {
  background: "#181818",
  borderRadius: "10px",
  padding: "1.5rem",
  width: "700px",
  maxHeight: "80vh",
  overflowY: "auto",
  color: "#fff",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const closeBtn = {
  background: "none",
  border: "none",
  color: "#fff",
  fontSize: "1.2rem",
  cursor: "pointer",
};

const input = {
  padding: "0.5rem",
  fontSize: "0.9rem",
  borderRadius: "0.5rem",
  border: "1px solid #444",
  backgroundColor: "#101010",
  color: "#fff",
  flex: 1,
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "1rem",
};

const card = {
  backgroundColor: "#252525",
  borderRadius: "0.5rem",
  padding: "1rem",
  boxShadow: "0 0 10px rgba(0,0,0,0.3)",
};
