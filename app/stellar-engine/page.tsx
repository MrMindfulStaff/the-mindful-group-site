"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, Environment, Text } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════
   THE STELLAR ENGINE — Architectural Cutaway Torus

   Full torus visible. ALL 7 sections permanently cutaway.
   Holographic dioramas float above every station.
   Click to rotate. Scroll for detail text below.
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

const R = 5; // ring radius — smaller so it fits on screen
const TR = 0.55; // tube radius
const N = 7;

const STEPS = [
  { id: "recruit", num: "01", title: "RECRUIT", sub: "Intake Accelerator", color: TEAL, glow: "#00d4aa",
    desc: "Zero-tuition enrollment from underserved communities. Court & probation partnerships. Walk-in orientations every other Tuesday at 11:30 AM.",
    long: "The Stellar Engine begins where the need is greatest. We recruit directly from Milwaukee's most underserved zip codes — 53206, 53216, 53210 — through community partnerships, court referrals, and walk-in orientations. There are no prerequisites. No tuition. No barriers to entry. Every other Tuesday at 11:30 AM, anyone can walk in and begin. This is the intake accelerator — the widest possible funnel feeding into the most focused pipeline.",
    tags: ["Zero tuition", "Community outreach", "Court partnerships", "Walk-in orientations"] },
  { id: "train", num: "02", title: "TRAIN", sub: "Compression Chamber", color: TEAL_L, glow: "#00c896",
    desc: "Accelerated certification programs: CNA/CBRF, Construction, Phlebotomy. Industry-recognized credentials from day one.",
    long: "Once enrolled, participants enter accelerated, high-density training cohorts. CNA/CBRF healthcare certification. Construction trades. Phlebotomy. Career development workshops. These are not remedial programs — they are compression chambers that pack months of traditional training into focused weeks. Every hour is designed to move participants closer to a credential that employers actually recognize and hire for.",
    tags: ["CNA/CBRF Healthcare", "Construction & Trades", "Phlebotomy", "Career workshops"] },
  { id: "certify", num: "03", title: "CERTIFY", sub: "Ignition Core", color: ORANGE, glow: "#ff9050",
    desc: "90% graduation rate. State-recognized credentials — not participation certificates.",
    long: "This is the ignition point. Participants earn real, state-recognized certifications — not participation trophies. Our 90% graduation rate proves the model works. These credentials are validated by employers, recognized by the state, and immediately employable. This is where potential combusts into power. The certification is the spark that ignites the entire economic engine that follows.",
    tags: ["State credentials", "90% graduation rate", "Employer-validated", "Industry-standard"] },
  { id: "place", num: "04", title: "PLACE", sub: "Extraction Turbine", color: COPPER, glow: "#e0a060",
    desc: "The staffing arm places graduates with employers. 85% placement rate. Every hire generates revenue.",
    long: "The Mindful Group's staffing arm places certified graduates directly with employers. This is not a referral — it is a placement. 85% of graduates are placed in jobs. Every single placement generates workforce revenue through the staffing relationship. The extraction turbine converts human potential into economic output — not extracting from the participant, but extracting value from the market on their behalf.",
    tags: ["85% job placement", "Staffing arm revenue", "Employer network", "Career tracking"] },
  { id: "surplus", num: "05", title: "SURPLUS", sub: "Thrust Output", color: ORANGE_W, glow: "#ffa040",
    desc: "Revenue exceeds operating costs. Not profit — thrust.",
    long: "When placement revenue exceeds the cost of training and support, the system generates surplus. This is not profit in the traditional sense — it is thrust. It is the economic force that propels the entire system forward without dependency on grants, donations, or government funding cycles. The surplus is the proof that the model is not charity — it is infrastructure. Self-sustaining infrastructure.",
    tags: ["Revenue > costs", "Grant-independent", "System fuel", "Revenue floor"] },
  { id: "reinvest", num: "06", title: "REINVEST", sub: "Return Manifold", color: NAVY_L, glow: "#4090d0",
    desc: "Surplus cycles back. 30% services, 20% non-WIOA, 30% expansion, 20% reserves.",
    long: "The surplus does not leave the system. It cycles back through four allocation channels: 30% funds supportive services (childcare, transportation, housing). 20% opens access for non-WIOA-eligible participants who would otherwise be excluded. 30% funds geographic and programmatic expansion. 20% builds operational reserves for stability. This is the return manifold — the mechanism that makes the loop closed.",
    tags: ["30% → Services", "20% → Access", "30% → Expansion", "20% → Reserves"] },
  { id: "scale", num: "07", title: "SCALE", sub: "Amplification Ring", color: NAVY, glow: "#3070b0",
    desc: "Cost per participant decreases. Surplus per cycle increases. Proven in 53206.",
    long: "At scale, the Stellar Engine does not just sustain — it accelerates. Cost per participant decreases as fixed costs spread across more cohorts. Surplus per cycle increases as the staffing arm's employer network grows. The engine becomes more powerful at volume, not less. This is not theoretical — it has been proven over 9 years in Milwaukee's 53206, one of the most challenging zip codes in America. The model is replication-ready.",
    tags: ["Lower unit cost", "Growing surplus", "Replication-ready", "Proven in 53206"] },
];

