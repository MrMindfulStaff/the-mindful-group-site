"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, SSAO, ChromaticAberration, Vignette, ToneMapping } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
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
const STEEL       = "#b0bec5";
const STEEL_DARK  = "#78909c";
const SILVER      = "#d0d8dd";
const COPPER      = "#b87333";
const HOT         = "#ff6633";
const HOLO_CYAN   = "#00e5ff";
const HOLO_GREEN  = "#39ff8e";
const BG          = "#111d2a";

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
      {/* Main torus — solid translucent silver */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RING_RADIUS, TUBE_RADIUS, 24, 120]} />
        <meshStandardMaterial
          color={SILVER}
          metalness={0.95}
          roughness={0.12}
          transparent
          opacity={0.18}
        />
      </mesh>
      {/* Wireframe overlay — bright silver */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RING_RADIUS, TUBE_RADIUS + 0.02, 12, 120]} />
        <meshBasicMaterial color={SILVER} wireframe transparent opacity={0.12} />
      </mesh>
      {/* Inner guide ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RING_RADIUS, TUBE_RADIUS * 0.3, 16, 120]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.06} />
      </mesh>
      {/* Outer containment ring — silver wireframe */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RING_RADIUS, TUBE_RADIUS + 0.15, 6, 120]} />
        <meshBasicMaterial color={SILVER} wireframe transparent opacity={0.05} />
      </mesh>
      {/* Segment dividers — structural ribs, silver */}
      {Array.from({ length: 28 }).map((_, i) => {
        const angle = (i / 28) * Math.PI * 2;
        const x = Math.cos(angle) * RING_RADIUS;
        const z = Math.sin(angle) * RING_RADIUS;
        return (
          <mesh key={i} position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
            <torusGeometry args={[TUBE_RADIUS + 0.1, 0.015, 8, 16]} />
            <meshStandardMaterial color={SILVER} metalness={0.9} roughness={0.15} transparent opacity={0.15} />
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

/* ── Inner tube particles — circling INSIDE the torus tube ── */
function InnerTubeParticles() {
  const count = 400;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      // Position along the major ring
      ringAngle: (i / count) * Math.PI * 2,
      // Position around the tube cross-section
      tubeAngle: Math.random() * Math.PI * 2,
      // How far from tube center (0 = center, 1 = wall)
      tubeR: 0.15 + Math.random() * 0.35,
      // Speed along the ring
      ringSpeed: 0.25 + Math.random() * 0.2,
      // Speed around the tube cross-section
      tubeSpeed: 0.8 + Math.random() * 1.2,
      size: 0.008 + Math.random() * 0.014,
      bright: Math.random() > 0.7, // 30% are bright accents
    })), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      // Current position along the ring
      const rA = p.ringAngle + t * p.ringSpeed;
      // Current position in tube cross-section
      const tA = p.tubeAngle + t * p.tubeSpeed;

      // Center of the tube at this ring position
      const cx = Math.cos(rA) * RING_RADIUS;
      const cz = Math.sin(rA) * RING_RADIUS;

      // Offset within the tube cross-section
      // The tube's local axes: radial (outward from ring center) and vertical (y)
      const radialDir = [Math.cos(rA), 0, Math.sin(rA)];
      const tubeOffsetR = Math.cos(tA) * p.tubeR * TUBE_RADIUS;
      const tubeOffsetY = Math.sin(tA) * p.tubeR * TUBE_RADIUS;

      const x = cx + radialDir[0] * tubeOffsetR;
      const y = tubeOffsetY;
      const z = cz + radialDir[2] * tubeOffsetR;

      dummy.position.set(x, y, z);
      const pulse = 1 + Math.sin(t * 4 + p.ringAngle * 3) * 0.25;
      dummy.scale.setScalar(p.size * pulse);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color={HOLO_CYAN} transparent opacity={0.35} />
      </instancedMesh>
    </>
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
  const glowRef = useRef<THREE.Mesh>(null!);
  const pulseRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) coreRef.current.rotation.y = t * 0.15;
    if (outerRef.current) {
      outerRef.current.rotation.x = t * 0.08;
      outerRef.current.rotation.z = t * 0.05;
    }
    // Pulsing glow
    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 1.5) * 0.15;
      glowRef.current.scale.setScalar(scale);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.12 + Math.sin(t * 2) * 0.04;
    }
    // Outer pulse ring
    if (pulseRef.current) {
      const scale = 1.2 + Math.sin(t * 0.8) * 0.3;
      pulseRef.current.scale.setScalar(scale);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.06 + Math.sin(t * 1.2) * 0.03;
    }
  });

  return (
    <group position={[0, 1.5, 0]}>
      {/* Outer wireframe sphere */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshBasicMaterial color={SILVER} wireframe transparent opacity={0.05} />
      </mesh>
      {/* Large pulsing glow sphere — soft ambient */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.06} />
      </mesh>
      {/* Inner core */}
      <group ref={coreRef}>
        <Float speed={1} floatIntensity={0.2}>
          {/* Main dodecahedron — bright wireframe */}
          <mesh>
            <dodecahedronGeometry args={[0.8, 0]} />
            <meshBasicMaterial color={HOLO_CYAN} wireframe transparent opacity={0.45} />
          </mesh>
          {/* Solid inner glow */}
          <mesh>
            <dodecahedronGeometry args={[0.65, 0]} />
            <meshBasicMaterial color={TEAL} transparent opacity={0.2} />
          </mesh>
          {/* Hot center */}
          <mesh>
            <dodecahedronGeometry args={[0.4, 0]} />
            <meshBasicMaterial color={ORANGE} transparent opacity={0.15} />
          </mesh>
          {/* Bright core point */}
          <mesh>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
          </mesh>
        </Float>
      </group>
      {/* Glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.1} />
      </mesh>
      {/* Vertical energy column */}
      <mesh>
        <cylinderGeometry args={[0.03, 0.03, 5, 6]} />
        <meshBasicMaterial color={HOLO_CYAN} transparent opacity={0.1} />
      </mesh>
      {/* Second energy column — thinner, brighter */}
      <mesh>
        <cylinderGeometry args={[0.008, 0.008, 5.5, 4]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} />
      </mesh>
      {/* Core point light — strong glow */}
      <pointLight intensity={3} color={TEAL} distance={6} />
      <pointLight intensity={1.5} color={HOLO_CYAN} distance={4} />
    </group>
  );
}

