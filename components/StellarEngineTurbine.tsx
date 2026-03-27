"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, Environment, Text, Html } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════
   THE STELLAR ENGINE — Architectural Cutaway Torus Diagram

   A full-color, architectural-drawing-style 3D visualization.
   Each of the 7 steps is a distinct colored torus segment with
   a cutaway revealing interior details and photorealistic
   holographic scenes projected above each station.

   Click/rotate navigation. Sidebar + detail overlay.
   ═══════════════════════════════════════════════════════════════ */

// ─── Brand Palette ───
const C = {
  teal:       "#1A7A5C",
  tealLight:  "#22936F",
  tealPale:   "#93B396",
  tealDark:   "#0d4a38",
  orange:     "#E07C3E",
  orangeWarm: "#E8944F",
  orangeDeep: "#C0602A",
  navy:       "#1B3A5C",
  navyLight:  "#2A5580",
  navyDark:   "#0d1e30",
  copper:     "#b87333",
  white:      "#f0ede8",
  cream:      "#f5f0e8",
  steel:      "#8a9aaa",
  bg:         "#f5f2ec",      // warm off-white background
  bgDark:     "#e8e4dc",
  line:       "#c0b8a8",      // architectural line color
  dimLine:    "#d8d0c4",
};

// ─── Step definitions ───
const STEPS = [
  {
    id: "recruit", num: "01", title: "RECRUIT", subtitle: "Intake Accelerator",
    color: C.teal, emissive: C.tealDark, holoColor: "#00d4aa",
    desc: "Zero-tuition enrollment from underserved communities. Court & probation partnerships. Walk-in orientations every other Tuesday at 11:30 AM.",
    details: ["Zero tuition", "Community outreach", "Court partnerships", "Walk-in orientations"],
    holoDesc: "People entering a portal — the gateway to opportunity",
  },
  {
    id: "train", num: "02", title: "TRAIN", subtitle: "Compression Chamber",
    color: C.tealLight, emissive: "#0a3a28", holoColor: "#00c896",
    desc: "Accelerated, industry-recognized certification programs: CNA/CBRF, Construction, Phlebotomy. High-density cohorts that compress months into weeks.",
    details: ["CNA/CBRF Healthcare", "Construction & Trades", "Phlebotomy", "Career workshops"],
    holoDesc: "Classroom scene — students learning together",
  },
  {
    id: "certify", num: "03", title: "CERTIFY", subtitle: "Ignition Core",
    color: C.orange, emissive: "#5a2a10", holoColor: "#ff9050",
    desc: "90% graduation rate. State-recognized credentials — not participation certificates. This is where potential becomes power.",
    details: ["State credentials", "90% graduation rate", "Employer-validated", "Industry-standard"],
    holoDesc: "Graduate holding certificate — achievement moment",
  },
  {
    id: "place", num: "04", title: "PLACE", subtitle: "Extraction Turbine",
    color: C.copper, emissive: "#3a2010", holoColor: "#e0a060",
    desc: "The staffing arm places certified graduates with employers. 85% placement rate. Every hire generates workforce revenue.",
    details: ["85% job placement", "Staffing arm revenue", "Employer network", "Career tracking"],
    holoDesc: "Handshake — employer meeting graduate",
  },
  {
    id: "surplus", num: "05", title: "SURPLUS", subtitle: "Thrust Output",
    color: C.orangeWarm, emissive: "#5a3018", holoColor: "#ffa040",
    desc: "Revenue exceeds operating costs. Not profit — thrust. The economic force that propels the system without grant dependency.",
    details: ["Revenue > costs", "Grant-independent", "System fuel", "Revenue floor"],
    holoDesc: "Rising graph — revenue exceeding operating line",
  },
  {
    id: "reinvest", num: "06", title: "REINVEST", subtitle: "Return Manifold",
    color: C.navyLight, emissive: "#0a1a30", holoColor: "#4090d0",
    desc: "Surplus cycles back. 30% supportive services, 20% non-WIOA access, 30% expansion, 20% reserves.",
    details: ["30% → Services", "20% → Access", "30% → Expansion", "20% → Reserves"],
    holoDesc: "Four channels splitting — resource allocation",
  },
  {
    id: "scale", num: "07", title: "SCALE", subtitle: "Amplification Ring",
    color: C.navy, emissive: "#081420", holoColor: "#3070b0",
    desc: "Cost per participant decreases. Surplus per cycle increases. More powerful at volume. Replication-ready. Proven in Milwaukee's 53206.",
    details: ["Lower unit cost", "Growing surplus", "Replication-ready", "Proven in 53206"],
    holoDesc: "Multiple torus rings — system replicating",
  },
];

const RING_RADIUS = 6;
const TUBE_RADIUS = 0.7;
const N = STEPS.length;