function ang(i: number) { return (i / N) * Math.PI * 2 - Math.PI / 2; }
function spos(i: number): [number, number, number] {
  const a = ang(i); return [Math.cos(a) * R, 0, Math.sin(a) * R];
}

/* ═══════════════════════════════════════
   TORUS — ALL segments cutaway
   ═══════════════════════════════════════ */
function Torus({ active, onSelect }: { active: number | null; onSelect: (i: number) => void }) {
  return (
    <group>
      {STEPS.map((s, i) => {
        const gap = 0.06;
        const fullArc = (Math.PI * 2) / N;
        const showArc = fullArc - gap * 2;
        const cutArc = showArc * 0.55; // permanent cutaway at 55%
        const start = ang(i) - showArc / 2;
        const isOn = active === i;
        return (
          <group key={s.id}>
            {/* Outer shell — only 55% of arc shown (cutaway) */}
            <mesh rotation={[0, -start, 0]} onClick={(e) => { e.stopPropagation(); onSelect(i); }}>
              <torusGeometry args={[R, TR, 20, 32, cutArc]} />
              <meshStandardMaterial
                color={s.color}
                emissive={s.color}
                emissiveIntensity={isOn ? 0.4 : 0.08}
                roughness={0.35}
                metalness={0.15}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Inner channel — visible in the cutaway gap */}
            <mesh rotation={[0, -start, 0]}>
              <torusGeometry args={[R, TR * 0.35, 14, 32, showArc]} />
              <meshStandardMaterial color="#0d1e30" emissive={s.glow} emissiveIntensity={isOn ? 0.2 : 0.06} roughness={0.5} metalness={0.3} side={THREE.DoubleSide} />
            </mesh>
            {/* Energy core — glowing inner tube */}
            <mesh rotation={[0, -start, 0]}>
              <torusGeometry args={[R, TR * 0.12, 8, 32, showArc]} />
              <meshBasicMaterial color={s.glow} transparent opacity={isOn ? 0.35 : 0.12} side={THREE.DoubleSide} />
            </mesh>
            {/* Cut edge disc */}
            <CutFace a={start + cutArc} color={s.color} glow={s.glow} on={isOn} />
          </group>
        );
      })}
    </group>
  );
}

