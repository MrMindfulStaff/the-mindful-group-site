"use client";

import { useRef, useEffect, useState } from "react";
import { ALLOCATIONS } from "@/lib/surplus-distribution-data";
import { PALETTE } from "@/lib/stellar-engine-data";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

interface Props {
  height?: string;
}

// ============================================================
// Layout constants
// ============================================================
const SOURCE_POS = new THREE.Vector3(-6.5, 0, 0);
const DEST_X = 3.5;
const DEST_SPREAD_Y = 5.5;

function destPos(i: number) {
  const y = DEST_SPREAD_Y / 2 - (i / (ALLOCATIONS.length - 1)) * DEST_SPREAD_Y;
  return new THREE.Vector3(DEST_X, y, 0);
}

// ============================================================
// Canvas texture helpers
// ============================================================
function makeFlareTex() {
  const size = 512;
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const ctx = cv.getContext("2d")!;
  const gr = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.1, "rgba(255,240,200,0.8)");
  gr.addColorStop(0.4, "rgba(255,180,100,0.2)");
  gr.addColorStop(1, "rgba(255,150,80,0)");
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(cv);
  t.needsUpdate = true;
  return t;
}

function makePointTexture() {
  const size = 64;
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const ctx = cv.getContext("2d")!;
  const gr = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.25, "rgba(255,240,210,0.85)");
  gr.addColorStop(0.6, "rgba(255,190,120,0.3)");
  gr.addColorStop(1, "rgba(255,160,80,0)");
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(cv);
  t.needsUpdate = true;
  return t;
}

function makePctTexture(pct: number) {
  const cv = document.createElement("canvas");
  cv.width = 256;
  cv.height = 128;
  const ctx = cv.getContext("2d")!;
  ctx.clearRect(0, 0, 256, 128);
  ctx.shadowColor = "#ffb870";
  ctx.shadowBlur = 24;
  ctx.fillStyle = "#ffe8c8";
  ctx.font = 'italic 300 48px Georgia, "Times New Roman", serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(pct + "%", 128, 64);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#fff5e0";
  ctx.fillText(pct + "%", 128, 64);
  const t = new THREE.CanvasTexture(cv);
  t.needsUpdate = true;
  return t;
}