function stationAngle(i: number) { return (i / N) * Math.PI * 2 - Math.PI / 2; }
function stationPos(i: number): [number, number, number] {
  const a = stationAngle(i);
  return [Math.cos(a) * RING_RADIUS, 0, Math.sin(a) * RING_RADIUS];
}

/* ═══════════════════════════════════════
   TORUS SEGMENTS — colored, with cutaway
   Each segment is a partial torus arc.
   The "active" segment gets a cutaway.
   ═══════════════════════════════════════ */

function TorusSegments({ activeStep }: { activeStep: number | null }) {
  return (
    <group>
      {STEPS.map((step, i) => {
        const gapAngle = 0.04;
        const segArc = (Math.PI * 2) / N - gapAngle * 2;
        const startA = stationAngle(i) - segArc / 2;
        const isActive = activeStep === i;

        // If active, show cutaway (thetaLength < full arc)
        const cutawayArc = isActive ? segArc * 0.65 : segArc;

        return (
          <group key={step.id}>
            {/* Outer shell */}
            <mesh rotation={[0, -startA, 0]}>
              <torusGeometry args={[RING_RADIUS, TUBE_RADIUS, 24, 32, cutawayArc]} />
              <meshStandardMaterial
                color={step.color}
                emissive={step.emissive}
                emissiveIntensity={isActive ? 0.4 : 0.08}
                roughness={0.4}
                metalness={0.15}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Cutaway: inner channel visible when active */}
            {isActive && (
              <group rotation={[0, -startA, 0]}>
                {/* Inner tube */}
                <mesh>
                  <torusGeometry args={[RING_RADIUS, TUBE_RADIUS * 0.35, 16, 32, cutawayArc]} />
                  <meshStandardMaterial
                    color={C.navyDark}
                    emissive={step.holoColor}
                    emissiveIntensity={0.15}
                    roughness={0.5}
                    metalness={0.3}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Energy core */}
                <mesh>
                  <torusGeometry args={[RING_RADIUS, TUBE_RADIUS * 0.12, 8, 32, cutawayArc]} />
                  <meshBasicMaterial color={step.holoColor} transparent opacity={0.35} side={THREE.DoubleSide} />
                </mesh>

                {/* Cross-section disc at cut edge */}
                <CutDisc angle={startA + cutawayArc} color={step.color} holoColor={step.holoColor} />
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}

/* Cross-section disc showing internal layers */
function CutDisc({ angle, color, holoColor }: { angle: number; color: string; holoColor: string }) {
  const x = Math.cos(-angle) * RING_RADIUS;
  const z = Math.sin(-angle) * RING_RADIUS;
  return (
    <group position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
      {/* Outer wall ring */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[TUBE_RADIUS * 0.35, TUBE_RADIUS, 32]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.15} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner channel */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[TUBE_RADIUS * 0.12, TUBE_RADIUS * 0.35, 32]} />
        <meshStandardMaterial color={C.navyDark} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Glowing core */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[TUBE_RADIUS * 0.12, 24]} />
        <meshBasicMaterial color={holoColor} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════
   FLOW PARTICLES — Energy in the torus
   ═══════════════════════════════════════ */

function FlowParticles() {
  const count = 350;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      a: (i / count) * Math.PI * 2,
      speed: 0.1 + Math.random() * 0.06,
      tubeA: Math.random() * Math.PI * 2,
      tubeR: Math.random() * TUBE_RADIUS * 0.3,
      size: 0.012 + Math.random() * 0.018,
    })), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    particles.forEach((p, i) => {
      const a = p.a + t * p.speed;
      const cx = Math.cos(a) * RING_RADIUS;
      const cz = Math.sin(a) * RING_RADIUS;
      const ox = Math.cos(p.tubeA) * p.tubeR;
      const oy = Math.sin(p.tubeA) * p.tubeR;
      const nx = -Math.sin(a), nz = Math.cos(a);
      dummy.position.set(cx + nx * ox, oy, cz + nz * ox);
      dummy.scale.setScalar(p.size * (0.8 + Math.sin(t * 2 + p.a * 3) * 0.2));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={C.tealPale} transparent opacity={0.4} />
    </instancedMesh>
  );
}

/* ═══════════════════════════════════════
   FLOW ARROWS — directional indicators
   ═══════════════════════════════════════ */

function FlowArrows() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.children.forEach((c, i) => {
      ((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.2 + Math.sin(t * 1.5 + i * 0.5) * 0.1;
    });
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const x = Math.cos(a) * RING_RADIUS, z = Math.sin(a) * RING_RADIUS;
        return (
          <mesh key={i} position={[x, TUBE_RADIUS + 0.05, z]} rotation={[Math.PI / 2, 0, -(a + Math.PI / 2)]}>
            <coneGeometry args={[0.05, 0.12, 3]} />
            <meshBasicMaterial color={C.orange} transparent opacity={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ═══════════════════════════════════════
   HOLOGRAPHIC PROJECTIONS — Detailed
   scenes floating above each station
   ═══════════════════════════════════════ */

/* ── 01 RECRUIT: People entering a portal ── */
function HoloRecruit() {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (groupRef.current) groupRef.current.rotation.y = clock.elapsedTime * 0.15; });
  return (
    <group ref={groupRef}>
      {/* Portal arch */}
      <mesh position={[0, 0.25, 0]}>
        <torusGeometry args={[0.35, 0.04, 8, 24, Math.PI]} />
        <meshStandardMaterial color={C.teal} emissive={C.teal} emissiveIntensity={0.6} roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Portal glow */}
      <mesh position={[0, 0.25, 0]}>
        <circleGeometry args={[0.3, 16, 0, Math.PI]} />
        <meshBasicMaterial color="#00e8aa" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      {/* People figures — capsule shapes walking toward portal */}
      {[-0.5, -0.3, -0.15, 0.05].map((xOff, i) => {
        const z = i * 0.12 - 0.15;
        const h = 0.15 + (i * 0.02);
        const skinTones = ["#8d5524", "#c68642", "#e0ac69", "#6b3a1f"];
        const shirtColors = [C.teal, C.tealLight, C.orange, C.navyLight];
        return (
          <group key={i} position={[xOff, 0, z]}>
            {/* Head */}
            <mesh position={[0, h + 0.04, 0]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshStandardMaterial color={skinTones[i]} roughness={0.7} />
            </mesh>
            {/* Body */}
            <mesh position={[0, h / 2, 0]}>
              <capsuleGeometry args={[0.02, h * 0.5, 4, 8]} />
              <meshStandardMaterial color={shirtColors[i]} roughness={0.6} />
            </mesh>
            {/* Legs */}
            <mesh position={[0, 0.03, 0]}>
              <capsuleGeometry args={[0.012, 0.04, 4, 6]} />
              <meshStandardMaterial color="#2a3040" roughness={0.8} />
            </mesh>
          </group>
        );
      })}
      {/* Ground path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <boxGeometry args={[0.8, 0.15, 0.005]} />
        <meshStandardMaterial color="#888" roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ── 02 TRAIN: Classroom scene ── */
function HoloTrain() {
  return (
    <group>
      {/* Whiteboard */}
      <mesh position={[0, 0.35, -0.2]}>
        <boxGeometry args={[0.5, 0.3, 0.01]} />
        <meshStandardMaterial color="#e8e8e0" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.38, -0.19]}>
        <boxGeometry args={[0.4, 0.01, 0.005]} />
        <meshStandardMaterial color={C.tealLight} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.34, -0.19]}>
        <boxGeometry args={[0.35, 0.006, 0.005]} />
        <meshStandardMaterial color={C.tealLight} roughness={0.5} />
      </mesh>
      {/* Instructor */}
      <group position={[0.15, 0, -0.12]}>
        <mesh position={[0, 0.22, 0]}><sphereGeometry args={[0.028, 8, 8]} /><meshStandardMaterial color="#8d5524" roughness={0.7} /></mesh>
        <mesh position={[0, 0.1, 0]}><capsuleGeometry args={[0.022, 0.12, 4, 8]} /><meshStandardMaterial color={C.navy} roughness={0.6} /></mesh>
        <mesh position={[0, 0.02, 0]}><capsuleGeometry args={[0.014, 0.04, 4, 6]} /><meshStandardMaterial color="#2a2a30" roughness={0.8} /></mesh>
      </group>
      {/* Student desks — 2 rows of 3 */}
      {[[-0.18, 0.08], [0, 0.08], [0.18, 0.08], [-0.12, 0.2], [0.06, 0.2]].map(([x, z], i) => {
        const skinTones = ["#c68642", "#e0ac69", "#8d5524", "#6b3a1f", "#c68642"];
        const shirts = [C.tealLight, C.orange, C.navyLight, C.teal, C.copper];
        return (
          <group key={i} position={[x!, 0, z!]}>
            {/* Desk */}
            <mesh position={[0, 0.06, 0]}><boxGeometry args={[0.08, 0.005, 0.05]} /><meshStandardMaterial color="#8a7050" roughness={0.8} /></mesh>
            <mesh position={[0, 0.03, 0]}><boxGeometry args={[0.005, 0.06, 0.005]} /><meshStandardMaterial color="#666" roughness={0.8} /></mesh>
            {/* Student */}
            <mesh position={[0, 0.12, 0.02]}><sphereGeometry args={[0.02, 8, 8]} /><meshStandardMaterial color={skinTones[i]} roughness={0.7} /></mesh>
            <mesh position={[0, 0.08, 0.02]}><capsuleGeometry args={[0.015, 0.04, 4, 8]} /><meshStandardMaterial color={shirts[i]} roughness={0.6} /></mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ── 03 CERTIFY: Graduate with certificate ── */
function HoloCertify() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.2; });
  return (
    <group ref={ref}>
      {/* Stage */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.04, 32]} />
        <meshStandardMaterial color="#8a7050" roughness={0.7} />
      </mesh>
      {/* Graduate — center, holding certificate */}
      <group position={[0, 0.04, 0]}>
        {/* Cap */}
        <mesh position={[0, 0.26, 0]}>
          <boxGeometry args={[0.06, 0.005, 0.06]} />
          <meshStandardMaterial color="#1a1a2a" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.245, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.02, 8]} />
          <meshStandardMaterial color="#1a1a2a" roughness={0.5} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.22, 0]}>
          <sphereGeometry args={[0.03, 10, 10]} />
          <meshStandardMaterial color="#8d5524" roughness={0.7} />
        </mesh>
        {/* Gown */}
        <mesh position={[0, 0.1, 0]}>
          <capsuleGeometry args={[0.028, 0.14, 4, 8]} />
          <meshStandardMaterial color="#1a1a3a" roughness={0.5} />
        </mesh>
        {/* Certificate */}
        <mesh position={[0.06, 0.15, 0.02]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.08, 0.06, 0.002]} />
          <meshStandardMaterial color={C.cream} roughness={0.4} />
        </mesh>
        <mesh position={[0.06, 0.155, 0.022]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.03, 0.005, 0.002]} />
          <meshStandardMaterial color={C.orange} emissive={C.orange} emissiveIntensity={0.5} roughness={0.4} />
        </mesh>
      </group>
      {/* Audience silhouettes */}
      {[-0.2, -0.1, 0.1, 0.2].map((x, i) => (
        <group key={i} position={[x, 0.04, 0.25]}>
          <mesh position={[0, 0.08, 0]}><sphereGeometry args={[0.018, 6, 6]} /><meshStandardMaterial color="#555" roughness={0.8} /></mesh>
          <mesh position={[0, 0.04, 0]}><capsuleGeometry args={[0.012, 0.04, 4, 6]} /><meshStandardMaterial color="#444" roughness={0.8} /></mesh>
        </group>
      ))}
    </group>
  );
}

