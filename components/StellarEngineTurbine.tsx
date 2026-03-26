"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";

/* ════════════════════════════════════════════════════════════════════
   THE STELLAR ENGINE — Particle Accelerator / Torus Closed Loop

   A premium interactive 3D visualization where the 7-step process
   lives on a toroidal ring — like CERN's Large Hadron Collider.
   Each station features a holographic vignette projected above it.

   Energy particles flow continuously through the ring.
   Click a station → camera orbits to it, hologram activates.
   ════════════════════════════════════════════════════════════════════ */

// ─── Colors ───
const TEAL        = "#1A7A5C";
const TEAL_LIGHT  = "#93B396";
const ORANGE      = "#E07C3E";
const ORANGE_LIGHT= "#E8944F";
const NAVY        = "#1B3A5C";
const STEEL       = "#6a7a85";
const STEEL_DARK  = "#3a4a55";
const COPPER      = "#b87333";
const HOT         = "#ff6633";
const HOLO_CYAN   = "#00e5ff";
const HOLO_GREEN  = "#39ff8e";
const BG          = "#060d14";

// ─── Ring geometry constants ───
const RING_RADIUS = 8;       // Major radius of the torus
const TUBE_RADIUS = 0.6;     // Tube thickness
const STATION_COUNT = 7;

// ─── Step data ───
const STEPS = [
  {
    id: "recruit", step: "01", title: "RECRUIT", part: "Intake Accelerator",
    color: TEAL,
    desc: "The system draws participants from underserved communities. Priority for those facing employment barriers in Milwaukee's 53206. Zero tuition. Zero prerequisites. Just show up.",
    details: ["Zero-tuition enrollment", "Court & probation partnerships", "Community recruitment", "Walk-in orientations"],
  },
  {
    id: "train", step: "02", title: "TRAIN", part: "Compression Chamber",
    color: TEAL_LIGHT,
    desc: "Accelerated, high-density certification programs compress months of learning into focused cohorts. CNA/CBRF, Construction, Phlebotomy — industry-recognized from day one.",
    details: ["CNA/CBRF Healthcare", "Construction & Trades", "Phlebotomy Certification", "Career Workshops"],
  },
  {
    id: "certify", step: "03", title: "CERTIFY", part: "Ignition Core",
    color: ORANGE,
    desc: "The combustion point. Participants earn real, state-recognized credentials — not participation certificates. This is where potential becomes power.",
    details: ["State-recognized credentials", "90% graduation rate", "Employer-validated", "Industry-standard"],
  },
  {
    id: "place", step: "04", title: "PLACE", part: "Extraction Turbine",
    color: COPPER,
    desc: "The staffing arm places certified graduates with employers. Every placement generates workforce revenue. Every hire proves the model.",
    details: ["85% job placement", "Staffing arm revenue", "Employer network", "Career tracking"],
  },
  {
    id: "surplus", step: "05", title: "GENERATE SURPLUS", part: "Thrust Output",
    color: ORANGE,
    desc: "Revenue exceeds operating costs. This is not profit — it is thrust. The economic force that propels the entire system forward without grant dependency.",
    details: ["Revenue > operating cost", "Not grant-dependent", "Surplus = system fuel", "Workforce revenue floor"],
  },
  {
    id: "reinvest", step: "06", title: "REINVEST", part: "Return Manifold",
    color: TEAL,
    desc: "Surplus cycles back through the system that created it. Four allocation channels ensure both immediate impact and long-term growth.",
    details: ["30% → Services", "20% → Non-WIOA access", "30% → Expansion", "20% → Reserves"],
  },
  {
    id: "scale", step: "07", title: "SCALE", part: "Amplification Ring",
    color: HOT,
    desc: "At scale, cost per participant decreases while surplus per cycle increases. The engine doesn't just sustain — it accelerates. More powerful at volume, not less.",
    details: ["Decreasing unit cost", "Increasing surplus", "Replication-ready", "Proven in 53206"],
  },
];

