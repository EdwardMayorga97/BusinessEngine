type Vec2 = [number, number];

const GRAD2: Vec2[] = [
  [1, 1],  [-1, 1],  [1, -1], [-1, -1],
  [1, 0],  [-1, 0],  [1, 0],  [-1, 0],
  [0, 1],  [0, -1],  [0, 1],  [0, -1],
];

/**
 * 2D Simplex Noise with seeded shuffle (Gustavson algorithm).
 * Returns values in approximately [-1, 1].
 */
export class SimplexNoise {
  private readonly perm = new Uint8Array(512);
  private readonly permMod12 = new Uint8Array(512);

  constructor(seed = 0) {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;

    // Seeded LCG Fisher-Yates shuffle
    let s = (seed ^ 0xdeadbeef) >>> 0;
    for (let i = 255; i > 0; i--) {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      const j = s % (i + 1);
      const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
    }
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  noise2D(xin: number, yin: number): number {
    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;

    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;

    const x0 = xin - (i - t);
    const y0 = yin - (j - t);

    const i1 = x0 > y0 ? 1 : 0;
    const j1 = x0 > y0 ? 0 : 1;

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;

    const ii = i & 255;
    const jj = j & 255;
    const { perm, permMod12 } = this;

    const gi0 = permMod12[ii      + perm[jj     ]];
    const gi1 = permMod12[ii + i1 + perm[jj + j1]];
    const gi2 = permMod12[ii + 1  + perm[jj + 1 ]];

    let n0 = 0, n1 = 0, n2 = 0;

    const t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 > 0) {
      const t0sq = t0 * t0;
      const g = GRAD2[gi0];
      n0 = t0sq * t0sq * (g[0] * x0 + g[1] * y0);
    }
    const t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 > 0) {
      const t1sq = t1 * t1;
      const g = GRAD2[gi1];
      n1 = t1sq * t1sq * (g[0] * x1 + g[1] * y1);
    }
    const t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 > 0) {
      const t2sq = t2 * t2;
      const g = GRAD2[gi2];
      n2 = t2sq * t2sq * (g[0] * x2 + g[1] * y2);
    }

    return 70 * (n0 + n1 + n2);
  }

  /** Fractal Brownian Motion — sums octaves of noise. Returns [-1, 1]. */
  fbm(x: number, y: number, octaves: number): number {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxAmplitude = 0;
    for (let i = 0; i < octaves; i++) {
      value += this.noise2D(x * frequency, y * frequency) * amplitude;
      maxAmplitude += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }
    return value / maxAmplitude;
  }
}
