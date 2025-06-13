/**
 * Simulator.jsx
 * --------------
 * Author: Vedesh Panday
 * Description:
 *   Main component that powers the entire Aether particle simulator. Handles particle state,
 *   undo/redo stacks, user settings, and renders the canvas, control panels, and file modals.
 *   Also manages key interactions and HUD display (FPS, zoom, particle count).
 */

import * as THREE from "three";
import { useState, useEffect } from "react";
import ParticleCanvas from "../canvas/ParticleCanvas";
import ControlPanel from "../components/ControlPanel";
import ConfigPanel from "../components/ConfigPanel";
import cloneParticles from "../utils/cloneParticles";

export default function Simulator() {
  const [settings, setSettings] = useState({
    count: 10,
    size: 1,
    color: "#00ffff",
    mode: "single",
    glow: true,
    trail: false,
    gravity: "none",
  });

  const [particles, setParticles] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isClearing, setIsClearing] = useState(false);
  const [zoom, setZoom] = useState("0.0");
  const [fps, setFps] = useState(0);
  const [showModal, setShowModal] = useState(false);

  /**
   * Spawns a new batch of particles and logs it to the undo stack.
   */
  const spawnParticles = (newBatch) => {
    setUndoStack((prev) => [...prev, cloneParticles(newBatch)]);
    setRedoStack([]);
    setParticles((prev) => [...prev, ...newBatch]);
  };

  /**
   * Undo the last particle spawn by popping from undo stack.
   */
  const undo = () => {
    if (undoStack.length === 0) return;
    const prev = [...undoStack];
    const lastBatch = prev.pop();
    setUndoStack(prev);
    setRedoStack((r) => [...r, cloneParticles(lastBatch)]);
    setParticles((prev) => prev.slice(0, prev.length - lastBatch.length));
  };

  /**
   * Redo the last undone particle spawn by popping from redo stack.
   */
  const redo = () => {
    if (redoStack.length === 0) return;
    const prev = [...redoStack];
    const batchToRestore = prev.pop();
    setRedoStack(prev);
    setUndoStack((u) => [...u, cloneParticles(batchToRestore)]);
    setParticles((prev) => [...prev, ...batchToRestore]);
  };

  /**
   * Clears all particles and resets history stacks.
   */
  const clearAll = () => {
    if (particles.length === 0) return;
    setUndoStack([]);
    setRedoStack([]);
    setParticles([]);
  };

  // Adds a random force to all particles when "F" is pressed
  useEffect(() => {
    const handleForceKick = (e) => {
      if (e.key.toLowerCase() === "f") {
        setParticles((prev) =>
          prev.map((p) => ({
            ...p,
            velocity: p.velocity
              .clone()
              .add(
                new THREE.Vector3(
                  THREE.MathUtils.randFloatSpread(1),
                  THREE.MathUtils.randFloatSpread(1),
                  THREE.MathUtils.randFloatSpread(1)
                )
              ),
          }))
        );
      }
    };

    window.addEventListener("keydown", handleForceKick);
    return () => window.removeEventListener("keydown", handleForceKick);
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#101010" }}>
      {/* Sidebar UI */}
      <div
        style={{ width: "270px", padding: "1rem", borderRight: "1px solid #333", color: "#fff" }}
      >
        <ControlPanel onSettingsChange={setSettings} />
        <hr style={{ margin: "1rem 0", borderColor: "#333" }} />
        <ConfigPanel
          particles={particles}
          spawnParticles={spawnParticles}
          undo={undo}
          redo={redo}
          clearAll={clearAll}
          canUndo={undoStack.length > 0}
          canRedo={redoStack.length > 0}
        />
        <button onClick={() => setShowModal(true)} style={{ ...buttonStyle, marginTop: "1rem" }}>
          📄 Browse Saved Files
        </button>
      </div>

      {/* Canvas + HUD */}
      <div style={{ flexGrow: 1, position: "relative" }}>
        <ParticleCanvas
          settings={settings}
          particles={particles}
          setParticles={setParticles}
          spawnParticles={spawnParticles}
          setZoom={setZoom}
          setFps={setFps}
          isClearing={isClearing}
        />
        {/* HUD display */}
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            display: "flex",
            gap: "1rem",
            background: "rgba(0,0,0,0.6)",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "0.9rem",
            zIndex: 100,
            pointerEvents: "none",
          }}
        >
          <div>🧱 Particles: {particles.length}</div>
          <div>🎯 Zoom: {zoom}</div>
          <div>⚡ FPS: {fps}</div>
        </div>
      </div>

      {showModal && <FileBrowserModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

/**
 * FileBrowserModal
 * A modal that lists saved particle configurations from the backend.
 * Supports sorting and searching.
 */
function FileBrowserModal({ onClose }) {
  const [configs, setConfigs] = useState([]);
  const [sortMode, setSortMode] = useState("recent");
  const [search, setSearch] = useState("");

  // Fetch sorted configs on sort mode change
  useEffect(() => {
    const fetchSorted = async () => {
      try {
        const baseSort = sortMode.includes("count") ? "count" : "recent";
        const res = await fetch(`http://localhost:5291/api/ParticleConfig/sorted/${baseSort}`);
        let data = await res.json();

        if (sortMode.endsWith("-asc")) {
          data = data.reverse();
        }

        setConfigs(data);
      } catch (err) {
        console.error("❌ Failed to fetch sorted configs", err);
      }
    };

    fetchSorted();
  }, [sortMode]);

  const filtered = configs.filter((cfg) => cfg.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={backdrop}>
      <div style={modal}>
        <div style={header}>
          <h2 style={{ margin: 0 }}>📁 Particle Files</h2>
          <button onClick={onClose} style={closeBtn}>
            ✖
          </button>
        </div>

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
            <option value="count">Sort by Count (Low → High)</option>
            <option value="count-asc">Sort by Count (High → Low)</option>
          </select>
        </div>

        <div style={cardGrid}>
          {filtered.map((cfg, i) => (
            <div key={`${cfg.name}-${i}`} style={card}>
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

const buttonStyle = {
  width: "100%",
  backgroundColor: "#7b4cff",
  color: "#fff",
  border: "none",
  borderRadius: "999px",
  padding: "0.6rem 1.2rem",
  fontSize: "0.9rem",
  cursor: "pointer",
};

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
