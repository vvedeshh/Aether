# 🌌 Aether — Particle Physics Simulator

Aether is an interactive, web-based 3D particle simulator built using **React + Three.js** for the frontend and **ASP.NET Core** for the backend. It allows users to spawn, configure, and save thousands of particles in real-time, with support for gravity presets, visual effects, and persistent file storage.

---

## Features

- ✨ **Real-time 3D particle simulation** using instanced rendering with glow/trail effects
- ⚙️ **Control panel** to configure spawn mode, count, size, color, gravity, and visual style
- 💾 **Save/load particle states** using JSON files (client + backend)
- 🕹️ **Undo/redo particle batches**
- 📂 **Browse and search saved configs**, with sorting by particle count or recency
- 🌐 **Backend API** using ASP.NET Core to manage config files with binary search tree and linked list logic
- 📊 **HUD** overlay displaying particle count, zoom, and frame rate
- 🧪 Built with **ICS4U concepts**: OOP, file I/O, recursion, data structures (BST, linked list), and sorting

---

## Tech Stack

### Frontend
- React (Vite)
- Three.js + @react-three/fiber + @react-three/drei
- JavaScript 
- Custom CSS with some Material Design styling

### Backend
- ASP.NET Core Web API
- C#
- JSON file I/O
- Custom services for sorting/searching
- Data structures (BST, Linked List)

---

## ⚙️ Setup Instructions

### 1. 🖥️ Backend (ASP.NET Core)
Requirements: .NET 7+ SDK

```
cd AetherAPI
dotnet restore
dotnet run
```
API runs on: http://localhost:5291

Saved files are stored in: ./SavedConfigs

### 2. 🌐 Frontend (React)
Requirements: Node.js 18+, Vite

```
cd aether-web
npm install
npm run dev
```
App runs on: http://localhost:5173

Connects to backend API via fetch() from api.js

---

## 🚀 Keyboard Shortcuts
- Key	Action
- E	Spawn particle(s) at mouse
- F	Apply random force to all particles

---

## 📁 Save File Format (JSON)
```
{
  "Name": "my-config",
  "SavedAt": "2025-06-12T18:31:00Z",
  "Particles": [
    {
      "Position": [x, y, z],
      "Velocity": [vx, vy, vz],
      "Color": "#00ffff",
      "Size": 1.0,
      "Gravity": 9.8
    }
  ]
}
```
