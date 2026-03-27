"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, Environment, Text } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════
   THE STELLAR ENGINE — Mechanical Architectural Torus

   One solid donut (torus) shape. Vertex-colored by section.
   Quarter cutaway reveals internal channel structure.
   Holographic dioramas above each station.
   Architectural drawing style with dimension lines.
   ═══════════════════════════════════════════════════════════════ */

const TEAL = "#1A7A5C";
const TEAL_L = "#22936F";
const TEAL_P = "#93B396";
const ORANGE = "#E07C3E";
const ORANGE_W = "#E8944F";
const NAVY = "#1B3A5C";
const NAVY_L = "#2A5580";
const COPPER = "#b87333";
const BG = "#f5f2ec";
const BG_D = "#e8e4dc";
const LINE = "#c0b8a8";

const R = 4.5;   // major radius
const TR = 0.65;  // tube radius
const N = 7;

const STEPS = [
  { id: "recruit", num: "01", title: "RECRUIT", sub: "Intake Accelerator", color: TEAL, glow: "#00d4aa",
    desc: "Zero-tuition enrollment from underserved communities.",
    long: "The Stellar Engine begins where the need is greatest. We recruit directly from Milwaukee's most underserved zip codes — 53206, 53216, 53210 — through community partnerships, court referrals, and walk-in orientations. There are no prerequisites. No tuition. No barriers to entry. Every other Tuesday at 11:30 AM, anyone can walk in and begin.",
    tags: ["Zero tuition", "Community outreach", "Court partnerships", "Walk-in orientations"] },
  { id: "train", num: "02", title: "TRAIN", sub: "Compression Chamber", color: TEAL_L, glow: "#00c896",
    desc: "Accelerated certification: CNA/CBRF, Construction, Phlebotomy.",
    long: "Once enrolled, participants enter accelerated, high-density training cohorts. CNA/CBRF healthcare certification. Construction trades. Phlebotomy. These are compression chambers that pack months of traditional training into focused weeks. Every hour moves participants closer to a credential employers hire for.",
    tags: ["CNA/CBRF Healthcare", "Construction & Trades", "Phlebotomy", "Career workshops"] },
  { id: "certify", num: "03", title: "CERTIFY", sub: "Ignition Core", color: ORANGE, glow: "#ff9050",
    desc: "90% graduation rate. State-recognized credentials.",
    long: "This is the ignition point. Participants earn real, state-recognized certifications — not participation trophies. Our 90% graduation rate proves the model works. These credentials are validated by employers, recognized by the state, and immediately employable.",
    tags: ["State credentials", "90% graduation rate", "Employer-validated", "Industry-standard"] },
  { id: "place", num: "04", title: "PLACE", sub: "Extraction Turbine", color: COPPER, glow: "#e0a060",
    desc: "85% placement rate. Every hire generates revenue.",
    long: "The staffing arm places certified graduates directly with employers. 85% of graduates are placed. Every single placement generates workforce revenue through the staffing relationship. The extraction turbine converts human potential into economic output on their behalf.",
    tags: ["85% job placement", "Staffing arm revenue", "Employer network", "Career tracking"] },
  { id: "surplus", num: "05", title: "SURPLUS", sub: "Thrust Output", color: ORANGE_W, glow: "#ffa040",
    desc: "Revenue exceeds operating costs. Not profit — thrust.",
    long: "When placement revenue exceeds the cost of training and support, the system generates surplus. This is not profit — it is thrust. The economic force that propels the system without dependency on grants or government funding cycles.",
    tags: ["Revenue > costs", "Grant-independent", "System fuel", "Revenue floor"] },
  { id: "reinvest", num: "06", title: "REINVEST", sub: "Return Manifold", color: NAVY_L, glow: "#4090d0",
    desc: "30% services, 20% access, 30% expansion, 20% reserves.",
    long: "The surplus cycles back: 30% funds supportive services. 20% opens access for non-WIOA-eligible participants. 30% funds expansion. 20% builds reserves. This is the return manifold — the mechanism that closes the loop.",
    tags: ["30% → Services", "20% → Access", "30% → Expansion", "20% → Reserves"] },
  { id: "scale", num: "07", title: "SCALE", sub: "Amplification Ring", color: NAVY, glow: "#3070b0",
    desc: "More powerful at volume, not less. Proven in 53206.",
    long: "At scale, cost per participant decreases as fixed costs spread. Surplus per cycle increases as the employer network grows. The engine becomes more powerful at volume. Proven over 9 years in Milwaukee's 53206. Replication-ready.",
    tags: ["Lower unit cost", "Growing surplus", "Replication-ready", "Proven in 53206"] },
];