/* ── 04 PLACE: Handshake ── */
function HoloPlace() {
  return (
    <group>
      {/* Office desk */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.35, 0.008, 0.2]} />
        <meshStandardMaterial color="#6a5035" roughness={0.7} />
      </mesh>
      {/* Desk legs */}
      {[[-0.16, -0.08], [0.16, -0.08], [-0.16, 0.08], [0.16, 0.08]].map(([x, z], i) => (
        <mesh key={i} position={[x!, 0.04, z!]}>
          <boxGeometry args={[0.008, 0.08, 0.008]} />
          <meshStandardMaterial color="#555" roughness={0.8} />
        </mesh>
      ))}
      {/* Employer */}
      <group position={[-0.12, 0, -0.08]}>
        <mesh position={[0, 0.2, 0]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color="#c68642" roughness={0.7} /></mesh>
        <mesh position={[0, 0.1, 0]}><capsuleGeometry args={[0.02, 0.1, 4, 8]} /><meshStandardMaterial color={C.navy} roughness={0.5} /></mesh>
        <mesh position={[0, 0.02, 0]}><capsuleGeometry args={[0.013, 0.04, 4, 6]} /><meshStandardMaterial color="#2a2a30" roughness={0.8} /></mesh>
      </group>
      {/* Graduate */}
      <group position={[0.12, 0, -0.08]}>
        <mesh position={[0, 0.19, 0]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color="#8d5524" roughness={0.7} /></mesh>
        <mesh position={[0, 0.09, 0]}><capsuleGeometry args={[0.02, 0.1, 4, 8]} /><meshStandardMaterial color={C.teal} roughness={0.5} /></mesh>
        <mesh position={[0, 0.02, 0]}><capsuleGeometry args={[0.013, 0.04, 4, 6]} /><meshStandardMaterial color="#2a2a30" roughness={0.8} /></mesh>
      </group>
      {/* Handshake — two arms meeting */}
      <mesh position={[0, 0.14, -0.04]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.008, 0.06, 4, 6]} />
        <meshStandardMaterial color="#c68642" roughness={0.7} />
      </mesh>
      {/* Contract on desk */}
      <mesh position={[0, 0.088, 0.02]}>
        <boxGeometry args={[0.06, 0.002, 0.08]} />
        <meshStandardMaterial color={C.cream} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ── 05 SURPLUS: Rising revenue graph ── */
function HoloSurplus() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.2) * 0.15; });
  // Bar chart rising
  const bars = [0.06, 0.1, 0.12, 0.18, 0.22, 0.3, 0.38];
  const opLine = 0.15; // operating cost line
  return (
    <group ref={ref}>
      {/* Base axis */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.5, 0.01, 0.005]} />
        <meshStandardMaterial color="#666" roughness={0.8} />
      </mesh>
      <mesh position={[-0.24, 0.2, 0]}>
        <boxGeometry args={[0.005, 0.4, 0.01]} />
        <meshStandardMaterial color="#666" roughness={0.8} />
      </mesh>
      {/* Revenue bars */}
      {bars.map((h, i) => {
        const x = -0.18 + i * 0.065;
        const above = h > opLine;
        return (
          <mesh key={i} position={[x, h / 2, 0]}>
            <boxGeometry args={[0.04, h, 0.04]} />
            <meshStandardMaterial
              color={above ? C.orange : C.tealLight}
              emissive={above ? C.orange : C.tealLight}
              emissiveIntensity={above ? 0.3 : 0.1}
              roughness={0.4}
            />
          </mesh>
        );
      })}
      {/* Operating cost line */}
      <mesh position={[0, opLine, 0.02]}>
        <boxGeometry args={[0.5, 0.003, 0.002]} />
        <meshBasicMaterial color="#ff4444" transparent opacity={0.6} />
      </mesh>
      {/* Label */}
      <Text position={[0.2, opLine + 0.02, 0.02]} fontSize={0.02} color="#ff6666" anchorX="left">
        Operating Cost
      </Text>
      <Text position={[0.2, 0.35, 0.02]} fontSize={0.02} color={C.orange} anchorX="left">
        Revenue
      </Text>
    </group>
  );
}

