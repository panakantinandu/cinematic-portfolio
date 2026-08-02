'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PALETTE = [
  [99, 102, 241],
  [34, 211, 238],
  [168, 85, 247],
  [244, 114, 182],
];

// Desktop hero background: a jittered grid "lattice" of nodes
// connected to their immediate neighbors, rendered as THREE.Points +
// THREE.LineSegments (never individual meshes — see threejs perf
// budget). Nodes idle-breathe via per-node sine drift; cursor
// proximity adds a repulsion offset on top of that base drift.
export default function ParticleFieldWebGL() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const cols = 22, rows = 13;
    const spacingX = 1, spacingY = 1;
    const nodeCount = cols * rows;

    const basePositions = new Float32Array(nodeCount * 3);
    const phases = new Float32Array(nodeCount);
    const colors = new Float32Array(nodeCount * 3);

    let idx = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const jitterX = (Math.random() - 0.5) * 0.35;
        const jitterY = (Math.random() - 0.5) * 0.35;
        basePositions[idx * 3] = (x - cols / 2) * spacingX + jitterX;
        basePositions[idx * 3 + 1] = (y - rows / 2) * spacingY + jitterY;
        basePositions[idx * 3 + 2] = (Math.random() - 0.5) * 0.6;
        phases[idx] = Math.random() * Math.PI * 2;
        const c = PALETTE[idx % PALETTE.length];
        colors[idx * 3] = c[0] / 255;
        colors[idx * 3 + 1] = c[1] / 255;
        colors[idx * 3 + 2] = c[2] / 255;
        idx++;
      }
    }

    // Lattice edges: connect each node to its right + down neighbor.
    const edgePairs = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        if (x < cols - 1) edgePairs.push(i, i + 1);
        if (y < rows - 1) edgePairs.push(i, i + cols);
      }
    }

    const livePositions = new Float32Array(basePositions);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 11;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(livePositions, 3));
    pointsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const pointsMat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const points = new THREE.Points(pointsGeo, pointsMat);
    scene.add(points);

    const linePositions = new Float32Array(edgePairs.length * 3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.12, depthWrite: false });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    const mouseNDC = new THREE.Vector2(-10, -10);
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mouseWorld = new THREE.Vector3(9999, 9999, 0);
    let lastMoveTime = performance.now();

    const onMove = e => {
      const rect = mount.getBoundingClientRect();
      mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      lastMoveTime = performance.now();
    };

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    let raf;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const idleFor = performance.now() - lastMoveTime;
      const idleBoost = idleFor > 2200 ? 1.6 : 1;

      raycaster.setFromCamera(mouseNDC, camera);
      raycaster.ray.intersectPlane(plane, mouseWorld);

      const posAttr = pointsGeo.attributes.position;
      for (let i = 0; i < nodeCount; i++) {
        const bx = basePositions[i * 3];
        const by = basePositions[i * 3 + 1];
        const bz = basePositions[i * 3 + 2];
        const phase = phases[i];

        // idle breathing drift
        const breathe = Math.sin(t * 0.5 + phase) * 0.12 * idleBoost;
        let px = bx;
        let py = by + breathe;
        let pz = bz + Math.cos(t * 0.4 + phase) * 0.08 * idleBoost;

        // cursor repulsion
        const dx = px - mouseWorld.x;
        const dy = py - mouseWorld.y;
        const dist = Math.hypot(dx, dy);
        const radius = 2.4;
        if (dist < radius && mouseWorld.x < 999) {
          const force = (1 - dist / radius) * 0.9;
          px += (dx / (dist || 1)) * force;
          py += (dy / (dist || 1)) * force;
        }

        livePositions[i * 3] = px;
        livePositions[i * 3 + 1] = py;
        livePositions[i * 3 + 2] = pz;
      }
      posAttr.needsUpdate = true;

      const linePos = lineGeo.attributes.position;
      for (let e = 0; e < edgePairs.length; e += 2) {
        const a = edgePairs[e], b = edgePairs[e + 1];
        linePos.array[e * 3] = livePositions[a * 3];
        linePos.array[e * 3 + 1] = livePositions[a * 3 + 1];
        linePos.array[e * 3 + 2] = livePositions[a * 3 + 2];
        linePos.array[e * 3 + 3] = livePositions[b * 3];
        linePos.array[e * 3 + 4] = livePositions[b * 3 + 1];
        linePos.array[e * 3 + 5] = livePositions[b * 3 + 2];
      }
      linePos.needsUpdate = true;

      lineMat.opacity = 0.1 + (idleBoost - 1) * 0.05;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      pointsGeo.dispose();
      lineGeo.dispose();
      pointsMat.dispose();
      lineMat.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