function CutFace({ a, color, glow, on }: { a: number; color: string; glow: string; on: boolean }) {
  const x = Math.cos(-a) * R, z = Math.sin(-a) * R;
  return (
    <group position={[x, 0, z]} rotation={[0, -a + Math.PI / 2, 0]}>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[TR * 0.35, TR, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={on ? 0.15 : 0.03} roughness={0.35} metalness={0.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[TR * 0.12, TR * 0.35, 32]} />
        <meshStandardMaterial color="#0d1e30" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[TR * 0.12, 24]} />
        <meshBasicMaterial color={glow} transparent opacity={on ? 0.5 : 0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════
   PARTICLES + ARROWS
   ═══════════════════════════════════════ */
function Particles() {
  const ct = 300;
  const ref = useRef<THREE.InstancedMesh>(null!);
  const o = useMemo(() => new THREE.Object3D(), []);
  const d = useMemo(() => Array.from({ length: ct }, (_, i) => ({
    a: (i / ct) * Math.PI * 2, sp: 0.08 + Math.random() * 0.05,
    ta: Math.random() * Math.PI * 2, tr: Math.random() * TR * 0.28,
    sz: 0.01 + Math.random() * 0.014,
  })), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    d.forEach((p, i) => {
      const a = p.a + t * p.sp;
      const cx = Math.cos(a) * R, cz = Math.sin(a) * R;
      const ox = Math.cos(p.ta) * p.tr, oy = Math.sin(p.ta) * p.tr;
      const nx = -Math.sin(a);
      o.position.set(cx + nx * ox, oy, cz + Math.cos(a) * ox);
      o.scale.setScalar(p.sz);
      o.updateMatrix();
      ref.current.setMatrixAt(i, o.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, ct]}>
      <sphereGeometry args={[1, 5, 5]} />
      <meshBasicMaterial color={TEAL_P} transparent opacity={0.35} />
    </instancedMesh>
  );
}

function Arrows() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.children.forEach((c, i) => {
      ((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(clock.elapsedTime * 1.5 + i * 0.5) * 0.08;
    });
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * R, TR + 0.04, Math.sin(a) * R]} rotation={[Math.PI / 2, 0, -(a + Math.PI / 2)]}>
            <coneGeometry args={[0.04, 0.1, 3]} />
            <meshBasicMaterial color={ORANGE} transparent opacity={0.15} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ═══════════════════════════════════════
   LABELS under each station
   ═══════════════════════════════════════ */
function StepLabels({ active }: { active: number | null }) {
  return (
    <group>
      {STEPS.map((s, i) => {
        const [x, , z] = spos(i);
        const on = active === i;
        return (
          <group key={i} position={[x, -TR - 0.25, z]}>
            <Text position={[0, 0, 0]} fontSize={on ? 0.14 : 0.09} color={on ? s.color : "#aaa"} anchorX="center" anchorY="middle">{s.num}</Text>
            <Text position={[0, -0.13, 0]} fontSize={on ? 0.065 : 0.045} color={on ? "#444" : "#bbb"} anchorX="center" anchorY="middle">{s.title}</Text>
          </group>
        );
      })}
    </group>
  );
}

/* ═══════════════════════════════════════
   CORE
   ═══════════════════════════════════════ */
function Core() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.06; });
  return (
    <group>
      <group ref={ref}>
        <Float speed={1} rotationIntensity={0.08} floatIntensity={0.1}>
          <mesh><dodecahedronGeometry args={[0.55, 0]} /><meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={1.2} wireframe transparent opacity={0.45} /></mesh>
          <mesh><dodecahedronGeometry args={[0.32, 0]} /><meshBasicMaterial color={TEAL} transparent opacity={0.08} /></mesh>
          <mesh><sphereGeometry args={[0.18, 12, 12]} /><meshBasicMaterial color="#fff" transparent opacity={0.06} /></mesh>
        </Float>
      </group>
      <mesh><sphereGeometry args={[0.9, 16, 16]} /><meshBasicMaterial color={TEAL} transparent opacity={0.03} /></mesh>
      <pointLight intensity={2.5} color={TEAL} distance={7} />
    </group>
  );
}

/* ═══════════════════════════════════════
   HOLOGRAPHIC SCENES — always visible
   ═══════════════════════════════════════ */
const SKIN = ["#8d5524", "#c68642", "#e0ac69", "#6b3a1f", "#c68642"];
const SHRT = [TEAL, TEAL_L, ORANGE, NAVY_L, COPPER];

function Fig({ x, z, si, ci, h = 0.14 }: { x: number; z: number; si: number; ci: number; h?: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h + 0.03, 0]}><sphereGeometry args={[0.02, 7, 7]} /><meshStandardMaterial color={SKIN[si % 5]} roughness={0.7} /></mesh>
      <mesh position={[0, h / 2, 0]}><capsuleGeometry args={[0.016, h * 0.45, 3, 6]} /><meshStandardMaterial color={SHRT[ci % 5]} roughness={0.6} /></mesh>
      <mesh position={[0, 0.025, 0]}><capsuleGeometry args={[0.01, 0.03, 3, 5]} /><meshStandardMaterial color="#2a3040" roughness={0.8} /></mesh>
    </group>
  );
}