// Get position on torus for a given station index
function getStationPosition(index: number): [number, number, number] {
  const angle = (index / STATION_COUNT) * Math.PI * 2 - Math.PI / 2;
  return [
    Math.cos(angle) * RING_RADIUS,
    0,
    Math.sin(angle) * RING_RADIUS,
  ];
}

function getStationAngle(index: number): number {
  return (index / STATION_COUNT) * Math.PI * 2 - Math.PI / 2;
}

/* ════════════════════════════════════════════
   TORUS RING — The Accelerator Structure
   ════════════════════════════════════════════ */

function AcceleratorRing() {
  return (
    <group>
      {/* Main torus — solid translucent */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RING_RADIUS, TUBE_RADIUS, 24, 120]} />
        <meshStandardMaterial
          color={STEEL_DARK}
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={0.15}
        />
      </mesh>
      {/* Wireframe overlay */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RING_RADIUS, TUBE_RADIUS + 0.02, 12, 120]} />
        <meshBasicMaterial color={STEEL} wireframe transparent opacity={0.06} />
      </mesh>
      {/* Inner guide ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RING_RADIUS, TUBE_RADIUS * 0.3, 16, 120]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.04} />
      </mesh>
      {/* Outer containment ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RING_RADIUS, TUBE_RADIUS + 0.15, 6, 120]} />
        <meshBasicMaterial color={NAVY} wireframe transparent opacity={0.03} />
      </mesh>
      {/* Segment dividers — structural ribs */}
      {Array.from({ length: 28 }).map((_, i) => {
        const angle = (i / 28) * Math.PI * 2;
        const x = Math.cos(angle) * RING_RADIUS;
        const z = Math.sin(angle) * RING_RADIUS;
        return (
          <mesh key={i} position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
            <torusGeometry args={[TUBE_RADIUS + 0.1, 0.015, 8, 16]} />
            <meshStandardMaterial color={STEEL} metalness={0.8} roughness={0.3} transparent opacity={0.12} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ════════════════════════════════════════════
   ENERGY PARTICLES — Flowing through the ring
   ════════════════════════════════════════════ */

function EnergyParticles() {
  const count = 600;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      offset: (i / count) * Math.PI * 2,
      speed: 0.15 + Math.random() * 0.12,
      wobble: (Math.random() - 0.5) * TUBE_RADIUS * 0.6,
      wobbleY: (Math.random() - 0.5) * TUBE_RADIUS * 0.6,
      size: 0.015 + Math.random() * 0.025,
      colorShift: Math.random(),
    })), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      const angle = p.offset + t * p.speed;
      const x = Math.cos(angle) * (RING_RADIUS + p.wobble);
      const y = p.wobbleY;
      const z = Math.sin(angle) * (RING_RADIUS + p.wobble);
      dummy.position.set(x, y, z);
      const pulse = 1 + Math.sin(t * 3 + p.offset) * 0.3;
      dummy.scale.setScalar(p.size * pulse);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* Teal particles — main flow */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color={TEAL_LIGHT} transparent opacity={0.55} />
      </instancedMesh>
    </>
  );
}

/* Fast orange particles — surplus energy */
function SurplusParticles() {
  const count = 150;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      offset: (i / count) * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.15,
      wobble: (Math.random() - 0.5) * TUBE_RADIUS * 0.3,
      size: 0.02 + Math.random() * 0.015,
    })), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      const angle = p.offset + t * p.speed;
      const x = Math.cos(angle) * (RING_RADIUS + p.wobble);
      const y = (Math.random() - 0.5) * 0.15;
      const z = Math.sin(angle) * (RING_RADIUS + p.wobble);
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(p.size * (0.8 + Math.sin(t * 5 + p.offset) * 0.2));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={ORANGE} transparent opacity={0.4} />
    </instancedMesh>
  );
}

/* ════════════════════════════════════════════
   STATION STRUCTURES — Mechanical nodes on ring
   ════════════════════════════════════════════ */