/* ════════════════════════════════════════════
   BASE PLATFORM
   ════════════════════════════════════════════ */

/* ════════════════════════════════════════════
   NEIGHBORHOOD — Realistic community scene
   The engine powers the surrounding neighborhood.
   ════════════════════════════════════════════ */

const WALL_PALETTES = [
  { walls: "#f0e8d8", trim: "#e0d5c0" },  // cream
  { walls: "#e6ddd0", trim: "#d4c8b5" },  // warm beige
  { walls: "#d9c9b0", trim: "#c4b498" },  // tan
  { walls: "#e8e0d5", trim: "#d5cab8" },  // ivory
  { walls: "#c8bfb0", trim: "#b5a998" },  // stone
  { walls: "#ddd5c8", trim: "#cabfa8" },  // sand
  { walls: "#e5dcd0", trim: "#d2c6b2" },  // antique white
  { walls: "#c2b8a0", trim: "#a89880" },  // khaki
  { walls: "#8b9ea0", trim: "#7a8d90" },  // slate blue siding
  { walls: "#a89078", trim: "#907860" },  // brown siding
  { walls: "#c4a882", trim: "#b09570" },  // caramel
  { walls: "#b8c0a8", trim: "#a0a890" },  // sage
];
const ROOF_COLORS = ["#5a2a2a", "#4a3520", "#3a4a38", "#2a3a55", "#6a3a20", "#3a2a2a", "#504030", "#3a4a30", "#5a3028", "#4a4040"];
const DOOR_COLORS = ["#6a2a2a", "#2a4a6a", "#3a5a3a", "#c49a20", "#4a3020", "#d45b3e", "#2a3a5a", "#8a3a2a"];
const TREE_SHADES = ["#2a5520", "#35662e", "#40753a", "#254a20", "#306a28", "#458040", "#1e5520", "#3a7035", "#285a25"];

/* ── Realistic House with varied architecture ── */
type HouseStyle = "ranch" | "colonial" | "bungalow" | "cape";