function H01() {
  const r = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (r.current) r.current.rotation.y = clock.elapsedTime * 0.12; });
  return (<group ref={r}>
    <mesh position={[0, 0.2, 0]}><torusGeometry args={[0.28, 0.03, 8, 20, Math.PI]} /><meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.5} roughness={0.3} metalness={0.4} /></mesh>
    <mesh position={[0, 0.2, 0]}><circleGeometry args={[0.24, 14, 0, Math.PI]} /><meshBasicMaterial color="#00e8aa" transparent opacity={0.12} side={THREE.DoubleSide} /></mesh>
    {[-0.4, -0.26, -0.13, 0.01].map((xo, i) => <Fig key={i} x={xo} z={i * 0.09 - 0.1} si={i} ci={i} h={0.12 + i * 0.015} />)}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}><boxGeometry args={[0.65, 0.12, 0.004]} /><meshStandardMaterial color="#888" roughness={0.9} /></mesh>
  </group>);
}

function H02() {
  return (<group>
    <mesh position={[0, 0.28, -0.16]}><boxGeometry args={[0.4, 0.24, 0.008]} /><meshStandardMaterial color="#e8e8e0" roughness={0.4} /></mesh>
    {[0.3, 0.26, 0.22].map((y, i) => <mesh key={i} position={[0, y, -0.155]}><boxGeometry args={[0.3 - i * 0.04, 0.005, 0.004]} /><meshStandardMaterial color={TEAL_L} roughness={0.5} /></mesh>)}
    <Fig x={0.14} z={-0.1} si={0} ci={3} h={0.16} />
    {[[-0.14, 0.06], [0, 0.06], [0.14, 0.06], [-0.07, 0.16], [0.07, 0.16]].map(([dx, dz], i) => (
      <group key={i} position={[dx!, 0, dz!]}>
        <mesh position={[0, 0.05, 0]}><boxGeometry args={[0.065, 0.004, 0.04]} /><meshStandardMaterial color="#8a7050" roughness={0.8} /></mesh>
        <Fig x={0} z={0.02} si={i + 1} ci={i} h={0.08} />
      </group>
    ))}
  </group>);
}

function H03() {
  const r = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (r.current) r.current.rotation.y = Math.sin(clock.elapsedTime * 0.25) * 0.15; });
  return (<group ref={r}>
    <mesh position={[0, 0.015, 0]}><cylinderGeometry args={[0.28, 0.32, 0.03, 24]} /><meshStandardMaterial color="#8a7050" roughness={0.7} /></mesh>
    <group position={[0, 0.03, 0]}>
      <mesh position={[0, 0.21, 0]}><boxGeometry args={[0.05, 0.004, 0.05]} /><meshStandardMaterial color="#1a1a2a" /></mesh>
      <mesh position={[0, 0.18, 0]}><sphereGeometry args={[0.024, 8, 8]} /><meshStandardMaterial color="#8d5524" roughness={0.7} /></mesh>
      <mesh position={[0, 0.08, 0]}><capsuleGeometry args={[0.022, 0.11, 4, 7]} /><meshStandardMaterial color="#1a1a3a" roughness={0.5} /></mesh>
      <mesh position={[0.05, 0.12, 0.015]} rotation={[0, 0, -0.3]}><boxGeometry args={[0.065, 0.048, 0.002]} /><meshStandardMaterial color="#f5f0e8" roughness={0.4} /></mesh>
      <mesh position={[0.05, 0.125, 0.017]} rotation={[0, 0, -0.3]}><boxGeometry args={[0.025, 0.004, 0.002]} /><meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.4} /></mesh>
    </group>
    {[-0.16, -0.06, 0.06, 0.16].map((x, i) => <group key={i} position={[x, 0.03, 0.2]}>
      <mesh position={[0, 0.06, 0]}><sphereGeometry args={[0.014, 5, 5]} /><meshStandardMaterial color="#555" /></mesh>
      <mesh position={[0, 0.03, 0]}><capsuleGeometry args={[0.01, 0.03, 3, 5]} /><meshStandardMaterial color="#444" /></mesh>
    </group>)}
  </group>);
}

function H04() {
  return (<group>
    <mesh position={[0, 0.065, 0]}><boxGeometry args={[0.28, 0.006, 0.16]} /><meshStandardMaterial color="#6a5035" roughness={0.7} /></mesh>
    {[[-0.12, -0.06], [0.12, -0.06], [-0.12, 0.06], [0.12, 0.06]].map(([x, z], i) => <mesh key={i} position={[x!, 0.032, z!]}><boxGeometry args={[0.006, 0.065, 0.006]} /><meshStandardMaterial color="#555" /></mesh>)}
    <Fig x={-0.11} z={-0.06} si={1} ci={3} h={0.15} />
    <Fig x={0.11} z={-0.06} si={0} ci={0} h={0.14} />
    <mesh position={[0, 0.115, -0.03]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.007, 0.05, 3, 5]} /><meshStandardMaterial color="#c68642" roughness={0.7} /></mesh>
    <mesh position={[0, 0.072, 0.015]}><boxGeometry args={[0.048, 0.002, 0.065]} /><meshStandardMaterial color="#f5f0e8" roughness={0.4} /></mesh>
  </group>);
}

