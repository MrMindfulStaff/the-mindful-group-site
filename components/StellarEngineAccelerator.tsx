"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { SECTIONS, PALETTE, type StellarSection } from "@/lib/stellar-engine-data";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

// ============================================================
// Props
// ============================================================
interface Props {
  height?: string;
}

// ============================================================
// Oval ring math
// ============================================================
const RING_RX = 5.2;
const RING_RZ = 5.2;

function ellipsePos(t: number) {
  const a = t * Math.PI * 2;
  return new THREE.Vector3(Math.cos(a) * RING_RX, 0, Math.sin(a) * RING_RZ);
}

function ellipseTangent(t: number) {
  const a = t * Math.PI * 2;
  return new THREE.Vector3(-Math.sin(a) * RING_RX, 0, Math.cos(a) * RING_RZ).normalize();
}

// ============================================================
// Canvas texture helpers
// ============================================================
function makeFlareTexture() {
  const size = 512;
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const ctx = cv.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.1, "rgba(255,240,200,0.8)");
  grad.addColorStop(0.4, "rgba(255,180,100,0.2)");
  grad.addColorStop(1, "rgba(255,150,80,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(cv);
  t.needsUpdate = true;
  return t;
}

function makeStreakTexture() {
  const w = 512, h = 64;
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, "rgba(255,180,100,0)");
  grad.addColorStop(0.45, "rgba(255,220,150,0.3)");
  grad.addColorStop(0.5, "rgba(255,255,255,1)");
  grad.addColorStop(0.55, "rgba(255,220,150,0.3)");
  grad.addColorStop(1, "rgba(255,180,100,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  const t = new THREE.CanvasTexture(cv);
  t.needsUpdate = true;
  return t;
}

function makePointTexture() {
  const size = 64;
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const ctx = cv.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,240,210,1)");
  g.addColorStop(0.3, "rgba(255,200,140,0.6)");
  g.addColorStop(1, "rgba(255,180,100,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(cv);
  t.needsUpdate = true;
  return t;
}

function makeBoltTexture() {
  const size = 128;
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const ctx = cv.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.15, "rgba(255,240,200,0.9)");
  g.addColorStop(0.4, "rgba(255,180,100,0.4)");
  g.addColorStop(1, "rgba(255,150,60,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(cv);
  t.needsUpdate = true;
  return t;
}