function StationStructure({ index, active }: { index: number; active: boolean }) {
  const [x, , z] = getStationPosition(index);
  const angle = getStationAngle(index);
  const step = STEPS[index];
  const groupRef = useRef<THREE.Group>(null!);

  // Pylon structure at each station
  return (
    <group position={[x, 0, z]} rotation={[0, -angle, 0]}>
      {/* Base mount — connects to ring */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[TUBE_RADIUS + 0.3, TUBE_RADIUS + 0.15, 0.2, 8]} />
        <meshStandardMaterial color={STEEL_DARK} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Vertical pylon */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 2.2, 6]} />
        <meshStandardMaterial color={active ? step.color : STEEL} metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Pylon cross-struts */}
      {[0.5, 1.0, 1.5].map((y, i) => (
        <group key={i}>
          <mesh position={[0.25, y, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.02, 0.02, 0.5, 4]} />
            <meshStandardMaterial color={STEEL_DARK} metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[-0.25, y, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.02, 0.02, 0.5, 4]} />
            <meshStandardMaterial color={STEEL_DARK} metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* Hologram projector platform */}
      <mesh position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.4, 0.35, 0.08, 8]} />
        <meshStandardMaterial color={active ? step.color : STEEL_DARK} metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Projector ring */}
      <mesh position={[0, 2.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.015, 8, 24]} />
        <meshBasicMaterial color={active ? step.color : STEEL} transparent opacity={active ? 0.8 : 0.2} />
      </mesh>
      {/* Active glow beam */}
      {active && (
        <mesh position={[0, 3.2, 0]}>
          <cylinderGeometry args={[0.02, 0.35, 1.6, 8]} />
          <meshBasicMaterial color={HOLO_CYAN} transparent opacity={0.06} />
        </mesh>
      )}
      {/* Station number marker */}
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color={active ? step.color : STEEL} transparent opacity={active ? 0.9 : 0.3} />
      </mesh>
    </group>
  );
}

/* ════════════════════════════════════════════
   HOLOGRAPHIC VIGNETTES — Projected scenes
   Each step gets a unique holographic diorama.
   ════════════════════════════════════════════ */

/* Shared hologram container with scan lines */
function HologramContainer({ index, active, children }: { index: number; active: boolean; children: React.ReactNode }) {
  const [x, , z] = getStationPosition(index);
  const angle = getStationAngle(index);
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    if (active) {
      groupRef.current.visible = true;
      // Gentle float
      groupRef.current.position.y = 3.5 + Math.sin(t * 1.5) * 0.08;
      // Slow rotation for hologram effect
      groupRef.current.children.forEach((child) => {
        if (child.userData.holoRotate) {
          child.rotation.y = t * 0.3;
        }
      });
    } else {
      groupRef.current.visible = false;
    }
  });

  return (
    <group ref={groupRef} position={[x, 3.5, z]} rotation={[0, -angle, 0]} visible={false}>
      {/* Hologram base glow */}
      <mesh position={[0, -0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.8, 24]} />
        <meshBasicMaterial color={HOLO_CYAN} transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      {/* Scan lines cylinder */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 1.6, 16, 12, true]} />
        <meshBasicMaterial color={HOLO_CYAN} wireframe transparent opacity={0.04} />
      </mesh>
      {/* Scene content */}
      <group userData={{ holoRotate: true }}>
        {children}
      </group>
    </group>
  );
}

/* 01 RECRUIT — Figures entering a portal */
function HoloRecruit() {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
  });
  return (
    <group ref={groupRef}>
      {/* Portal arch */}
      <mesh position={[0, 0, 0.3]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.45, 0.04, 8, 24, Math.PI]} />
        <meshBasicMaterial color={HOLO_CYAN} transparent opacity={0.5} />
      </mesh>
      {/* Portal fill */}
      <mesh position={[0, 0, 0.3]}>
        <circleGeometry args={[0.44, 16, 0, Math.PI]} />
        <meshBasicMaterial color={HOLO_CYAN} transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
      {/* Line of figures approaching */}
      {[-0.6, -0.4, -0.2, 0, 0.15].map((xOff, i) => (
        <group key={i} position={[xOff - 0.1, -0.25 + i * 0.02, -0.15 + i * 0.12]}>
          {/* Body */}
          <mesh>
            <capsuleGeometry args={[0.04, 0.12, 4, 8]} />
            <meshBasicMaterial color={i < 3 ? HOLO_GREEN : HOLO_CYAN} transparent opacity={0.5 - i * 0.05} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.035, 6, 6]} />
            <meshBasicMaterial color={i < 3 ? HOLO_GREEN : HOLO_CYAN} transparent opacity={0.5 - i * 0.05} />
          </mesh>
        </group>
      ))}
      {/* Arrow indicator */}
      <mesh position={[0.15, -0.3, 0.15]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.04, 0.15, 4]} />
        <meshBasicMaterial color={HOLO_CYAN} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