function H05() {
  const r = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (r.current) r.current.rotation.y = Math.sin(clock.elapsedTime * 0.18) * 0.12; });
  const bars = [0.05, 0.08, 0.1, 0.14, 0.18, 0.24, 0.3];
  const op = 0.12;
  return (<group ref={r}>
    <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}><boxGeometry args={[0.4, 0.008, 0.004]} /><meshStandardMaterial color="#666" /></mesh>
    <mesh position={[-0.19, 0.16, 0]}><boxGeometry args={[0.004, 0.32, 0.008]} /><meshStandardMaterial color="#666" /></mesh>
    {bars.map((h, i) => <mesh key={i} position={[-0.14 + i * 0.052, h / 2, 0]}><boxGeometry args={[0.032, h, 0.032]} /><meshStandardMaterial color={h > op ? ORANGE : TEAL_L} emissive={h > op ? ORANGE : TEAL_L} emissiveIntensity={h > op ? 0.25 : 0.08} roughness={0.4} /></mesh>)}
    <mesh position={[0, op, 0.015]}><boxGeometry args={[0.4, 0.002, 0.002]} /><meshBasicMaterial color="#ff4444" transparent opacity={0.5} /></mesh>
    <Text position={[0.17, op + 0.015, 0.015]} fontSize={0.014} color="#ff6666" anchorX="left">Op Cost</Text>
  </group>);
}

function H06() {
  const ch = [
    { l: "Services", p: "30%", c: TEAL, x: -0.4, h: 0.24 },
    { l: "Access", p: "20%", c: TEAL_L, x: -0.13, h: 0.2 },
    { l: "Expansion", p: "30%", c: ORANGE, x: 0.13, h: 0.28 },
    { l: "Reserves", p: "20%", c: NAVY, x: 0.4, h: 0.16 },
  ];
  return (<group>
    <mesh position={[0, -0.04, 0]}><cylinderGeometry args={[0.032, 0.032, 0.12, 7]} /><meshStandardMaterial color={ORANGE_W} emissive={ORANGE_W} emissiveIntensity={0.25} roughness={0.4} /></mesh>
    <mesh position={[0, 0.03, 0]}><sphereGeometry args={[0.04, 10, 10]} /><meshStandardMaterial color={ORANGE_W} emissive={ORANGE_W} emissiveIntensity={0.35} roughness={0.3} metalness={0.3} /></mesh>
    {ch.map((c, i) => <group key={i}>
      <mesh position={[c.x * 0.45, 0.03 + c.h / 2, 0]} rotation={[0, 0, -c.x * 0.4]}><cylinderGeometry args={[0.01, 0.012, c.h, 5]} /><meshStandardMaterial color={c.c} emissive={c.c} emissiveIntensity={0.15} roughness={0.5} /></mesh>
      <mesh position={[c.x, 0.03 + c.h, 0]}><cylinderGeometry args={[0.032, 0.024, 0.048, 7]} /><meshStandardMaterial color={c.c} emissive={c.c} emissiveIntensity={0.15} roughness={0.4} metalness={0.2} /></mesh>
      <Text position={[c.x, 0.03 + c.h + 0.05, 0]} fontSize={0.015} color={c.c} anchorX="center">{c.p}</Text>
      <Text position={[c.x, 0.03 + c.h + 0.035, 0]} fontSize={0.01} color="#888" anchorX="center">{c.l}</Text>
    </group>)}
  </group>);
}