function makeLabelTexture(text: string, size = 512) {
  const cv = document.createElement("canvas");
  cv.width = size * 2;
  cv.height = size / 2;
  const ctx = cv.getContext("2d")!;
  ctx.clearRect(0, 0, cv.width, cv.height);
  const spacedText = text.toUpperCase().split("").join("  ");
  let fontSize = size / 4;
  ctx.font = `300 ${fontSize}px -apple-system, system-ui, "Helvetica Neue", sans-serif`;
  const measured = ctx.measureText(spacedText);
  const maxWidth = cv.width * 0.92;
  if (measured.width > maxWidth) {
    fontSize = Math.floor(fontSize * (maxWidth / measured.width));
    ctx.font = `300 ${fontSize}px -apple-system, system-ui, "Helvetica Neue", sans-serif`;
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "#ffb870";
  ctx.shadowBlur = 30;
  ctx.fillStyle = "#ffe8c8";
  ctx.fillText(spacedText, cv.width / 2, cv.height / 2);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(spacedText, cv.width / 2, cv.height / 2);
  const t = new THREE.CanvasTexture(cv);
  t.needsUpdate = true;
  return t;
}

function makeNumberTexture(index: number) {
  const cv = document.createElement("canvas");
  cv.width = 128; cv.height = 128;
  const ctx = cv.getContext("2d")!;
  ctx.font = "400 72px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#c9a57a";
  ctx.shadowColor = "#c9a57a";
  ctx.shadowBlur = 10;
  ctx.fillText(`0${index + 1}`, 64, 64);
  const t = new THREE.CanvasTexture(cv);
  t.needsUpdate = true;
  return t;
}

// ============================================================
// Component
// ============================================================
export default function StellarEngineAccelerator({ height = "100vh" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Refs shared between React UI handlers and the Three.js loop
  const stateRef = useRef({
    activeSection: null as string | null,
    autoRotate: true,
    rotationTarget: 0,
    ringRotation: 0,
    reducedMotion: false,
  });

  const selectSection = useCallback((id: string) => {
    setActiveSection(id);
    stateRef.current.activeSection = id;
    stateRef.current.autoRotate = false;

    const idx = SECTIONS.findIndex((s) => s.id === id);
    const sectionAngle = (idx / SECTIONS.length) * Math.PI * 2;
    const cameraAngle = Math.PI / 2 - controlsRef.current.theta;
    const target = sectionAngle - cameraAngle;

    const currentMod = ((stateRef.current.ringRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const targetMod = ((target % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    let delta = targetMod - currentMod;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;
    stateRef.current.rotationTarget = stateRef.current.ringRotation + delta;
  }, []);

  const resumeRotation = useCallback(() => {
    setActiveSection(null);
    stateRef.current.activeSection = null;
    stateRef.current.autoRotate = true;
  }, []);

  const controlsRef = useRef({
    distance: 15.18,
    theta: Math.PI * 0.15,
    phi: Math.PI * 0.3696,
    minDist: 10,
    maxDist: 32,
    minPhi: Math.PI / 10,
    maxPhi: Math.PI * 0.47,
    dragging: false,
    prevX: 0,
    prevY: 0,
  });

  // Store section mesh data for hover/active state updates
  const sectionMeshDataRef = useRef<Array<{
    housing: THREE.Mesh;
    topCap: THREE.Mesh;
    label: THREE.Sprite;
    light: THREE.PointLight;
    section: StellarSection;
    index: number;
    hovered: boolean;
    active: boolean;
  }>>([]);

  const clickableMeshesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Reduced motion check
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    stateRef.current.reducedMotion = motionQuery.matches;
    const motionHandler = (e: MediaQueryListEvent) => {
      stateRef.current.reducedMotion = e.matches;
    };
    motionQuery.addEventListener("change", motionHandler);

    let disposed = false;

    // ============================================================
    // Scene setup
    // ============================================================
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.028);

    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );

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
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Env map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envCanvas = document.createElement("canvas");
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const envCtx = envCanvas.getContext("2d")!;
    const envGrad = envCtx.createLinearGradient(0, 0, 0, 512);
    envGrad.addColorStop(0, "#1a2030");
    envGrad.addColorStop(0.4, "#0a0d14");
    envGrad.addColorStop(0.6, "#2a1810");
    envGrad.addColorStop(1, "#3a1f0a");
    envCtx.fillStyle = envGrad;
    envCtx.fillRect(0, 0, 1024, 512);
    envCtx.fillStyle = "rgba(255, 180, 100, 0.35)";
    envCtx.beginPath(); envCtx.arc(512, 256, 150, 0, Math.PI * 2); envCtx.fill();
    envCtx.fillStyle = "rgba(201, 165, 122, 0.2)";
    envCtx.beginPath(); envCtx.arc(200, 300, 80, 0, Math.PI * 2); envCtx.fill();
    envCtx.beginPath(); envCtx.arc(800, 350, 120, 0, Math.PI * 2); envCtx.fill();
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    const envMap = pmremGenerator.fromEquirectangular(envTex).texture;
    scene.environment = envMap;
    pmremGenerator.dispose();

    // Lighting
    scene.add(new THREE.AmbientLight(0x404858, 0.3));
    const keyLight = new THREE.DirectionalLight(0xfff0d8, 0.8);
    keyLight.position.set(6, 14, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 40;
    keyLight.shadow.camera.left = -12;
    keyLight.shadow.camera.right = 12;
    keyLight.shadow.camera.top = 12;
    keyLight.shadow.camera.bottom = -12;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb87333, 0.35);
    fillLight.position.set(-10, 4, -6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffa870, 0.4);
    rimLight.position.set(0, 3, -12);
    scene.add(rimLight);

    // ============================================================
    // Ground platform
    // ============================================================
    const platformGroup = new THREE.Group();
    scene.add(platformGroup);

    const floorGeo = new THREE.PlaneGeometry(40, 40);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0a0d14,
      metalness: 0.168,
      roughness: 0.95,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.6;
    floor.receiveShadow = true;
    platformGroup.add(floor);

    // Concentric oval outlines on floor
    for (let i = 0; i < 3; i++) {
      const scale = 1 + i * 0.15;
      const curve = new THREE.EllipseCurve(0, 0, RING_RX * scale, RING_RZ * scale, 0, Math.PI * 2, false, 0);
      const pts = curve.getPoints(128);
      const pts3d = pts.map((p) => new THREE.Vector3(p.x, 0, p.y));
      const geo = new THREE.BufferGeometry().setFromPoints(pts3d);
      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({
          color: PALETTE.copperDeep,
          transparent: true,
          opacity: 0.25 - i * 0.07,
        })
      );
      line.position.y = -1.58;
      platformGroup.add(line);
    }

    // Radial floor lines
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const x1 = Math.cos(a) * (RING_RX - 1);
      const z1 = Math.sin(a) * (RING_RZ - 1);
      const x2 = Math.cos(a) * (RING_RX + 2);
      const z2 = Math.sin(a) * (RING_RZ + 2);
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x1, -1.58, z1),
        new THREE.Vector3(x2, -1.58, z2),
      ]);
      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({ color: 0x2a1810, transparent: true, opacity: 0.3 })
      );
      platformGroup.add(line);
    }

    // ============================================================
    // Core Reactor
    // ============================================================
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const coreCenter = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    coreGroup.add(coreCenter);

    const corona1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 48, 48),
      new THREE.MeshBasicMaterial({
        color: PALETTE.coreHot,
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
      })
    );
    coreGroup.add(corona1);

    const corona2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.75, 48, 48),
      new THREE.MeshBasicMaterial({
        color: PALETTE.coreWarm,
        transparent: true,
        opacity: 0.192,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    coreGroup.add(corona2);

    const corona3 = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 48, 48),
      new THREE.MeshBasicMaterial({
        color: PALETTE.orbitGlow,
        transparent: true,
        opacity: 0.077,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    coreGroup.add(corona3);

    // Lens flare
    const flareTex = makeFlareTexture();
    const flareSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: flareTex,
        color: 0xffffff,
        transparent: true,
        opacity: 0.512,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    flareSprite.scale.set(3.5, 3.5, 1);
    coreGroup.add(flareSprite);

    const streakTex = makeStreakTexture();
    const streakH = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: streakTex,
        transparent: true,
        opacity: 0.384,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    streakH.scale.set(5, 0.5, 1);
    coreGroup.add(streakH);

    const streakV = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: streakTex,
        transparent: true,
        opacity: 0.256,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        rotation: Math.PI / 2,
      })
    );
    streakV.scale.set(5, 0.3, 1);
    coreGroup.add(streakV);

    // Orbital rings around core
    interface OrbitObj {
      isParticle?: boolean;
      mesh?: THREE.Mesh;
      rotation?: THREE.Euler;
      userData?: Record<string, unknown>;
    }
    const orbits: OrbitObj[] = [];
    const orbitConfigs = [
      { rx: 1.3, rz: 1.1, tilt: [0.2, 0, 0.3] },
      { rx: 1.5, rz: 1.3, tilt: [0.8, 0.5, -0.2] },
      { rx: 1.2, rz: 1.4, tilt: [-0.4, 1.1, 0.6] },
      { rx: 1.6, rz: 1.15, tilt: [0.5, -0.7, 0.9] },
      { rx: 1.4, rz: 1.5, tilt: [-0.9, 0.3, -0.5] },
      { rx: 1.35, rz: 1.25, tilt: [1.2, 0.8, 0.1] },
    ];

    orbitConfigs.forEach((cfg, i) => {
      const curve = new THREE.EllipseCurve(0, 0, cfg.rx, cfg.rz, 0, Math.PI * 2, false, 0);
      const pts = curve.getPoints(128);
      const pts3d = pts.map((p) => new THREE.Vector3(p.x, 0, p.y));
      const curvePath = new THREE.CatmullRomCurve3(pts3d, true);

      const tubeGeo = new THREE.TubeGeometry(curvePath, 128, 0.008, 8, true);
      const tube = new THREE.Mesh(
        tubeGeo,
        new THREE.MeshStandardMaterial({
          color: PALETTE.copperBright,
          emissive: PALETTE.copperBright,
          emissiveIntensity: 0.6,
          metalness: 0.8,
          roughness: 0.3,
        })
      );
      tube.rotation.set(cfg.tilt[0], cfg.tilt[1], cfg.tilt[2]);
      tube.userData.spin = [
        0.001 + Math.random() * 0.002,
        0.0015 + Math.random() * 0.002,
        0.001 + Math.random() * 0.002,
      ];
      coreGroup.add(tube);
      orbits.push(tube as unknown as OrbitObj);

      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      particle.userData.orbit = i;
      particle.userData.speed = 0.003 + Math.random() * 0.005;
      particle.userData.t = Math.random();
      particle.userData.curve = curvePath;
      particle.userData.tilt = cfg.tilt;
      coreGroup.add(particle);
      orbits.push({ isParticle: true, mesh: particle });
    });

    // Core lights
    const coreLight1 = new THREE.PointLight(PALETTE.coreWarm, 1.92, 20);
    coreGroup.add(coreLight1);
    const coreLight2 = new THREE.PointLight(PALETTE.orbitGlow, 0.96, 10);
    coreLight2.position.set(0, 0.5, 0);
    coreGroup.add(coreLight2);

    // Core pedestal
    const corePedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.3, 0.2, 48),
      new THREE.MeshStandardMaterial({
        color: PALETTE.darkSteel,
        metalness: 0.85,
        roughness: 0.35,
        envMapIntensity: 1,
      })
    );
    corePedestal.position.y = -1.45;
    corePedestal.castShadow = true;
    corePedestal.receiveShadow = true;
    scene.add(corePedestal);

    const corePedRing = new THREE.Mesh(
      new THREE.CylinderGeometry(1.12, 1.12, 0.04, 48),
      new THREE.MeshStandardMaterial({
        color: PALETTE.copper,
        metalness: 1,
        roughness: 0.3,
        emissive: PALETTE.copper,
        emissiveIntensity: 0.15,
      })
    );
    corePedRing.position.y = -1.33;
    scene.add(corePedRing);

    // ============================================================
    // Accelerator Ring — 7 arc segments
    // ============================================================
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const GLASS_GAPS = new Set([0, 2, 4]);
    const SECTION_COUNT = SECTIONS.length;
    const HOUSING_GAP = 0.025;

    interface ArcDatum {
      fromT: number;
      toT: number;
      midT: number;
      isGlass: boolean;
      curve: THREE.CatmullRomCurve3;
    }
    const arcData: ArcDatum[] = [];

    for (let i = 0; i < SECTION_COUNT; i++) {
      const fromT = i / SECTION_COUNT + HOUSING_GAP;
      const toT = (i + 1) / SECTION_COUNT - HOUSING_GAP;
      const midT = (fromT + toT) / 2;
      const isGlass = GLASS_GAPS.has(i);

      const arcPts: THREE.Vector3[] = [];
      const segs = 48;
      for (let s = 0; s <= segs; s++) {
        const tt = fromT + (toT - fromT) * (s / segs);
        arcPts.push(ellipsePos(tt));
      }
      const arcCurve = new THREE.CatmullRomCurve3(arcPts, false);
      arcData.push({ fromT, toT, midT, isGlass, curve: arcCurve });
    }

    const glassMat = new THREE.MeshPhongMaterial({
      color: 0xe8ecf2,
      transparent: true,
      opacity: 0.18,
      shininess: 90,
      specular: new THREE.Color(0xffffff),
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const solidMat = new THREE.MeshPhysicalMaterial({
      color: PALETTE.platinum,
      metalness: 0.95,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.15,
      envMapIntensity: 1.5,
    });

    // Build each arc
    arcData.forEach((arc) => {
      const outerGeo = new THREE.TubeGeometry(arc.curve, 48, 0.16, 20, false);
      const outerMesh = new THREE.Mesh(
        outerGeo,
        arc.isGlass ? glassMat.clone() : solidMat.clone()
      );
      if (!arc.isGlass) {
        outerMesh.castShadow = true;
        outerMesh.receiveShadow = true;
      } else {
        outerMesh.renderOrder = 2;
      }
      ringGroup.add(outerMesh);

      if (arc.isGlass) {
        [arc.fromT, arc.toT].forEach((capT) => {
          const capPos = ellipsePos(capT);
          const capTan = ellipseTangent(capT);
          const cap = new THREE.Mesh(
            new THREE.TorusGeometry(0.18, 0.025, 12, 32),
            new THREE.MeshPhysicalMaterial({
              color: PALETTE.copper,
              metalness: 1,
              roughness: 0.3,
              clearcoat: 1,
              envMapIntensity: 1.6,
            })
          );
          cap.position.copy(capPos);
          const quat = new THREE.Quaternion();
          quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), capTan);
          cap.quaternion.copy(quat);
          cap.rotation.x += Math.PI / 2;
          ringGroup.add(cap);

          const light = new THREE.Mesh(
            new THREE.SphereGeometry(0.025, 12, 12),
            new THREE.MeshBasicMaterial({ color: PALETTE.copperBright })
          );
          light.position.copy(capPos);
          light.position.y += 0.2;
          ringGroup.add(light);
        });
      }
    });

    // Inner beam glow for solid arcs
    arcData.forEach((arc) => {
      if (arc.isGlass) return;
      const innerArcGeo = new THREE.TubeGeometry(arc.curve, 48, 0.06, 12, false);
      const innerArc = new THREE.Mesh(
        innerArcGeo,
        new THREE.MeshBasicMaterial({
          color: PALETTE.copperBright,
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending,
        })
      );
      ringGroup.add(innerArc);
    });

    // Glass-section energy streams
    interface GlassStream {
      mesh: THREE.Mesh;
      base: number;
      speed: number;
      phase: number;
    }
    const glassStreams: GlassStream[] = [];
    arcData.forEach((arc) => {
      if (!arc.isGlass) return;

      const coreBeamGeo = new THREE.TubeGeometry(arc.curve, 48, 0.015, 8, false);
      const coreBeam = new THREE.Mesh(
        coreBeamGeo,
        new THREE.MeshBasicMaterial({
          color: 0xfff0d0,
          transparent: true,
          opacity: 0.25,
          blending: THREE.AdditiveBlending,
        })
      );
      coreBeam.renderOrder = 1;
      ringGroup.add(coreBeam);
      glassStreams.push({ mesh: coreBeam, base: 0.25, speed: 6, phase: Math.random() * 10 });

      const midBeamGeo = new THREE.TubeGeometry(arc.curve, 48, 0.045, 12, false);
      const midBeam = new THREE.Mesh(
        midBeamGeo,
        new THREE.MeshBasicMaterial({
          color: PALETTE.coreWarm,
          transparent: true,
          opacity: 0.12,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      midBeam.renderOrder = 1;
      ringGroup.add(midBeam);
      glassStreams.push({ mesh: midBeam, base: 0.12, speed: 4, phase: Math.random() * 10 });
    });

    // Rib joints on solid arcs
    const jointCount = 56;
    for (let i = 0; i < jointCount; i++) {
      const tt = i / jointCount;
      const insideGlass = arcData.some(
        (arc) => arc.isGlass && tt >= arc.fromT && tt <= arc.toT
      );
      if (insideGlass) continue;
      const p = ellipsePos(tt);
      const tan = ellipseTangent(tt);
      const jointGroup = new THREE.Group();
      jointGroup.position.copy(p);
      const quat = new THREE.Quaternion();
      quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan);
      jointGroup.quaternion.copy(quat);
      const rib = new THREE.Mesh(
        new THREE.TorusGeometry(0.2, 0.02, 10, 20),
        new THREE.MeshStandardMaterial({
          color: PALETTE.darkSteel,
          metalness: 0.9,
          roughness: 0.25,
        })
      );
      rib.rotation.x = Math.PI / 2;
      jointGroup.add(rib);
      ringGroup.add(jointGroup);
    }

    // ============================================================
    // Section housings
    // ============================================================
    const sectionMeshes: typeof sectionMeshDataRef.current = [];
    const clickableMeshes: THREE.Mesh[] = [];

    SECTIONS.forEach((section, index) => {
      const tt = index / SECTIONS.length;
      const pos = ellipsePos(tt);
      const tan = ellipseTangent(tt);
      const segGroup = new THREE.Group();
      segGroup.position.copy(pos);
      const angleFromTangent = Math.atan2(tan.x, tan.z);
      segGroup.rotation.y = angleFromTangent;

      const housingGroup = new THREE.Group();
      housingGroup.position.y = 0.35;
      segGroup.add(housingGroup);

      const housing = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.55, 0.7),
        new THREE.MeshPhysicalMaterial({
          color: PALETTE.brushedSteel,
          metalness: 0.92,
          roughness: 0.25,
          clearcoat: 0.8,
          clearcoatRoughness: 0.2,
          envMapIntensity: 1.3,
        })
      );
      housing.castShadow = true;
      housing.receiveShadow = true;
      housing.userData.sectionId = section.id;
      housingGroup.add(housing);
      clickableMeshes.push(housing);

      const topCap = new THREE.Mesh(
        new THREE.BoxGeometry(0.92, 0.06, 0.72),
        new THREE.MeshPhysicalMaterial({
          color: PALETTE.copper,
          metalness: 1,
          roughness: 0.3,
          envMapIntensity: 1.5,
        })
      );
      topCap.position.y = 0.3;
      housingGroup.add(topCap);

      // Side coils
      [-0.55, 0.55].forEach((zOffset) => {
        const coilOuter = new THREE.Mesh(
          new THREE.CylinderGeometry(0.28, 0.28, 0.3, 32),
          new THREE.MeshPhysicalMaterial({
            color: PALETTE.copper,
            metalness: 1,
            roughness: 0.3,
            clearcoat: 0.6,
            envMapIntensity: 1.4,
          })
        );
        coilOuter.rotation.z = Math.PI / 2;
        coilOuter.position.set(0, 0, zOffset);
        coilOuter.castShadow = true;
        housingGroup.add(coilOuter);

        for (let r = 0; r < 6; r++) {
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.29, 0.012, 8, 32),
            new THREE.MeshStandardMaterial({
              color: PALETTE.copperDeep,
              metalness: 0.9,
              roughness: 0.4,
            })
          );
          ring.rotation.y = Math.PI / 2;
          ring.position.set(-0.12 + r * 0.048, 0, zOffset);
          housingGroup.add(ring);
        }
      });

      // Brackets
      [-0.32, 0.32].forEach((xOffset) => {
        const bracket = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.45, 0.74),
          new THREE.MeshStandardMaterial({
            color: PALETTE.darkSteel,
            metalness: 0.85,
            roughness: 0.4,
          })
        );
        bracket.position.set(xOffset, -0.05, 0);
        housingGroup.add(bracket);
      });

      // LED indicators
      for (let l = 0; l < 3; l++) {
        const led = new THREE.Mesh(
          new THREE.SphereGeometry(0.025, 16, 16),
          new THREE.MeshBasicMaterial({ color: PALETTE.copperBright })
        );
        led.position.set(0, 0.34, -0.2 + l * 0.2);
        housingGroup.add(led);
      }

      // Base mount
      const mount = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.18, 0.12, 24),
        new THREE.MeshStandardMaterial({
          color: PALETTE.darkSteel,
          metalness: 0.9,
          roughness: 0.3,
        })
      );
      mount.position.y = 0.08;
      segGroup.add(mount);

      // Floating label
      const labelTex = makeLabelTexture(section.name, 512);
      const labelMat = new THREE.SpriteMaterial({
        map: labelTex,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        depthTest: true,
        blending: THREE.NormalBlending,
      });
      const label = new THREE.Sprite(labelMat);
      label.scale.set(2.4, 0.6, 1);
      label.position.y = 1.9;
      label.userData.baseY = 1.9;
      label.userData.phase = index * 0.7;
      segGroup.add(label);

      // Connector line
      const connGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0.95, 0),
        new THREE.Vector3(0, 1.7, 0),
      ]);
      new THREE.Line(
        connGeo,
        new THREE.LineBasicMaterial({
          color: PALETTE.copper,
          transparent: true,
          opacity: 0.35,
        })
      );
      segGroup.add(new THREE.Line(connGeo, new THREE.LineBasicMaterial({ color: PALETTE.copper, transparent: true, opacity: 0.35 })));

      // Section glow light
      const sectionLight = new THREE.PointLight(PALETTE.coreWarm, 0, 4);
      sectionLight.position.y = 0.4;
      segGroup.add(sectionLight);

      // Number label on housing face
      const numTex = makeNumberTexture(index);
      const numPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.18, 0.18),
        new THREE.MeshBasicMaterial({
          map: numTex,
          transparent: true,
          depthWrite: false,
        })
      );
      numPlane.position.set(0, 0.42, 0.36);
      housingGroup.add(numPlane);

      sectionMeshes.push({
        housing,
        topCap,
        label,
        light: sectionLight,
        section,
        index,
        hovered: false,
        active: false,
      });

      ringGroup.add(segGroup);
    });

    sectionMeshDataRef.current = sectionMeshes;
    clickableMeshesRef.current = clickableMeshes;

    // ============================================================
    // Energy particles
    // ============================================================
    const PARTICLE_COUNT = 400;
    const particleT = new Float32Array(PARTICLE_COUNT);
    const particleSpeed = new Float32Array(PARTICLE_COUNT);
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particleT[i] = Math.random();
      particleSpeed[i] = 0.0008 + Math.random() * 0.0015;
      const p = ellipsePos(particleT[i]);
      particlePositions[i * 3] = p.x;
      particlePositions[i * 3 + 1] = p.y + (Math.random() - 0.5) * 0.08;
      particlePositions[i * 3 + 2] = p.z;
    }

    const pointTex = makePointTexture();
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({
        map: pointTex,
        color: 0xffe0b0,
        size: 0.28,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false,
      })
    );
    particles.renderOrder = 1;
    ringGroup.add(particles);

    // Energy bolts
    const BOLT_COUNT = 40;
    const boltT = new Float32Array(BOLT_COUNT);
    const boltSpeed = new Float32Array(BOLT_COUNT);
    const boltPositions = new Float32Array(BOLT_COUNT * 3);

    for (let i = 0; i < BOLT_COUNT; i++) {
      boltT[i] = i / BOLT_COUNT;
      boltSpeed[i] = 0.0018 + Math.random() * 0.0008;
      const p = ellipsePos(boltT[i]);
      boltPositions[i * 3] = p.x;
      boltPositions[i * 3 + 1] = p.y;
      boltPositions[i * 3 + 2] = p.z;
    }

    const boltTex = makeBoltTexture();
    const boltGeo = new THREE.BufferGeometry();
    boltGeo.setAttribute("position", new THREE.BufferAttribute(boltPositions, 3));
    const bolts = new THREE.Points(
      boltGeo,
      new THREE.PointsMaterial({
        map: boltTex,
        color: 0xffffff,
        size: 0.7,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false,
      })
    );
    bolts.renderOrder = 1;
    ringGroup.add(bolts);

    // ============================================================
    // Post-processing
    // ============================================================
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    composer.setSize(container.clientWidth, container.clientHeight);

    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      1.1,
      0.7,
      0.12
    );
    composer.addPass(bloomPass);

    const colorShader = {
      uniforms: {
        tDiffuse: { value: null },
        amount: { value: 0.002 },
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
          col.r += 0.015 * (1.0 - col.r);
          col.g += 0.005 * (1.0 - col.g);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    };
    composer.addPass(new ShaderPass(colorShader));

    // ============================================================
    // Camera
    // ============================================================
    const ctrl = controlsRef.current;
    function updateCamera() {
      const sinPhi = Math.sin(ctrl.phi);
      camera.position.x = ctrl.distance * sinPhi * Math.sin(ctrl.theta);
      camera.position.y = ctrl.distance * Math.cos(ctrl.phi);
      camera.position.z = ctrl.distance * sinPhi * Math.cos(ctrl.theta);
      camera.lookAt(0, 0, 0);
    }
    updateCamera();

    // Interaction
    let dragMoved = false;

    const onPointerDown = (e: PointerEvent) => {
      ctrl.dragging = true;
      ctrl.prevX = e.clientX;
      ctrl.prevY = e.clientY;
      dragMoved = false;
    };
    const onPointerUp = () => { ctrl.dragging = false; };
    const onPointerMove = (e: PointerEvent) => {
      if (!ctrl.dragging) {
        // Hover detection
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(clickableMeshes);
        const hoveredId = hits.length > 0 ? (hits[0].object.userData.sectionId as string) : null;
        canvas.style.cursor = hoveredId ? "pointer" : "default";
        sectionMeshes.forEach((sm) => {
          sm.hovered = sm.section.id === hoveredId;
        });
        return;
      }
      const dx = e.clientX - ctrl.prevX;
      const dy = e.clientY - ctrl.prevY;
      if (Math.abs(dx) + Math.abs(dy) > 3) dragMoved = true;
      ctrl.prevX = e.clientX;
      ctrl.prevY = e.clientY;
      ctrl.theta -= dx * 0.005;
      ctrl.phi = Math.max(ctrl.minPhi, Math.min(ctrl.maxPhi, ctrl.phi - dy * 0.005));
      updateCamera();
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      ctrl.distance = Math.max(ctrl.minDist, Math.min(ctrl.maxDist, ctrl.distance + e.deltaY * 0.015));
      updateCamera();
    };
    const onClick = (e: MouseEvent) => {
      if (dragMoved) return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes);
      if (hits.length > 0) {
        const id = hits[0].object.userData.sectionId as string;
        if (id) selectSection(id);
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("click", onClick);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    // ============================================================
    // Animation loop
    // ============================================================
    const clock = new THREE.Clock();
    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    let animId = 0;
    function animate() {
      if (disposed) return;
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const st = stateRef.current;
      const reduced = st.reducedMotion;

      // Core pulse
      if (!reduced) {
        const pulse = 1 + Math.sin(t * 2.2) * 0.08;
        coreCenter.scale.set(pulse, pulse, pulse);
        const pulse2 = 1 + Math.sin(t * 2.2 + 0.4) * 0.06;
        corona1.scale.set(pulse2, pulse2, pulse2);
        corona2.material.opacity = 0.16 + Math.sin(t * 1.8) * 0.051;
        corona3.material.opacity = 0.064 + Math.sin(t * 1.3) * 0.026;
        flareSprite.material.opacity = 0.448 + Math.sin(t * 3) * 0.096;
        streakH.material.opacity = 0.32 + Math.sin(t * 2.5 + 1) * 0.096;
        streakV.material.opacity = 0.224 + Math.sin(t * 3.5 + 2) * 0.064;
        streakH.scale.x = 5 + Math.sin(t * 2.5) * 0.3;
        streakV.scale.x = 5 + Math.sin(t * 3) * 0.25;
      }

      // Orbital rings rotation
      if (!reduced) {
        orbits.forEach((obj) => {
          if (obj.isParticle && obj.mesh) {
            const p = obj.mesh;
            p.userData.t = ((p.userData.t as number) + (p.userData.speed as number)) % 1;
            const pos = (p.userData.curve as THREE.CatmullRomCurve3).getPoint(p.userData.t as number);
            const tilt = p.userData.tilt as number[];
            const euler = new THREE.Euler(tilt[0], tilt[1], tilt[2]);
            pos.applyEuler(euler);
            p.position.copy(pos);
          } else if (!obj.isParticle) {
            const tube = obj as unknown as THREE.Mesh;
            const spin = tube.userData.spin as number[];
            tube.rotation.x += spin[0];
            tube.rotation.y += spin[1];
            tube.rotation.z += spin[2];
          }
        });
      }

      // Ring rotation
      if (!reduced) {
        if (st.autoRotate) {
          st.ringRotation += 0.0008;
        } else {
          st.ringRotation = lerp(st.ringRotation, st.rotationTarget, 0.05);
        }
      }
      ringGroup.rotation.y = st.ringRotation;

      // Particle flow
      if (!reduced) {
        const posArr = particleGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particleT[i] = (particleT[i] + particleSpeed[i]) % 1;
          const p = ellipsePos(particleT[i]);
          posArr[i * 3] = p.x;
          posArr[i * 3 + 2] = p.z;
        }
        particleGeo.attributes.position.needsUpdate = true;

        const boltArr = boltGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < BOLT_COUNT; i++) {
          boltT[i] = (boltT[i] + boltSpeed[i]) % 1;
          const p = ellipsePos(boltT[i]);
          boltArr[i * 3] = p.x;
          boltArr[i * 3 + 1] = p.y;
          boltArr[i * 3 + 2] = p.z;
        }
        boltGeo.attributes.position.needsUpdate = true;

        glassStreams.forEach((s) => {
          (s.mesh.material as THREE.MeshBasicMaterial).opacity =
            s.base + Math.sin(t * s.speed + s.phase) * (s.base * 0.25);
        });
      }

      // Section states
      sectionMeshes.forEach((sm) => {
        const isActive = sm.section.id === st.activeSection;
        sm.active = isActive;

        const targetIntensity = isActive ? 1.5 : sm.hovered ? 0.6 : 0;
        sm.light.intensity = lerp(sm.light.intensity, targetIntensity, 0.1);

        const mat = sm.topCap.material as THREE.MeshPhysicalMaterial;
        if (isActive) {
          mat.emissive = new THREE.Color(PALETTE.orbitGlow);
          mat.emissiveIntensity = lerp(mat.emissiveIntensity || 0, 0.6, 0.1);
        } else {
          mat.emissiveIntensity = lerp(mat.emissiveIntensity || 0, 0, 0.1);
        }

        if (!reduced) {
          sm.label.position.y =
            (sm.label.userData.baseY as number) +
            Math.sin(t * 1.5 + (sm.label.userData.phase as number)) * 0.08;
        }
        const labelOp = isActive ? 1.0 : sm.hovered ? 0.95 : 0.85;
        sm.label.material.opacity = lerp(sm.label.material.opacity, labelOp, 0.1);
      });

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
      bloomPass.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Start
    animate();
    setTimeout(() => setLoaded(true), 800);

    // ============================================================
    // Cleanup
    // ============================================================
    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("click", onClick);
      motionQuery.removeEventListener("change", motionHandler);
      renderer.dispose();
      composer.dispose();
    };
  }, [selectSection]);

  // ============================================================
  // Active section data for definition panel
  // ============================================================
  const activeData = activeSection
    ? SECTIONS.find((s) => s.id === activeSection)
    : null;
  const activeIdx = activeSection
    ? SECTIONS.findIndex((s) => s.id === activeSection)
    : -1;

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
        <span
          className="text-[10px] tracking-[0.4em]"
          style={{ color: "#c9a57a" }}
        >
          INITIALIZING &middot; STELLAR ENGINE
        </span>
      </div>

      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,220,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(200,220,255,0.015) 1px, transparent 1px)",
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
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
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
      <div className="absolute top-7 left-[26px] z-[5] font-mono text-[10px] tracking-[0.25em]" style={{ color: "#c0cad8", textShadow: "0 0 12px rgba(168, 216, 255, 0.15)" }}>
        <div className="mb-[5px] flex items-center gap-2">
          <span className="inline-block w-[5px] h-[5px] rounded-full animate-pulse" style={{ background: "#ffd896", boxShadow: "0 0 10px #ffd896, 0 0 20px rgba(255, 216, 150, 0.4)" }} />
          SYSTEM &middot; ONLINE
        </div>
        <div className="mb-[5px] pl-[10px]">CORE &middot; STABLE</div>
        <div className="pl-[10px]">FLUX &middot; NOMINAL</div>
      </div>

      {/* Title block */}
      <div className="absolute top-[34px] left-1/2 -translate-x-1/2 text-center pointer-events-none z-[5]">
        <div
          className="text-[26px] tracking-[0.35em] font-extralight mb-2"
          style={{
            color: "#e8ecf2",
            textShadow: "0 0 40px rgba(255,200,140,0.2)",
          }}
        >
          THE STELLAR ENGINE
        </div>
        <div
          className="text-[10.5px] tracking-[0.18em] font-light"
          style={{
            color: "#c0cad8",
            textShadow: "0 0 10px rgba(168, 216, 255, 0.15)",
          }}
        >
          A seven-stage governance system for reversing urban poverty at scale
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
          The Closed Loop
        </div>
      </div>

      {/* Definition panel */}
      {activeData && (
        <div
          className="absolute bottom-[120px] left-1/2 -translate-x-1/2 w-[520px] max-w-[calc(100vw-60px)] z-[6] animate-[fadeUp_0.4s_ease]"
          style={{
            background: "rgba(10,13,20,0.70)",
            backdropFilter: "blur(24px) saturate(1.2)",
            WebkitBackdropFilter: "blur(24px) saturate(1.2)",
            border: "1px solid rgba(180,140,100,0.15)",
            boxShadow: "0 0 40px rgba(0,0,0,0.6)",
            padding: "18px 24px",
          }}
        >
          {/* Gold bar */}
          <div
            className="absolute -top-px left-6 w-[30px] h-[2px]"
            style={{ background: "#c9a57a", boxShadow: "0 0 10px #c9a57a" }}
          />
          <div className="flex items-center gap-3 mb-[10px]">
            <span className="text-[10px] tracking-[0.25em] font-mono" style={{ color: "#ffd896" }}>
              0{activeIdx + 1}
            </span>
            <span
              className="text-[13px] tracking-[0.25em] font-medium uppercase flex-1"
              style={{
                color: "#ffffff",
                textShadow: "0 0 12px rgba(255, 216, 150, 0.2)",
              }}
            >
              {activeData.name}
            </span>
            <span
              className="text-lg"
              style={{
                opacity: 0.9,
                filter: "drop-shadow(0 0 8px rgba(255, 216, 150, 0.3))",
              }}
            >
              {activeData.icon}
            </span>
          </div>
          <div className="text-[11.5px] leading-[1.7] mb-3" style={{ color: "#8a94a4" }}>
            {activeData.definition}
          </div>
          <button
            onClick={resumeRotation}
            className="bg-transparent text-[9px] tracking-[0.25em] cursor-pointer font-inherit transition-all duration-300 hover:border-[rgba(201,165,122,0.6)] hover:bg-[rgba(201,165,122,0.08)]"
            style={{
              border: "1px solid rgba(201,165,122,0.25)",
              color: "#c9a57a",
              padding: "6px 12px",
            }}
          >
            &larr; RESUME ROTATION
          </button>
        </div>
      )}

      {/* Menubar */}
      <nav
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-[6] flex items-stretch max-w-[calc(100vw-60px)]"
        style={{
          background: "rgba(10,13,20,0.82)",
          backdropFilter: "blur(24px) saturate(1.2)",
          WebkitBackdropFilter: "blur(24px) saturate(1.2)",
          border: "1px solid rgba(180,140,100,0.12)",
          boxShadow:
            "0 0 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        {/* Header */}
        <div
          className="flex flex-col justify-center px-5 min-w-[110px]"
          style={{ borderRight: "1px solid rgba(180,140,100,0.15)" }}
        >
          <div className="text-[9px] tracking-[0.35em] font-medium mb-1" style={{ color: "#c0cad8", textShadow: "0 0 10px rgba(168, 216, 255, 0.15)" }}>
            PROCESS
          </div>
          <div className="text-[8.5px] tracking-[0.25em] font-mono" style={{ color: "#8a94a4" }}>
            INDEX &middot; 7
          </div>
        </div>

        {/* Nav items */}
        <div className="flex flex-row">
          {SECTIONS.map((s, i) => {
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => selectSection(s.id)}
                className="flex flex-col items-start justify-center text-left gap-1 relative min-w-[98px] whitespace-nowrap transition-all duration-300 cursor-pointer border-none font-inherit"
                style={{
                  padding: "14px 18px",
                  background: isActive
                    ? "linear-gradient(180deg, rgba(184,115,51,0.12), transparent)"
                    : "transparent",
                  borderTop: `2px solid ${isActive ? "#c9a57a" : "transparent"}`,
                  color: "inherit",
                }}
              >
                {/* Separator */}
                {i < SECTIONS.length - 1 && (
                  <span
                    className="absolute right-0 top-[30%] bottom-[30%] w-px"
                    style={{ background: "rgba(180,140,100,0.1)" }}
                  />
                )}
                <span className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-medium font-mono transition-colors duration-300" style={{ color: isActive ? "#ffd896" : "#8a94a4" }}>
                  <span
                    className="inline-block w-1 h-1 rounded-full transition-all duration-400"
                    style={{
                      background: isActive ? "#ffd896" : "#4a5260",
                      boxShadow: isActive
                        ? "0 0 10px #ffd896, 0 0 20px rgba(255, 216, 150, 0.4)"
                        : "none",
                    }}
                  />
                  0{i + 1}
                </span>
                <span
                  className="text-[11.5px] tracking-[0.25em] font-medium uppercase transition-colors duration-300"
                  style={{
                    color: isActive ? "#ffffff" : "#d0d8e4",
                    textShadow: isActive
                      ? "0 0 12px rgba(255, 216, 150, 0.4)"
                      : "0 0 10px rgba(200, 215, 240, 0.15)",
                  }}
                >
                  {s.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Hint */}
      {!activeSection && (
        <div
          className="absolute bottom-7 right-[26px] z-[5] text-[10px] tracking-[0.15em] flex items-center gap-2"
          style={{
            color: "#6b7380",
            padding: "8px 14px",
            background: "rgba(10,13,20,0.6)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(180,140,100,0.1)",
          }}
        >
          <span
            className="w-[5px] h-[5px] rounded-full animate-pulse"
            style={{
              background: "#c9a57a",
              boxShadow: "0 0 10px #c9a57a",
            }}
          />
          DRAG &middot; SCROLL &middot; CLICK SEGMENT
        </div>
      )}

      {/* Corner info */}
      <div className="absolute top-7 right-[26px] text-right z-[5]">
        <div className="text-[9px] tracking-[0.3em] font-mono mb-[3px]" style={{ color: "#4a5260" }}>
          SYS.MODEL
        </div>
        <div className="text-[11px] tracking-[0.25em] font-mono" style={{ color: "#c9a57a" }}>
          v7.0 &middot; MKE
        </div>
      </div>
    </div>
  );
}