function RealisticHouse({ position, style, wallIdx, roofIdx, doorIdx, scale = 1, rotation = 0 }: {
  position: [number, number, number]; style: HouseStyle;
  wallIdx: number; roofIdx: number; doorIdx: number;
  scale?: number; rotation?: number;
}) {
  const pal = WALL_PALETTES[wallIdx % WALL_PALETTES.length];
  const roof = ROOF_COLORS[roofIdx % ROOF_COLORS.length];
  const door = DOOR_COLORS[doorIdx % DOOR_COLORS.length];
  const s = scale;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {style === "ranch" && <RanchHouse s={s} pal={pal} roof={roof} door={door} />}
      {style === "colonial" && <ColonialHouse s={s} pal={pal} roof={roof} door={door} />}
      {style === "bungalow" && <BungalowHouse s={s} pal={pal} roof={roof} door={door} />}
      {style === "cape" && <CapeHouse s={s} pal={pal} roof={roof} door={door} />}
      {/* Front yard lawn patch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0.55 * s]}>
        <boxGeometry args={[1.2 * s, 0.6 * s, 0.01]} />
        <meshStandardMaterial color="#4a8a3e" roughness={0.95} />
      </mesh>
      {/* Driveway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.35 * s, 0.006, 0.55 * s]}>
        <boxGeometry args={[0.22 * s, 0.55 * s, 0.01]} />
        <meshStandardMaterial color="#888580" roughness={0.9} />
      </mesh>
      {/* Mailbox */}
      <group position={[0.3 * s, 0, 0.85 * s]}>
        <mesh position={[0, 0.12 * s, 0]}>
          <cylinderGeometry args={[0.008 * s, 0.01 * s, 0.24 * s, 4]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.25 * s, 0]}>
          <boxGeometry args={[0.05 * s, 0.035 * s, 0.03 * s]} />
          <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>
      {/* Front walkway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0.38 * s]}>
        <boxGeometry args={[0.12 * s, 0.35 * s, 0.01]} />
        <meshStandardMaterial color="#999590" roughness={0.85} />
      </mesh>
    </group>
  );
}

/* ── Ranch style — wide, single story ── */
function RanchHouse({ s, pal, roof, door }: { s: number; pal: { walls: string; trim: string }; roof: string; door: string }) {
  const w = 1.0 * s, h = 0.45 * s, d = 0.6 * s;
  return (
    <group>
      {/* Main body */}
      <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={pal.walls} roughness={0.85} />
      </mesh>
      {/* Foundation strip */}
      <mesh position={[0, 0.03 * s, 0]}>
        <boxGeometry args={[w + 0.02 * s, 0.06 * s, d + 0.02 * s]} />
        <meshStandardMaterial color="#777770" roughness={0.9} />
      </mesh>
      {/* Gable roof */}
      <mesh castShadow position={[0, h + 0.12 * s, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[w + 0.08 * s, 0.02 * s, d + 0.12 * s]} />
        <meshStandardMaterial color={roof} roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, h + 0.2 * s, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[(w * 0.78), 0.2 * s, 4]} />
        <meshStandardMaterial color={roof} roughness={0.8} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.17 * s, d / 2 + 0.005]}>
        <boxGeometry args={[0.1 * s, 0.28 * s, 0.01]} />
        <meshStandardMaterial color={door} roughness={0.7} />
      </mesh>
      {/* Door handle */}
      <mesh position={[0.035 * s, 0.15 * s, d / 2 + 0.012]}>
        <sphereGeometry args={[0.006 * s, 6, 6]} />
        <meshPhysicalMaterial color="#c8a840" metalness={0.95} roughness={0.15} clearcoat={0.5} reflectivity={1} />
      </mesh>
      {/* Front windows */}
      {[-0.28, 0.28].map((xOff, i) => (
        <group key={i} position={[xOff * s, 0.25 * s, d / 2 + 0.005]}>
          <mesh><boxGeometry args={[0.14 * s, 0.12 * s, 0.01]} /><meshPhysicalMaterial color="#88c8e8" roughness={0.05} metalness={0.1} transmission={0.3} ior={1.5} clearcoat={1} clearcoatRoughness={0.05} reflectivity={0.9} /></mesh>
          {/* Window frame */}
          <mesh position={[0, 0, 0.002]}><boxGeometry args={[0.15 * s, 0.005 * s, 0.005]} /><meshStandardMaterial color={pal.trim} roughness={0.7} /></mesh>
          <mesh position={[0, 0, 0.002]}><boxGeometry args={[0.005 * s, 0.13 * s, 0.005]} /><meshStandardMaterial color={pal.trim} roughness={0.7} /></mesh>
          {/* Shutters */}
          <mesh position={[-0.09 * s, 0, 0]}><boxGeometry args={[0.025 * s, 0.13 * s, 0.008]} /><meshStandardMaterial color={roof} roughness={0.8} /></mesh>
          <mesh position={[0.09 * s, 0, 0]}><boxGeometry args={[0.025 * s, 0.13 * s, 0.008]} /><meshStandardMaterial color={roof} roughness={0.8} /></mesh>
        </group>
      ))}
      {/* Porch overhang */}
      <mesh castShadow position={[0, h - 0.02 * s, d / 2 + 0.12 * s]}>
        <boxGeometry args={[0.5 * s, 0.015 * s, 0.22 * s]} />
        <meshStandardMaterial color={pal.trim} roughness={0.7} />
      </mesh>
      {/* Porch posts */}
      {[-0.2, 0.2].map((x, i) => (
        <mesh key={i} position={[x * s, h / 2 - 0.05 * s, d / 2 + 0.2 * s]}>
          <cylinderGeometry args={[0.01 * s, 0.01 * s, h - 0.08 * s, 6]} />
          <meshStandardMaterial color={pal.trim} roughness={0.6} />
        </mesh>
      ))}
      {/* Porch step */}
      <mesh position={[0, 0.025 * s, d / 2 + 0.15 * s]}>
        <boxGeometry args={[0.3 * s, 0.05 * s, 0.1 * s]} />
        <meshStandardMaterial color="#888580" roughness={0.85} />
      </mesh>
    </group>
  );
}

/* ── Colonial — two story, symmetrical ── */
function ColonialHouse({ s, pal, roof, door }: { s: number; pal: { walls: string; trim: string }; roof: string; door: string }) {
  const w = 0.75 * s, h = 0.7 * s, d = 0.55 * s;
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={pal.walls} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.03 * s, 0]}>
        <boxGeometry args={[w + 0.02 * s, 0.06 * s, d + 0.02 * s]} />
        <meshStandardMaterial color="#777770" roughness={0.9} />
      </mesh>
      {/* Peaked roof */}
      <mesh castShadow position={[0, h + 0.15 * s, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[w * 0.85, 0.32 * s, 4]} />
        <meshStandardMaterial color={roof} roughness={0.8} />
      </mesh>
      {/* Door with frame */}
      <mesh position={[0, 0.17 * s, d / 2 + 0.005]}>
        <boxGeometry args={[0.1 * s, 0.28 * s, 0.01]} />
        <meshStandardMaterial color={door} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.32 * s, d / 2 + 0.006]}>
        <boxGeometry args={[0.14 * s, 0.02 * s, 0.005]} />
        <meshStandardMaterial color={pal.trim} roughness={0.6} />
      </mesh>
      {/* First floor windows */}
      {[-0.22, 0.22].map((x, i) => (
        <group key={`f1-${i}`} position={[x * s, 0.22 * s, d / 2 + 0.005]}>
          <mesh><boxGeometry args={[0.1 * s, 0.12 * s, 0.01]} /><meshPhysicalMaterial color="#88c8e8" roughness={0.05} metalness={0.1} transmission={0.3} ior={1.5} clearcoat={1} clearcoatRoughness={0.05} reflectivity={0.9} /></mesh>
          <mesh position={[0, 0, 0.002]}><boxGeometry args={[0.005, 0.13 * s, 0.005]} /><meshStandardMaterial color={pal.trim} roughness={0.7} /></mesh>
          <mesh position={[-0.065 * s, 0, 0]}><boxGeometry args={[0.02 * s, 0.13 * s, 0.008]} /><meshStandardMaterial color={roof} roughness={0.8} /></mesh>
          <mesh position={[0.065 * s, 0, 0]}><boxGeometry args={[0.02 * s, 0.13 * s, 0.008]} /><meshStandardMaterial color={roof} roughness={0.8} /></mesh>
        </group>
      ))}
      {/* Second floor windows */}
      {[-0.22, 0, 0.22].map((x, i) => (
        <group key={`f2-${i}`} position={[x * s, 0.48 * s, d / 2 + 0.005]}>
          <mesh><boxGeometry args={[0.08 * s, 0.1 * s, 0.01]} /><meshPhysicalMaterial color="#88c8e8" roughness={0.05} metalness={0.1} transmission={0.3} ior={1.5} clearcoat={1} clearcoatRoughness={0.05} reflectivity={0.9} /></mesh>
          <mesh position={[0, 0, 0.002]}><boxGeometry args={[0.005, 0.11 * s, 0.005]} /><meshStandardMaterial color={pal.trim} roughness={0.7} /></mesh>
        </group>
      ))}
      {/* Chimney */}
      <mesh castShadow position={[w * 0.3, h + 0.3 * s, 0]}>
        <boxGeometry args={[0.07 * s, 0.35 * s, 0.07 * s]} />
        <meshStandardMaterial color="#7a4030" roughness={0.9} />
      </mesh>
      {/* Step */}
      <mesh position={[0, 0.03 * s, d / 2 + 0.1 * s]}>
        <boxGeometry args={[0.2 * s, 0.06 * s, 0.08 * s]} />
        <meshStandardMaterial color="#888580" roughness={0.85} />
      </mesh>
    </group>
  );
}

