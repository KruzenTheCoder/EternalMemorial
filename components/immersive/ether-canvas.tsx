"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type EtherCanvasProps = {
  /** Fewer particles + softer look for auth pages */
  subtle?: boolean;
  className?: string;
};

export function EtherCanvas({ subtle = false, className = "" }: EtherCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = typeof navigator !== "undefined" && "connection" in navigator && (navigator as any).connection?.saveData;
    const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 4 : 4;
    const lowPower = reducedMotion || !!saveData || cores <= 4;
    const dprCap = lowPower ? 1.25 : 1.75;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 120);
    camera.position.z = subtle ? 5.2 : 4.6;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, dprCap));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const baseCount = subtle ? 900 : 3200;
    const qualityScale = lowPower ? 0.45 : 1;
    const count = Math.max(360, Math.floor(baseCount * qualityScale));
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 14;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 8;
      sizes[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uGold: { value: new THREE.Color("#d4af37") },
        uGoldDeep: { value: new THREE.Color("#8b6914") },
        uSubtle: { value: subtle ? 1 : 0 },
      },
      vertexShader: `
        attribute float aScale;
        uniform float uTime;
        uniform float uSubtle;
        varying float vAlpha;
        void main() {
          vec3 p = position;
          float wave = sin(uTime * 0.35 + p.x * 0.4 + p.y * 0.3) * 0.12 * (1.0 - uSubtle * 0.5);
          p.z += wave;
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          float s = (0.012 + aScale * 0.018) * (1.0 + uSubtle * 0.35);
          gl_PointSize = s * (220.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          vAlpha = 0.35 + aScale * 0.5;
        }
      `,
      fragmentShader: `
        uniform vec3 uGold;
        uniform vec3 uGoldDeep;
        varying float vAlpha;
        void main() {
          vec2 c = gl_PointCoord - vec2(0.5);
          float d = length(c);
          if (d > 0.5) discard;
          float core = smoothstep(0.5, 0.0, d);
          vec3 col = mix(uGoldDeep, uGold, core);
          gl_FragColor = vec4(col, vAlpha * core * core);
        }
      `,
    });

    const points = new THREE.Points(geometry, material);
    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    const setSize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(el);
    let inView = true;
    const io = new IntersectionObserver((entries) => {
      inView = !!entries[0]?.isIntersecting;
    });
    io.observe(el);
    let docVisible = !document.hidden;
    const onVisibility = () => {
      docVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    let raf = 0;
    const t0 = performance.now();
    const frameMs = lowPower ? 1000 / 32 : 1000 / 50;
    let lastFrame = t0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!inView || !docVisible) return;
      if (now - lastFrame < frameMs) return;
      lastFrame = now;
      const t = (now - t0) * 0.001;
      material.uniforms.uTime.value = t;
      group.rotation.y = t * 0.045;
      group.rotation.x = Math.sin(t * 0.11) * 0.07;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) {
        el.removeChild(renderer.domElement);
      }
    };
  }, [subtle]);

  return <div ref={mountRef} className={`absolute inset-0 ${className}`} aria-hidden />;
}
