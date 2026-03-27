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

   Full-color, architectural-drawing style.
   7 colored torus segments, cutaway reveals internal flow,
   holographic dioramas above each station.
   Sidebar + click navigation + orbit controls.
   ═══════════════════════════════════════════════════════════════ */

// Brand palette
const TEAL = "#1A7A5C";
const TEAL_LIGHT = "#22936F";
const TEAL_PALE = "#93B396";
const ORANGE = "#E07C3E";
const ORANGE_WARM = "#E8944F";
const NAVY = "#1B3A5C";
const NAVY_LIGHT = "#2A5580";
const COPPER = "#b87333";
const BG = "#f5f2ec";
const BG_DARK = "#e8e4dc";
const LINE = "#c0b8a8";

const RING_R = 6;
const TUBE_R = 0.7;
const N = 7;

// Step data
const STEPS = [
  { id: "recruit", num: "01", title: "RECRUIT", sub: "Intake Accelerator", color: TEAL, glow: "#00d4aa",
    desc: "Zero-tuition enrollment from underserved communities. Court & probation partnerships. Walk-in orientations every other Tuesday at 11:30 AM.",
    tags: ["Zero tuition", "Community outreach", "Court partnerships", "Walk-in orientations"] },
  { id: "train", num: "02", title: "TRAIN", sub: "Compression Chamber", color: TEAL_LIGHT, glow: "#00c896",
    desc: "Accelerated certification programs: CNA/CBRF, Construction, Phlebotomy. Industry-recognized credentials from day one.",
    tags: ["CNA/CBRF", "Construction", "Phlebotomy", "Career workshops"] },
  { id: "certify", num: "03", title: "CERTIFY", sub: "Ignition Core", color: ORANGE, glow: "#ff9050",
    desc: "90% graduation rate. State-recognized credentials — not participation certificates. Potential becomes power.",
    tags: ["State credentials", "90% grad rate", "Employer-validated", "Industry-standard"] },
  { id: "place", num: "04", title: "PLACE", sub: "Extraction Turbine", color: COPPER, glow: "#e0a060",
    desc: "The staffing arm places graduates with employers. 85% placement rate. Every hire generates workforce revenue.",
    tags: ["85% placement", "Staffing revenue", "Employer network", "Career tracking"] },
  { id: "surplus", num: "05", title: "SURPLUS", sub: "Thrust Output", color: ORANGE_WARM, glow: "#ffa040",
    desc: "Revenue exceeds operating costs. Not profit — thrust. The force that propels the system without grant dependency.",
    tags: ["Revenue > costs", "Grant-independent", "System fuel", "Revenue floor"] },
  { id: "reinvest", num: "06", title: "REINVEST", sub: "Return Manifold", color: NAVY_LIGHT, glow: "#4090d0",
    desc: "Surplus cycles back. 30% supportive services, 20% non-WIOA access, 30% expansion, 20% reserves.",
    tags: ["30% → Services", "20% → Access", "30% → Expansion", "20% → Reserves"] },
  { id: "scale", num: "07", title: "SCALE", sub: "Amplification Ring", color: NAVY, glow: "#3070b0",
    desc: "Cost per participant decreases. Surplus per cycle increases. More powerful at volume. Proven in Milwaukee's 53206.",
    tags: ["Lower unit cost", "Growing surplus", "Replication-ready", "Proven in 53206"] },
];

function angle(i: number) { return (i / N) * Math.PI * 2 - Math.PI / 2; }
function pos(i: number): [number, number, number] {
  const a = angle(i);
  return [Math.cos(a) * RING_R, 0, Math.sin(a) * RING_R];
}

/* ═══════════════════════════════════════
   TORUS SEGMENTS
   ═══════════════════════════════════════ */