/* ── Bungalow — low, wide porch ── */
function BungalowHouse({ s, pal, roof, door }: { s: number; pal: { walls: string; trim: string }; roof: string; door: string }) {
  const w = 0.85 * s, h = 0.4 * s, d = 0.55 * s;
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={pal.walls} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.025 * s, 0]}>
        <boxGeometry args={[w + 0.02 * s, 0.05 * s, d + 0.02 * s]} />
        <meshStandardMaterial color="#777770" roughness={0.9} />
      </mesh>
      {/* Wide low roof */}
      <mesh castShadow position={[0, h + 0.1 * s, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[w * 0.9, 0.22 * s, 4]} />
        <meshStandardMaterial color={roof} roughness={0.8} />
      </mesh>
      {/* Full-width porch */}
      <mesh castShadow position={[0, h - 0.02 * s, d / 2 + 0.18 * s]}>
        <boxGeometry args={[w + 0.1 * s, 0.012 * s, 0.35 * s]} />
        <meshStandardMaterial color={pal.trim} roughness={0.7} />
      </mesh>
      {/* Porch floor */}
      <mesh position={[0, 0.01 * s, d / 2 + 0.15 * s]}>
        <boxGeometry args={[w + 0.05 * s, 0.02 * s, 0.28 * s]} />
        <meshStandardMaterial color="#9a9080" roughness={0.85} />
      </mesh>
      {/* Porch columns */}
      {[-0.35, -0.12, 0.12, 0.35].map((x, i) => (
        <mesh key={i} position={[x * s, h / 2 - 0.03 * s, d / 2 + 0.28 * s]}>
          <boxGeometry args={[0.025 * s, h - 0.04 * s, 0.025 * s]} />
          <meshStandardMaterial color={pal.trim} roughness={0.6} />
        </mesh>
      ))}
      {/* Door */}
      <mesh position={[0, 0.15 * s, d / 2 + 0.005]}>
        <boxGeometry args={[0.1 * s, 0.25 * s, 0.01]} />
        <meshStandardMaterial color={door} roughness={0.7} />
      </mesh>
      {/* Windows */}
      {[-0.25, 0.25].map((x, i) => (
        <group key={i} position={[x * s, 0.22 * s, d / 2 + 0.005]}>
          <mesh><boxGeometry args={[0.12 * s, 0.1 * s, 0.01]} /><meshPhysicalMaterial color="#88c8e8" roughness={0.05} metalness={0.1} transmission={0.3} ior={1.5} clearcoat={1} clearcoatRoughness={0.05} reflectivity={0.9} /></mesh>
          <mesh position={[0, 0, 0.002]}><boxGeometry args={[0.005, 0.11 * s, 0.005]} /><meshStandardMaterial color={pal.trim} roughness={0.7} /></mesh>
          <mesh position={[0, 0, 0.002]}><boxGeometry args={[0.13 * s, 0.005, 0.005]} /><meshStandardMaterial color={pal.trim} roughness={0.7} /></mesh>
        </group>
      ))}
      {/* Porch railing */}
      <mesh position={[0, 0.15 * s, d / 2 + 0.3 * s]}>
        <boxGeometry args={[w + 0.05 * s, 0.008 * s, 0.01 * s]} />
        <meshStandardMaterial color={pal.trim} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ── Cape Cod — steep roof, dormers ── */
function CapeHouse({ s, pal, roof, door }: { s: number; pal: { walls: string; trim: string }; roof: string; door: string }) {
  const w = 0.75 * s, h = 0.42 * s, d = 0.55 * s;
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={pal.walls} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.03 * s, 0]}>
        <boxGeometry args={[w + 0.02 * s, 0.06 * s, d + 0.02 * s]} />
        <meshStandardMaterial color="#777770" roughness={0.9} />
      </mesh>
      {/* Steep roof */}
      <mesh castShadow position={[0, h + 0.2 * s, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[w * 0.82, 0.42 * s, 4]} />
        <meshStandardMaterial color={roof} roughness={0.75} />
      </mesh>
      {/* Dormers */}
      {[-0.15, 0.15].map((x, i) => (
        <group key={i} position={[x * s, h + 0.15 * s, d / 2 * 0.5]}>
          <mesh castShadow><boxGeometry args={[0.1 * s, 0.1 * s, 0.08 * s]} /><meshStandardMaterial color={pal.walls} roughness={0.85} /></mesh>
          <mesh castShadow position={[0, 0.06 * s, 0]}><coneGeometry args={[0.065 * s, 0.05 * s, 4]} /><meshStandardMaterial color={roof} roughness={0.8} /></mesh>
          <mesh position={[0, -0.01 * s, 0.041 * s]}><boxGeometry args={[0.04 * s, 0.05 * s, 0.005]} /><meshPhysicalMaterial color="#88c8e8" roughness={0.05} metalness={0.1} transmission={0.3} ior={1.5} clearcoat={1} clearcoatRoughness={0.05} reflectivity={0.9} /></mesh>
        </group>
      ))}
      {/* Door */}
      <mesh position={[0, 0.16 * s, d / 2 + 0.005]}>
        <boxGeometry args={[0.09 * s, 0.26 * s, 0.01]} />
        <meshStandardMaterial color={door} roughness={0.7} />
      </mesh>
      {/* Windows with shutters */}
      {[-0.22, 0.22].map((x, i) => (
        <group key={i} position={[x * s, 0.22 * s, d / 2 + 0.005]}>
          <mesh><boxGeometry args={[0.1 * s, 0.12 * s, 0.01]} /><meshPhysicalMaterial color="#88c8e8" roughness={0.05} metalness={0.1} transmission={0.3} ior={1.5} clearcoat={1} clearcoatRoughness={0.05} reflectivity={0.9} /></mesh>
          <mesh position={[0, 0, 0.002]}><boxGeometry args={[0.005, 0.13 * s, 0.005]} /><meshStandardMaterial color={pal.trim} roughness={0.7} /></mesh>
          <mesh position={[-0.065 * s, 0, 0]}><boxGeometry args={[0.02 * s, 0.13 * s, 0.008]} /><meshStandardMaterial color={roof} roughness={0.8} /></mesh>
          <mesh position={[0.065 * s, 0, 0]}><boxGeometry args={[0.02 * s, 0.13 * s, 0.008]} /><meshStandardMaterial color={roof} roughness={0.8} /></mesh>
        </group>
      ))}
      {/* Step */}
      <mesh position={[0, 0.03 * s, d / 2 + 0.08 * s]}>
        <boxGeometry args={[0.18 * s, 0.06 * s, 0.06 * s]} />
        <meshStandardMaterial color="#888580" roughness={0.85} />
      </mesh>
      {/* Chimney */}
      <mesh castShadow position={[-w * 0.28, h + 0.38 * s, 0]}>
        <boxGeometry args={[0.06 * s, 0.35 * s, 0.06 * s]} />
        <meshStandardMaterial color="#7a4030" roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ── Realistic trees — deciduous with sphere canopy + evergreen ── */
function DeciduousTree({ position, height = 0.8, color }: { position: [number, number, number]; height?: number; color: string }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, height * 0.35, 0]}>
        <cylinderGeometry args={[0.02, 0.04, height * 0.55, 6]} />
        <meshStandardMaterial color="#5a3a1a" roughness={0.95} />
      </mesh>
      {/* Main canopy — sphere cluster */}
      <mesh castShadow position={[0, height * 0.7, 0]}>
        <sphereGeometry args={[height * 0.38, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh castShadow position={[height * 0.12, height * 0.78, height * 0.08]}>
        <sphereGeometry args={[height * 0.25, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh castShadow position={[-height * 0.1, height * 0.65, -height * 0.1]}>
        <sphereGeometry args={[height * 0.22, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  );
}

function EvergreenTree({ position, height = 0.9, color }: { position: [number, number, number]; height?: number; color: string }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, height * 0.25, 0]}>
        <cylinderGeometry args={[0.015, 0.03, height * 0.4, 5]} />
        <meshStandardMaterial color="#4a2a10" roughness={0.95} />
      </mesh>
      <mesh castShadow position={[0, height * 0.48, 0]}>
        <coneGeometry args={[height * 0.3, height * 0.35, 8]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, height * 0.65, 0]}>
        <coneGeometry args={[height * 0.24, height * 0.3, 8]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, height * 0.82, 0]}>
        <coneGeometry args={[height * 0.15, height * 0.22, 8]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Bush({ position, color, size = 0.12 }: { position: [number, number, number]; color: string; size?: number }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, size * 0.5, 0]}>
        <sphereGeometry args={[size, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      <mesh castShadow position={[size * 0.6, size * 0.4, 0]}>
        <sphereGeometry args={[size * 0.7, 6, 5]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
    </group>
  );
}

/* ── Street infrastructure ── */
function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.012, 0.018, 1.0, 6]} />
        <meshStandardMaterial color="#444" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Arm */}
      <mesh castShadow position={[0.06, 0.95, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.006, 0.008, 0.15, 4]} />
        <meshStandardMaterial color="#444" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Lamp housing */}
      <mesh position={[0.1, 0.98, 0]}>
        <boxGeometry args={[0.05, 0.025, 0.03]} />
        <meshStandardMaterial color="#333" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Glow */}
      <mesh position={[0.1, 0.96, 0]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshBasicMaterial color="#ffe8b0" transparent opacity={0.6} />
      </mesh>
      <pointLight position={[0.1, 0.96, 0]} intensity={0.25} color="#ffe4a0" distance={2.5} />
    </group>
  );
}