function ang(i: number) { return (i / N) * Math.PI * 2 - Math.PI / 2; }
function spos(i: number): [number, number, number] {
  const a = ang(i); return [Math.cos(a) * R, 0, Math.sin(a) * R];
}

/* ═══════════════════════════════════════
   THE DONUT — One solid torus, vertex-colored
   by section, with a quarter cutaway
   ═══════════════════════════════════════ */
function DonutTorus({ active, onSelect }: { active: number | null; onSelect: (i: number) => void }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const outlineRef = useRef<THREE.Mesh>(null!);

  // Create the torus with vertex colors per section
  const { geometry, sectionMap } = useMemo(() => {
    const tubSegs = 128;
    const radSegs = 32;
    // Create 270° torus (quarter cutaway)
    const geo = new THREE.TorusGeometry(R, TR, radSegs, tubSegs, Math.PI * 1.75);
    // Lay flat (horizontal) then rotate cutaway to front-right
    geo.rotateX(-Math.PI / 2);
    geo.rotateY(Math.PI * 0.15);

    const posAttr = geo.getAttribute("position");
    const colors = new Float32Array(posAttr.count * 3);
    const map: number[] = new Array(posAttr.count);

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      // Determine angle from center
      let theta = Math.atan2(z, x);
      // Adjust for rotation
      theta -= Math.PI * 0.15;
      if (theta < -Math.PI) theta += Math.PI * 2;
      // Normalize to 0-1 around the torus
      let norm = (theta + Math.PI / 2) / (Math.PI * 2);
      if (norm < 0) norm += 1;
      if (norm > 1) norm -= 1;
      // Map to section index
      const section = Math.floor(norm * N) % N;
      map[i] = section;

      const col = new THREE.Color(STEPS[section].color);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return { geometry: geo, sectionMap: map };
  }, []);

  // Highlight active section
  useEffect(() => {
    if (!meshRef.current) return;
    const colors = geometry.getAttribute("color");
    for (let i = 0; i < colors.count; i++) {
      const section = sectionMap[i];
      const col = new THREE.Color(STEPS[section].color);
      if (active !== null && section === active) {
        col.multiplyScalar(1.3); // brighter
      } else if (active !== null) {
        col.multiplyScalar(0.7); // dimmer
      }
      colors.setXYZ(i, col.r, col.g, col.b);
    }
    colors.needsUpdate = true;
  }, [active, geometry, sectionMap]);

  return (
    <group>
      {/* Main solid donut */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        onClick={(e) => {
          e.stopPropagation();
          // Determine which section was clicked
          const point = e.point;
          let theta = Math.atan2(point.z, point.x);
          theta -= Math.PI * 0.15;
          if (theta < -Math.PI) theta += Math.PI * 2;
          let norm = (theta + Math.PI / 2) / (Math.PI * 2);
          if (norm < 0) norm += 1;
          if (norm > 1) norm -= 1;
          const section = Math.floor(norm * N) % N;
          onSelect(section);
        }}
      >
        <meshStandardMaterial
          vertexColors
          roughness={0.35}
          metalness={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wireframe overlay — architectural drawing style */}
      <mesh ref={outlineRef} geometry={geometry}>
        <meshBasicMaterial color="#333" wireframe transparent opacity={0.03} />
      </mesh>

      {/* Cutaway interior — visible in the open quarter */}
      <CutawayInterior active={active} />

      {/* Section divider lines on the surface */}
      <SectionDividers />

      {/* Dimension annotation lines */}
      <DimensionLines />
    </group>
  );
}

/* Interior visible through the cutaway */
function CutawayInterior({ active }: { active: number | null }) {
  return (
    <group>
      {/* Inner channel tube — visible through the cut (rotated to match horizontal donut) */}
      <mesh rotation={[-Math.PI / 2, Math.PI * 0.15, 0]}>
        <torusGeometry args={[R, TR * 0.4, 20, 64, Math.PI * 0.25]} />
        <meshStandardMaterial color="#0d1e30" roughness={0.5} metalness={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Glowing energy core */}
      <mesh rotation={[-Math.PI / 2, Math.PI * 0.15, 0]}>
        <torusGeometry args={[R, TR * 0.15, 12, 64, Math.PI * 0.25]} />
        <meshBasicMaterial color={active !== null ? STEPS[active].glow : TEAL_P} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      {/* Cross-section faces at both cut edges */}
      {[Math.PI * 0.15, Math.PI * 0.15 + Math.PI * 1.75].map((cutAngle, idx) => {
        const cx = Math.cos(-cutAngle) * R;
        const cz = Math.sin(-cutAngle) * R;
        return (
          <group key={idx} position={[cx, 0, cz]} rotation={[0, -cutAngle + Math.PI / 2, 0]}>
            {/* Outer wall ring */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <ringGeometry args={[TR * 0.4, TR, 32]} />
              <meshStandardMaterial color={idx === 0 ? TEAL : NAVY} roughness={0.35} metalness={0.12} side={THREE.DoubleSide} />
            </mesh>
            {/* Inner channel */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <ringGeometry args={[TR * 0.15, TR * 0.4, 32]} />
              <meshStandardMaterial color="#0d1e30" roughness={0.5} side={THREE.DoubleSide} />
            </mesh>
            {/* Core glow */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[TR * 0.15, 20]} />
              <meshBasicMaterial color={TEAL_P} transparent opacity={0.4} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* Lines on the donut surface marking section boundaries */
function SectionDividers() {
  return (
    <group>
      {STEPS.map((_, i) => {
        const a = ang(i) + Math.PI / N; // boundary between sections
        const x = Math.cos(a) * R;
        const z = Math.sin(a) * R;
        return (
          <mesh key={i} position={[x, 0, z]} rotation={[Math.PI / 2, 0, -a]}>
            <torusGeometry args={[TR * 1.01, 0.008, 8, 20]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
          </mesh>
        );
      })}
    </group>
  );
}

/* Architectural dimension lines */
function DimensionLines() {
  return (
    <group>
      {/* Major radius dimension */}
      <mesh position={[0, -1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[R - 0.01, R + 0.01, 64]} />
        <meshBasicMaterial color={LINE} transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
      {/* Tube radius dimension */}
      <Text position={[R + 1.2, -1.3, 0]} fontSize={0.15} color={LINE} anchorX="left" anchorY="middle" rotation={[-Math.PI / 2, 0, 0]}>
        R = {R}m
      </Text>
      <Text position={[0, -1.3, R + 1]} fontSize={0.12} color={LINE} anchorX="center" anchorY="middle" rotation={[-Math.PI / 2, 0, 0]}>
        tube ∅ = {(TR * 2).toFixed(1)}m
      </Text>
    </group>
  );
}

/* ═══════════════════════════════════════
   PARTICLES flowing inside the donut
   ═══════════════════════════════════════ */
function Particles() {
  const ct = 300;
  const ref = useRef<THREE.InstancedMesh>(null!);
  const o = useMemo(() => new THREE.Object3D(), []);
  const d = useMemo(() => Array.from({ length: ct }, (_, i) => ({
    a: (i / ct) * Math.PI * 2, sp: 0.08 + Math.random() * 0.04,
    ta: Math.random() * Math.PI * 2, tr: Math.random() * TR * 0.28,
    sz: 0.01 + Math.random() * 0.012,
  })), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    d.forEach((p, i) => {
      const a = p.a + t * p.sp;
      const cx = Math.cos(a) * R, cz = Math.sin(a) * R;
      const ox = Math.cos(p.ta + t * 0.5) * p.tr;
      const oy = Math.sin(p.ta + t * 0.5) * p.tr;
      const nx = -Math.sin(a), nz = Math.cos(a);
      o.position.set(cx + nx * ox, oy, cz + nz * ox);
      o.scale.setScalar(p.sz);
      o.updateMatrix();
      ref.current.setMatrixAt(i, o.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, ct]}>
      <sphereGeometry args={[1, 5, 5]} />
      <meshBasicMaterial color={TEAL_P} transparent opacity={0.3} />
    </instancedMesh>
  );
}

/* Flow direction arrows */
function Arrows() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.children.forEach((c, i) => {
      ((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.12 + Math.sin(clock.elapsedTime * 1.5 + i * 0.5) * 0.06;
    });
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * R, TR + 0.06, Math.sin(a) * R]} rotation={[0, -(a + Math.PI / 2), 0]}>
            <coneGeometry args={[0.04, 0.09, 3]} />
            <meshBasicMaterial color={ORANGE} transparent opacity={0.12} />
          </mesh>
        );
      })}
    </group>
  );
}

/* Station labels around the donut */
function StepLabels({ active }: { active: number | null }) {
  return (
    <group>
      {STEPS.map((s, i) => {
        const a = ang(i);
        const labelR = R + TR + 0.5;
        const x = Math.cos(a) * labelR;
        const z = Math.sin(a) * labelR;
        const on = active === i;
        return (
          <group key={i} position={[x, 0, z]}>
            <Text position={[0, 0.1, 0]} fontSize={on ? 0.18 : 0.12} color={on ? s.color : "#999"} anchorX="center" anchorY="middle">
              {s.num}
            </Text>
            <Text position={[0, -0.08, 0]} fontSize={on ? 0.08 : 0.055} color={on ? "#444" : "#bbb"} anchorX="center" anchorY="middle">
              {s.title}
            </Text>
            {/* Connector line from label to donut surface */}
            <mesh position={[0, 0, 0]} rotation={[0, -a + Math.PI, Math.PI / 2]}>
              <cylinderGeometry args={[0.003, 0.003, 0.3, 3]} />
              <meshBasicMaterial color={on ? s.color : LINE} transparent opacity={on ? 0.4 : 0.1} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* Central core */
function Core() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.06; });
  return (
    <group>
      <group ref={ref}>
        <Float speed={1} rotationIntensity={0.06} floatIntensity={0.08}>
          <mesh><dodecahedronGeometry args={[0.5, 0]} /><meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={1} wireframe transparent opacity={0.4} /></mesh>
          <mesh><sphereGeometry args={[0.2, 12, 12]} /><meshBasicMaterial color="#fff" transparent opacity={0.05} /></mesh>
        </Float>
      </group>
      <pointLight intensity={2} color={TEAL} distance={6} />
    </group>
  );
}

/* ═══════════════════════════════════════
   HOLOGRAM SCENES
   ═══════════════════════════════════════ */
const SK = ["#8d5524", "#c68642", "#e0ac69", "#6b3a1f", "#c68642"];
const SH = [TEAL, TEAL_L, ORANGE, NAVY_L, COPPER];
function Fig({ x, z, si, ci, h = 0.12 }: { x: number; z: number; si: number; ci: number; h?: number }) {
  return (<group position={[x, 0, z]}>
    <mesh position={[0, h + 0.025, 0]}><sphereGeometry args={[0.018, 7, 7]} /><meshStandardMaterial color={SK[si % 5]} roughness={0.7} /></mesh>
    <mesh position={[0, h / 2, 0]}><capsuleGeometry args={[0.014, h * 0.4, 3, 6]} /><meshStandardMaterial color={SH[ci % 5]} roughness={0.6} /></mesh>
    <mesh position={[0, 0.02, 0]}><capsuleGeometry args={[0.009, 0.025, 3, 5]} /><meshStandardMaterial color="#2a3040" roughness={0.8} /></mesh>
  </group>);
}

function H01() {
  const r = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (r.current) r.current.rotation.y = clock.elapsedTime * 0.1; });
  return (<group ref={r}>
    <mesh position={[0, 0.18, 0]}><torusGeometry args={[0.24, 0.025, 8, 18, Math.PI]} /><meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.5} roughness={0.3} metalness={0.4} /></mesh>
    <mesh position={[0, 0.18, 0]}><circleGeometry args={[0.2, 12, 0, Math.PI]} /><meshBasicMaterial color="#00e8aa" transparent opacity={0.1} side={THREE.DoubleSide} /></mesh>
    {[-0.35, -0.22, -0.1, 0.01].map((xo, i) => <Fig key={i} x={xo} z={i * 0.07 - 0.08} si={i} ci={i} h={0.1 + i * 0.012} />)}
  </group>);
}

function H02() {
  return (<group>
    <mesh position={[0, 0.24, -0.14]}><boxGeometry args={[0.34, 0.2, 0.006]} /><meshStandardMaterial color="#e8e8e0" roughness={0.4} /></mesh>
    <Fig x={0.12} z={-0.08} si={0} ci={3} h={0.14} />
    {[[-0.12, 0.05], [0, 0.05], [0.12, 0.05], [-0.06, 0.14], [0.06, 0.14]].map(([dx, dz], i) => (
      <group key={i} position={[dx!, 0, dz!]}>
        <mesh position={[0, 0.04, 0]}><boxGeometry args={[0.055, 0.003, 0.035]} /><meshStandardMaterial color="#8a7050" roughness={0.8} /></mesh>
        <Fig x={0} z={0.018} si={i + 1} ci={i} h={0.07} />
      </group>
    ))}
  </group>);
}

function H03() {
  return (<group>
    <mesh position={[0, 0.012, 0]}><cylinderGeometry args={[0.24, 0.28, 0.025, 20]} /><meshStandardMaterial color="#8a7050" roughness={0.7} /></mesh>
    <group position={[0, 0.025, 0]}>
      <mesh position={[0, 0.18, 0]}><boxGeometry args={[0.042, 0.004, 0.042]} /><meshStandardMaterial color="#1a1a2a" /></mesh>
      <mesh position={[0, 0.155, 0]}><sphereGeometry args={[0.02, 8, 8]} /><meshStandardMaterial color="#8d5524" roughness={0.7} /></mesh>
      <mesh position={[0, 0.07, 0]}><capsuleGeometry args={[0.018, 0.09, 4, 6]} /><meshStandardMaterial color="#1a1a3a" roughness={0.5} /></mesh>
      <mesh position={[0.04, 0.1, 0.012]} rotation={[0, 0, -0.3]}><boxGeometry args={[0.055, 0.04, 0.002]} /><meshStandardMaterial color="#f5f0e8" roughness={0.4} /></mesh>
    </group>
  </group>);
}

function H04() {
  return (<group>
    <mesh position={[0, 0.055, 0]}><boxGeometry args={[0.24, 0.005, 0.14]} /><meshStandardMaterial color="#6a5035" roughness={0.7} /></mesh>
    <Fig x={-0.09} z={-0.05} si={1} ci={3} h={0.13} />
    <Fig x={0.09} z={-0.05} si={0} ci={0} h={0.12} />
    <mesh position={[0, 0.1, -0.025]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.006, 0.04, 3, 5]} /><meshStandardMaterial color="#c68642" roughness={0.7} /></mesh>
  </group>);
}

function H05() {
  const bars = [0.04, 0.07, 0.08, 0.12, 0.15, 0.2, 0.26]; const op = 0.1;
  return (<group>
    {bars.map((h, i) => <mesh key={i} position={[-0.12 + i * 0.044, h / 2, 0]}><boxGeometry args={[0.028, h, 0.028]} /><meshStandardMaterial color={h > op ? ORANGE : TEAL_L} emissive={h > op ? ORANGE : TEAL_L} emissiveIntensity={h > op ? 0.2 : 0.06} roughness={0.4} /></mesh>)}
    <mesh position={[0, op, 0.012]}><boxGeometry args={[0.34, 0.002, 0.002]} /><meshBasicMaterial color="#ff4444" transparent opacity={0.4} /></mesh>
  </group>);
}

function H06() {
  const ch = [{ c: TEAL, x: -0.34, h: 0.2 }, { c: TEAL_L, x: -0.11, h: 0.17 }, { c: ORANGE, x: 0.11, h: 0.24 }, { c: NAVY, x: 0.34, h: 0.14 }];
  return (<group>
    <mesh position={[0, 0.025, 0]}><sphereGeometry args={[0.035, 10, 10]} /><meshStandardMaterial color={ORANGE_W} emissive={ORANGE_W} emissiveIntensity={0.3} roughness={0.3} metalness={0.3} /></mesh>
    {ch.map((c, i) => <group key={i}>
      <mesh position={[c.x * 0.4, 0.025 + c.h / 2, 0]}><cylinderGeometry args={[0.008, 0.01, c.h, 5]} /><meshStandardMaterial color={c.c} emissive={c.c} emissiveIntensity={0.12} roughness={0.5} /></mesh>
      <mesh position={[c.x, 0.025 + c.h, 0]}><cylinderGeometry args={[0.028, 0.02, 0.04, 6]} /><meshStandardMaterial color={c.c} roughness={0.4} /></mesh>
    </group>)}
  </group>);
}

function H07() {
  const r = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (r.current) r.current.rotation.y = clock.elapsedTime * 0.15; });
  return (<group ref={r}>
    <mesh><torusGeometry args={[0.14, 0.02, 10, 20]} /><meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.4} roughness={0.3} metalness={0.4} /></mesh>
    {[0.22, 0.29].map((rv, i) => <mesh key={i} rotation={[Math.PI / 2, 0, (i + 1) * 0.3]}>
      <torusGeometry args={[rv, 0.01, 7, 16]} /><meshStandardMaterial color={[ORANGE, NAVY][i]} emissive={[ORANGE, NAVY][i]} emissiveIntensity={0.2} transparent opacity={0.5} />
    </mesh>)}
  </group>);
}

const HOLOS = [H01, H02, H03, H04, H05, H06, H07];

function HoloPod({ index, active }: { index: number; active: boolean }) {
  const [x, , z] = spos(index);
  const s = STEPS[index];
  const ref = useRef<THREE.Group>(null!);
  const H = HOLOS[index];

  useFrame(() => {
    if (!ref.current) return;
    const ts = active ? 1.3 : 0.75;
    const cs = ref.current.scale.x;
    ref.current.scale.setScalar(cs + (ts - cs) * 0.04);
  });

  return (
    <group position={[x, TR + 0.5, z]}>
      <group ref={ref}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
          <circleGeometry args={[0.3, 16]} />
          <meshBasicMaterial color={s.glow} transparent opacity={active ? 0.05 : 0.015} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.28, 0]}>
          <cylinderGeometry args={[0.003, 0.05, 0.5, 4]} />
          <meshBasicMaterial color={s.glow} transparent opacity={active ? 0.07 : 0.015} />
        </mesh>
        <H />
        {active && <pointLight intensity={0.6} color={s.glow} distance={2} />}
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════
   BACKGROUND
   ═══════════════════════════════════════ */
function Bg() {
  return (<group>
    <SkyGrad />
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
      <circleGeometry args={[18, 48]} /><meshStandardMaterial color={BG_D} roughness={0.95} />
    </mesh>
    {Array.from({ length: 12 }, (_, i) => (
      <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.79, 0]}>
        <ringGeometry args={[(i + 1) * 1.3 - 0.005, (i + 1) * 1.3 + 0.005, 64]} />
        <meshBasicMaterial color={LINE} transparent opacity={0.035 - i * 0.002} side={THREE.DoubleSide} />
      </mesh>
    ))}
  </group>);
}

