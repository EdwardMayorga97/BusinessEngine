import * as THREE from 'three';
import { SimplexNoise } from './noise';
import type { TerrainConfig } from './types';

interface Biome {
  t: number;
  c: THREE.Color;
}

const BIOMES: Biome[] = [
  { t: 0.00, c: new THREE.Color(0x04111f) }, // abyss
  { t: 0.12, c: new THREE.Color(0x0d2d5a) }, // deep ocean
  { t: 0.21, c: new THREE.Color(0x1a5090) }, // ocean
  { t: 0.25, c: new THREE.Color(0x2470b8) }, // shallow water
  { t: 0.28, c: new THREE.Color(0xe8d89a) }, // sand
  { t: 0.32, c: new THREE.Color(0x8ec84e) }, // light grass
  { t: 0.47, c: new THREE.Color(0x52a028) }, // grass
  { t: 0.60, c: new THREE.Color(0x387018) }, // forest
  { t: 0.68, c: new THREE.Color(0x605545) }, // highland
  { t: 0.78, c: new THREE.Color(0x7a6e68) }, // rock
  { t: 0.88, c: new THREE.Color(0x908880) }, // mountain
  { t: 0.94, c: new THREE.Color(0xcfcbc8) }, // snow start
  { t: 1.00, c: new THREE.Color(0xf8f8f8) }, // peak snow
];

function biomeColor(n: number): THREE.Color {
  if (n <= BIOMES[0].t) return BIOMES[0].c.clone();
  for (let i = 1; i < BIOMES.length; i++) {
    if (n <= BIOMES[i].t) {
      const a = (n - BIOMES[i - 1].t) / (BIOMES[i].t - BIOMES[i - 1].t);
      return BIOMES[i - 1].c.clone().lerp(BIOMES[i].c, Math.max(0, Math.min(1, a)));
    }
  }
  return BIOMES[BIOMES.length - 1].c.clone();
}

function smoothstep(e0: number, e1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

export class Terrain {
  readonly mesh: THREE.Mesh;
  private mat: THREE.MeshPhongMaterial;

  get polyCount(): number {
    const s = this.cfg.resolution - 1;
    return s * s * 2;
  }

  constructor(private readonly cfg: TerrainConfig) {
    const { width, depth, resolution, heightScale, frequency, octaves, seed, islandMode } = cfg;
    const segs = resolution - 1;

    const geo = new THREE.PlaneGeometry(width, depth, segs, segs);
    // Rotate flat so X/Z are the terrain axes, Y is up
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes['position'] as THREE.BufferAttribute;
    const colArr = new Float32Array(pos.count * 3);
    const colAttr = new THREE.BufferAttribute(colArr, 3);

    const noise = new SimplexNoise(seed);
    const halfW = width / 2;
    const halfD = depth / 2;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // FBM noise, normalized to [0, 1]
      let n = (noise.fbm(x * frequency, z * frequency, octaves) + 1) * 0.5;

      if (islandMode) {
        // Smooth radial falloff so edges become ocean
        const nx = x / halfW;
        const nz = z / halfD;
        const dist = Math.sqrt(nx * nx + nz * nz) / Math.SQRT2;
        const mask = 1 - smoothstep(0.30, 0.88, dist);
        n = n * mask;
      }

      n = Math.max(0, Math.min(1, n));
      pos.setY(i, n * heightScale);

      const c = biomeColor(n);
      colAttr.setXYZ(i, c.r, c.g, c.b);
    }

    geo.setAttribute('color', colAttr);
    geo.computeVertexNormals();

    this.mat = new THREE.MeshPhongMaterial({
      vertexColors: true,
      shininess: 6,
      specular: new THREE.Color(0x111111),
    });

    this.mesh = new THREE.Mesh(geo, this.mat);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  setWireframe(on: boolean): void {
    this.mat.wireframe = on;
  }
}