/* 02 TRAIN — Figures in formation with knowledge beams */
function HoloTrain() {
  const beamRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (beamRef.current) {
      beamRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          (child.material as THREE.MeshBasicMaterial).opacity =
            0.15 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.1;
        }
      });
    }
  });
  return (
    <group>
      {/* Seated figures in rows */}
      {[
        [-0.3, -0.35, -0.2], [0, -0.35, -0.2], [0.3, -0.35, -0.2],
        [-0.15, -0.35, 0.1], [0.15, -0.35, 0.1],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x!, y!, z!]}>
          <mesh>
            <capsuleGeometry args={[0.04, 0.08, 4, 8]} />
            <meshBasicMaterial color={HOLO_GREEN} transparent opacity={0.45} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.035, 6, 6]} />
            <meshBasicMaterial color={HOLO_GREEN} transparent opacity={0.45} />
          </mesh>
        </group>
      ))}
      {/* Knowledge beams from above */}
      <group ref={beamRef}>
        {[-0.2, 0, 0.2].map((x, i) => (
          <mesh key={i} position={[x, 0.2, -0.05]}>
            <cylinderGeometry args={[0.01, 0.15, 0.5, 4]} />
            <meshBasicMaterial color={HOLO_CYAN} transparent opacity={0.2} />
          </mesh>
        ))}
      </group>
      {/* Floating textbook/screen */}
      <Float speed={2} floatIntensity={0.1}>
        <mesh position={[0, 0.5, -0.05]}>
          <boxGeometry args={[0.35, 0.25, 0.02]} />
          <meshBasicMaterial color={HOLO_CYAN} transparent opacity={0.15} />
        </mesh>
        <mesh position={[0, 0.5, -0.04]}>
          <boxGeometry args={[0.32, 0.22, 0.01]} />
          <meshBasicMaterial color={HOLO_CYAN} wireframe transparent opacity={0.3} />
        </mesh>
      </Float>
    </group>
  );
}

/* 03 CERTIFY — Figure in certification ring, badge materializing */
function HoloCertify() {
  const ringRef = useRef<THREE.Mesh>(null!);
  const badgeRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) ringRef.current.rotation.y = t * 0.8;
    if (badgeRef.current) {
      badgeRef.current.rotation.y = t * 0.5;
      badgeRef.current.position.y = 0.35 + Math.sin(t * 2) * 0.05;
      (badgeRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.4 + Math.sin(t * 3) * 0.15;
    }
  });
  return (
    <group>
      {/* Central figure */}
      <group position={[0, -0.2, 0]}>
        <mesh>
          <capsuleGeometry args={[0.05, 0.15, 4, 8]} />
          <meshBasicMaterial color={HOLO_GREEN} transparent opacity={0.5} />
        </mesh>
        <mesh position={[0, 0.14, 0]}>
          <sphereGeometry args={[0.045, 6, 6]} />
          <meshBasicMaterial color={HOLO_GREEN} transparent opacity={0.5} />
        </mesh>
      </group>
      {/* Spinning certification ring */}
      <mesh ref={ringRef} position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.35, 0.02, 8, 32]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.5} />
      </mesh>
      {/* Second ring at different angle */}
      <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[0.38, 0.015, 8, 32]} />
        <meshBasicMaterial color={HOLO_CYAN} transparent opacity={0.2} />
      </mesh>
      {/* Materializing badge/credential */}
      <mesh ref={badgeRef} position={[0, 0.35, 0]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.5} />
      </mesh>
      {/* Particle shower */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.25, 0.3, Math.sin(a) * 0.25]}>
            <sphereGeometry args={[0.015, 4, 4]} />
            <meshBasicMaterial color={ORANGE} transparent opacity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

