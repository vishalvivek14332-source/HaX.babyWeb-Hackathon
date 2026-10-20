# ★ Pip's Cozy Dream Workshop ★
> **A whimsical, interactive bedtime story experience built for HaX.baby — Baby's First Website Hackathon.**

🌐 **Live Website:** [https://ha-x-baby-web-hackathon-pip-s-cozy.vercel.app/](https://ha-x-baby-web-hackathon-pip-s-cozy.vercel.app/)

✨ **Live at Midnight Nursery:** Meet Pip, the tiny skull baby dream engineer who crafts lullabies, nightlights, and soothing dreams for sleepy thoughts to land.

---

## 🌐 Live Demo & Deployment

- **Production URL:** [https://ha-x-baby-web-hackathon-pip-s-cozy.vercel.app/](https://ha-x-baby-web-hackathon-pip-s-cozy.vercel.app/)
- **Repository:** [https://github.com/vishalvivek14332-source/HaX.babyWeb-Hackathon](https://github.com/vishalvivek14332-source/HaX.babyWeb-Hackathon)

---

## 🌟 Highlights & Features

- **Interactive 3D Pip Model (Three.js):**
  - Fully interactive 3D model viewer loaded from `3D.glb`.
  - 360° orbit rotation, smooth damping, zoom controls, and gentle cloud-floating animation.
  - Studio lighting with pastel rim highlights and collectible vinyl toy shading.
  - One-tap toggle between interactive 3D model and 2D storybook portrait.

- **Dream Mode (Daydream / Midnight Dream):**
  - Switch smoothly between cozy daytime peach palette and dreamy starry midnight dark mode.
  - Theme state persists seamlessly via `localStorage`.

- **Web Audio Music Box Lullaby:**
  - Procedural, gentle chime melodies synthesised using the Web Audio API.
  - Play, pause, and mute controls directly in the floating header navigation.

- **Hero 300-Frame Animation:**
  - High-resolution multi-frame sequence of Pip hugging his glowing star.
  - Floating stars, organic cloud mask, and responsive editorial typography.

- **Interactive Creations & Toybox:**
  - 01 The Lullaby Lab (interactive music box player)
  - 02 Nightlight Collection (dimmable starlight chamber modal)
  - 03 Dream Delivery Routes (interactive midnight waypoint map)
  - 04 Rattle & Block Toys (interactive chiming sound toys)

- **Interactive Origin Story & Snapshots Gallery:**
  - 3-step illustrated tale of how a little star found its way home.
  - Modal lightboxes and secret easter egg with Pip.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Vanilla CSS + TailwindCSS (v4)
- **3D Graphics:** Three.js + GLTFLoader + OrbitControls
- **Audio:** Web Audio API (custom synth music box)
- **Animation:** Motion (Framer Motion) + CSS Keyframes
- **Server:** Node.js HTTP server (`server.js`) with zero external runtime dependencies

---

## 🚀 Getting Started

### Option 1: Run with Vite Dev Server
```bash
cd "pip's-cozy-dream-workshop"
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Run with Standalone Node Server
```bash
node server.js
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📁 Project Structure

```
├── artwork/                    # High-definition 3D storybook illustrations
├── assets/                     # Bundled client scripts and CSS
├── models/                     # 3D.glb interactive model
├── frames/                     # 300-frame hero animation sequence
├── pip images/                 # Original reference mockups
├── pip's-cozy-dream-workshop/   # React + Vite source code
│   ├── src/
│   │   ├── components/         # Hero, MeetPip, Creations, Story, Gallery, 3DViewer
│   │   ├── utils/              # Web Audio music box synth
│   │   └── App.tsx             # Main application orchestrator
│   └── package.json
├── index.html                  # Standalone production entry point
├── server.js                   # Lightweight static server
└── README.md
```

---

*Sweet dreams, little dreamer. Built with love for HaX.baby.* ✨