function Segments({ active }: { active: number | null }) {
  return (
    <group>
      {STEPS.map((s, i) => {
        const gap = 0.04;
        const arc = (Math.PI * 2) / N - gap * 2;
        const start = angle(i) - arc / 2;
        const isActive = active === i;
        const showArc = isActive ? arc * 0.6 : arc;
        return (
          <group key={s.id}>
            <mesh rotation={[0, -start, 0]}>
              <torusGeometry args={[RING_R, TUBE_R, 24, 40, showArc]} />
              <meshStandardMaterial
                color={s.color}
                emissive={s.color}
                emissiveIntensity={isActive ? 0.35 : 0.06}
                roughness={0.4}
                metalness={0.15}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Cutaway internals */}
            {isActive && (
              <group rotation={[0, -start, 0]}>
                <mesh>
                  <torusGeometry args={[RING_R, TUBE_R * 0.38, 16, 40, showArc]} />
                  <meshStandardMaterial color="#0d1e30" emissive={s.glow} emissiveIntensity={0.12} roughness={0.5} metalness={0.3} side={THREE.DoubleSide} />
                </mesh>
                <mesh>
                  <torusGeometry args={[RING_R, TUBE_R * 0.14, 10, 40, showArc]} />
                  <meshBasicMaterial color={s.glow} transparent opacity={0.3} side={THREE.DoubleSide} />
                </mesh>
                <CutDisc a={start + showArc} color={s.color} glow={s.glow} />
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}

function CutDisc({ a, color, glow }: { a: number; color: string; glow: string }) {
  const x = Math.cos(-a) * RING_R, z = Math.sin(-a) * RING_R;
  return (
    <group position={[x, 0, z]} rotation={[0, -a + Math.PI / 2, 0]}>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[TUBE_R * 0.38, TUBE_R, 32]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[TUBE_R * 0.14, TUBE_R * 0.38, 32]} />
        <meshStandardMaterial color="#0d1e30" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[TUBE_R * 0.14, 24]} />
        <meshBasicMaterial color={glow} transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════
   FLOW PARTICLES
   ═══════════════════════════════════════ */
function Particles() {
  const count = 350;
  const ref = useRef<THREE.InstancedMesh>(null!);
  const o = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => Array.from({ length: count }, (_, i) => ({
    a: (i / count) * Math.PI * 2,
    sp: 0.1 + Math.random() * 0.06,
    ta: Math.random() * Math.PI * 2,
    tr: Math.random() * TUBE_R * 0.3,
    sz: 0.012 + Math.random() * 0.018,
  })), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    data.forEach((p, i) => {
      const a = p.a + t * p.sp;
      const cx = Math.cos(a) * RING_R, cz = Math.sin(a) * RING_R;
      const ox = Math.cos(p.ta) * p.tr, oy = Math.sin(p.ta) * p.tr;
      const nx = -Math.sin(a), nz = Math.cos(a);
      o.position.set(cx + nx * ox, oy, cz + nz * ox);
      o.scale.setScalar(p.sz * (0.8 + Math.sin(t * 2 + p.a * 3) * 0.2));
      o.updateMatrix();
      ref.current.setMatrixAt(i, o.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={TEAL_PALE} transparent opacity={0.4} />
    </instancedMesh>
  );
}

/* ═══════════════════════════════════════
   FLOW ARROWS
   ═══════════════════════════════════════ */
function Arrows() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.children.forEach((c, i) => {
      ((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.18 + Math.sin(clock.elapsedTime * 1.5 + i * 0.5) * 0.1;
    });
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * RING_R, TUBE_R + 0.05, Math.sin(a) * RING_R]} rotation={[Math.PI / 2, 0, -(a + Math.PI / 2)]}>
            <coneGeometry args={[0.05, 0.12, 3]} />
            <meshBasicMaterial color={ORANGE} transparent opacity={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ═══════════════════════════════════════
   LABELS
   ═══════════════════════════════════════ */
function Labels({ active }: { active: number | null }) {
  return (
    <group>
      {STEPS.map((s, i) => {
        const [x, , z] = pos(i);
        const on = active === i;
        return (
          <group key={i} position={[x, -TUBE_R - 0.3, z]}>
            <Text position={[0, 0, 0]} fontSize={on ? 0.15 : 0.1} color={on ? s.color : "#aaa"} anchorX="center" anchorY="middle">
              {s.num}
            </Text>
            <Text position={[0, -0.14, 0]} fontSize={on ? 0.07 : 0.05} color={on ? "#444" : "#bbb"} anchorX="center" anchorY="middle">
              {s.title}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

/* ═══════════════════════════════════════
   CENTRAL CORE
   ═══════════════════════════════════════ */
function Core() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.08; });
  return (
    <group>
      <group ref={ref}>
        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.15}>
          <mesh>
            <dodecahedronGeometry args={[0.7, 0]} />
            <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={1.5} wireframe transparent opacity={0.5} />
          </mesh>
          <mesh>
            <dodecahedronGeometry args={[0.4, 0]} />
            <meshBasicMaterial color={TEAL} transparent opacity={0.1} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshBasicMaterial color="#f0ede8" transparent opacity={0.08} />
          </mesh>
        </Float>
      </group>
      <mesh>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.04} />
      </mesh>
      <pointLight intensity={3} color={TEAL} distance={8} />
    </group>
  );
}

/* ═══════════════════════════════════════
   HOLOGRAM CONTAINER
   ═══════════════════════════════════════ */
function HoloWrap({ index, active, children }: { index: number; active: boolean; children: React.ReactNode }) {
  const [x, , z] = pos(index);
  const s = STEPS[index];
  const ref = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (!ref.current) return;
    const ty = active ? 2.2 : 1.5;
    const ts = active ? 1.5 : 0.7;
    ref.current.position.y += (ty - ref.current.position.y) * 0.04;
    const cs = ref.current.scale.x;
    ref.current.scale.setScalar(cs + (ts - cs) * 0.04);
  });

  return (
    <group position={[x, 1.5, z]}>
      <group ref={ref}>
        {/* Pedestal disc */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <circleGeometry args={[0.45, 24]} />
          <meshBasicMaterial color={s.glow} transparent opacity={active ? 0.06 : 0.02} side={THREE.DoubleSide} />
        </mesh>
        {/* Projection beam */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.005, 0.08, 1, 6]} />
          <meshBasicMaterial color={s.glow} transparent opacity={active ? 0.1 : 0.02} />
        </mesh>
        {children}
        {active && <pointLight intensity={1} color={s.glow} distance={3} />}
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════
   7 HOLOGRAPHIC SCENES
   ═══════════════════════════════════════ */

// Skin + shirt helpers
const SKIN = ["#8d5524", "#c68642", "#e0ac69", "#6b3a1f", "#c68642"];
const SHIRTS = [TEAL, TEAL_LIGHT, ORANGE, NAVY_LIGHT, COPPER];

function Person({ x, z, skinI, shirtI, h = 0.17 }: { x: number; z: number; skinI: number; shirtI: number; h?: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h + 0.04, 0]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color={SKIN[skinI % 5]} roughness={0.7} /></mesh>
      <mesh position={[0, h / 2 + 0.01, 0]}><capsuleGeometry args={[0.02, h * 0.5, 4, 8]} /><meshStandardMaterial color={SHIRTS[shirtI % 5]} roughness={0.6} /></mesh>
      <mesh position={[0, 0.03, 0]}><capsuleGeometry args={[0.012, 0.04, 4, 6]} /><meshStandardMaterial color="#2a3040" roughness={0.8} /></mesh>
    </group>
  );
}

/* 01 — People entering a portal */
function Holo01() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.15; });
  return (
    <group ref={ref}>
      {/* Portal arch */}
      <mesh position={[0, 0.25, 0]}>
        <torusGeometry args={[0.35, 0.04, 8, 24, Math.PI]} />
        <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.6} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <circleGeometry args={[0.3, 16, 0, Math.PI]} />
        <meshBasicMaterial color="#00e8aa" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      {/* Queue of people */}
      {[-0.5, -0.32, -0.16, 0.02].map((xo, i) => (
        <Person key={i} x={xo} z={i * 0.12 - 0.15} skinI={i} shirtI={i} h={0.15 + i * 0.02} />
      ))}
      {/* Path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <boxGeometry args={[0.8, 0.15, 0.005]} />
        <meshStandardMaterial color="#888" roughness={0.9} />
      </mesh>
    </group>
  );
}

/* 02 — Classroom */
function Holo02() {
  return (
    <group>
      {/* Whiteboard */}
      <mesh position={[0, 0.35, -0.2]}>
        <boxGeometry args={[0.5, 0.3, 0.01]} />
        <meshStandardMaterial color="#e8e8e0" roughness={0.4} />
      </mesh>
      {[0.38, 0.34, 0.30].map((y, i) => (
        <mesh key={i} position={[0, y, -0.19]}>
          <boxGeometry args={[0.35 - i * 0.05, 0.006, 0.005]} />
          <meshStandardMaterial color={TEAL_LIGHT} roughness={0.5} />
        </mesh>
      ))}
      {/* Instructor */}
      <Person x={0.18} z={-0.12} skinI={0} shirtI={3} h={0.2} />
      {/* Students at desks */}
      {[[-0.18, 0.08], [0, 0.08], [0.18, 0.08], [-0.1, 0.2], [0.08, 0.2]].map(([dx, dz], i) => (
        <group key={i} position={[dx!, 0, dz!]}>
          <mesh position={[0, 0.06, 0]}><boxGeometry args={[0.08, 0.005, 0.05]} /><meshStandardMaterial color="#8a7050" roughness={0.8} /></mesh>
          <mesh position={[0, 0.03, 0]}><boxGeometry args={[0.005, 0.06, 0.005]} /><meshStandardMaterial color="#666" roughness={0.8} /></mesh>
          <Person x={0} z={0.025} skinI={i + 1} shirtI={i} h={0.1} />
        </group>
      ))}
    </group>
  );
}

/* 03 — Graduate with certificate */
function Holo03() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.2; });
  return (
    <group ref={ref}>
      {/* Stage */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.04, 32]} />
        <meshStandardMaterial color="#8a7050" roughness={0.7} />
      </mesh>
      {/* Graduate */}
      <group position={[0, 0.04, 0]}>
        <mesh position={[0, 0.26, 0]}><boxGeometry args={[0.06, 0.005, 0.06]} /><meshStandardMaterial color="#1a1a2a" roughness={0.5} /></mesh>
        <mesh position={[0, 0.245, 0]}><cylinderGeometry args={[0.02, 0.02, 0.02, 8]} /><meshStandardMaterial color="#1a1a2a" roughness={0.5} /></mesh>
        <mesh position={[0, 0.22, 0]}><sphereGeometry args={[0.03, 10, 10]} /><meshStandardMaterial color="#8d5524" roughness={0.7} /></mesh>
        <mesh position={[0, 0.1, 0]}><capsuleGeometry args={[0.028, 0.14, 4, 8]} /><meshStandardMaterial color="#1a1a3a" roughness={0.5} /></mesh>
        {/* Certificate */}
        <mesh position={[0.06, 0.15, 0.02]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.08, 0.06, 0.002]} />
          <meshStandardMaterial color="#f5f0e8" roughness={0.4} />
        </mesh>
        <mesh position={[0.06, 0.155, 0.022]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.03, 0.005, 0.002]} />
          <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.5} roughness={0.4} />
        </mesh>
      </group>
      {/* Audience */}
      {[-0.2, -0.08, 0.08, 0.2].map((x, i) => (
        <group key={i} position={[x, 0.04, 0.25]}>
          <mesh position={[0, 0.08, 0]}><sphereGeometry args={[0.018, 6, 6]} /><meshStandardMaterial color="#555" roughness={0.8} /></mesh>
          <mesh position={[0, 0.04, 0]}><capsuleGeometry args={[0.012, 0.04, 4, 6]} /><meshStandardMaterial color="#444" roughness={0.8} /></mesh>
        </group>
      ))}
    </group>
  );
}

/* 04 — Handshake / Job placement */
function Holo04() {
  return (
    <group>
      {/* Desk */}
      <mesh position={[0, 0.08, 0]}><boxGeometry args={[0.35, 0.008, 0.2]} /><meshStandardMaterial color="#6a5035" roughness={0.7} /></mesh>
      {[[-0.16, -0.08], [0.16, -0.08], [-0.16, 0.08], [0.16, 0.08]].map(([x, z], i) => (
        <mesh key={i} position={[x!, 0.04, z!]}><boxGeometry args={[0.008, 0.08, 0.008]} /><meshStandardMaterial color="#555" roughness={0.8} /></mesh>
      ))}
      {/* Employer + Graduate */}
      <Person x={-0.14} z={-0.08} skinI={1} shirtI={3} h={0.18} />
      <Person x={0.14} z={-0.08} skinI={0} shirtI={0} h={0.17} />
      {/* Handshake */}
      <mesh position={[0, 0.14, -0.04]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.008, 0.06, 4, 6]} />
        <meshStandardMaterial color="#c68642" roughness={0.7} />
      </mesh>
      {/* Contract */}
      <mesh position={[0, 0.088, 0.02]}><boxGeometry args={[0.06, 0.002, 0.08]} /><meshStandardMaterial color="#f5f0e8" roughness={0.4} /></mesh>
    </group>
  );
}

