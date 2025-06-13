/**
 * Home.jsx
 * ---------
 * Author: Vedesh Panday
 * Description:
 *   Landing page for Aether. Features animated title, launch button, and logo.
 *   Provides a link to the simulator with visual polish using custom CSS keyframes.
 *   Dynamically injects CSS animations on mount.
 */

import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  // Inject custom CSS animations on component mount
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes shimmer {
        0% { background-position: 0% center; }
        100% { background-position: 200% center; }
      }

      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      .launch-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(123, 76, 255, 0.5);
      }

      .launch-btn::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.15) 10%, transparent 60%);
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
        transition: transform 0.4s ease, opacity 0.4s ease;
        pointer-events: none;
        border-radius: 50%;
        z-index: 0;
      }

      .launch-btn:hover::after {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src="/public/aether-logo.png" alt="Aether Logo" style={styles.logo} />
        <h1 style={styles.title}>Aether</h1>
        <p style={styles.subtitle}>Welcome to the Particle Physics Simulator.</p>
        <Link to="/simulator">
          <button className="launch-btn" style={styles.button}>
            🚀 Launch Simulator
          </button>
        </Link>
      </div>
    </div>
  );
}

// ---------- Styles ----------

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#121212",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "rgba(255, 255, 255, 0.04)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "3rem 4rem",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
    color: "#fff",
    border: "2px solid",
    borderImage: "linear-gradient(135deg, #7b4cff, #00ffff) 1",
  },
  logo: {
    width: "180px",
    height: "auto",
    marginBottom: "1rem",
    animation: "pulseBounce 2.8s ease-in-out infinite",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "0.5rem",
    fontWeight: "bold",
    background: "linear-gradient(270deg, #00ffff, #7b4cff, #00ffff)",
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "shimmer 3s linear infinite",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#bbb",
    marginBottom: "2rem",
  },
  button: {
    fontSize: "1rem",
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    color: "#fff",
    backgroundImage: "linear-gradient(135deg, #7b4cff, #00ffff)",
    backgroundSize: "200% 200%",
    animation: "gradientShift 6s ease infinite",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(123, 76, 255, 0.3)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
};
