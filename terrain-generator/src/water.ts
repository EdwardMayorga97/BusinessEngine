import * as THREE from 'three';

export class Water {
  readonly mesh: THREE.Mesh;
  private mat: THREE.MeshPhongMaterial;
  private elapsed = 0;

  constructor(width: number, depth: number, y: number) {
    const geo = new THREE.PlaneGeometry(width * 1.6, depth * 1.6, 1, 1);
    this.mat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0x1a5fa8),
      transparent: true,
      opacity: 0.68,
      shininess: 200,
      specular: new THREE.Color(0xaaddff),
      depthWrite: false,
    });
    this.mesh = new THREE.Mesh(geo, this.mat);
    this.mesh.rotation.x = -Math.PI / 2;
    // Slight offset above sea-level threshold to avoid z-fighting at shoreline
    this.mesh.position.y = y + 0.2;
    this.mesh.renderOrder = 1;
  }

  update(dt: number): void {
    this.elapsed += dt;
    // Gentle opacity shimmer
    this.mat.opacity = 0.62 + Math.sin(this.elapsed * 1.1) * 0.06;
    // Subtle hue shift
    const shift = Math.sin(this.elapsed * 0.6) * 0.04;
    this.mat.color.setRGB(0.08 + shift, 0.36 + shift, 0.66 + shift * 0.5);
  }
}