function SkyGrad() {
  const ref = useRef<THREE.Mesh>(null!);
  useEffect(() => {
    if (!ref.current) return;
    const geo = ref.current.geometry; const p = geo.getAttribute("position");
    const c = new Float32Array(p.count * 3);
    const lo = new THREE.Color(BG_D), mid = new THREE.Color("#d0ccc0"), hi = new THREE.Color("#b8c8d8");
    for (let i = 0; i < p.count; i++) {
      const t = (p.getY(i) / 20 + 1) / 2; const col = new THREE.Color();
      t < 0.4 ? col.lerpColors(lo, mid, t / 0.4) : col.lerpColors(mid, hi, (t - 0.4) / 0.6);
      c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(c, 3));
  }, []);
  return <mesh ref={ref}><sphereGeometry args={[20, 24, 16]} /><meshBasicMaterial vertexColors side={THREE.BackSide} /></mesh>;
}

/* Camera */
function Cam({ active }: { active: number | null }) {
  const { camera } = useThree();
  const tgt = useRef(new THREE.Vector3(4, 6, 8));

  useEffect(() => {
    if (active !== null) {
      const a = ang(active);
      const [x, , z] = spos(active);
      tgt.current.set(x + Math.cos(a) * 3, 3.5, z + Math.sin(a) * 3);
    } else {
      tgt.current.set(4, 6, 8);
    }
  }, [active]);

  useFrame(() => { camera.position.lerp(tgt.current, 0.025); camera.lookAt(0, 0, 0); });
  return null;
}