/* 04 PLACE — Figure crossing bridge to building */
function HoloPlace() {
  return (
    <group>
      {/* Building structure (destination) */}
      <group position={[0.3, -0.15, 0]}>
        <mesh>
          <boxGeometry args={[0.25, 0.4, 0.2]} />
          <meshBasicMaterial color={HOLO_CYAN} transparent opacity={0.12} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.25, 0.4, 0.2]} />
          <meshBasicMaterial color={HOLO_CYAN} wireframe transparent opacity={0.3} />
        </mesh>
        {/* Door */}
        <mesh position={[0, -0.1, 0.101]}>
          <boxGeometry args={[0.08, 0.15, 0.01]} />
          <meshBasicMaterial color={HOLO_GREEN} transparent opacity={0.3} />
        </mesh>
        {/* Windows */}
        {[[-0.06, 0.08], [0.06, 0.08]].map(([x, y], i) => (
          <mesh key={i} position={[x!, y!, 0.101]}>
            <boxGeometry args={[0.05, 0.05, 0.01]} />
            <meshBasicMaterial color={HOLO_CYAN} transparent opacity={0.25} />
          </mesh>
        ))}
      </group>
      {/* Bridge */}
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[0.7, 0.02, 0.12]} />
        <meshBasicMaterial color={HOLO_CYAN} transparent opacity={0.2} />
      </mesh>
      {/* Bridge railings */}
      {[-0.06, 0.06].map((z, i) => (
        <mesh key={i} position={[0, -0.3, z]}>
          <boxGeometry args={[0.7, 0.01, 0.01]} />
          <meshBasicMaterial color={HOLO_CYAN} transparent opacity={0.15} />
        </mesh>
      ))}
      {/* Walking figure */}
      <Float speed={1} floatIntensity={0.03}>
        <group position={[-0.1, -0.2, 0]}>
          <mesh>
            <capsuleGeometry args={[0.04, 0.12, 4, 8]} />
            <meshBasicMaterial color={HOLO_GREEN} transparent opacity={0.5} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.035, 6, 6]} />
            <meshBasicMaterial color={HOLO_GREEN} transparent opacity={0.5} />
          </mesh>
        </group>
      </Float>
      {/* Arrow */}
      <mesh position={[0.1, -0.2, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.03, 0.1, 4]} />
        <meshBasicMaterial color={HOLO_GREEN} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

/* 05 SURPLUS — Upward energy radiating */
function HoloSurplus() {
  const beamsRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!beamsRef.current) return;
    const t = state.clock.elapsedTime;
    beamsRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        const cycle = ((t * 0.5 + i * 0.3) % 1);
        child.position.y = -0.3 + cycle * 0.8;
        child.scale.setScalar(1 - cycle * 0.5);
        (child.material as THREE.MeshBasicMaterial).opacity = (1 - cycle) * 0.4;
      }
    });
  });
  return (
    <group>
      {/* Central core */}
      <mesh position={[0, -0.15, 0]}>
        <dodecahedronGeometry args={[0.15, 0]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshBasicMaterial color={ORANGE} wireframe transparent opacity={0.25} />
      </mesh>
      {/* Rising energy beams */}
      <group ref={beamsRef}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const r = 0.15 + (i % 3) * 0.08;
          return (
            <mesh key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
              <sphereGeometry args={[0.025, 4, 4]} />
              <meshBasicMaterial color={i % 2 === 0 ? ORANGE : HOLO_CYAN} transparent opacity={0.4} />
            </mesh>
          );
        })}
      </group>
      {/* Upward thrust lines */}
      {[0, Math.PI / 3, Math.PI * 2 / 3, Math.PI, Math.PI * 4 / 3, Math.PI * 5 / 3].map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 0.12, 0.15, Math.sin(a) * 0.12]}>
          <cylinderGeometry args={[0.008, 0.002, 0.35, 4]} />
          <meshBasicMaterial color={ORANGE} transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  );
}