/* 05 — Revenue chart */
function Holo05() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.2) * 0.15; });
  const bars = [0.06, 0.1, 0.12, 0.18, 0.22, 0.3, 0.38];
  const opLine = 0.15;
  return (
    <group ref={ref}>
      {/* Axes */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}><boxGeometry args={[0.5, 0.01, 0.005]} /><meshStandardMaterial color="#666" roughness={0.8} /></mesh>
      <mesh position={[-0.24, 0.2, 0]}><boxGeometry args={[0.005, 0.4, 0.01]} /><meshStandardMaterial color="#666" roughness={0.8} /></mesh>
      {/* Bars */}
      {bars.map((h, i) => (
        <mesh key={i} position={[-0.18 + i * 0.065, h / 2, 0]}>
          <boxGeometry args={[0.04, h, 0.04]} />
          <meshStandardMaterial color={h > opLine ? ORANGE : TEAL_LIGHT} emissive={h > opLine ? ORANGE : TEAL_LIGHT} emissiveIntensity={h > opLine ? 0.3 : 0.1} roughness={0.4} />
        </mesh>
      ))}
      {/* Op cost line */}
      <mesh position={[0, opLine, 0.02]}><boxGeometry args={[0.5, 0.003, 0.002]} /><meshBasicMaterial color="#ff4444" transparent opacity={0.6} /></mesh>
      <Text position={[0.22, opLine + 0.02, 0.02]} fontSize={0.018} color="#ff6666" anchorX="left">Op Cost</Text>
      <Text position={[0.22, 0.35, 0.02]} fontSize={0.018} color={ORANGE} anchorX="left">Revenue</Text>
    </group>
  );
}