/* 3D Scene */
function Scene({ active, onSelect }: { active: number | null; onSelect: (i: number) => void }) {
  return (<>
    <Environment preset="studio" background={false} environmentIntensity={0.35} />
    <fogExp2 attach="fog" args={[BG_D, 0.012]} />
    <ambientLight intensity={0.45} color="#c8c0b8" />
    <directionalLight position={[10, 14, 8]} intensity={0.85} color="#f8f0e0" />
    <directionalLight position={[-6, 8, -4]} intensity={0.2} color="#c0d0e0" />
    <hemisphereLight color="#d0d8e0" groundColor="#c8c0a8" intensity={0.2} />
    <Cam active={active} />
    <OrbitControls enableZoom enablePan={false} minDistance={6} maxDistance={18} enableDamping dampingFactor={0.05} maxPolarAngle={Math.PI * 0.65} minPolarAngle={Math.PI * 0.1} target={[0, 0, 0]} />
    <Bg />
    <DonutTorus active={active} onSelect={onSelect} />
    <Particles />
    <Arrows />
    <StepLabels active={active} />
    <Core />
    {STEPS.map((_, i) => <HoloPod key={i} index={i} active={active === i} />)}
    {STEPS.map((s, i) => { const [x, , z] = spos(i); return <pointLight key={i} position={[x, 1.2, z]} intensity={active === i ? 1.2 : 0.04} color={s.color} distance={3} />; })}
    <EffectComposer>
      <Bloom intensity={0.2} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur />
      <Vignette offset={0.2} darkness={0.3} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  </>);
}