/* ── 06 REINVEST: Four channels splitting ── */
function HoloReinvest() {
  const channels = [
    { label: "Services", pct: "30%", color: C.teal, angle: -0.5, h: 0.3 },
    { label: "Access", pct: "20%", color: C.tealLight, angle: -0.17, h: 0.25 },
    { label: "Expansion", pct: "30%", color: C.orange, angle: 0.17, h: 0.35 },
    { label: "Reserves", pct: "20%", color: C.navy, angle: 0.5, h: 0.2 },
  ];
  return (
    <group>
      {/* Central input pipe */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.15, 8]} />
        <meshStandardMaterial color={C.orangeWarm} emissive={C.orangeWarm} emissiveIntensity={0.3} roughness={0.4} />
      </mesh>
      {/* Splitter node */}
      <mesh position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color={C.orangeWarm} emissive={C.orangeWarm} emissiveIntensity={0.4} roughness={0.3} metalness={0.3} />
      </mesh>
      {/* Channel pipes + buckets */}
      {channels.map((ch, i) => (
        <group key={i}>
          {/* Pipe from splitter to bucket */}
          <mesh position={[ch.angle * 0.5, 0.04 + ch.h / 2, 0]} rotation={[0, 0, -ch.angle * 0.5]}>
            <cylinderGeometry args={[0.012, 0.015, ch.h, 6]} />
            <meshStandardMaterial color={ch.color} emissive={ch.color} emissiveIntensity={0.2} roughness={0.5} />
          </mesh>
          {/* Bucket */}
          <mesh position={[ch.angle, 0.04 + ch.h, 0]}>
            <cylinderGeometry args={[0.04, 0.03, 0.06, 8]} />
            <meshStandardMaterial color={ch.color} emissive={ch.color} emissiveIntensity={0.2} roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Label */}
          <Text position={[ch.angle, 0.04 + ch.h + 0.06, 0]} fontSize={0.018} color={ch.color} anchorX="center">
            {ch.pct}
          </Text>
          <Text position={[ch.angle, 0.04 + ch.h + 0.04, 0]} fontSize={0.013} color="#888" anchorX="center">
            {ch.label}
          </Text>
        </group>
      ))}
    </group>
  );
}

