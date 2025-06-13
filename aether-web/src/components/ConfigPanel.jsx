/**
 * ConfigPanel.jsx
 * ----------------
 * Author: Vedesh Panday
 * Description:
 *   Provides user controls for saving, loading, and clearing particle configurations.
 *   Supports saving to local file or backend server, loading saved presets,
 *   and undo/redo functionality.
 */

import * as THREE from "three";
import { useState, useEffect } from "react";
import { FaSave, FaFolderOpen, FaUndo, FaRedo, FaBroom } from "react-icons/fa";
import { loadParticlesFromFile, saveParticlesToFile } from "../utils/saveLoad";

export default function ConfigPanel({
  particles,
  undo,
  redo,
  clearAll,
  canUndo,
  canRedo,
  spawnParticles,
}) {
  const [message, setMessage] = useState("");
  const [configs, setConfigs] = useState([]);
  const [chosenLoad, setChosenLoad] = useState("");

  // Fetch list of saved configs from the backend
  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await fetch("http://localhost:5291/api/ParticleConfig");
      const names = await res.json();
      setConfigs(names);
    } catch (err) {
      console.error("Failed to load config list", err);
    }
  };

  // Adds random velocity to loaded particles
  const addKick = () => {
    return new THREE.Vector3(
      Math.random() * 0.4 - 0.2,
      Math.random() * 0.4 - 0.2,
      Math.random() * 0.4 - 0.2
    );
  };

  // Save current particles to the server
  const handleServerSave = async () => {
    let name = prompt("Enter config name");
    if (!name) return;

    const exists = configs.includes(name);
    if (exists) {
      alert(`❌ A config named "${name}" already exists. Overwriting is not allowed.`);
      return;
    }

    const payload = {
      name,
      savedAt: new Date().toISOString(),
      particles: particles.map((p) => ({
        position: p.position.toArray(),
        velocity: p.velocity.toArray(),
        size: p.size,
        color: p.color,
        gravity: p.gravity,
      })),
    };

    try {
      const res = await fetch("http://localhost:5291/api/ParticleConfig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");
      setMessage(`💾 Saved "${name}"`);
      fetchConfigs();
    } catch (err) {
      console.error(err);
      setMessage("❌ Save failed.");
    }
  };

  // Load a config from the server and reconstruct particles
  const handleServerLoad = async () => {
    if (!chosenLoad) return;
    try {
      const res = await fetch(
        `http://localhost:5291/api/ParticleConfig/${encodeURIComponent(chosenLoad)}`
      );
      if (!res.ok) throw new Error("Load failed");
      const cfg = await res.json();
      const reconstructed = cfg.particles.map((p) => ({
        position: new THREE.Vector3(...p.position),
        velocity: addKick(),
        size: p.size,
        color: p.color,
        gravity: p.gravity,
      }));
      spawnParticles(reconstructed);
      setMessage(`📥 Loaded "${chosenLoad}"`);
    } catch (err) {
      console.error(err);
      setMessage("❌ Load failed.");
    }
  };

  // Load particles from local JSON file
  const handleLocalLoad = () => {
    loadParticlesFromFile((loaded) => {
      const reconstructed = loaded.map((p) => ({
        position: new THREE.Vector3(...p.position),
        velocity: addKick(),
        size: p.size,
        color: p.color,
        gravity: p.gravity,
      }));
      spawnParticles(reconstructed);
      setMessage("📂 Loaded from File");
    });
  };

  return (
    <div style={container}>
      <h2>Config</h2>

      {/* Save Buttons */}
      <div style={rowWrap}>
        <button
          onClick={handleServerSave}
          disabled={!particles.length}
          style={{ ...smallBtn, ...(particles.length ? {} : disabledBtn) }}
        >
          <FaSave /> Server
        </button>
        <button
          onClick={() => {
            saveParticlesToFile(particles);
            setMessage("📁 Saved to file");
          }}
          disabled={!particles.length}
          style={{ ...smallBtn, ...(particles.length ? {} : disabledBtn) }}
        >
          <FaSave /> File
        </button>
      </div>

      {/* Dropdown and Load Buttons */}
      <select
        value={chosenLoad}
        onChange={(e) => setChosenLoad(e.target.value)}
        style={dropdownStyle}
      >
        <option value="">— Choose config —</option>
        {configs.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <button
        onClick={handleServerLoad}
        disabled={!chosenLoad}
        style={{ ...fullBtn, ...(!chosenLoad ? disabledBtn : {}) }}
      >
        <FaFolderOpen /> Load Server
      </button>

      <button onClick={handleLocalLoad} style={fullBtn}>
        <FaFolderOpen /> Load from File
      </button>

      {/* Clear All Particles */}
      <button
        onClick={clearAll}
        disabled={!particles.length}
        style={{ ...fullBtn, ...(particles.length ? {} : disabledBtn) }}
      >
        <FaBroom /> Clear All
      </button>

      {/* Undo/Redo Controls */}
      <div style={rowWrap}>
        <button
          onClick={undo}
          disabled={!canUndo}
          style={{ ...smallBtn, ...(canUndo ? {} : disabledBtn) }}
        >
          <FaUndo /> Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          style={{ ...smallBtn, ...(canRedo ? {} : disabledBtn) }}
        >
          <FaRedo /> Redo
        </button>
      </div>

      {/* Feedback message */}
      {message && (
        <p style={{ marginTop: "0.4rem", fontSize: "0.85rem", color: "#ccc" }}>{message}</p>
      )}
    </div>
  );
}

// ---------- Styles ----------

const container = {
  padding: "0.75rem 1rem 0.25rem",
  color: "white",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
};

const baseBtn = {
  backgroundColor: "#7b4cff",
  color: "#fff",
  border: "none",
  borderRadius: "999px",
  fontSize: "0.85rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  cursor: "pointer",
  transition: "transform 0.15s ease, opacity 0.2s ease",
};

const fullBtn = {
  ...baseBtn,
  padding: "0.5rem 1rem",
  width: "100%",
  marginBottom: "0.6rem",
};

const smallBtn = {
  ...baseBtn,
  flex: 1,
  padding: "0.4rem 0.5rem",
  whiteSpace: "nowrap",
};

const dropdownStyle = {
  ...fullBtn,
  backgroundColor: "#2a2a2a",
  color: "#fff",
  marginBottom: "0.4rem",
  cursor: "pointer",
};

const rowWrap = {
  display: "flex",
  gap: "0.5rem",
  justifyContent: "space-between",
  marginBottom: "0.4rem",
};

const disabledBtn = {
  opacity: 0.5,
  cursor: "not-allowed",
};

// Injects ripple effect on hover globally
const style = document.createElement("style");
style.innerHTML = `
  button:hover:not(:disabled) {
    transform: scale(1.03);
    opacity: 0.95;
  }
`;
document.head.appendChild(style);
