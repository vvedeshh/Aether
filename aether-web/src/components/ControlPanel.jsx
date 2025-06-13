/**
 * ControlPanel.jsx
 * -----------------
 * Author: Vedesh Panday
 * Description:
 *   UI panel for configuring particle spawning behavior. Includes controls for
 *   spawn mode, count, size, color, visual effects (glow/trail), and gravity presets.
 *   Emits settings to parent components (like ParticleCanvas) on change.
 */

import { useState, useEffect } from "react";
import { FaSun, FaMoon, FaMagic, FaStream } from "react-icons/fa";

export default function ControlPanel({ onSettingsChange }) {
  const [count, setCount] = useState(10);
  const [size, setSize] = useState(1);
  const [color, setColor] = useState("#00ffff");
  const [mode, setMode] = useState("single");
  const [glow, setGlow] = useState(true);
  const [trail, setTrail] = useState(false);
  const [gravity, setGravity] = useState("none");

  // Notify parent when any setting changes
  useEffect(() => {
    onSettingsChange({ count, size, color, mode, glow, trail, gravity });
  }, [count, size, color, mode, glow, trail, gravity, onSettingsChange]);

  // Only one of glow or trail can be enabled
  const toggleEffect = (effect) => {
    if (effect === "glow") {
      setGlow(true);
      setTrail(false);
    } else {
      setGlow(false);
      setTrail(true);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2 style={{ marginBottom: "0.5rem" }}>Controls</h2>

      {/* Spawn Mode Dropdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div>
          <label style={{ fontSize: "0.9rem" }}>Spawn Mode</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)} style={inputStyle}>
            <option value="single">Single</option>
            <option value="burst">Burst</option>
          </select>
        </div>

        {/* Particle Count Input */}
        <div>
          <label style={{ fontSize: "0.9rem" }}>Particle Count</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(+e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Particle Size Input */}
        <div>
          <label style={{ fontSize: "0.9rem" }}>Particle Size</label>
          <input
            type="number"
            min={0.1}
            max={5}
            step={0.1}
            value={size}
            onChange={(e) => setSize(+e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Color Picker */}
        <div>
          <label style={{ fontSize: "0.9rem" }}>Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ width: "100%", height: "2rem", border: "none", background: "none" }}
          />
        </div>

        {/* Visual Effects Toggle (Glow vs Trail) */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => toggleEffect("glow")} style={glow ? pillSelected : pillUnselected}>
            <FaMagic style={{ marginRight: "0.5rem" }} /> Glow
          </button>

          <button
            onClick={() => toggleEffect("trail")}
            style={trail ? pillSelected : pillUnselected}
          >
            <FaStream style={{ marginRight: "0.5rem" }} /> Trail
          </button>
        </div>

        {/* Gravity Preset Dropdown */}
        <div>
          <label style={{ fontSize: "0.9rem" }}>Gravity</label>
          <select value={gravity} onChange={(e) => setGravity(e.target.value)} style={inputStyle}>
            <option value="none">None</option>
            <option value="earth">Earth (9.8)</option>
            <option value="moon">Moon (1.6)</option>
            <option value="mars">Mars (3.7)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// ---------- Styles ----------

const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  fontSize: "0.9rem",
  borderRadius: "0.5rem",
  border: "1px solid #444",
  backgroundColor: "#181818",
  color: "#fff",
  marginTop: "0.25rem",
  marginBottom: "0.75rem",
};

const pillSelected = {
  flex: 1,
  backgroundColor: "#6200ee",
  color: "#fff",
  border: "none",
  borderRadius: "999px",
  padding: "0.4rem 0.8rem",
  fontSize: "0.85rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const pillUnselected = {
  ...pillSelected,
  backgroundColor: "#2a2a2a",
  color: "#bbb",
};