/* 06 — Reinvest splitter */
function Holo06() {
  const ch = [
    { label: "Services", pct: "30%", color: TEAL, x: -0.5, h: 0.3 },
    { label: "Access", pct: "20%", color: TEAL_LIGHT, x: -0.17, h: 0.25 },
    { label: "Expansion", pct: "30%", color: ORANGE, x: 0.17, h: 0.35 },
    { label: "Reserves", pct: "20%", color: NAVY, x: 0.5, h: 0.2 },
  ];
  return (
    <group>
      <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.04, 0.04, 0.15, 8]} /><meshStandardMaterial color={ORANGE_WARM} emissive={ORANGE_WARM} emissiveIntensity={0.3} roughness={0.4} /></mesh>
      <mesh position={[0, 0.04, 0]}><sphereGeometry args={[0.05, 12, 12]} /><meshStandardMaterial color={ORANGE_WARM} emissive={ORANGE_WARM} emissiveIntensity={0.4} roughness={0.3} metalness={0.3} /></mesh>
      {ch.map((c, i) => (
        <group key={i}>
          <mesh position={[c.x * 0.5, 0.04 + c.h / 2, 0]} rotation={[0, 0, -c.x * 0.5]}>
            <cylinderGeometry args={[0.012, 0.015, c.h, 6]} />
            <meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={0.2} roughness={0.5} />
          </mesh>
          <mesh position={[c.x, 0.04 + c.h, 0]}>
            <cylinderGeometry args={[0.04, 0.03, 0.06, 8]} />
            <meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={0.2} roughness={0.4} metalness={0.2} />
          </mesh>
          <Text position={[c.x, 0.04 + c.h + 0.06, 0]} fontSize={0.018} color={c.color} anchorX="center">{c.pct}</Text>
          <Text position={[c.x, 0.04 + c.h + 0.04, 0]} fontSize={0.012} color="#888" anchorX="center">{c.label}</Text>
        </group>
      ))}
    </group>
  );
}

