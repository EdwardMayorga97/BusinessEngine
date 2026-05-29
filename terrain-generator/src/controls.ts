import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function setupControls(camera: THREE.Camera, canvas: HTMLElement): OrbitControls {
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.rotateSpeed = 0.7;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.minDistance = 30;
  controls.maxDistance = 1000;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.target.set(0, 10, 0);
  return controls;
}