// ============================================================
// Component
// ============================================================
export default function SurplusDistribution({ height = "100vh" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;

    // ============================================================
    // Scene
    // ============================================================
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.02);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 0.5, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Env map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envCv = document.createElement("canvas");
    envCv.width = 1024;
    envCv.height = 512;
    const envCtx = envCv.getContext("2d")!;
    const g = envCtx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, "#1a2030");
    g.addColorStop(0.4, "#0a0d14");
    g.addColorStop(0.6, "#2a1810");
    g.addColorStop(1, "#3a1f0a");
    envCtx.fillStyle = g;
    envCtx.fillRect(0, 0, 1024, 512);
    envCtx.fillStyle = "rgba(255, 180, 100, 0.3)";
    envCtx.beginPath();
    envCtx.arc(300, 256, 100, 0, Math.PI * 2);
    envCtx.fill();
    envCtx.beginPath();
    envCtx.arc(720, 300, 120, 0, Math.PI * 2);
    envCtx.fill();
    const envTex = new THREE.CanvasTexture(envCv);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    const envMap = pmremGenerator.fromEquirectangular(envTex).texture;
    scene.environment = envMap;
    pmremGenerator.dispose();

    // Lighting
    scene.add(new THREE.AmbientLight(0x404858, 0.3));
    const keyLight = new THREE.DirectionalLight(0xfff0d8, 0.7);
    keyLight.position.set(4, 8, 6);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xb87333, 0.3);
    fillLight.position.set(-6, 2, -4);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xffa870, 0.35);
    rimLight.position.set(0, 2, -8);
    scene.add(rimLight);

    // ============================================================
    // Source — blazing warm sphere
    // ============================================================
    const sourceGroup = new THREE.Group();
    sourceGroup.position.copy(SOURCE_POS);
    scene.add(sourceGroup);

    // Core brightness reduced by 40%
    const sourceCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x999999 })
    );
    sourceGroup.add(sourceCore);

    const sourceCorona1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 48, 48),
      new THREE.MeshBasicMaterial({
        color: PALETTE.coreHot,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
      })
    );
    sourceGroup.add(sourceCorona1);

    const sourceCorona2 = new THREE.Mesh(
      new THREE.SphereGeometry(1.05, 48, 48),
      new THREE.MeshBasicMaterial({
        color: PALETTE.coreWarm,
        transparent: true,
        opacity: 0.108,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    sourceGroup.add(sourceCorona2);

    const sourceCorona3 = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 48, 48),
      new THREE.MeshBasicMaterial({
        color: PALETTE.orbitGlow,
        transparent: true,
        opacity: 0.048,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    sourceGroup.add(sourceCorona3);

    // Orbital rings around source
    const sourceRings: THREE.Mesh[] = [];
    const ringConfigs = [
      { r: 0.8, tilt: [0.3, 0, 0.2] },
      { r: 0.95, tilt: [0.7, 0.4, -0.3] },
      { r: 1.1, tilt: [-0.3, 0.9, 0.5] },
    ];
    ringConfigs.forEach((cfg, i) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(cfg.r, 0.008, 8, 96),
        new THREE.MeshStandardMaterial({
          color: PALETTE.copperBright,
          emissive: PALETTE.copperBright,
          emissiveIntensity: 0.5,
          metalness: 0.7,
          roughness: 0.4,
        })
      );
      ring.rotation.set(cfg.tilt[0], cfg.tilt[1], cfg.tilt[2]);
      ring.userData.spin = [0.002 + i * 0.001, 0.0015 + i * 0.001, 0.001];
      sourceGroup.add(ring);
      sourceRings.push(ring);
    });

    // Source lens flare
    const flareTex = makeFlareTex();
    const sourceFlare = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: flareTex,
        transparent: true,
        opacity: 0.27,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    sourceFlare.scale.set(3.2, 3.2, 1);
    sourceGroup.add(sourceFlare);

    // Source point light (reduced 40%)
    const srcLight = new THREE.PointLight(PALETTE.coreWarm, 1.08, 15);
    sourceGroup.add(srcLight);

    // ============================================================
    // Destination pools — glass basins
    // ============================================================
    interface Pool {
      group: THREE.Group;
      liquid: THREE.Mesh;
      surface: THREE.Mesh;
      light: THREE.PointLight;
      rim: THREE.Mesh;
      scale: number;
      index: number;
      fillLevel: number;
      phase: number;
    }
    const pools: Pool[] = [];

    ALLOCATIONS.forEach((alloc, i) => {
      const poolGroup = new THREE.Group();
      poolGroup.position.copy(destPos(i));
      scene.add(poolGroup);

      const scale = 0.7 + (alloc.pct / 30) * 0.3;

      // Glass basin
      const basinGeo = new THREE.CylinderGeometry(0.55 * scale, 0.45 * scale, 0.7 * scale, 32, 1, false);
      const basin = new THREE.Mesh(
        basinGeo,
        new THREE.MeshPhongMaterial({
          color: 0xe8ecf2,
          transparent: true,
          opacity: 0.18,
          shininess: 90,
          specular: new THREE.Color(0xffffff),
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );
      basin.renderOrder = 2;
      poolGroup.add(basin);

      // Copper rim
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.55 * scale, 0.025, 12, 48),
        new THREE.MeshStandardMaterial({
          color: PALETTE.copper,
          metalness: 1,
          roughness: 0.3,
          envMapIntensity: 1.5,
        })
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.35 * scale;
      poolGroup.add(rim);

      // Bottom plate
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45 * scale, 0.5 * scale, 0.08, 32),
        new THREE.MeshStandardMaterial({
          color: PALETTE.darkSteel,
          metalness: 0.9,
          roughness: 0.3,
        })
      );
      base.position.y = -0.39 * scale;
      poolGroup.add(base);

      // Energy liquid inside
      const liquidGeo = new THREE.CylinderGeometry(0.5 * scale, 0.42 * scale, 0.6 * scale, 32, 1, false);
      const liquid = new THREE.Mesh(
        liquidGeo,
        new THREE.MeshBasicMaterial({
          color: PALETTE.coreWarm,
          transparent: true,
          opacity: 0.45,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      liquid.renderOrder = 1;
      poolGroup.add(liquid);

      // Bright liquid surface
      const surface = new THREE.Mesh(
        new THREE.CircleGeometry(0.5 * scale, 32),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.7,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      surface.rotation.x = -Math.PI / 2;
      surface.renderOrder = 1;
      poolGroup.add(surface);

      const poolLight = new THREE.PointLight(PALETTE.coreWarm, 0.6, 4);
      poolGroup.add(poolLight);

      pools.push({
        group: poolGroup,
        liquid,
        surface,
        light: poolLight,
        rim,
        scale,
        index: i,
        fillLevel: 0,
        phase: i * 0.7,
      });
    });

    // ============================================================
    // Streams — curved tubes from source to each pool
    // ============================================================
    interface Stream {
      curve: THREE.CatmullRomCurve3;
      mesh: THREE.Mesh;
      coreLine: THREE.Mesh;
      index: number;
      radius: number;
    }
    const streams: Stream[] = [];

    ALLOCATIONS.forEach((alloc, i) => {
      const start = SOURCE_POS.clone();
      const end = destPos(i);

      const mid1 = new THREE.Vector3(
        start.x + (end.x - start.x) * 0.25,
        start.y + (end.y - start.y) * 0.1,
        0
      );
      const mid2 = new THREE.Vector3(
        start.x + (end.x - start.x) * 0.7,
        end.y * 0.85,
        0
      );
      const endApproach = new THREE.Vector3(end.x, end.y + 0.35, 0);

      const curve = new THREE.CatmullRomCurve3(
        [start, mid1, mid2, endApproach],
        false,
        "catmullrom",
        0.4
      );

      const radius = 0.015 + (alloc.pct / 30) * 0.025;

      // Outer translucent stream tube
      const streamGeo = new THREE.TubeGeometry(curve, 100, radius, 10, false);
      const streamMesh = new THREE.Mesh(
        streamGeo,
        new THREE.MeshBasicMaterial({
          color: PALETTE.copperBright,
          transparent: true,
          opacity: 0.15,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      scene.add(streamMesh);

      // Inner bright core line
      const coreLineGeo = new THREE.TubeGeometry(curve, 100, radius * 0.4, 6, false);
      const coreLine = new THREE.Mesh(
        coreLineGeo,
        new THREE.MeshBasicMaterial({
          color: PALETTE.coreHot,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      scene.add(coreLine);

      streams.push({ curve, mesh: streamMesh, coreLine, index: i, radius });
    });

    // ============================================================
    // Flow particles
    // ============================================================
    interface ParticleGroup {
      geo: THREE.BufferGeometry;
      ts: Float32Array;
      speeds: Float32Array;
      count: number;
      curve: THREE.CatmullRomCurve3;
    }
    const allParticles: ParticleGroup[] = [];

    const pointTex = makePointTexture();

    streams.forEach((stream, streamIdx) => {
      const alloc = ALLOCATIONS[streamIdx];
      const count = 20 + Math.floor(alloc.pct / 2);
      const positions = new Float32Array(count * 3);
      const ts = new Float32Array(count);
      const speeds = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        ts[i] = i / count;
        speeds[i] = 0.0045 + Math.random() * 0.002;
        const p = stream.curve.getPoint(ts[i]);
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const pts = new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          map: pointTex,
          color: 0xffffff,
          size: 0.18 + (alloc.pct / 30) * 0.08,
          transparent: true,
          opacity: 1.0,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
          depthWrite: false,
        })
      );
      scene.add(pts);
      allParticles.push({ geo, ts, speeds, count, curve: stream.curve });
    });

    // ============================================================
    // Percentage labels on streams
    // ============================================================
    interface PctLabel {
      sprite: THREE.Sprite;
      basePos: THREE.Vector3;
      index: number;
    }
    const pctLabels: PctLabel[] = [];

    streams.forEach((stream, i) => {
      const midPoint = stream.curve.getPoint(0.5);
      const tex = makePctTexture(ALLOCATIONS[i].pct);
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: tex,
          transparent: true,
          opacity: 0.9,
          depthWrite: false,
        })
      );
      sprite.scale.set(1.1, 0.55, 1);
      sprite.position.copy(midPoint);
      sprite.position.y += 0.3;
      scene.add(sprite);
      pctLabels.push({ sprite, basePos: sprite.position.clone(), index: i });
    });

    // ============================================================
    // Post-processing
    // ============================================================
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    composer.setSize(container.clientWidth, container.clientHeight);

    composer.addPass(new RenderPass(scene, camera));

    const bloom = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.85,
      0.7,
      0.15
    );
    composer.addPass(bloom);

    const colorShader = {
      uniforms: {
        tDiffuse: { value: null },
        amount: { value: 0.0018 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float amount;
        varying vec2 vUv;
        void main() {
          vec2 center = vec2(0.5);
          vec2 dir = vUv - center;
          float dist = length(dir);
          vec2 offset = dir * amount * dist;
          vec4 r = texture2D(tDiffuse, vUv - offset);
          vec4 g = texture2D(tDiffuse, vUv);
          vec4 b = texture2D(tDiffuse, vUv + offset);
          vec3 col = vec3(r.r, g.g, b.b);
          col.r += 0.012 * (1.0 - col.r);
          col.g += 0.004 * (1.0 - col.g);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    };
    composer.addPass(new ShaderPass(colorShader));

    // ============================================================
    // Card cycling
    // ============================================================
    let cardTimer = 0;
    let activeIdx = 0;
    const CARD_CYCLE_DURATION = 2.5;

    // ============================================================
    // Animation loop
    // ============================================================
    const clock = new THREE.Clock();
    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    let animId = 0;
    function animate() {
      if (disposed) return;
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const dt = clock.getDelta();

      if (!reducedMotion) {
        // Source pulse (reduced 40%)
        const pulse = 1 + Math.sin(t * 2.2) * 0.05;
        sourceCore.scale.set(pulse, pulse, pulse);
        sourceCorona1.scale.setScalar(1 + Math.sin(t * 2.2 + 0.4) * 0.04);
        (sourceCorona2.material as THREE.MeshBasicMaterial).opacity =
          0.084 + Math.sin(t * 1.8) * 0.03;
        (sourceCorona3.material as THREE.MeshBasicMaterial).opacity =
          0.036 + Math.sin(t * 1.3) * 0.015;
        sourceFlare.material.opacity = 0.24 + Math.sin(t * 3) * 0.06;

        // Source orbital rings
        sourceRings.forEach((ring) => {
          const spin = ring.userData.spin as number[];
          ring.rotation.x += spin[0];
          ring.rotation.y += spin[1];
          ring.rotation.z += spin[2];
        });

        // Flow particles
        allParticles.forEach((group) => {
          const posArr = group.geo.attributes.position.array as Float32Array;
          for (let i = 0; i < group.count; i++) {
            group.ts[i] += group.speeds[i];
            if (group.ts[i] > 1) group.ts[i] = 0;
            const p = group.curve.getPoint(group.ts[i]);
            posArr[i * 3] = p.x;
            posArr[i * 3 + 1] = p.y;
            posArr[i * 3 + 2] = p.z;
          }
          group.geo.attributes.position.needsUpdate = true;
        });

        // Pool fill/drain cycle
        pools.forEach((pool) => {
          const cycleTime = 6;
          const localT = ((t + pool.phase) % cycleTime) / cycleTime;
          let target: number;
          if (localT < 0.5) target = localT / 0.5;
          else if (localT < 0.65) target = 1;
          else if (localT < 0.92) target = 1 - (localT - 0.65) / 0.27;
          else target = 0;

          pool.fillLevel = lerp(pool.fillLevel, target, 0.08);

          const maxHeight = 0.6 * pool.scale;
          const h = Math.max(0.001, pool.fillLevel * maxHeight);
          pool.liquid.scale.y = pool.fillLevel + 0.001;
          pool.liquid.position.y = -0.3 * pool.scale + h / 2;
          pool.surface.position.y = -0.3 * pool.scale + h;
          (pool.surface.material as THREE.MeshBasicMaterial).opacity =
            0.4 + pool.fillLevel * 0.5;
          pool.surface.scale.setScalar(0.9 + Math.sin(t * 4 + pool.phase) * 0.06);
          pool.light.intensity = pool.fillLevel * 0.9;

          const rimMat = pool.rim.material as THREE.MeshStandardMaterial;
          rimMat.emissive = new THREE.Color(PALETTE.copper);
          rimMat.emissiveIntensity = pool.fillLevel * 0.3;
        });

        // Stream intensity pulse
        streams.forEach((stream) => {
          (stream.coreLine.material as THREE.MeshBasicMaterial).opacity =
            0.4 + Math.sin(t * 4 + stream.index) * 0.15;
          (stream.mesh.material as THREE.MeshBasicMaterial).opacity =
            0.12 + Math.sin(t * 2.5 + stream.index) * 0.04;
        });

        // Percentage labels bob
        pctLabels.forEach((lbl) => {
          lbl.sprite.position.y =
            lbl.basePos.y + Math.sin(t * 1.5 + lbl.index) * 0.04;
        });
      }

      // Card cycling
      cardTimer += dt;
      if (cardTimer >= CARD_CYCLE_DURATION) {
        cardTimer = 0;
        activeIdx = (activeIdx + 1) % ALLOCATIONS.length;
        setActiveCard(activeIdx);
      }

      composer.render();
    }

    // ============================================================
    // Resize
    // ============================================================
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloom.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    animate();
    setTimeout(() => setLoaded(true), 800);

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      composer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{
        height,
        minHeight: "600px",
        background: "radial-gradient(ellipse at center, #0a0d14 0%, #000 75%)",
      }}
    >
      {/* Loading */}
      <div
        className={`absolute inset-0 bg-black flex items-center justify-center z-[100] transition-opacity duration-700 ${
          loaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <span className="text-[10px] tracking-[0.4em]" style={{ color: "#ffd896" }}>
          INITIALIZING &middot; DISTRIBUTION FLOW
        </span>
      </div>

      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,220,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(200,220,255,0.012) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[2]" />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[4]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none z-[10] opacity-5 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' /></filter><rect width='100%25' height='100%25' filter='url(%23n)' /></svg>\")",
        }}
      />

      {/* HUD */}
      <div
        className="absolute top-7 left-[26px] z-[5] font-mono text-[10px] tracking-[0.25em]"
        style={{
          color: "#c0cad8",
          textShadow: "0 0 12px rgba(168, 216, 255, 0.15)",
        }}
      >
        <div className="mb-[5px] flex items-center gap-2">
          <span
            className="inline-block w-[5px] h-[5px] rounded-full animate-pulse"
            style={{
              background: "#ffd896",
              boxShadow: "0 0 10px #ffd896, 0 0 20px rgba(255, 216, 150, 0.4)",
            }}
          />
          SURPLUS &middot; ALLOCATING
        </div>
        <div className="mb-[5px] pl-[10px]">CYCLE &middot; CONTINUOUS</div>
        <div className="pl-[10px]">FLOW &middot; NOMINAL</div>
      </div>

      {/* Title block */}
      <div className="absolute top-[34px] left-1/2 -translate-x-1/2 text-center pointer-events-none z-[5]">
        <div
          className="text-[22px] tracking-[0.35em] font-extralight mb-2"
          style={{
            color: "#e8ecf2",
            textShadow: "0 0 40px rgba(255,200,140,0.2)",
          }}
        >
          SURPLUS DISTRIBUTION
        </div>
        <div
          className="text-[10.5px] tracking-[0.18em] font-light"
          style={{
            color: "#c0cad8",
            textShadow: "0 0 10px rgba(168, 216, 255, 0.15)",
          }}
        >
          How generated surplus reinvests into the system
        </div>
        <div
          className="mt-[10px] text-[13px] italic font-light"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            color: "#ffd896",
            letterSpacing: "0.08em",
            textShadow: "0 0 14px rgba(255, 216, 150, 0.35)",
          }}
        >
          Fuel for the next cycle
        </div>
      </div>

      {/* Source label — positioned above the core sphere */}
      <div
        className="absolute z-[5] text-center pointer-events-none"
        style={{
          top: "22%",
          left: "8%",
          transform: "translateX(-50%)",
        }}
      >
        <div
          className="text-[36px] font-light italic mb-1"
          style={{
            fontFamily: "Georgia, serif",
            color: "#ffd896",
            textShadow: "0 0 24px rgba(255, 216, 150, 0.5)",
            letterSpacing: "0.05em",
          }}
        >
          100%
        </div>
        <div
          className="text-[10px] tracking-[0.35em] uppercase"
          style={{
            color: "#c0cad8",
            textShadow: "0 0 10px rgba(168, 216, 255, 0.2)",
          }}
        >
          Surplus
        </div>
      </div>

      {/* Allocation cards — each positioned to align with its basin.
          Basins span from top (i=0, y=+2.75) to bottom (i=3, y=-2.75)
          in a viewport with camera at fov=42.  Screen %:
            i=0 → ~18%, i=1 → ~35%, i=2 → ~52%, i=3 → ~69%  */}
      {ALLOCATIONS.map((alloc, i) => {
        const topPcts = [18, 35, 52, 69];
        return (
          <div
            key={alloc.name}
            className="absolute z-[6] w-[340px] max-w-[calc(100vw-80px)]"
            style={{ top: `${topPcts[i]}%`, right: "40px" }}
          >
            <div
              className="relative flex items-center gap-[14px] transition-all duration-400"
              style={{
                background: "rgba(10,13,20,0.72)",
                backdropFilter: "blur(20px) saturate(1.2)",
                WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                border: "1px solid rgba(180,140,100,0.15)",
                boxShadow:
                  "0 0 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
                padding: "14px 16px",
              }}
            >
              {/* Active bar */}
              <div
                className="absolute left-[-1px] top-[-1px] bottom-[-1px] w-[3px] transition-all duration-400"
                style={{
                  background: activeCard === i ? "#ffd896" : "transparent",
                  boxShadow: activeCard === i ? "0 0 14px #ffd896" : "none",
                }}
              />
              <div
                className="text-[15px] font-medium italic min-w-[44px] text-center transition-all duration-400"
                style={{
                  fontFamily: "Georgia, serif",
                  color: "#ffd896",
                  padding: "8px 10px",
                  background:
                    activeCard === i
                      ? "rgba(255, 216, 150, 0.2)"
                      : "rgba(184,115,51,0.12)",
                  border: `1px solid ${
                    activeCard === i
                      ? "rgba(255, 216, 150, 0.6)"
                      : "rgba(201,165,122,0.25)"
                  }`,
                  letterSpacing: "0.05em",
                  textShadow: "0 0 10px rgba(255, 216, 150, 0.4)",
                }}
              >
                {alloc.pct}%
              </div>
              <div className="flex-1">
                <div
                  className="text-[14px] mb-1"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    color: "#f0f4fa",
                    letterSpacing: "0.02em",
                  }}
                >
                  {alloc.name}
                </div>
                <div
                  className="text-[10.5px] leading-[1.55]"
                  style={{ color: "#a0aab8", letterSpacing: "0.02em" }}
                >
                  {alloc.description}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Corner info */}
      <div className="absolute bottom-[22px] right-[26px] text-right z-[5]">
        <div
          className="text-[9px] tracking-[0.3em] font-mono mb-[3px]"
          style={{ color: "#8a94a4" }}
        >
          SYS.MODEL
        </div>
        <div
          className="text-[11px] tracking-[0.25em] font-mono"
          style={{ color: "#ffd896" }}
        >
          DISTR &middot; v1.0
        </div>
      </div>
    </div>
  );
}