/* 07 — Replicating rings */
function Holo07() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.2; });
  return (
    <group ref={ref}>
      <mesh><torusGeometry args={[0.2, 0.03, 12, 32]} /><meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.5} roughness={0.3} metalness={0.4} /></mesh>
      {[0.32, 0.42, 0.5].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i + 1) * 0.3]}>
          <torusGeometry args={[r, 0.015 - i * 0.003, 8, 24]} />
          <meshStandardMaterial color={[TEAL_LIGHT, ORANGE, NAVY][i]} emissive={[TEAL_LIGHT, ORANGE, NAVY][i]} emissiveIntensity={0.3 - i * 0.08} roughness={0.4} transparent opacity={0.7 - i * 0.15} />
        </mesh>
      ))}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 0.26, 0, Math.sin(a) * 0.26]} rotation={[0, 0, a]}>
          <boxGeometry args={[0.003, 0.12, 0.003]} />
          <meshBasicMaterial color={TEAL_PALE} transparent opacity={0.25} />
        </mesh>
      ))}
      <mesh><sphereGeometry args={[0.06, 12, 12]} /><meshBasicMaterial color={TEAL_PALE} transparent opacity={0.15} /></mesh>
    </group>
  );
}

const HOLOS = [Holo01, Holo02, Holo03, Holo04, Holo05, Holo06, Holo07];

