/**
 * saveLoad.js
 * ------------
 * Author: Vedesh Panday
 * Description:
 *   Provides functions to save particle data as a downloadable JSON file
 *   and to load a previously saved file into the simulator.
 *   Supports both camelCase and PascalCase property names for compatibility with backend.
 */

import * as THREE from "three";

// Save particles as a JSON file with timestamped filename
export function saveParticlesToFile(particles) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `particles-${timestamp}`;

  const json = JSON.stringify(
    {
      Name: filename,
      SavedAt: new Date().toISOString(),
      Particles: particles.map((p) => ({
        Position: p.position.toArray(),
        Velocity: p.velocity.toArray(),
        Color: p.color,
        Size: p.size,
        Gravity: p.gravity,
      })),
      Description: null,
    },
    null,
    2
  );

  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.json`;
  a.click();

  URL.revokeObjectURL(url);
}

/**
 * Opens file picker and loads a JSON file as particle objects.
 * Accepts callback to return reconstructed particle array.
 */
export function loadParticlesFromFile(callback) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = reader.result;
        const parsed = JSON.parse(raw);

        // Allows PascalCase or camelCase
        const particles = parsed.particles || parsed.Particles;
        if (!Array.isArray(particles)) throw new Error("Invalid particle structure");

        const reconstructed = particles.map((p) => ({
          position: new THREE.Vector3(...(p.position || p.Position)),
          velocity: new THREE.Vector3(...(p.velocity || p.Velocity)),
          size: p.size ?? p.Size,
          color: p.color || p.Color,
          gravity: p.gravity ?? p.Gravity ?? 0,
        }));

        callback(reconstructed);
      } catch (err) {
        console.error("❌ File parsing error:", err);
        alert("⚠️ Invalid file format. Please choose a valid particle config JSON.");
      }
    };

    reader.readAsText(file);
  };

  input.click();
}
