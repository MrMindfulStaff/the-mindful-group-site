"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
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

const R = 3.2; // ring radius
const TUBE = 0.35; // tube radius

/* ── Torus ring with vertex colors ── */
function ColoredRing({ active }: { active: number | null }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  const geometry = useMemo(() => {
    const geo = new THREE.TorusGeometry(R, TUBE, 24, 128);
    geo.rotateX(-Math.PI / 2); // lay flat
    const colors = new Float32Array(geo.attributes.position.count * 3);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      let angle = Math.atan2(z, x);
      if (angle < 0) angle += Math.PI * 2;
      const section = Math.floor((angle / (Math.PI * 2)) * 7) % 7;
      const c = new THREE.Color(STEPS[section].color);
      if (active !== null && section !== active) {
        c.multiplyScalar(0.5);
      }
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [active]);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial vertexColors roughness={0.4} metalness={0.3} />
    </mesh>
  );
}

/* ── Wireframe overlay ── */
function WireframeRing() {
  const geo = useMemo(() => {
    const g = new THREE.TorusGeometry(R, TUBE, 16, 64);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);

  return (
    <mesh geometry={geo}>
      <meshBasicMaterial color="#1B3A5C" wireframe transparent opacity={0.06} />
    </mesh>
  );
}

/* ── Step nodes on the ring ── */
function StepNodes({ active, onSelect }: { active: number | null; onSelect: (i: number) => void }) {
  return (
    <>
      {STEPS.map((step, i) => {
        const angle = (i / 7) * Math.PI * 2;
        const x = Math.cos(angle) * R;
        const z = Math.sin(angle) * R;
        const isActive = active === i;
        const scale = isActive ? 1.5 : 1;
        return (
          <group key={i} position={[x, 0.15, z]}>
            <Float speed={2} floatIntensity={isActive ? 0.15 : 0.05}>
              <mesh
                scale={scale}
                onClick={(e) => { e.stopPropagation(); onSelect(i); }}
              >
                <octahedronGeometry args={[0.18, 0]} />
                <meshStandardMaterial
                  color={step.color}
                  emissive={step.color}
                  emissiveIntensity={isActive ? 0.6 : 0.1}
                  metalness={0.5}
                  roughness={0.3}
                />
              </mesh>
            </Float>
            {/* Vertical line from ring to node */}
            <mesh position={[0, -0.08, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.15, 4]} />
              <meshBasicMaterial color={step.color} transparent opacity={0.3} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

/* ── Flowing particles inside the ring ── */
function FlowParticles() {
  const count = 200;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      speed: 0.08 + Math.random() * 0.04,
      offset: (Math.random() - 0.5) * TUBE * 0.6,
      yOff: (Math.random() - 0.5) * TUBE * 0.4,
      size: 0.008 + Math.random() * 0.012,
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      const a = p.angle + t * p.speed;
      const pr = R + p.offset;
      dummy.position.set(Math.cos(a) * pr, p.yOff, Math.sin(a) * pr);
      dummy.scale.setScalar(p.size * (1 + Math.sin(t * 2 + p.angle) * 0.3));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#93B396" transparent opacity={0.4} />
    </instancedMesh>
  );
}

/* ── Flow direction arrows ── */
function FlowArrows() {
  const arrowsRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!arrowsRef.current) return;
    const t = state.clock.elapsedTime;
    arrowsRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        (child.material as THREE.MeshBasicMaterial).opacity =
          0.15 + Math.sin(t * 1.5 + i * 0.6) * 0.08;
      }
    });
  });

  return (
    <group ref={arrowsRef}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * R;
        const z = Math.sin(angle) * R;
        return (
          <mesh
            key={i}
            position={[x, TUBE + 0.08, z]}
            rotation={[Math.PI / 2, 0, -angle + Math.PI / 2]}
          >
            <coneGeometry args={[0.06, 0.14, 4]} />
            <meshBasicMaterial color="#E07C3E" transparent opacity={0.15} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ── Central core ── */
function Core() {
  const coreRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (coreRef.current) coreRef.current.rotation.y = state.clock.elapsedTime * 0.08;
  });

  return (
    <Float speed={1.5} floatIntensity={0.1}>
      <mesh ref={coreRef}>
        <dodecahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial
          color="#1A7A5C"
          emissive="#1A7A5C"
          emissiveIntensity={0.4}
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshBasicMaterial color="#E07C3E" transparent opacity={0.08} />
      </mesh>
      <pointLight intensity={1.5} color="#1A7A5C" distance={5} />
    </Float>
  );
}

/* ── Auto-rotate wrapper ── */
function RotatingScene({ active, onSelect }: { active: number | null; onSelect: (i: number) => void }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current && active === null) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <ColoredRing active={active} />
      <WireframeRing />
      <StepNodes active={active} onSelect={onSelect} />
      <FlowParticles />
      <FlowArrows />
      <Core />
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
      <div className="w-full aspect-square max-w-xl mx-auto rounded-2xl overflow-hidden bg-gradient-to-b from-surface to-white border border-border-light shadow-lg">
        <Canvas
          camera={{ position: [3, 4.5, 5], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true }}
        >
          <ambientLight intensity={0.5} color="#c8c0b8" />
          <directionalLight position={[8, 10, 5]} intensity={0.8} color="#fff5e0" />
          <directionalLight position={[-4, 6, -3]} intensity={0.2} color="#aac4e0" />
          <hemisphereLight color="#d0d8e0" groundColor="#c8c0a8" intensity={0.2} />

          <RotatingScene active={active} onSelect={handleSelect} />

          <OrbitControls
            enablePan={false}
            minDistance={5}
            maxDistance={14}
            minPolarAngle={0.3}
            maxPolarAngle={1.2}
            enableDamping
          />
        </Canvas>
      </div>

      {/* Step legend below the diagram */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
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

      {/* Active step detail */}
      {active !== null && (
        <div className="mt-4 text-center">
          <p className="text-sm text-text-light">
            Click the node again or drag to orbit. Click another step to compare.
          </p>
        </div>
      )}
    </div>
  );
}
