import * as THREE from 'three';
import { setupControls } from './controls';
import { Terrain } from './terrain';
import { Water } from './water';
import { UIPanel } from './ui';
import type { TerrainConfig } from './types';

const DEFAULT_CONFIG: TerrainConfig = {
  width: 500,
  depth: 500,
  resolution: 256,
  heightScale: 80,
  frequency: 0.004,
  octaves: 7,
  seed: 42,
  islandMode: true,
};

// ── Renderer ──────────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.body.appendChild(renderer.domElement);

// ── Scene ─────────────────────────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8bc4e8);
scene.fog = new THREE.FogExp2(0xbedde8, 0.0016);

// ── Camera ────────────────────────────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(
  65, window.innerWidth / window.innerHeight, 0.5, 3000
);
camera.position.set(0, 180, 350);

// ── Orbit controls ────────────────────────────────────────────────────────────
const controls = setupControls(camera, renderer.domElement);

// ── Lights ────────────────────────────────────────────────────────────────────
const sun = new THREE.DirectionalLight(0xfff4d6, 1.8);
sun.position.set(200, 400, 150);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 1400;
sun.shadow.camera.left   = -380;
sun.shadow.camera.right  =  380;
sun.shadow.camera.top    =  380;
sun.shadow.camera.bottom = -380;
sun.shadow.bias = -0.0003;
scene.add(sun);

scene.add(new THREE.AmbientLight(0x7090b0, 0.8));
scene.add(new THREE.HemisphereLight(0x87ceeb, 0x2d4a1e, 0.5));

// Visible sun disc in the sky
const sunMesh = new THREE.Mesh(
  new THREE.SphereGeometry(14, 16, 8),
  new THREE.MeshBasicMaterial({ color: 0xfff280 })
);
sunMesh.position.copy(sun.position).normalize().multiplyScalar(900);
scene.add(sunMesh);

// ── Scene objects ─────────────────────────────────────────────────────────────
let terrain: Terrain | null = null;
let water: Water   | null = null;

function rebuild(cfg: TerrainConfig): void {
  if (terrain) scene.remove(terrain.mesh);
  if (water)   scene.remove(water.mesh);

  terrain = new Terrain(cfg);
  scene.add(terrain.mesh);

  const seaY = cfg.heightScale * 0.22;
  water = new Water(cfg.width, cfg.depth, seaY);
  scene.add(water.mesh);
}

const ui = new UIPanel(DEFAULT_CONFIG, rebuild);
rebuild(DEFAULT_CONFIG);

// ── Resize ────────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ── Animation loop ────────────────────────────────────────────────────────────
const clock = new THREE.Clock();
let frames = 0;
let fpsTimer = 0;
let currentFps = 0;

function animate(): void {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();

  controls.update();
  water?.update(dt);
  if (terrain) terrain.setWireframe(ui.wireframe);

  frames++;
  fpsTimer += dt;
  if (fpsTimer >= 1) {
    currentFps = frames;
    frames = 0;
    fpsTimer -= 1;
  }
  ui.updateStats(currentFps, terrain?.polyCount ?? 0);

  renderer.render(scene, camera);
}

animate();