/* ═══════════════════════════════════════
   PAGE
   ═══════════════════════════════════════ */
export default function StellarEnginePage() {
  const [active, setActive] = useState<number | null>(null);
  const toggle = useCallback((i: number) => setActive(p => p === i ? null : i), []);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleSelect = useCallback((i: number) => {
    toggle(i);
    setTimeout(() => { sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 600);
  }, [toggle]);

  return (
    <div className="fixed inset-0 z-[9999] flex" style={{ backgroundColor: BG }}>
      {/* Sidebar */}
      <div className="w-52 lg:w-60 shrink-0 bg-white/80 backdrop-blur-md border-r border-[#d0c8b8] flex flex-col overflow-y-auto">
        <Link href="/" className="flex items-center gap-2 px-4 py-2.5 border-b border-[#d0c8b8] text-[#888] text-[10px] uppercase tracking-wider hover:bg-[#f0ebe0] transition-colors">← Back to Site</Link>
        <div className="p-4 border-b border-[#d0c8b8]">
          <p className="text-[#E07C3E] text-[8px] uppercase tracking-[0.5em] mb-1 font-semibold">System Architecture</p>
          <h1 className="text-base font-heading text-[#1B3A5C]">The Stellar <span className="text-[#E07C3E]">Engine</span></h1>
          <p className="text-[#aaa] text-[9px] mt-1">Click donut sections. Drag to orbit. Scroll for details.</p>
        </div>
        <div className="flex-1 py-0.5">
          {STEPS.map((s, i) => (
            <button key={s.id} onClick={() => handleSelect(i)}
              className={`w-full text-left px-4 py-2.5 transition-all border-l-2 ${active === i ? "bg-[#f0ebe0] border-l-current" : "border-l-transparent hover:bg-[#f8f5f0]"}`}
              style={{ borderColor: active === i ? s.color : "transparent" }}>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[10px] font-heading" style={{ color: active === i ? s.color : "#bbb" }}>{s.num}</span>
                <span className={`text-[10px] tracking-wider ${active === i ? "text-[#1B3A5C]" : "text-[#888]"}`}>{s.title}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-[#d0c8b8] space-y-1.5">
          <Link href="/programs" className="block text-center px-3 py-1.5 bg-[#E07C3E] text-white text-[9px] uppercase tracking-wider font-semibold hover:bg-[#E8944F] rounded-md">Explore Programs</Link>
          <Link href="/get-involved" className="block text-center px-3 py-1.5 border border-[#d0c8b8] text-[#888] text-[9px] uppercase tracking-wider hover:bg-[#f0ebe0] rounded-md">Partner With Us</Link>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="h-[65vh] min-h-[420px] shrink-0 relative">
          <Canvas camera={{ position: [4, 6, 8], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true, alpha: false }}
            onCreated={({ gl }) => { gl.setClearColor(new THREE.Color(BG)); gl.outputColorSpace = THREE.SRGBColorSpace; }}>
            <Scene active={active} onSelect={handleSelect} />
          </Canvas>
          {active !== null && (
            <button onClick={() => setActive(null)} className="absolute top-3 right-3 px-2.5 py-1 bg-white/80 border border-[#d0c8b8] rounded text-[#888] text-[9px] uppercase tracking-wider hover:bg-white">Reset View</button>
          )}
        </div>

        {/* Scroll text */}
        <div style={{ backgroundColor: BG }}>
          <div className="max-w-3xl mx-auto px-8 py-10 border-t border-[#d0c8b8]">
            <p className="text-[#E07C3E] text-[10px] uppercase tracking-[0.4em] mb-2 font-semibold">How It Works</p>
            <h2 className="text-2xl font-heading text-[#1B3A5C] mb-3">The Closed-Loop System</h2>
            <p className="text-[#777] text-sm leading-relaxed">
              The Stellar Engine is a self-sustaining workforce development model. Participant outcomes generate the revenue that funds the next cohort. Each step feeds the next. Surplus cycles back. The loop never opens.
            </p>
          </div>
          {STEPS.map((s, i) => (
            <div key={s.id} ref={el => { sectionRefs.current[i] = el; }} className={`border-t border-[#d0c8b8] ${i % 2 === 0 ? "bg-white/40" : ""}`}>
              <div className="max-w-3xl mx-auto px-8 py-8">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-xl font-heading" style={{ color: s.color }}>{s.num}</span>
                  <h3 className="text-lg font-heading text-[#1B3A5C]">{s.title}</h3>
                  <span className="text-[#c0b8a8] text-[10px] uppercase tracking-wider">— {s.sub}</span>
                </div>
                <p className="text-[#666] text-sm leading-relaxed mb-3">{s.long}</p>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map(t => <span key={t} className="px-2.5 py-1 bg-white border border-[#d0c8b8] rounded text-[#888] text-[10px]">{t}</span>)}
                </div>
                <button onClick={() => handleSelect(i)} className="mt-3 text-[10px] uppercase tracking-wider font-semibold hover:underline" style={{ color: s.color }}>
                  View in Diagram ↑
                </button>
              </div>
            </div>
          ))}
          <div className="max-w-3xl mx-auto px-8 py-10 border-t border-[#d0c8b8]">
            <div className="border-l-4 border-[#E07C3E] pl-6">
              <p className="text-lg font-heading text-[#1B3A5C] leading-relaxed mb-2">
                The Stellar Engine does not ask why people are poor. It builds a system that makes the conditions of poverty economically unsustainable.
              </p>
              <p className="text-[#E07C3E] text-[10px] uppercase tracking-[0.2em] font-semibold">
                <a href="https://reginald-reed-site.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:underline">Reginald Reed Jr.</a> — Founder
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <Link href="/programs" className="px-5 py-2.5 bg-[#E07C3E] text-white text-[10px] uppercase tracking-wider font-semibold hover:bg-[#E8944F] rounded-md">Explore Programs</Link>
              <Link href="/get-involved" className="px-5 py-2.5 border border-[#d0c8b8] text-[#888] text-[10px] uppercase tracking-wider hover:bg-[#f0ebe0] rounded-md">Partner With Us</Link>
            </div>
          </div>
          <div className="py-4 text-center border-t border-[#d0c8b8]">
            <p className="text-[#d0c8b8] text-[9px] uppercase tracking-[0.5em]">The Mindful Group — Milwaukee, WI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