/* ── 07 SCALE: Multiple torus rings replicating ── */
function HoloScale() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.2; });
  return (
    <group ref={ref}>
      {/* Primary ring */}
      <mesh>
        <torusGeometry args={[0.2, 0.03, 12, 32]} />
        <meshStandardMaterial color={C.teal} emissive={C.teal} emissiveIntensity={0.5} roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Replicated rings — growing outward */}
      {[0.32, 0.42, 0.5].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i + 1) * 0.3]}>
          <torusGeometry args={[r, 0.015 - i * 0.003, 8, 24]} />
          <meshStandardMaterial
            color={i === 0 ? C.tealLight : i === 1 ? C.orange : C.navy}
            emissive={i === 0 ? C.tealLight : i === 1 ? C.orange : C.navy}
            emissiveIntensity={0.3 - i * 0.08}
            roughness={0.4}
            transparent
            opacity={0.7 - i * 0.15}
          />
        </mesh>
      ))}
      {/* Connection lines between rings */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 0.26, 0, Math.sin(a) * 0.26]} rotation={[0, 0, a]}>
          <boxGeometry args={[0.003, 0.12, 0.003]} />
          <meshBasicMaterial color={C.tealPale} transparent opacity={0.25} />
        </mesh>
      ))}
      {/* Center glow */}
      <mesh>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color={C.tealPale} transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