function FireHydrant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.12, 8]} />
        <meshStandardMaterial color="#cc3333" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <sphereGeometry args={[0.025, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#cc3333" roughness={0.7} />
      </mesh>
      {/* Nozzles */}
      <mesh position={[0.03, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.02, 6]} />
        <meshStandardMaterial color="#cc3333" roughness={0.7} />
      </mesh>
    </group>
  );
}

function StopSign({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.01, 0.012, 0.9, 4]} />
        <meshStandardMaterial color="#777" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.005, 8]} />
        <meshStandardMaterial color="#cc2222" roughness={0.6} />
      </mesh>
    </group>
  );
}

function ParkBench({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat */}
      <mesh castShadow position={[0, 0.08, 0]}>
        <boxGeometry args={[0.3, 0.012, 0.08]} />
        <meshStandardMaterial color="#6a4020" roughness={0.9} />
      </mesh>
      {/* Back */}
      <mesh castShadow position={[0, 0.14, -0.035]}>
        <boxGeometry args={[0.3, 0.08, 0.008]} />
        <meshStandardMaterial color="#6a4020" roughness={0.9} />
      </mesh>
      {/* Legs */}
      {[-0.12, 0.12].map((x, i) => (
        <mesh key={i} position={[x, 0.04, 0]}>
          <boxGeometry args={[0.01, 0.08, 0.07]} />
          <meshStandardMaterial color="#444" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function Fence({ start, end, color = "#8a7a60" }: { start: [number, number, number]; end: [number, number, number]; color?: string }) {
  const dx = end[0] - start[0], dz = end[2] - start[2];
  const len = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);
  const mx = (start[0] + end[0]) / 2, mz = (start[2] + end[2]) / 2;
  const posts = Math.max(2, Math.floor(len / 0.2));
  return (
    <group>
      {/* Rails */}
      <mesh position={[mx, start[1] + 0.08, mz]} rotation={[0, angle, 0]}>
        <boxGeometry args={[0.008, 0.008, len]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[mx, start[1] + 0.14, mz]} rotation={[0, angle, 0]}>
        <boxGeometry args={[0.008, 0.008, len]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* Posts */}
      {Array.from({ length: posts }, (_, i) => {
        const t = i / (posts - 1);
        return (
          <mesh key={i} position={[start[0] + dx * t, start[1] + 0.09, start[2] + dz * t]}>
            <boxGeometry args={[0.012, 0.18, 0.012]} />
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ── Energy beams from engine to community ── */
function PowerBeams() {
  const beamsRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!beamsRef.current) return;
    const t = state.clock.elapsedTime;
    beamsRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        (child.material as THREE.MeshBasicMaterial).opacity =
          0.06 + Math.sin(t * 1.5 + i * 0.8) * 0.03;
      }
    });
  });

  const beamAngles = Array.from({ length: 24 }, (_, i) => (i / 24) * Math.PI * 2);
  return (
    <group ref={beamsRef} position={[0, -0.3, 0]}>
      {beamAngles.map((angle, i) => {
        const innerR = RING_RADIUS + 1;
        const outerR = RING_RADIUS + 5 + (i % 3) * 2;
        const midR = (innerR + outerR) / 2;
        const x = Math.cos(angle) * midR;
        const z = Math.sin(angle) * midR;
        const len = outerR - innerR;
        return (
          <mesh key={i} position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, Math.PI / 2]}>
            <cylinderGeometry args={[0.005, 0.03, len, 4]} />
            <meshBasicMaterial color={TEAL} transparent opacity={0.06} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ── Sky dome — gradient from horizon to zenith ── */
function SkyDome() {
  const skyRef = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    if (!skyRef.current) return;
    const geo = skyRef.current.geometry;
    const posAttr = geo.getAttribute("position");
    const colors = new Float32Array(posAttr.count * 3);
    // Zenith: deep blue, Horizon: warm golden
    const zenith = new THREE.Color("#1a3050");
    const horizon = new THREE.Color("#c8a070");
    const mid = new THREE.Color("#4a7090");
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      const normalizedY = (y / 35 + 1) / 2; // 0 at bottom, 1 at top
      const c = new THREE.Color();
      if (normalizedY < 0.5) {
        c.lerpColors(horizon, mid, normalizedY * 2);
      } else {
        c.lerpColors(mid, zenith, (normalizedY - 0.5) * 2);
      }
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  }, []);

  return (
    <mesh ref={skyRef}>
      <sphereGeometry args={[35, 48, 24]} />
      <meshBasicMaterial vertexColors side={THREE.BackSide} />
    </mesh>
  );
}

/* ── Main neighborhood assembly ── */
function Neighborhood() {
  const STYLES: HouseStyle[] = ["ranch", "colonial", "bungalow", "cape"];
  const pick = (i: number, len: number) => i % len;

  const houses = useMemo(() => {
    const h: { pos: [number, number, number]; rot: number; scale: number; style: HouseStyle; wI: number; rI: number; dI: number }[] = [];

    // Inner ring (inside torus, r ≈ 3.5-6)
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2 + 0.15;
      const r = 4.2 + (i % 3) * 0.7;
      h.push({ pos: [Math.cos(angle) * r, -1.5, Math.sin(angle) * r], rot: -angle + Math.PI,
        scale: 0.65 + (i % 3) * 0.1, style: STYLES[pick(i, 4)], wI: i, rI: i + 2, dI: i + 1 });
    }
    // Outer ring (r ≈ 10-12)
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const r = 10.5 + (i % 4) * 0.5;
      h.push({ pos: [Math.cos(angle) * r, -1.5, Math.sin(angle) * r], rot: -angle,
        scale: 0.75 + (i % 3) * 0.08, style: STYLES[pick(i + 1, 4)], wI: i + 3, rI: i + 1, dI: i + 4 });
    }
    // Far ring (r ≈ 13.5-16.5)
    for (let i = 0; i < 22; i++) {
      const angle = (i / 22) * Math.PI * 2 + 0.08;
      const r = 14 + (i % 5) * 0.6;
      h.push({ pos: [Math.cos(angle) * r, -1.5, Math.sin(angle) * r], rot: -angle + 0.2,
        scale: 0.6 + (i % 4) * 0.1, style: STYLES[pick(i + 2, 4)], wI: i + 5, rI: i + 3, dI: i + 2 });
    }
    return h;
  }, []);

  const trees = useMemo(() => {
    const t: { pos: [number, number, number]; h: number; color: string; evergreen: boolean }[] = [];
    for (let i = 0; i < 80; i++) {
      const angle = (i / 80) * Math.PI * 2 + (i * 0.37);
      const r = 3 + Math.abs(Math.sin(i * 1.7)) * 14;
      if (r > RING_RADIUS - 1.5 && r < RING_RADIUS + 1.5) continue;
      t.push({ pos: [Math.cos(angle) * r, -1.5, Math.sin(angle) * r],
        h: 0.5 + (i % 5) * 0.15, color: TREE_SHADES[i % TREE_SHADES.length], evergreen: i % 4 === 0 });
    }
    return t;
  }, []);

  const bushes = useMemo(() => {
    const b: { pos: [number, number, number]; color: string; size: number }[] = [];
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2 + (i * 0.6);
      const r = 4 + Math.abs(Math.sin(i * 2.3)) * 12;
      if (r > RING_RADIUS - 1.2 && r < RING_RADIUS + 1.2) continue;
      b.push({ pos: [Math.cos(angle) * r, -1.5, Math.sin(angle) * r],
        color: TREE_SHADES[(i + 3) % TREE_SHADES.length], size: 0.06 + (i % 3) * 0.04 });
    }
    return b;
  }, []);

  return (
    <group>
      <SkyDome />

      {/* Ground — layered for realism */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.52, 0]}>
        <circleGeometry args={[25, 64]} />
        <meshPhysicalMaterial color="#3a7530" roughness={0.98} clearcoat={0.02} clearcoatRoughness={0.9} sheen={0.3} sheenColor="#4a8a3a" />
      </mesh>
      {/* Lighter grass patches */}
      {[5, 12, -8, -14].map((x, i) => (
        <mesh key={i} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[x, -1.518, (i - 2) * 4]}>
          <circleGeometry args={[1.5 + i * 0.3, 16]} />
          <meshStandardMaterial color="#488a38" roughness={0.95} />
        </mesh>
      ))}

      {/* Park inside torus */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.515, 0]}>
        <circleGeometry args={[RING_RADIUS - 1.5, 32]} />
        <meshStandardMaterial color="#48903a" roughness={0.92} />
      </mesh>
      {/* Park pathway — circular */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.51, 0]}>
        <ringGeometry args={[3.2, 3.4, 32]} />
        <meshStandardMaterial color="#b8a890" roughness={0.88} />
      </mesh>

      {/* Main ring road */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.51, 0]}>
        <ringGeometry args={[9.3, 10.3, 64]} />
        <meshPhysicalMaterial color="#2a2a2a" roughness={0.7} metalness={0.05} clearcoat={0.15} clearcoatRoughness={0.6} />
      </mesh>
      {/* Curbs */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.505, 0]}>
        <ringGeometry args={[9.25, 9.32, 64]} />
        <meshStandardMaterial color="#999590" roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.505, 0]}>
        <ringGeometry args={[10.28, 10.35, 64]} />
        <meshStandardMaterial color="#999590" roughness={0.85} />
      </mesh>
      {/* Center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.504, 0]}>
        <ringGeometry args={[9.78, 9.82, 64]} />
        <meshStandardMaterial color="#d8c040" roughness={0.7} />
      </mesh>
      {/* Sidewalks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.508, 0]}>
        <ringGeometry args={[9.1, 9.25, 64]} />
        <meshStandardMaterial color="#c0b8a8" roughness={0.88} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.508, 0]}>
        <ringGeometry args={[10.35, 10.5, 64]} />
        <meshStandardMaterial color="#c0b8a8" roughness={0.88} />
      </mesh>

      {/* Outer ring road */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.51, 0]}>
        <ringGeometry args={[13.3, 14.0, 64]} />
        <meshPhysicalMaterial color="#2a2a2a" roughness={0.7} metalness={0.05} clearcoat={0.15} clearcoatRoughness={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.504, 0]}>
        <ringGeometry args={[13.62, 13.68, 64]} />
        <meshStandardMaterial color="#d8c040" roughness={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.508, 0]}>
        <ringGeometry args={[13.15, 13.3, 64]} />
        <meshStandardMaterial color="#c0b8a8" roughness={0.88} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.508, 0]}>
        <ringGeometry args={[14.0, 14.15, 64]} />
        <meshStandardMaterial color="#c0b8a8" roughness={0.88} />
      </mesh>

      {/* Radial roads */}
      {[0, Math.PI / 3, Math.PI * 2 / 3, Math.PI, Math.PI * 4 / 3, Math.PI * 5 / 3].map((angle, i) => {
        const x1 = Math.cos(angle) * 9.3, z1 = Math.sin(angle) * 9.3;
        const x2 = Math.cos(angle) * 18, z2 = Math.sin(angle) * 18;
        const mx = (x1 + x2) / 2, mz = (z1 + z2) / 2;
        const len = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
        return (
          <mesh key={i} receiveShadow position={[mx, -1.51, mz]} rotation={[-Math.PI / 2, 0, -angle + Math.PI / 2]}>
            <boxGeometry args={[0.4, len, 0.01]} />
            <meshPhysicalMaterial color="#2a2a2a" roughness={0.7} metalness={0.05} clearcoat={0.15} clearcoatRoughness={0.6} />
          </mesh>
        );
      })}

      {/* Houses */}
      {houses.map((h, i) => (
        <RealisticHouse key={i} position={h.pos} style={h.style} wallIdx={h.wI} roofIdx={h.rI} doorIdx={h.dI} scale={h.scale} rotation={h.rot} />
      ))}

      {/* Trees */}
      {trees.map((t, i) => t.evergreen
        ? <EvergreenTree key={i} position={t.pos} height={t.h} color={t.color} />
        : <DeciduousTree key={i} position={t.pos} height={t.h} color={t.color} />
      )}

      {/* Bushes */}
      {bushes.map((b, i) => (
        <Bush key={i} position={b.pos} color={b.color} size={b.size} />
      ))}

      {/* Street lamps */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        return <StreetLamp key={i} position={[Math.cos(angle) * 11.5, -1.5, Math.sin(angle) * 11.5]} />;
      })}

      {/* Fire hydrants */}
      {[0.8, 2.4, 4.0, 5.6].map((a, i) => (
        <FireHydrant key={i} position={[Math.cos(a) * 10.45, -1.5, Math.sin(a) * 10.45]} />
      ))}

      {/* Stop signs at intersections */}
      {[0, Math.PI / 3, Math.PI * 2 / 3, Math.PI, Math.PI * 4 / 3, Math.PI * 5 / 3].map((a, i) => (
        <StopSign key={i} position={[Math.cos(a) * 9.6, -1.5, Math.sin(a) * 9.6]} rotation={a} />
      ))}

      {/* Park benches inside torus */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, i) => (
        <ParkBench key={i} position={[Math.cos(a) * 3.3, -1.5, Math.sin(a) * 3.3]} rotation={a} />
      ))}

      {/* Fences — select yards */}
      {houses.slice(10, 18).filter((_, i) => i % 3 === 0).map((h, i) => {
        const fenceR = 0.55 * h.scale;
        const sin = Math.sin(h.rot), cos = Math.cos(h.rot);
        const p = h.pos;
        return (
          <Fence key={i}
            start={[p[0] - cos * fenceR, p[1], p[2] + sin * fenceR]}
            end={[p[0] + cos * fenceR, p[1], p[2] - sin * fenceR]}
            color="#8a7a5a"
          />
        );
      })}

      {/* Power beams */}
      <PowerBeams />

      {/* Atmospheric edge fade */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.49, 0]}>
        <ringGeometry args={[20, 25, 64]} />
        <meshBasicMaterial color="#111d2a" transparent opacity={0.75} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function BasePlatform() {
  return <Neighborhood />;
}