/* ═══════════════════════════════════════
   ARCHITECTURAL BACKGROUND
   ═══════════════════════════════════════ */
function Background() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.003; });
  return (
    <group ref={ref}>
      <Sky />
      {/* Ground */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
        <circleGeometry args={[25, 64]} />
        <meshStandardMaterial color={BG_DARK} roughness={0.95} />
      </mesh>
      {/* Concentric grid */}
      {Array.from({ length: 18 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.49, 0]}>
          <ringGeometry args={[(i + 1) * 1.5 - 0.008, (i + 1) * 1.5 + 0.008, 80]} />
          <meshBasicMaterial color={LINE} transparent opacity={0.05 - i * 0.002} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Radial lines */}
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 12, -2.49, Math.sin(a) * 12]} rotation={[-Math.PI / 2, 0, -a + Math.PI / 2]}>
            <boxGeometry args={[0.005, 24, 0.003]} />
            <meshBasicMaterial color={LINE} transparent opacity={0.025} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      {/* Subtle floating shapes */}
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const colors = [TEAL, NAVY, ORANGE];
        return (
          <Float key={i} speed={0.3 + (i % 3) * 0.2} floatIntensity={0.2}>
            <mesh position={[Math.cos(a) * (14 + (i % 3) * 2), -1 + (i % 4) * 1.5, Math.sin(a) * (14 + (i % 3) * 2)]}>
              <octahedronGeometry args={[0.15 + (i % 3) * 0.08, 0]} />
              <meshStandardMaterial color={colors[i % 3]} transparent opacity={0.04} roughness={0.6} />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

function Sky() {
  const ref = useRef<THREE.Mesh>(null!);
  useEffect(() => {
    if (!ref.current) return;
    const geo = ref.current.geometry;
    const p = geo.getAttribute("position");
    const c = new Float32Array(p.count * 3);
    const lo = new THREE.Color(BG_DARK);
    const mid = new THREE.Color("#d0ccc0");
    const hi = new THREE.Color("#b8c8d8");
    for (let i = 0; i < p.count; i++) {
      const t = (p.getY(i) / 30 + 1) / 2;
      const col = new THREE.Color();
      if (t < 0.4) col.lerpColors(lo, mid, t / 0.4);
      else col.lerpColors(mid, hi, (t - 0.4) / 0.6);
      c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(c, 3));
  }, []);
  return <mesh ref={ref}><sphereGeometry args={[30, 32, 24]} /><meshBasicMaterial vertexColors side={THREE.BackSide} /></mesh>;
}

/* ═══════════════════════════════════════
   CAMERA
   ═══════════════════════════════════════ */
function Cam({ active }: { active: number | null }) {
  const { camera } = useThree();
  const tgt = useRef(new THREE.Vector3(5, 4, 9));

  useEffect(() => {
    if (active !== null) {
      const a = angle(active);
      const [x, , z] = pos(active);
      tgt.current.set(x + Math.cos(a) * 4.5, 2.5, z + Math.sin(a) * 4.5);
    } else {
      tgt.current.set(5, 4, 9);
    }
  }, [active]);

  useFrame(() => { camera.position.lerp(tgt.current, 0.025); });
  return null;
}

/* ═══════════════════════════════════════
   SCENE
   ═══════════════════════════════════════ */
function Scene({ active, onClick }: { active: number | null; onClick: (i: number) => void }) {
  return (
    <>
      <Environment preset="studio" background={false} environmentIntensity={0.4} />
      <fogExp2 attach="fog" args={[BG_DARK, 0.018]} />

      <ambientLight intensity={0.5} color="#c8c0b8" />
      <directionalLight position={[12, 18, 8]} intensity={1.0} color="#f8f0e0" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <directionalLight position={[-8, 12, -5]} intensity={0.3} color="#c0d0e0" />
      <hemisphereLight color="#d0d8e0" groundColor="#c8c0a8" intensity={0.3} />

      <Cam active={active} />
      <OrbitControls enableZoom enablePan={false} minDistance={5} maxDistance={20} enableDamping dampingFactor={0.05} maxPolarAngle={Math.PI * 0.75} minPolarAngle={Math.PI * 0.15} />

      <Background />
      <Segments active={active} />
      <Particles />
      <Arrows />
      <Labels active={active} />
      <Core />

      {HOLOS.map((H, i) => (
        <HoloWrap key={i} index={i} active={active === i}><H /></HoloWrap>
      ))}

      {STEPS.map((s, i) => {
        const [x, , z] = pos(i);
        return <pointLight key={i} position={[x, 2, z]} intensity={active === i ? 2 : 0.08} color={s.color} distance={4} />;
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
   PAGE
   ═══════════════════════════════════════ */
export default function StellarEnginePage() {
  const [active, setActive] = useState<number | null>(null);
  const toggle = useCallback((i: number) => setActive(p => p === i ? null : i), []);
  const data = active !== null ? STEPS[active] : null;

  return (
    <div className="fixed inset-0 z-[9999] flex" style={{ backgroundColor: BG }}>
      {/* Sidebar */}
      <div className="w-56 lg:w-64 shrink-0 bg-white/80 backdrop-blur-md border-r border-[#d0c8b8] flex flex-col overflow-y-auto">
        <Link href="/" className="flex items-center gap-2 px-5 py-3 border-b border-[#d0c8b8] text-[#888] text-[10px] uppercase tracking-wider hover:bg-[#f0ebe0] transition-colors">
          <span>←</span> Back to Site
        </Link>
        <div className="p-5 border-b border-[#d0c8b8]">
          <p className="text-[#E07C3E] text-[9px] uppercase tracking-[0.5em] mb-1.5 font-semibold">System Architecture</p>
          <h1 className="text-lg font-heading text-[#1B3A5C] leading-tight">The Stellar <span className="text-[#E07C3E]">Engine</span></h1>
          <p className="text-[#aaa] text-[10px] mt-1.5">Click segments to inspect. Drag to orbit.</p>
        </div>
        <div className="flex-1 py-1">
          {STEPS.map((s, i) => (
            <button key={s.id} onClick={() => toggle(i)}
              className={`w-full text-left px-5 py-3 transition-all duration-300 border-l-2 ${active === i ? "bg-[#f0ebe0] border-l-current" : "border-l-transparent hover:bg-[#f8f5f0]"}`}
              style={{ borderColor: active === i ? s.color : "transparent" }}>
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-heading" style={{ color: active === i ? s.color : "#bbb" }}>{s.num}</span>
                <span className={`text-[11px] tracking-wider ${active === i ? "text-[#1B3A5C]" : "text-[#888]"}`}>{s.title}</span>
              </div>
              <p className="text-[#c0b8a8] text-[9px] mt-0.5">{s.sub}</p>
            </button>
          ))}
        </div>
        <div className="p-5 border-t border-[#d0c8b8] space-y-2">
          <Link href="/programs" className="block text-center px-4 py-2 bg-[#E07C3E] text-white text-[10px] uppercase tracking-wider font-semibold hover:bg-[#E8944F] transition-colors rounded-md">Explore Programs</Link>
          <Link href="/get-involved" className="block text-center px-4 py-2 border border-[#d0c8b8] text-[#888] text-[10px] uppercase tracking-wider hover:bg-[#f0ebe0] transition-colors rounded-md">Partner With Us</Link>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <Canvas shadows camera={{ position: [5, 4, 9], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true, alpha: false }}
          onCreated={({ gl }) => { gl.setClearColor(new THREE.Color(BG)); gl.outputColorSpace = THREE.SRGBColorSpace; }}>
          <Scene active={active} onClick={toggle} />
        </Canvas>

        {data && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#f5f2ec] via-[#f5f2ec]/90 to-transparent pt-16 pb-6 px-8">
            <div className="max-w-xl">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-heading text-xl" style={{ color: data.color }}>{data.num}</span>
                <h2 className="text-sm font-heading text-[#1B3A5C] tracking-wider">{data.title}</h2>
                <span className="text-[#c0b8a8] text-[10px] uppercase tracking-wider">— {data.sub}</span>
              </div>
              <p className="text-[#777] text-xs leading-relaxed mb-3 max-w-md">{data.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {data.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 bg-white border border-[#d0c8b8] rounded text-[#888] text-[10px]">{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {active !== null && (
          <button onClick={() => setActive(null)} className="absolute top-4 right-4 px-3 py-1.5 bg-white/80 border border-[#d0c8b8] rounded text-[#888] text-[10px] uppercase tracking-wider hover:bg-white transition-colors">
            Reset View
          </button>
        )}

        {active === null && (
          <div className="absolute bottom-6 left-8 pointer-events-none">
            <p className="text-[#d0c8b8] text-[10px] uppercase tracking-[0.5em]">The Mindful Group — Milwaukee, WI</p>
          </div>
        )}
      </div>
    </div>
  );
}
