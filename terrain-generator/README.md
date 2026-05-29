# 3D Terrain Generator

Game engine style procedural 3D terrain built with **Three.js + TypeScript + Vite**.

## Quick Start

```bash
cd terrain-generator
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

## Controls

| Action | Input |
|--------|-------|
| Rotate camera | Left mouse drag |
| Zoom | Scroll wheel |
| Pan | Right mouse drag |

## Features

- **500 m × 500 m** procedural terrain
- **Fractal Brownian Motion** noise (up to 10 octaves) for realistic heightmaps
- **Biome coloring** by altitude: abyss → ocean → beach → grassland → forest → rock → snow
- **Animated water** plane with translucency shimmer at sea level
- **Island mode** — smooth radial falloff so map edges are always ocean
- **Real-time parameter sliders** — seed, height, frequency, octaves
- **Wireframe mode** toggle
- ACES filmic tone mapping, PCF soft shadows, atmospheric exponential fog
- FPS counter + triangle count overlay

## Build for Production

```bash
npm run build
npm run preview
```

Output goes to `dist/`.
