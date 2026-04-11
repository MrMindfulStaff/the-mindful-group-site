"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

/* ── Data ── */
const BUCKETS = [
  { name: "Supportive Services", pct: "30%", fill: 0.7, color: "#1A7A5C" },
  { name: "Non-WIOA Access", pct: "20%", fill: 0.5, color: "#22936F" },
  { name: "Program Expansion", pct: "30%", fill: 0.7, color: "#E07C3E" },
  { name: "Operational Reserves", pct: "20%", fill: 0.5, color: "#1B3A5C" },
];

/* Staircase positions — compact descending left-to-right */
const POSITIONS: [number, number, number][] = [
  [-1.8, 2.2, 0],
  [-0.6, 1.0, 0],
  [0.6, -0.2, 0],
  [1.8, -1.4, 0],
];

const TILT_Z = -0.08; // slight tilt toward next bucket

/* ── Bucket geometry constants ── */
const BUCKET_R_TOP = 0.55;
const BUCKET_R_BOT = 0.42;
const BUCKET_H = 0.8;

/* ══════════════════════════════════════════════
   Single Bucket — walls + floor + water fill
   ══════════════════════════════════════════════ */
function Bucket({
  color,
  fill,
  name,
  pct,
  visible,
}: {
  color: string;
  fill: number;
  name: string;
  pct: string;
  visible: boolean;
}) {
  const scaleRef = useRef(0);
  const groupRef = useRef<THREE.Group>(null!);
  const waterRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    // Scale-in animation
    const target = visible ? 1 : 0;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, target, delta * 3);
    if (groupRef.current) {
      groupRef.current.scale.setScalar(scaleRef.current);
    }

    // Water surface ripple
    if (waterRef.current && scaleRef.current > 0.5) {
      const geo = waterRef.current.geometry;
      const pos = geo.attributes.position;
      const t = state.clock.elapsedTime;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const y = Math.sin(x * 5 + t * 2.5) * 0.012 + Math.sin(z * 4 + t * 1.8) * 0.008;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }
  });

  const waterH = BUCKET_H * fill;
  const waterR =
    BUCKET_R_BOT + (BUCKET_R_TOP - BUCKET_R_BOT) * (waterH / BUCKET_H) * 0.9;

  return (
    <group ref={groupRef} rotation={[0, 0, TILT_Z]}>
      {/* Bucket walls (open top) */}
      <mesh>
        <cylinderGeometry
          args={[BUCKET_R_TOP, BUCKET_R_BOT, BUCKET_H, 32, 1, true]}
        />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.65}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floor */}
      <mesh position={[0, -BUCKET_H / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[BUCKET_R_BOT, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.65}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Rim ring for definition */}
      <mesh position={[0, BUCKET_H / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[BUCKET_R_TOP - 0.03, BUCKET_R_TOP + 0.03, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Water body inside */}
      <mesh position={[0, -BUCKET_H / 2 + waterH / 2 + 0.02, 0]}>
        <cylinderGeometry args={[waterR, BUCKET_R_BOT * 0.88, waterH, 32, 1, false]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.05}
          metalness={0.1}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* Water surface disc (with ripple) */}
      <mesh
        ref={waterRef}
        position={[0, -BUCKET_H / 2 + waterH + 0.03, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[waterR, 32, undefined, undefined]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.02}
          metalness={0.15}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Label — centered on the bucket front face */}
      <Html
        position={[0, 0, BUCKET_R_TOP + 0.05]}
        center
        distanceFactor={10}
        style={{ pointerEvents: "none" }}
      >
        <div className="text-center whitespace-nowrap">
          <p className="text-[11px] font-heading font-bold leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            {name}
          </p>
          <p className="text-[10px] font-semibold text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            {pct}
          </p>
        </div>
      </Html>
    </group>
  );
}

/* ══════════════════════════════════════════════
   Pour Stream — instanced particle bezier path
   ══════════════════════════════════════════════ */