const HOLO_COMPONENTS = [HoloRecruit, HoloTrain, HoloCertify, HoloPlace, HoloSurplus, HoloReinvest, HoloScale];

/* ═══════════════════════════════════════
   HOLOGRAM CONTAINER — Pedestal + projection
   ═══════════════════════════════════════ */

function HologramContainer({ index, active, children }: { index: number; active: boolean; children: React.ReactNode }) {
  const [x, , z] = stationPos(index);
  const step = STEPS[index];
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (!groupRef.current) return;
    const targetY = active ? 2.2 : 1.6;
    const targetScale = active ? 1.6 : 0.8;
    const targetOpacity = active ? 1 : 0.3;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.04;
    groupRef.current.scale.x += (targetScale - groupRef.current.scale.x) * 0.04;
    groupRef.current.scale.y = groupRef.current.scale.x;
    groupRef.current.scale.z = groupRef.current.scale.x;
    // Update pedestal opacity
    groupRef.current.children.forEach(c => {
      if (c instanceof THREE.Mesh && c.material instanceof THREE.MeshBasicMaterial) {
        c.material.opacity += (targetOpacity * 0.06 - c.material.opacity) * 0.05;
      }
    });
  });

  return (
    <group position={[x, 1.6, z]}>
      <group ref={groupRef}>
        {/* Pedestal glow disc */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <circleGeometry args={[0.45, 24]} />
          <meshBasicMaterial color={step.holoColor} transparent opacity={0.04} side={THREE.DoubleSide} />
        </mesh>
        {/* Vertical projection beam */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.005, 0.08, 1, 6]} />
          <meshBasicMaterial color={step.holoColor} transparent opacity={active ? 0.1 : 0.03} />
        </mesh>
        {/* The holographic scene */}
        {children}
        {/* Light for the holo */}
        {active && <pointLight intensity={1} color={step.holoColor} distance={3} />}
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════
   STATION LABELS — Step number + title
   ═══════════════════════════════════════ */

function StationLabels({ activeStep }: { activeStep: number | null }) {
  return (
    <group>
      {STEPS.map((step, i) => {
        const [x, , z] = stationPos(i);
        const isActive = activeStep === i;
        return (
          <group key={i} position={[x, -TUBE_RADIUS - 0.3, z]}>
            <Text
              position={[0, 0, 0]}
              fontSize={isActive ? 0.16 : 0.11}
              color={isActive ? step.color : C.steel}
              anchorX="center"
              anchorY="middle"
              font="/fonts/inter-var.woff2"
            >
              {step.num}
            </Text>
            <Text
              position={[0, -0.15, 0]}
              fontSize={isActive ? 0.08 : 0.06}
              color={isActive ? C.white : "#aaa"}
              anchorX="center"
              anchorY="middle"
              font="/fonts/inter-var.woff2"
            >
              {step.title}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

/* ═══════════════════════════════════════
   CENTRAL CORE — Glowing dodecahedron
   ═══════════════════════════════════════ */

function CentralCore() {
  const coreRef = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (coreRef.current) coreRef.current.rotation.y = clock.elapsedTime * 0.08; });
  return (
    <group>
      <group ref={coreRef}>
        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.15}>
          <mesh>
            <dodecahedronGeometry args={[0.7, 0]} />
            <meshStandardMaterial color={C.teal} emissive={C.teal} emissiveIntensity={1.5} wireframe transparent opacity={0.5} />
          </mesh>
          <mesh>
            <dodecahedronGeometry args={[0.4, 0]} />
            <meshBasicMaterial color={C.teal} transparent opacity={0.1} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshBasicMaterial color={C.white} transparent opacity={0.08} />
          </mesh>
        </Float>
      </group>
      <mesh>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color={C.teal} transparent opacity={0.04} />
      </mesh>
      <pointLight intensity={3} color={C.teal} distance={8} />
    </group>
  );
}

/* ═══════════════════════════════════════
   ARCHITECTURAL BACKGROUND
   Blueprint-style drawing grid + brand
   ═══════════════════════════════════════ */

function ArchitecturalBackground() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.003; });
  return (
    <group ref={ref}>
      {/* Sky — warm gradient */}
      <ArchSky />
      {/* Ground plane — light, architectural */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
        <circleGeometry args={[25, 64]} />
        <meshStandardMaterial color={C.bgDark} roughness={0.95} />
      </mesh>
      {/* Architectural grid on ground */}
      {Array.from({ length: 20 }, (_, i) => {
        const r = (i + 1) * 1.5;
        return (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.49, 0]}>
            <ringGeometry args={[r - 0.008, r + 0.008, 80]} />
            <meshBasicMaterial color={C.line} transparent opacity={0.06 - i * 0.002} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      {/* Radial lines — architectural drawing guides */}
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 12, -2.49, Math.sin(a) * 12]} rotation={[-Math.PI / 2, 0, -a + Math.PI / 2]}>
            <boxGeometry args={[0.005, 24, 0.003]} />
            <meshBasicMaterial color={C.line} transparent opacity={0.03} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      {/* Floating accent shapes — very subtle */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r = 12 + (i % 3) * 3;
        const y = -1 + (i % 4) * 1.5;
        const colors = [C.teal, C.navy, C.orange];
        return (
          <Float key={i} speed={0.3 + (i % 3) * 0.2} floatIntensity={0.2}>
            <mesh position={[Math.cos(a) * r, y, Math.sin(a) * r]}>
              <octahedronGeometry args={[0.15 + (i % 3) * 0.1, 0]} />
              <meshStandardMaterial color={colors[i % 3]} transparent opacity={0.05} roughness={0.6} />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

function ArchSky() {
  const ref = useRef<THREE.Mesh>(null!);
  useEffect(() => {
    if (!ref.current) return;
    const geo = ref.current.geometry;
    const pos = geo.getAttribute("position");
    const colors = new Float32Array(pos.count * 3);
    const lo = new THREE.Color(C.bgDark);
    const mid = new THREE.Color("#d0ccc0");
    const hi = new THREE.Color("#b8c8d8");
    for (let i = 0; i < pos.count; i++) {
      const t = (pos.getY(i) / 30 + 1) / 2;
      const c = new THREE.Color();
      if (t < 0.4) c.lerpColors(lo, mid, t / 0.4);
      else c.lerpColors(mid, hi, (t - 0.4) / 0.6);
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  }, []);
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[30, 32, 24]} />
      <meshBasicMaterial vertexColors side={THREE.BackSide} />
    </mesh>
  );
}

/* ═══════════════════════════════════════
   CAMERA CONTROLLER
   ═══════════════════════════════════════ */

function CameraController({ activeStep }: { activeStep: number | null }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(5, 4, 9));
  const look = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (activeStep !== null) {
      const a = stationAngle(activeStep);
      const [x, , z] = stationPos(activeStep);
      target.current.set(x + Math.cos(a) * 4.5, 2.5, z + Math.sin(a) * 4.5);
      look.current.set(x, 0.5, z);
    } else {
      target.current.set(5, 4, 9);
      look.current.set(0, 0, 0);
    }
  }, [activeStep]);

  useFrame(() => {
    camera.position.lerp(target.current, 0.025);
  });

  return null;
}

/* ═══════════════════════════════════════
   SCENE ASSEMBLY
   ═══════════════════════════════════════ */

function Scene({ activeStep, onStepClick }: { activeStep: number | null; onStepClick: (i: number) => void }) {
  return (
    <>
      <Environment preset="studio" background={false} environmentIntensity={0.4} />
      <fogExp2 attach="fog" args={[C.bgDark, 0.018]} />

      {/* Lighting — architectural studio */}
      <ambientLight intensity={0.5} color="#c8c0b8" />
      <directionalLight position={[12, 18, 8]} intensity={1.0} color="#f8f0e0" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <directionalLight position={[-8, 12, -5]} intensity={0.3} color="#c0d0e0" />
      <hemisphereLight color="#d0d8e0" groundColor="#c8c0a8" intensity={0.3} />

      <CameraController activeStep={activeStep} />
      <OrbitControls enableZoom enablePan={false} minDistance={5} maxDistance={20} enableDamping dampingFactor={0.05} maxPolarAngle={Math.PI * 0.75} minPolarAngle={Math.PI * 0.15} />

      <ArchitecturalBackground />
      <TorusSegments activeStep={activeStep} />
      <FlowParticles />
      <FlowArrows />
      <StationLabels activeStep={activeStep} />
      <CentralCore />

      {/* Holograms */}
      {HOLO_COMPONENTS.map((Holo, i) => (
        <HologramContainer key={i} index={i} active={activeStep === i}>
          <Holo />
        </HologramContainer>
      ))}

      {/* Station lights */}
      {STEPS.map((step, i) => {
        const [x, , z] = stationPos(i);
        return <pointLight key={i} position={[x, 2, z]} intensity={activeStep === i ? 2 : 0.08} color={step.color} distance={4} />;
      })}

      <EffectComposer>
        <Bloom intensity={0.25} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur />
        <Vignette offset={0.25} darkness={0.4} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}

/* ═══════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════ */

export default function StellarEngineTurbine() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const handleStepClick = useCallback((index: number) => {
    setActiveStep(prev => prev === index ? null : index);
  }, []);
  const activeData = activeStep !== null ? STEPS[activeStep] : null;

  return (
    <div className="fixed inset-0 z-[9999] flex" style={{ backgroundColor: C.bg }}>
      {/* ── Sidebar ── */}
      <div className="w-56 lg:w-64 shrink-0 bg-white/80 backdrop-blur-md border-r border-[#d0c8b8] flex flex-col overflow-y-auto">
        {/* Back to site */}
        <Link href="/" className="flex items-center gap-2 px-5 py-3 border-b border-[#d0c8b8] text-[#888] text-[10px] uppercase tracking-wider hover:bg-[#f0ebe0] transition-colors">
          <span>←</span> <span>Back to Site</span>
        </Link>
        <div className="p-5 border-b border-[#d0c8b8]">
          <p className="text-[#E07C3E] text-[9px] uppercase tracking-[0.5em] mb-1.5 font-semibold">System Architecture</p>
          <h1 className="text-lg font-heading text-[#1B3A5C] leading-tight">
            The Stellar <span className="text-[#E07C3E]">Engine</span>
          </h1>
          <p className="text-[#aaa] text-[10px] mt-1.5 leading-relaxed">Click segments to inspect. Drag to orbit.</p>
        </div>
        <div className="flex-1 py-1">
          {STEPS.map((step, i) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(i)}
              className={`w-full text-left px-5 py-3 transition-all duration-300 border-l-2 ${
                activeStep === i ? "bg-[#f0ebe0] border-l-current" : "border-l-transparent hover:bg-[#f8f5f0]"
              }`}
              style={{ borderColor: activeStep === i ? step.color : "transparent" }}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-heading" style={{ color: activeStep === i ? step.color : "#bbb" }}>{step.num}</span>
                <span className={`text-[11px] tracking-wider ${activeStep === i ? "text-[#1B3A5C]" : "text-[#888]"}`}>{step.title}</span>
              </div>
              <p className="text-[#c0b8a8] text-[9px] mt-0.5">{step.subtitle}</p>
            </button>
          ))}
        </div>
        <div className="p-5 border-t border-[#d0c8b8] space-y-2">
          <Link href="/programs" className="block text-center px-4 py-2 bg-[#E07C3E] text-white text-[10px] uppercase tracking-wider font-semibold hover:bg-[#E8944F] transition-colors rounded-md">
            Explore Programs
          </Link>
          <Link href="/get-involved" className="block text-center px-4 py-2 border border-[#d0c8b8] text-[#888] text-[10px] uppercase tracking-wider hover:bg-[#f0ebe0] transition-colors rounded-md">
            Partner With Us
          </Link>
        </div>
      </div>

      {/* ── Canvas ── */}
      <div className="flex-1 relative">
        <Canvas
          shadows
          camera={{ position: [5, 4, 9], fov: 40 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color(C.bg));
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
        >
          <Scene activeStep={activeStep} onStepClick={handleStepClick} />
        </Canvas>

        {/* Detail panel */}
        {activeData && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#f5f2ec] via-[#f5f2ec]/90 to-transparent pt-16 pb-6 px-8">
            <div className="max-w-xl">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-heading text-xl" style={{ color: activeData.color }}>{activeData.num}</span>
                <h2 className="text-sm font-heading text-[#1B3A5C] tracking-wider">{activeData.title}</h2>
                <span className="text-[#c0b8a8] text-[10px] uppercase tracking-wider">— {activeData.subtitle}</span>
              </div>
              <p className="text-[#777] text-xs leading-relaxed mb-3 max-w-md">{activeData.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {activeData.details.map(d => (
                  <span key={d} className="px-2 py-0.5 bg-white border border-[#d0c8b8] rounded text-[#888] text-[10px]">{d}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeStep !== null && (
          <button onClick={() => setActiveStep(null)} className="absolute top-4 right-4 px-3 py-1.5 bg-white/80 border border-[#d0c8b8] rounded text-[#888] text-[10px] uppercase tracking-wider hover:bg-white transition-colors">
            Reset View
          </button>
        )}

        {activeStep === null && (
          <div className="absolute bottom-6 left-8 pointer-events-none">
            <p className="text-[#d0c8b8] text-[10px] uppercase tracking-[0.5em]">The Mindful Group — Milwaukee, WI</p>
          </div>
        )}
      </div>
    </div>
  );
}
