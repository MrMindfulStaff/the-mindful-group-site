"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, Scroll, useScroll, Float } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";

/* ── The closed-loop torus ── */
function ClosedLoop() {
  const torusRef = useRef<THREE.Mesh>(null!);
  const scroll = useScroll();

  useFrame((state) => {
    const offset = scroll.offset;
    const t = state.clock.elapsedTime;
    if (torusRef.current) {
      torusRef.current.rotation.x = Math.PI / 2.5 + offset * 0.3;
      torusRef.current.rotation.z = t * 0.02 + offset * Math.PI * 0.5;
    }
  });

  return (
    <mesh ref={torusRef}>
      <torusGeometry args={[3, 0.04, 16, 100]} />
      <meshBasicMaterial color="#1A7A5C" transparent opacity={0.4} />
    </mesh>
  );
}

/* ── 7 step nodes orbiting ── */
function StepNodes() {
  const steps = ["Recruit", "Train", "Certify", "Place", "Surplus", "Reinvest", "Scale"];
  const groupRef = useRef<THREE.Group>(null!);
  const scroll = useScroll();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const offset = scroll.offset;
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.PI / 2.5 + offset * 0.3;
      groupRef.current.rotation.z = t * 0.02 + offset * Math.PI * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {steps.map((step, i) => {
        const angle = (i / steps.length) * Math.PI * 2;
        const r = 3;
        const isKey = i === 4;
        return (
          <Float key={step} speed={1.5} floatIntensity={0.1}>
            <mesh position={[Math.cos(angle) * r, Math.sin(angle) * r, 0]}>
              <octahedronGeometry args={[isKey ? 0.22 : 0.13, 0]} />
              <meshBasicMaterial color={isKey ? "#E07C3E" : "#1A7A5C"} transparent opacity={0.9} />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

/* ── Energy particles ── */
function EnergyFlow() {
  const count = 350;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const scroll = useScroll();

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      const speed = 0.15 + Math.random() * 0.1;
      const offset = (Math.random() - 0.5) * 0.6;
      const size = 0.01 + Math.random() * 0.02;
      arr.push({ t, speed, offset, size });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const scrollOffset = scroll.offset;
    const tilt = Math.PI / 2.5 + scrollOffset * 0.3;
    const zRot = time * 0.02 + scrollOffset * Math.PI * 0.5;

    particles.forEach((p, i) => {
      const a = p.t + time * p.speed;
      const r = 3 + p.offset;
      // Position on tilted torus
      let x = Math.cos(a) * r;
      let y = Math.sin(a) * r;
      const z = 0;
      // Apply tilt rotation
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);
      const y2 = y * cosT - z * sinT;
      const z2 = y * sinT + z * cosT;
      // Apply z rotation
      const cosZ = Math.cos(zRot);
      const sinZ = Math.sin(zRot);
      const x3 = x * cosZ - y2 * sinZ;
      const y3 = x * sinZ + y2 * cosZ;

      dummy.position.set(x3, y3, z2);
      dummy.scale.setScalar(p.size * (1 + Math.sin(time + p.t) * 0.3));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#93B396" transparent opacity={0.5} />
    </instancedMesh>
  );
}

/* ── Core ── */
function EngineCore() {
  const coreRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.1;
      coreRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.05);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh ref={coreRef}>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshBasicMaterial color="#1A7A5C" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial color="#E07C3E" transparent opacity={0.1} />
      </mesh>
    </Float>
  );
}

/* ── Surplus radiation ── */
function SurplusRadiation() {
  const count = 60;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const scroll = useScroll();

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 0.4;
      const maxR = 2 + Math.random() * 3;
      const phase = Math.random() * Math.PI * 2;
      arr.push({ angle, speed, maxR, phase });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Only show surplus radiation in the later scroll sections
    const vis = Math.max(0, scroll.offset - 0.4) * 2.5;
    particles.forEach((p, i) => {
      const cycle = ((t * p.speed * 0.2 + p.phase) % 1);
      const r = cycle * p.maxR * vis;
      dummy.position.set(
        Math.cos(p.angle) * r,
        Math.sin(p.angle) * r * 0.4,
        Math.sin(p.angle + 1) * r * 0.3
      );
      dummy.scale.setScalar(0.025 * (1 - cycle) * vis);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#E07C3E" transparent opacity={0.4} />
    </instancedMesh>
  );
}

/* ── Camera rig ── */
function CameraRig() {
  const scroll = useScroll();
  const { camera } = useThree();

  useFrame(() => {
    const offset = scroll.offset;
    const angle = offset * Math.PI * 0.8;
    const radius = 9 - offset * 1.5;
    camera.position.x = Math.sin(angle) * radius * 0.4;
    camera.position.y = 3 + Math.cos(offset * Math.PI) * 2;
    camera.position.z = Math.cos(angle) * radius;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ── HTML content ── */
function HtmlContent() {
  const steps = [
    { step: "01", title: "Recruit", desc: "Participants recruited from underserved communities with priority for those facing employment barriers." },
    { step: "02", title: "Train", desc: "Accelerated, industry-recognized certification programs: CNA/CBRF, Construction, Phlebotomy." },
    { step: "03", title: "Certify", desc: "Graduates earn credentials that meet employer standards — not participation certificates." },
    { step: "04", title: "Place", desc: "The staffing arm places graduates with employers. This placement generates workforce revenue." },
    { step: "05", title: "Generate Surplus", desc: "Revenue exceeds operating costs. This is not profit — it is fuel for the next cycle." },
    { step: "06", title: "Reinvest", desc: "30% supportive services, 20% non-WIOA access, 30% expansion, 20% reserves." },
    { step: "07", title: "Scale", desc: "Costs per participant decrease, surplus increases. More efficient at scale, not less." },
  ];

  return (
    <Scroll html>
      {/* Intro */}
      <div className="w-screen h-screen flex items-center">
        <div className="max-w-3xl mx-auto px-8 md:px-16">
          <p className="text-[#E07C3E] text-sm uppercase tracking-[0.3em] mb-4 font-semibold">System Architecture</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white leading-tight mb-6">
            The Stellar <span className="text-[#E07C3E]">Engine</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-xl">
            A self-sustaining closed-loop system where participant outcomes
            generate the revenue that funds the next cohort. Not a program —
            infrastructure.
          </p>
        </div>
      </div>

      {/* Steps - 2 per screen */}
      <div className="w-screen h-screen flex items-center">
        <div className="max-w-4xl mx-auto px-8 md:px-16">
          <div className="space-y-8">
            {steps.slice(0, 3).map((s) => (
              <div key={s.step} className="flex gap-6 items-start">
                <span className="text-[#E07C3E] font-heading text-2xl w-12 shrink-0">{s.step}</span>
                <div>
                  <h3 className="text-xl font-heading text-white mb-1">{s.title}</h3>
                  <p className="text-white/50 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-screen h-screen flex items-center">
        <div className="max-w-4xl mx-auto px-8 md:px-16">
          <div className="space-y-8">
            {steps.slice(3, 7).map((s) => (
              <div key={s.step} className="flex gap-6 items-start">
                <span className="text-[#E07C3E] font-heading text-2xl w-12 shrink-0">{s.step}</span>
                <div>
                  <h3 className="text-xl font-heading text-white mb-1">{s.title}</h3>
                  <p className="text-white/50 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Configurations */}
      <div className="w-screen h-screen flex items-center">
        <div className="max-w-4xl mx-auto px-8 md:px-16">
          <h2 className="text-3xl md:text-4xl font-heading text-white mb-8">
            Two Engines. <span className="text-[#E07C3E]">One Architecture.</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-lg">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Sub-Model</p>
              <h3 className="text-2xl font-heading text-white mb-2">Little Dipper</h3>
              <p className="text-white/50 text-sm">Workforce revenue only. Proves the floor of sustainability on placement revenue alone.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-[#E07C3E]/30 p-8 rounded-lg">
              <p className="text-[#E07C3E]/60 text-xs uppercase tracking-wider mb-2">Sub-Model</p>
              <h3 className="text-2xl font-heading text-white mb-2">Big Dipper</h3>
              <p className="text-white/50 text-sm">Training + workforce revenue. Full-power configuration achieving sustainability at lower thresholds.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="w-screen h-screen flex items-center">
        <div className="max-w-3xl mx-auto px-8 md:px-16 text-center">
          <div className="mb-10">
            <div className="border-l-4 border-[#E07C3E] pl-8 text-left">
              <p className="text-xl md:text-2xl font-heading text-white leading-relaxed mb-4">
                The Stellar Engine does not ask why people are poor. It builds a
                system that makes the conditions of poverty economically unsustainable.
              </p>
              <p className="text-[#E07C3E] text-sm uppercase tracking-[0.2em] font-semibold">
                <a href="https://reginald-reed-site.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:underline">Reginald Reed Jr.</a>
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/programs" className="px-8 py-4 bg-[#E07C3E] text-white font-semibold text-sm uppercase tracking-wider hover:bg-[#E8944F] transition-colors rounded-md">
              Explore Programs
            </Link>
            <Link href="/get-involved" className="px-8 py-4 border border-white/30 text-white text-sm uppercase tracking-wider hover:bg-white/10 transition-colors rounded-md">
              Partner With Us
            </Link>
          </div>
        </div>
      </div>
    </Scroll>
  );
}

/* ── Main scene ── */
function Scene() {
  return (
    <ScrollControls pages={5} damping={0.15}>
      <CameraRig />
      <EngineCore />
      <ClosedLoop />
      <StepNodes />
      <EnergyFlow />
      <SurplusRadiation />
      <HtmlContent />
    </ScrollControls>
  );
}

export default function StellarEngineOrbit() {
  return (
    <div className="h-screen w-screen bg-[#0f1f2e]">
      <Canvas
        camera={{ position: [0, 3, 9], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