function PourStream({
  from,
  to,
  color,
  active,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  active: boolean;
}) {
  const count = 70;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const opacityRef = useRef(0);

  const particles = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        t: Math.random(),
        speed: 0.25 + Math.random() * 0.15,
        wobbleX: (Math.random() - 0.5) * 0.15,
        wobbleZ: (Math.random() - 0.5) * 0.15,
        size: 0.025 + Math.random() * 0.02,
      })),
    []
  );

  // Bezier control points
  const start = useMemo(() => new THREE.Vector3(from[0] + 0.3, from[1] + BUCKET_H * 0.4, from[2]), [from]);
  const end = useMemo(() => new THREE.Vector3(to[0], to[1] + BUCKET_H * 0.5, to[2]), [to]);
  const control = useMemo(
    () =>
      new THREE.Vector3(
        (start.x + end.x) / 2,
        Math.min(start.y, end.y) - 0.3,
        0
      ),
    [start, end]
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Fade in/out
    const targetOp = active ? 0.65 : 0;
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOp, delta * 3);
    (meshRef.current.material as THREE.MeshStandardMaterial).opacity = opacityRef.current;

    if (opacityRef.current < 0.01) return;

    const t = state.clock.elapsedTime;

    particles.forEach((p, i) => {
      p.t += delta * p.speed;
      if (p.t > 1) p.t -= 1;

      // Quadratic bezier
      const t1 = p.t;
      const mt = 1 - t1;
      const x = mt * mt * start.x + 2 * mt * t1 * control.x + t1 * t1 * end.x;
      const y = mt * mt * start.y + 2 * mt * t1 * control.y + t1 * t1 * end.y;
      const z = mt * mt * start.z + 2 * mt * t1 * control.z + t1 * t1 * end.z;

      // Wobble
      const wx = Math.sin(t * 3 + i) * p.wobbleX;
      const wz = Math.cos(t * 2.5 + i * 0.7) * p.wobbleZ;

      // Splash spread near landing
      const splash = t1 > 0.85 ? (t1 - 0.85) * 4 : 0;
      const spreadX = splash * (Math.sin(i * 2.3) * 0.3);
      const spreadZ = splash * (Math.cos(i * 1.7) * 0.3);

      dummy.position.set(x + wx + spreadX, y, z + wz + spreadZ);
      const scale = p.size * (1 - splash * 0.5) * (0.5 + Math.sin(t * 2 + p.t * 6) * 0.2);
      dummy.scale.setScalar(Math.max(scale, 0.005));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        roughness={0.1}
        metalness={0.3}
        transparent
        opacity={0}
      />
    </instancedMesh>
  );
}

/* ══════════════════════════════════════════════
   River of Abundance
   ══════════════════════════════════════════════ */