function H07() {
  const r = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (r.current) r.current.rotation.y = clock.elapsedTime * 0.18; });
  return (<group ref={r}>
    <mesh><torusGeometry args={[0.16, 0.024, 10, 24]} /><meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.45} roughness={0.3} metalness={0.4} /></mesh>
    {[0.26, 0.34, 0.4].map((rv, i) => <mesh key={i} rotation={[Math.PI / 2, 0, (i + 1) * 0.3]}>
      <torusGeometry args={[rv, 0.012 - i * 0.002, 7, 20]} />
      <meshStandardMaterial color={[TEAL_L, ORANGE, NAVY][i]} emissive={[TEAL_L, ORANGE, NAVY][i]} emissiveIntensity={0.25 - i * 0.06} roughness={0.4} transparent opacity={0.65 - i * 0.12} />
    </mesh>)}
    <mesh><sphereGeometry args={[0.05, 10, 10]} /><meshBasicMaterial color={TEAL_P} transparent opacity={0.12} /></mesh>
  </group>);
}

const HOLOS = [H01, H02, H03, H04, H05, H06, H07];

/* ═══════════════════════════════════════
   HOLOGRAM CONTAINER — always visible
   ═══════════════════════════════════════ */
function HoloPod({ index, active }: { index: number; active: boolean }) {
  const [x, , z] = spos(index);
  const s = STEPS[index];
  const ref = useRef<THREE.Group>(null!);
  const H = HOLOS[index];

  useFrame(() => {
    if (!ref.current) return;
    const ts = active ? 1.4 : 0.85;
    const cs = ref.current.scale.x;
    ref.current.scale.setScalar(cs + (ts - cs) * 0.04);
  });

  return (
    <group position={[x, TR + 0.6, z]}>
      <group ref={ref}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
          <circleGeometry args={[0.35, 20]} />
          <meshBasicMaterial color={s.glow} transparent opacity={active ? 0.06 : 0.02} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.004, 0.06, 0.65, 5]} />
          <meshBasicMaterial color={s.glow} transparent opacity={active ? 0.08 : 0.02} />
        </mesh>
        <H />
        {active && <pointLight intensity={0.8} color={s.glow} distance={2.5} />}
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════
   BACKGROUND — architectural drawing
   ═══════════════════════════════════════ */
function Bg() {
  return (
    <group>
      <SkyGrad />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <circleGeometry args={[22, 48]} />
        <meshStandardMaterial color={BG_D} roughness={0.95} />
      </mesh>
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.99, 0]}>
          <ringGeometry args={[(i + 1) * 1.5 - 0.006, (i + 1) * 1.5 + 0.006, 64]} />
          <meshBasicMaterial color={LINE} transparent opacity={0.04 - i * 0.002} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <mesh key={i} position={[Math.cos(a) * 10, -1.99, Math.sin(a) * 10]} rotation={[-Math.PI / 2, 0, -a + Math.PI / 2]}>
          <boxGeometry args={[0.004, 20, 0.002]} /><meshBasicMaterial color={LINE} transparent opacity={0.02} side={THREE.DoubleSide} />
        </mesh>;
      })}
    </group>
  );
}

function SkyGrad() {
  const ref = useRef<THREE.Mesh>(null!);
  useEffect(() => {
    if (!ref.current) return;
    const geo = ref.current.geometry;
    const p = geo.getAttribute("position");
    const c = new Float32Array(p.count * 3);
    const lo = new THREE.Color(BG_D), mid = new THREE.Color("#d0ccc0"), hi = new THREE.Color("#b8c8d8");
    for (let i = 0; i < p.count; i++) {
      const t = (p.getY(i) / 25 + 1) / 2;
      const col = new THREE.Color();
      t < 0.4 ? col.lerpColors(lo, mid, t / 0.4) : col.lerpColors(mid, hi, (t - 0.4) / 0.6);
      c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(c, 3));
  }, []);
  return <mesh ref={ref}><sphereGeometry args={[25, 28, 20]} /><meshBasicMaterial vertexColors side={THREE.BackSide} /></mesh>;
}

/* ═══════════════════════════════════════
   CAMERA — zoomed out to show full torus
   ═══════════════════════════════════════ */
function Cam({ active }: { active: number | null }) {
  const { camera } = useThree();
  const tgt = useRef(new THREE.Vector3(0, 8, 12));

  useEffect(() => {
    if (active !== null) {
      const a = ang(active);
      const [x, , z] = spos(active);
      tgt.current.set(x + Math.cos(a) * 3.5, 4, z + Math.sin(a) * 3.5);
    } else {
      tgt.current.set(0, 8, 12);
    }
  }, [active]);

  useFrame(() => { camera.position.lerp(tgt.current, 0.025); camera.lookAt(0, 0, 0); });
  return null;
}