/* 06 REINVEST — Stream splitting into 4 channels */
function HoloReinvest() {
  return (
    <group>
      {/* Central input */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color={HOLO_CYAN} transparent opacity={0.4} />
      </mesh>
      {/* Four output channels */}
      {[
        { angle: -0.8, label: "30%", color: TEAL },
        { angle: -0.3, label: "20%", color: TEAL_LIGHT },
        { angle: 0.3, label: "30%", color: ORANGE },
        { angle: 0.8, label: "20%", color: COPPER },
      ].map((ch, i) => (
        <group key={i}>
          {/* Flow line from center to output */}
          <mesh position={[ch.angle * 0.4, 0, 0]} rotation={[0, 0, ch.angle * 0.5]}>
            <cylinderGeometry args={[0.015, 0.015, 0.5, 4]} />
            <meshBasicMaterial color={ch.color} transparent opacity={0.3} />
          </mesh>
          {/* Output node */}
          <mesh position={[ch.angle * 0.55, -0.25, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color={ch.color} transparent opacity={0.35} />
          </mesh>
          <mesh position={[ch.angle * 0.55, -0.25, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color={ch.color} wireframe transparent opacity={0.5} />
          </mesh>
        </group>
      ))}
      {/* Connecting arc at top */}
      <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.01, 8, 16, Math.PI]} />
        <meshBasicMaterial color={HOLO_CYAN} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

/* 07 SCALE — Fractal expansion rings */
function HoloScale() {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const t = state.clock.elapsedTime;
          const scale = 0.3 + i * 0.25 + Math.sin(t * 1.5 + i * 0.8) * 0.05;
          child.scale.setScalar(scale);
          child.rotation.y = t * (0.3 - i * 0.05);
          child.rotation.z = Math.sin(t + i) * 0.1;
        }
      });
    }
  });
  return (
    <group>
      {/* Expanding rings */}
      <group ref={groupRef}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, -0.1 + i * 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1, 0.03, 8, 24]} />
            <meshBasicMaterial
              color={i === 0 ? HOT : i === 1 ? ORANGE : i === 2 ? TEAL : HOLO_CYAN}
              transparent
              opacity={0.4 - i * 0.07}
            />
          </mesh>
        ))}
      </group>
      {/* Center node */}
      <Float speed={2} floatIntensity={0.1}>
        <mesh position={[0, -0.1, 0]}>
          <icosahedronGeometry args={[0.1, 0]} />
          <meshBasicMaterial color={HOT} transparent opacity={0.5} />
        </mesh>
      </Float>
      {/* Expansion arrows */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 0.5, -0.1, Math.sin(a) * 0.5]} rotation={[0, -a, 0]}>
          <coneGeometry args={[0.025, 0.08, 4]} />
          <meshBasicMaterial color={HOLO_CYAN} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

const HOLO_COMPONENTS = [HoloRecruit, HoloTrain, HoloCertify, HoloPlace, HoloSurplus, HoloReinvest, HoloScale];

/* ════════════════════════════════════════════
   CAMERA CONTROLLER — Smooth orbit to stations
   ════════════════════════════════════════════ */

function CameraController({ activeStep }: { activeStep: number | null }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(8, 8, 12));
  const lookTarget = useRef(new THREE.Vector3(0, 1, 0));

  useEffect(() => {
    if (activeStep === null) {
      targetPos.current.set(8, 8, 12);
      lookTarget.current.set(0, 1, 0);
    } else {
      const angle = getStationAngle(activeStep);
      // Position camera behind and above the station, looking at hologram
      const camAngle = angle - 0.4;
      targetPos.current.set(
        Math.cos(camAngle) * 13,
        4.5,
        Math.sin(camAngle) * 13
      );
      const [sx, , sz] = getStationPosition(activeStep);
      lookTarget.current.set(sx * 0.7, 2.5, sz * 0.7);
    }
  }, [activeStep]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.025);
    const currentTarget = new THREE.Vector3();
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    currentTarget.copy(camera.position).add(dir.multiplyScalar(10));
    currentTarget.lerp(lookTarget.current, 0.03);
    camera.lookAt(currentTarget);
  });

  return null;
}