function RiverOfAbundance({ active }: { active: boolean }) {
  const opacityRef = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  /* 4 colored river band refs */
  const bandRefs = useRef<(THREE.Mesh | null)[]>([]);
  const particlesRef = useRef<THREE.InstancedMesh>(null!);

  const RIVER_COLORS = ["#1A7A5C", "#22936F", "#E07C3E", "#1B3A5C"];

  const riverParticles = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        x: (Math.random() - 0.5) * 5,
        z: (Math.random() - 0.5) * 1.0,
        speed: 0.4 + Math.random() * 0.5,
        size: 0.025 + Math.random() * 0.03,
        yOff: Math.random() * 0.06,
        colorIdx: i % 4,
      })),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Fade river in
    const targetOp = active ? 1 : 0;
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOp, delta * 2);

    // Ripple each color band
    bandRefs.current.forEach((mesh) => {
      if (!mesh) return;
      (mesh.material as THREE.MeshStandardMaterial).opacity = opacityRef.current * 0.7;
      const geo = mesh.geometry;
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const y =
          Math.sin(x * 3 + t * 1.2) * 0.035 +
          Math.sin(x * 7 - t * 1.8) * 0.015 +
          Math.sin(z * 5 + t) * 0.01;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    });

    // Animate floating particles
    if (particlesRef.current) {
      (particlesRef.current.material as THREE.MeshStandardMaterial).opacity =
        opacityRef.current * 0.85;
      riverParticles.forEach((p, i) => {
        p.x += delta * p.speed;
        if (p.x > 3) p.x = -3;
        dummy.position.set(p.x, p.yOff + Math.sin(t + i) * 0.02, p.z);
        dummy.scale.setScalar(p.size);
        dummy.updateMatrix();
        particlesRef.current.setMatrixAt(i, dummy.matrix);
      });
      particlesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group position={[0.3, -2.6, 0]}>
      {/* 4 colored bands side by side */}
      {RIVER_COLORS.map((col, i) => (
        <mesh
          key={i}
          ref={(el) => { bandRefs.current[i] = el; }}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, -0.45 + i * 0.3]}
        >
          <planeGeometry args={[5.5, 0.35, 48, 8]} />
          <meshStandardMaterial
            color={col}
            emissive={col}
            emissiveIntensity={0.35}
            roughness={0.05}
            metalness={0.25}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Colored floating particles */}
      <instancedMesh ref={particlesRef} args={[undefined, undefined, 50]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          color="#22936F"
          emissive="#1A7A5C"
          emissiveIntensity={0.3}
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0}
        />
      </instancedMesh>

      {/* River label */}
      <Html
        position={[0, 0.15, 0.8]}
        center
        distanceFactor={10}
        style={{ pointerEvents: "none" }}
      >
        <span className="text-xs font-heading font-semibold text-primary whitespace-nowrap bg-white/85 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-primary/20">
          River of Abundance
        </span>
      </Html>
    </group>
  );
}

/* ══════════════════════════════════════════════
   Scene Assembly
   ══════════════════════════════════════════════ */
function CascadeScene() {
  const [visibleCount, setVisibleCount] = useState(0);

  // Staggered reveal
  useEffect(() => {
    if (visibleCount >= 5) return; // 4 buckets + river
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), 500);
    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.45} color="#c8c0b8" />
      <directionalLight position={[5, 8, 4]} intensity={0.9} color="#fff5e0" />
      <directionalLight position={[-3, 5, -2]} intensity={0.25} color="#aac4e0" />
      <hemisphereLight color="#d0d8e0" groundColor="#c8c0a8" intensity={0.2} />
      <Environment preset="city" environmentIntensity={0.3} />

      {/* Buckets */}
      {BUCKETS.map((b, i) => (
        <group key={i} position={POSITIONS[i]}>
          <Bucket
            color={b.color}
            fill={b.fill}
            name={b.name}
            pct={b.pct}
            visible={visibleCount > i}
          />
        </group>
      ))}

      {/* Pour streams between buckets */}
      {BUCKETS.slice(0, -1).map((b, i) => (
        <PourStream
          key={`stream-${i}`}
          from={POSITIONS[i]}
          to={POSITIONS[i + 1]}
          color={b.color}
          active={visibleCount > i + 1}
        />
      ))}

      {/* Final pour into river */}
      <PourStream
        from={POSITIONS[3]}
        to={[1.8, -2.6, 0]}
        color={BUCKETS[3].color}
        active={visibleCount > 4}
      />

      {/* River */}
      <RiverOfAbundance active={visibleCount > 4} />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          intensity={0.25}
          mipmapBlur
        />
        <Vignette offset={0.3} darkness={0.35} />
      </EffectComposer>
    </>
  );
}

/* ══════════════════════════════════════════════
   Main Export — Canvas wrapper
   ══════════════════════════════════════════════ */
export default function CascadingBuckets() {
  return (
    <div className="w-full aspect-[3/5] sm:aspect-[3/4] max-w-2xl mx-auto">
      <Canvas
        camera={{ position: [0, 0.4, 9], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <CascadeScene />
      </Canvas>
    </div>
  );
}