/* ═══════════════════════════════════════
   3D SCENE
   ═══════════════════════════════════════ */
function Scene({ active, onSelect }: { active: number | null; onSelect: (i: number) => void }) {
  return (
    <>
      <Environment preset="studio" background={false} environmentIntensity={0.35} />
      <fogExp2 attach="fog" args={[BG_D, 0.015]} />
      <ambientLight intensity={0.45} color="#c8c0b8" />
      <directionalLight position={[10, 16, 8]} intensity={0.9} color="#f8f0e0" />
      <directionalLight position={[-6, 10, -4]} intensity={0.25} color="#c0d0e0" />
      <hemisphereLight color="#d0d8e0" groundColor="#c8c0a8" intensity={0.25} />

      <Cam active={active} />
      <OrbitControls enableZoom enablePan={false} minDistance={8} maxDistance={22} enableDamping dampingFactor={0.05} maxPolarAngle={Math.PI * 0.7} minPolarAngle={Math.PI * 0.1} target={[0, 0, 0]} />

      <Bg />
      <Torus active={active} onSelect={onSelect} />
      <Particles />
      <Arrows />
      <StepLabels active={active} />
      <Core />

      {STEPS.map((_, i) => <HoloPod key={i} index={i} active={active === i} />)}

      {STEPS.map((s, i) => {
        const [x, , z] = spos(i);
        return <pointLight key={i} position={[x, 1.5, z]} intensity={active === i ? 1.5 : 0.05} color={s.color} distance={3.5} />;
      })}

      <EffectComposer>
        <Bloom intensity={0.2} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur />
        <Vignette offset={0.2} darkness={0.35} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}

/* ═══════════════════════════════════════
   PAGE LAYOUT
   Sidebar | Canvas (top) + Scroll text (below)
   ═══════════════════════════════════════ */
export default function StellarEnginePage() {
  const [active, setActive] = useState<number | null>(null);
  const toggle = useCallback((i: number) => setActive(p => p === i ? null : i), []);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleSelect = useCallback((i: number) => {
    toggle(i);
    // Scroll to text section
    setTimeout(() => {
      sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 600);
  }, [toggle]);

  return (
    <div className="fixed inset-0 z-[9999] flex" style={{ backgroundColor: BG }}>
      {/* ── Sidebar ── */}
      <div className="w-52 lg:w-60 shrink-0 bg-white/80 backdrop-blur-md border-r border-[#d0c8b8] flex flex-col overflow-y-auto">
        <Link href="/" className="flex items-center gap-2 px-4 py-2.5 border-b border-[#d0c8b8] text-[#888] text-[10px] uppercase tracking-wider hover:bg-[#f0ebe0] transition-colors">
          <span>←</span> Back to Site
        </Link>
        <div className="p-4 border-b border-[#d0c8b8]">
          <p className="text-[#E07C3E] text-[8px] uppercase tracking-[0.5em] mb-1 font-semibold">System Architecture</p>
          <h1 className="text-base font-heading text-[#1B3A5C] leading-tight">The Stellar <span className="text-[#E07C3E]">Engine</span></h1>
          <p className="text-[#aaa] text-[9px] mt-1">Click to inspect. Drag to orbit. Scroll for details.</p>
        </div>
        <div className="flex-1 py-0.5">
          {STEPS.map((s, i) => (
            <button key={s.id} onClick={() => handleSelect(i)}
              className={`w-full text-left px-4 py-2.5 transition-all duration-300 border-l-2 ${active === i ? "bg-[#f0ebe0] border-l-current" : "border-l-transparent hover:bg-[#f8f5f0]"}`}
              style={{ borderColor: active === i ? s.color : "transparent" }}>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[10px] font-heading" style={{ color: active === i ? s.color : "#bbb" }}>{s.num}</span>
                <span className={`text-[10px] tracking-wider ${active === i ? "text-[#1B3A5C]" : "text-[#888]"}`}>{s.title}</span>
              </div>
              <p className="text-[#c0b8a8] text-[8px] mt-0.5">{s.sub}</p>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-[#d0c8b8] space-y-1.5">
          <Link href="/programs" className="block text-center px-3 py-1.5 bg-[#E07C3E] text-white text-[9px] uppercase tracking-wider font-semibold hover:bg-[#E8944F] transition-colors rounded-md">Explore Programs</Link>
          <Link href="/get-involved" className="block text-center px-3 py-1.5 border border-[#d0c8b8] text-[#888] text-[9px] uppercase tracking-wider hover:bg-[#f0ebe0] transition-colors rounded-md">Partner With Us</Link>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* 3D Canvas — top portion */}
        <div className="h-[65vh] min-h-[450px] shrink-0 relative">
          <Canvas camera={{ position: [0, 8, 12], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true, alpha: false }}
            onCreated={({ gl }) => { gl.setClearColor(new THREE.Color(BG)); gl.outputColorSpace = THREE.SRGBColorSpace; }}>
            <Scene active={active} onSelect={handleSelect} />
          </Canvas>
          {active !== null && (
            <button onClick={() => setActive(null)} className="absolute top-3 right-3 px-2.5 py-1 bg-white/80 border border-[#d0c8b8] rounded text-[#888] text-[9px] uppercase tracking-wider hover:bg-white transition-colors">
              Reset View
            </button>
          )}
        </div>

        {/* ── Scrollable text sections ── */}
        <div style={{ backgroundColor: BG }}>
          {/* Intro */}
          <div className="max-w-3xl mx-auto px-8 py-12 border-t border-[#d0c8b8]">
            <p className="text-[#E07C3E] text-[10px] uppercase tracking-[0.4em] mb-3 font-semibold">How It Works</p>
            <h2 className="text-2xl font-heading text-[#1B3A5C] leading-tight mb-4">The Closed-Loop System</h2>
            <p className="text-[#777] text-sm leading-relaxed">
              The Stellar Engine is a self-sustaining workforce development model where participant outcomes
              generate the revenue that funds the next cohort. It is not a program — it is infrastructure.
              Each step feeds the next. Surplus cycles back. The loop never opens.
            </p>
          </div>

          {/* Step sections */}
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              ref={el => { sectionRefs.current[i] = el; }}
              className={`border-t border-[#d0c8b8] ${i % 2 === 0 ? "bg-white/40" : ""}`}
            >
              <div className="max-w-3xl mx-auto px-8 py-10">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-xl font-heading" style={{ color: s.color }}>{s.num}</span>
                  <h3 className="text-lg font-heading text-[#1B3A5C] tracking-wider">{s.title}</h3>
                  <span className="text-[#c0b8a8] text-[10px] uppercase tracking-wider">— {s.sub}</span>
                </div>
                <p className="text-[#666] text-sm leading-relaxed mb-4">{s.long}</p>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 bg-white border border-[#d0c8b8] rounded text-[#888] text-[10px]">{t}</span>
                  ))}
                </div>
                <button
                  onClick={() => handleSelect(i)}
                  className="mt-4 text-[10px] uppercase tracking-wider font-semibold transition-colors hover:underline"
                  style={{ color: s.color }}
                >
                  View in Diagram ↑
                </button>
              </div>
            </div>
          ))}

          {/* Closing */}
          <div className="max-w-3xl mx-auto px-8 py-12 border-t border-[#d0c8b8]">
            <div className="border-l-4 border-[#E07C3E] pl-6">
              <p className="text-lg font-heading text-[#1B3A5C] leading-relaxed mb-3">
                The Stellar Engine does not ask why people are poor. It builds a system that makes
                the conditions of poverty economically unsustainable.
              </p>
              <p className="text-[#E07C3E] text-[10px] uppercase tracking-[0.2em] font-semibold">
                <a href="https://reginald-reed-site.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:underline">Reginald Reed Jr.</a> — Founder & Executive Director
              </p>
            </div>
            <div className="flex gap-3 mt-8">
              <Link href="/programs" className="px-6 py-3 bg-[#E07C3E] text-white text-[10px] uppercase tracking-wider font-semibold hover:bg-[#E8944F] transition-colors rounded-md">Explore Programs</Link>
              <Link href="/get-involved" className="px-6 py-3 border border-[#d0c8b8] text-[#888] text-[10px] uppercase tracking-wider hover:bg-[#f0ebe0] transition-colors rounded-md">Partner With Us</Link>
            </div>
          </div>

          <div className="py-6 text-center border-t border-[#d0c8b8]">
            <p className="text-[#d0c8b8] text-[9px] uppercase tracking-[0.5em]">The Mindful Group — Milwaukee, WI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