/* ════════════════════════════════════════════
   CENTRAL CORE — The engine heart
   ════════════════════════════════════════════ */

function CentralCore() {
  const coreRef = useRef<THREE.Group>(null!);
  const outerRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) coreRef.current.rotation.y = t * 0.15;
    if (outerRef.current) {
      outerRef.current.rotation.x = t * 0.08;
      outerRef.current.rotation.z = t * 0.05;
    }
  });

  return (
    <group position={[0, 1.5, 0]}>
      {/* Outer wireframe sphere */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshBasicMaterial color={NAVY} wireframe transparent opacity={0.04} />
      </mesh>
      {/* Inner core */}
      <group ref={coreRef}>
        <Float speed={1} floatIntensity={0.2}>
          <mesh>
            <dodecahedronGeometry args={[0.8, 0]} />
            <meshBasicMaterial color={TEAL} wireframe transparent opacity={0.15} />
          </mesh>
          <mesh>
            <dodecahedronGeometry args={[0.6, 0]} />
            <meshBasicMaterial color={ORANGE} transparent opacity={0.06} />
          </mesh>
        </Float>
      </group>
      {/* Vertical energy column */}
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, 4, 4]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

/* ════════════════════════════════════════════
   BASE PLATFORM
   ════════════════════════════════════════════ */

function BasePlatform() {
  return (
    <group position={[0, -1.5, 0]}>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[RING_RADIUS - 3, RING_RADIUS + 3, 64]} />
        <meshBasicMaterial color={NAVY} transparent opacity={0.03} side={THREE.DoubleSide} />
      </mesh>
      {/* Grid lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <ringGeometry args={[0, RING_RADIUS + 5, 48, 1]} />
        <meshBasicMaterial color={TEAL} wireframe transparent opacity={0.02} />
      </mesh>
    </group>
  );
}

/* ════════════════════════════════════════════
   SCENE ASSEMBLY
   ════════════════════════════════════════════ */

function Scene({ activeStep }: { activeStep: number | null }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} color="#4a6a8a" />
      <directionalLight position={[10, 15, 5]} intensity={0.4} color="#ffffff" />
      <directionalLight position={[-5, -3, 8]} intensity={0.15} color="#ff8844" />
      <pointLight position={[0, 1.5, 0]} intensity={1} color={TEAL} distance={8} />
      {STEPS.map((step, i) => {
        const [x, , z] = getStationPosition(i);
        return <pointLight key={i} position={[x, 3, z]} intensity={activeStep === i ? 1.5 : 0.1} color={step.color} distance={4} />;
      })}

      <CameraController activeStep={activeStep} />
      <OrbitControls enableZoom enablePan={false} minDistance={6} maxDistance={22} enableDamping dampingFactor={0.05} />

      <AcceleratorRing />
      <EnergyParticles />
      <SurplusParticles />
      <CentralCore />
      <BasePlatform />

      {/* Stations + Holograms */}
      {STEPS.map((_, i) => (
        <StationStructure key={i} index={i} active={activeStep === i} />
      ))}
      {HOLO_COMPONENTS.map((HoloComponent, i) => (
        <HologramContainer key={i} index={i} active={activeStep === i}>
          <HoloComponent />
        </HologramContainer>
      ))}
    </>
  );
}

/* ════════════════════════════════════════════
   MAIN EXPORT — Compact sidebar + full canvas
   ════════════════════════════════════════════ */

export default function StellarEngineTurbine() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const handleStepClick = useCallback((index: number) => {
    setActiveStep((prev) => (prev === index ? null : index));
  }, []);

  const activeData = activeStep !== null ? STEPS[activeStep] : null;

  return (
    <div className="h-screen w-screen bg-[#060d14] flex">
      {/* Compact sidebar */}
      <div className="w-56 lg:w-64 shrink-0 bg-black/50 backdrop-blur-md border-r border-white/[0.03] flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.04]">
          <p className="text-[#E07C3E] text-[9px] uppercase tracking-[0.5em] mb-1.5 font-semibold">
            System Architecture
          </p>
          <h1 className="text-lg font-heading text-white leading-tight">
            The Stellar <span className="text-[#E07C3E]">Engine</span>
          </h1>
          <p className="text-white/20 text-[10px] mt-1.5 leading-relaxed">
            Click to inspect. Drag to orbit. Scroll to zoom.
          </p>
        </div>

        {/* Step list */}
        <div className="flex-1 py-1">
          {STEPS.map((step, i) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(i)}
              className={`w-full text-left px-5 py-3 transition-all duration-300 border-l-2 ${
                activeStep === i
                  ? "bg-white/[0.04] border-[#E07C3E]"
                  : "border-transparent hover:bg-white/[0.015] hover:border-white/[0.06]"
              }`}
            >
              <div className="flex items-baseline gap-2">
                <span
                  className="font-heading text-sm tabular-nums"
                  style={{ color: activeStep === i ? step.color : "rgba(255,255,255,0.2)" }}
                >
                  {step.step}
                </span>
                <div>
                  <p className={`text-[11px] font-semibold tracking-wider transition-colors ${
                    activeStep === i ? "text-white" : "text-white/40"
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-white/15 text-[9px] uppercase tracking-wider">
                    {step.part}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Configs */}
        <div className="px-5 py-3 border-t border-white/[0.04]">
          <p className="text-white/15 text-[9px] uppercase tracking-[0.2em] mb-2">Configurations</p>
          <div className="space-y-1.5">
            <div className="px-2.5 py-1.5 bg-white/[0.02] rounded border border-white/[0.04] text-[10px]">
              <span className="text-white/25">A.</span>{" "}
              <span className="text-white/50">Little Dipper</span>
            </div>
            <div className="px-2.5 py-1.5 bg-white/[0.02] rounded border border-[#E07C3E]/10 text-[10px]">
              <span className="text-[#E07C3E]/40">B.</span>{" "}
              <span className="text-white/50">Big Dipper</span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="p-5 border-t border-white/[0.04] space-y-2">
          <Link
            href="/programs"
            className="block w-full px-3 py-2.5 bg-[#E07C3E] text-white text-[10px] font-semibold uppercase tracking-wider text-center rounded hover:bg-[#E8944F] transition-colors"
          >
            Explore Programs
          </Link>
          <Link
            href="/get-involved"
            className="block w-full px-3 py-2.5 border border-white/10 text-white text-[10px] uppercase tracking-wider text-center rounded hover:bg-white/[0.03] transition-colors"
          >
            Partner With Us
          </Link>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <Canvas camera={{ position: [8, 8, 12], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true, alpha: false }} onCreated={({ gl }) => { gl.setClearColor(BG); }}>
          <Scene activeStep={activeStep} />
        </Canvas>

        {/* Detail panel — compact bottom overlay */}
        {activeData && (
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#060d14] via-[#060d14]/80 to-transparent pt-12 pb-6 px-8"
          >
            <div className="max-w-xl">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[#E07C3E] font-heading text-xl">{activeData.step}</span>
                <h2 className="text-sm font-heading text-white tracking-wider">{activeData.title}</h2>
                <span className="text-white/15 text-[10px] uppercase tracking-wider">— {activeData.part}</span>
              </div>
              <p className="text-white/45 text-xs leading-relaxed mb-3 max-w-md">{activeData.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {activeData.details.map((d) => (
                  <span key={d} className="px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded text-white/40 text-[10px]">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reset view */}
        {activeStep !== null && (
          <button
            onClick={() => setActiveStep(null)}
            className="absolute top-4 right-4 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded text-white/40 text-[10px] uppercase tracking-wider hover:bg-white/[0.08] transition-colors"
          >
            Reset View
          </button>
        )}

        {/* Title watermark when no step selected */}
        {activeStep === null && (
          <div className="absolute bottom-6 left-8 pointer-events-none">
            <p className="text-white/8 text-[10px] uppercase tracking-[0.5em]">
              The Mindful Group — Milwaukee, WI
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