/* ════════════════════════════════════════════
   SCENE ASSEMBLY
   ════════════════════════════════════════════ */

function Scene({ activeStep }: { activeStep: number | null }) {
  return (
    <>
      {/* ══ ENVIRONMENT — HDR image-based lighting ══ */}
      <Environment preset="sunset" background={false} environmentIntensity={0.4} />

      {/* ══ ATMOSPHERIC FOG ══ */}
      <fog attach="fog" args={["#1a2a3a", 18, 40]} />

      {/* ══ LIGHTING — golden hour with high-quality shadows ══ */}
      <ambientLight intensity={0.25} color="#8098b0" />

      {/* Primary sun — warm golden hour */}
      <directionalLight
        position={[18, 25, 12]}
        intensity={1.5}
        color="#ffe8c0"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={60}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      {/* Fill — cool sky bounce */}
      <directionalLight position={[-12, 18, -8]} intensity={0.2} color="#a0c0e0" />
      {/* Rim — warm backlight */}
      <directionalLight position={[-5, 8, -15]} intensity={0.15} color="#ffaa66" />

      <hemisphereLight color="#87CEEB" groundColor="#3a7530" intensity={0.3} />

      {/* Engine core glow */}
      <pointLight position={[0, 1.5, 0]} intensity={2.5} color={TEAL} distance={12} />
      {/* Station lights */}
      {STEPS.map((step, i) => {
        const [x, , z] = getStationPosition(i);
        return <pointLight key={i} position={[x, 3, z]} intensity={activeStep === i ? 2.5 : 0.15} color={step.color} distance={5} />;
      })}

      {/* ══ CONTACT SHADOWS — soft ground shadows ══ */}
      <ContactShadows
        position={[0, -1.52, 0]}
        opacity={0.35}
        scale={50}
        blur={2.5}
        far={12}
        color="#1a2a1a"
      />

      <CameraController activeStep={activeStep} />
      <OrbitControls enableZoom enablePan={false} minDistance={6} maxDistance={22} enableDamping dampingFactor={0.05} />

      <AcceleratorRing />
      <EnergyParticles />
      <SurplusParticles />
      <InnerTubeParticles />
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

      {/* ══ POST-PROCESSING PIPELINE ══ */}
      <EffectComposer multisampling={4}>
        {/* Bloom — engine glow bleeds realistically */}
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        {/* SSAO — ambient occlusion for depth in corners/crevices */}
        <SSAO
          blendFunction={BlendFunction.MULTIPLY}
          samples={21}
          radius={0.12}
          intensity={18}
        />
        {/* Chromatic aberration — subtle lens effect */}
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0004, 0.0004)}
        />
        {/* Vignette — dark edges like a real camera */}
        <Vignette
          offset={0.35}
          darkness={0.55}
          blendFunction={BlendFunction.NORMAL}
        />
        {/* Tone mapping — cinematic color grading */}
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
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
    <div className="h-screen w-screen bg-[#111d2a] flex">
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
        <Canvas
          shadows
          camera={{ position: [8, 8, 12], fov: 40 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color("#111d2a"));
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
        >
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
