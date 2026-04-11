"use client";

import { useRef, useMemo, useCallback, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, Text } from "@react-three/drei";
import * as THREE from "three";

const STEPS = [
  { title: "Recruit", color: "#1A7A5C" },
  { title: "Train", color: "#22936F" },
  { title: "Certify", color: "#2a9e7a" },
  { title: "Place", color: "#E07C3E" },
  { title: "Surplus", color: "#E8944F" },
  { title: "Reinvest", color: "#1B3A5C" },
  { title: "Scale", color: "#2A5580" },
];

const ORBIT_R = 3;

/* ── Glowing Orb Node ── */
function OrbNode({
  index,
  step,
  isActive,
  onSelect,
}: {
  index: number;
  step: (typeof STEPS)[number];
  isActive: boolean;
  onSelect: (i: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const orbSize = isActive ? 0.45 : 0.35;

  useFrame((state) => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.12 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.8} floatIntensity={isActive ? 0.15 : 0.06}>
        {/* Main orb */}
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelect(index);
          }}
          scale={orbSize}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color={step.color}
            emissive={step.color}
            emissiveIntensity={isActive ? 0.8 : 0.3}
            roughness={0.2}
            metalness={0.6}
            transparent
            opacity={0.92}
          />
        </mesh>

        {/* Outer glow */}
        <mesh ref={glowRef} scale={orbSize * 1.8}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color={step.color}
            transparent
            opacity={0.12}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Label */}
        <Html
          position={[0, orbSize + 0.35, 0]}
          center
          distanceFactor={8}
          style={{ pointerEvents: "none" }}
        >
          <span
            className={`text-xs font-semibold whitespace-nowrap px-2 py-0.5 rounded-full backdrop-blur-sm transition-all ${
              isActive
                ? "bg-white/90 text-primary shadow-md scale-110"
                : "bg-white/70 text-text-light"
            }`}
          >
            {step.title}
          </span>
        </Html>

        {/* Point light on active */}
        {isActive && (
          <pointLight color={step.color} intensity={2} distance={3} />
        )}
      </Float>
    </group>
  );
}

/* ── Orbit ring path (subtle torus) ── */
function OrbitPath() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[ORBIT_R, 0.015, 8, 128]} />
      <meshBasicMaterial color="#1A7A5C" transparent opacity={0.2} />
    </mesh>
  );
}

/* ── Flowing particles along orbit ── */
function FlowParticles() {
  const count = 120;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        angle: (i / count) * Math.PI * 2,
        speed: 0.12 + Math.random() * 0.06,
        rOff: (Math.random() - 0.5) * 0.6,
        yOff: (Math.random() - 0.5) * 0.3,
        size: 0.012 + Math.random() * 0.018,
      })),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      const a = p.angle + t * p.speed;
      const r = ORBIT_R + p.rOff;
      dummy.position.set(Math.cos(a) * r, p.yOff, Math.sin(a) * r);
      dummy.scale.setScalar(p.size * (1 + Math.sin(t * 2.5 + p.angle) * 0.3));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#93B396" transparent opacity={0.35} />
    </instancedMesh>
  );
}

/* ── Center Core with "Stellar Engine" label ── */
function CenterCore() {
  const coreRef = useRef<THREE.Mesh>(null!);
  const shellRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) coreRef.current.rotation.y = t * 0.15;
    if (shellRef.current) {
      shellRef.current.rotation.y = -t * 0.08;
      shellRef.current.rotation.x = t * 0.05;
    }
  });

  return (
    <group>
      {/* Inner glowing sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#1A7A5C"
          emissive="#1A7A5C"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.7}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Wireframe shell */}
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshStandardMaterial
          color="#E07C3E"
          wireframe
          transparent
          opacity={0.25}
          emissive="#E07C3E"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshBasicMaterial
          color="#1A7A5C"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* "Stellar Engine" label */}
      <Html center distanceFactor={8} position={[0, -1.0, 0]} style={{ pointerEvents: "none" }}>
        <span className="text-sm font-heading font-bold text-primary whitespace-nowrap bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-primary/20">
          Stellar Engine
        </span>
      </Html>

      <pointLight intensity={3} color="#1A7A5C" distance={6} />
    </group>
  );
}

/* ── Connection lines from center to orbs (thin cylinders) ── */
function ConnectionLines({ active }: { active: number | null }) {
  return (
    <>
      {STEPS.map((step, i) => {
        const angle = (i / STEPS.length) * Math.PI * 2;
        const x = Math.cos(angle) * ORBIT_R;
        const z = Math.sin(angle) * ORBIT_R;
        const isActive = active === i;
        const length = ORBIT_R;
        const midX = x / 2;
        const midZ = z / 2;

        return (
          <mesh
            key={i}
            position={[midX, 0, midZ]}
            rotation={[0, -angle + Math.PI / 2, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.008, 0.008, length, 4]} />
            <meshBasicMaterial
              color={step.color}
              transparent
              opacity={isActive ? 0.4 : 0.08}
            />
          </mesh>
        );
      })}
    </>
  );
}

/* ── Rotating scene ── */
function RotatingScene({
  active,
  onSelect,
}: {
  active: number | null;
  onSelect: (i: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <OrbitPath />
      <ConnectionLines active={active} />
      <FlowParticles />

      {/* 7 Orb nodes */}
      {STEPS.map((step, i) => {
        const angle = (i / STEPS.length) * Math.PI * 2;
        const x = Math.cos(angle) * ORBIT_R;
        const z = Math.sin(angle) * ORBIT_R;

        return (
          <group key={i} position={[x, 0, z]}>
            <OrbNode
              index={i}
              step={step}
              isActive={active === i}
              onSelect={onSelect}
            />
          </group>
        );
      })}

      <CenterCore />
    </group>
  );
}

/* ── Main export ── */
export default function EngineRingDiagram() {
  const [active, setActive] = useState<number | null>(null);

  const handleSelect = useCallback((i: number) => {
    setActive((prev) => (prev === i ? null : i));
  }, []);

  return (
    <div className="relative">
      <div className="w-full aspect-[4/3] max-w-2xl mx-auto">
        <Canvas
          camera={{ position: [0, 5, 7], fov: 38 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.5} color="#c8c0b8" />
          <directionalLight position={[8, 10, 5]} intensity={0.8} color="#fff5e0" />
          <directionalLight position={[-4, 6, -3]} intensity={0.2} color="#aac4e0" />
          <hemisphereLight color="#d0d8e0" groundColor="#c8c0a8" intensity={0.25} />

          <RotatingScene active={active} onSelect={handleSelect} />

          {/* No OrbitControls — fixed camera, no zoom */}
        </Canvas>
      </div>

      {/* Step legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {STEPS.map((step, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              active === i
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-border-light bg-white text-text-light hover:border-primary/30 hover:text-primary"
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: step.color }}
            />
            {step.title}
          </button>
        ))}
      </div>
    </div>
  );
}
