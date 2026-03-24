"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, Scroll, useScroll, Float, Html } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";

/* ── Particle field flowing around the globe ── */
function ParticleField() {
  const count = 500;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 4.5 + Math.random() * 2;
      const speed = 0.02 + Math.random() * 0.03;
      const size = 0.008 + Math.random() * 0.015;
      arr.push({ theta, phi, r, speed, size });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      const theta = p.theta + t * p.speed;
      const x = p.r * Math.sin(p.phi) * Math.cos(theta);
      const y = p.r * Math.cos(p.phi);
      const z = p.r * Math.sin(p.phi) * Math.sin(theta);
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(p.size * (1 + Math.sin(t * 2 + p.theta) * 0.3));
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

/* ── The main globe with wireframe ── */
function Globe() {
  const globeRef = useRef<THREE.Group>(null!);
  const scroll = useScroll();

  useFrame(() => {
    const offset = scroll.offset; // 0 to 1
    // Vertical rotation: scroll drives pitch
    globeRef.current.rotation.x = offset * Math.PI * 1.2 - 0.3;
    // Horizontal partial rotation: sinusoidal sway
    globeRef.current.rotation.y = Math.sin(offset * Math.PI * 2) * 0.8;
  });

  return (
    <group ref={globeRef}>
      {/* Wireframe sphere */}
      <mesh>
        <icosahedronGeometry args={[3.5, 3]} />
        <meshBasicMaterial color="#1A7A5C" wireframe transparent opacity={0.12} />
      </mesh>
      {/* Inner glow */}
      <mesh>
        <icosahedronGeometry args={[3.2, 2]} />
        <meshBasicMaterial color="#1A7A5C" transparent opacity={0.03} />
      </mesh>
      {/* Latitude rings */}
      {[-1.5, -0.5, 0.5, 1.5].map((y, i) => {
        const r = Math.sqrt(3.5 * 3.5 - y * y);
        return (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r - 0.005, r + 0.005, 80]} />
            <meshBasicMaterial color="#1A7A5C" transparent opacity={0.08} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      {/* Section markers on the globe surface */}
      <SectionNodes />
    </group>
  );
}

/* ── Glowing nodes at different positions on the globe ── */
function SectionNodes() {
  const sections = [
    { name: "Programs", lat: 0.8, lng: 0, color: "#1A7A5C" },
    { name: "Support", lat: 0.3, lng: 1.2, color: "#22936F" },
    { name: "Engine", lat: -0.3, lng: 2.4, color: "#E07C3E" },
    { name: "Stories", lat: -0.8, lng: 3.6, color: "#1B3A5C" },
    { name: "Impact", lat: -1.2, lng: 4.8, color: "#E07C3E" },
  ];

  return (
    <>
      {sections.map((s) => {
        const r = 3.55;
        const x = r * Math.cos(s.lat) * Math.cos(s.lng);
        const y = r * Math.sin(s.lat);
        const z = r * Math.cos(s.lat) * Math.sin(s.lng);
        return (
          <Float key={s.name} speed={2} floatIntensity={0.1}>
            <mesh position={[x, y, z]}>
              <octahedronGeometry args={[0.1, 0]} />
              <meshBasicMaterial color={s.color} transparent opacity={0.9} />
            </mesh>
          </Float>
        );
      })}
    </>
  );
}

/* ── Orbital rings around the globe ── */
function OrbitalRings() {
  const ring1 = useRef<THREE.Mesh>(null!);
  const ring2 = useRef<THREE.Mesh>(null!);
  const scroll = useScroll();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const offset = scroll.offset;
    if (ring1.current) {
      ring1.current.rotation.x = offset * Math.PI + t * 0.02;
      ring1.current.rotation.z = Math.sin(t * 0.1) * 0.2;
    }
    if (ring2.current) {
      ring2.current.rotation.y = offset * Math.PI * 0.5 + t * 0.015;
      ring2.current.rotation.x = Math.PI / 3;
    }
  });

  return (
    <>
      <mesh ref={ring1}>
        <torusGeometry args={[4.5, 0.008, 16, 120]} />
        <meshBasicMaterial color="#E07C3E" transparent opacity={0.25} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[5, 0.006, 16, 120]} />
        <meshBasicMaterial color="#1B3A5C" transparent opacity={0.15} />
      </mesh>
    </>
  );
}

/* ── Camera rig that responds to scroll ── */
function CameraRig() {
  const scroll = useScroll();
  const { camera } = useThree();

  useFrame(() => {
    const offset = scroll.offset;
    // Camera orbits: starts front, moves up and around
    const angle = offset * Math.PI * 0.6;
    const radius = 10 - offset * 2; // zooms in slightly
    camera.position.x = Math.sin(angle * 0.5) * 3;
    camera.position.y = 2 + Math.sin(offset * Math.PI) * 3;
    camera.position.z = radius * Math.cos(angle * 0.3);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ── HTML content sections that appear at scroll positions ── */
function HtmlContent() {
  return (
    <Scroll html>
      {/* Section 1: Hero */}
      <div className="w-screen h-screen flex items-center">
        <div className="max-w-3xl mx-auto px-8 md:px-16">
          {/* Prominent Logo */}
          <div className="mb-8">
            <img
              src="/images/tmg-logo.png"
              alt="The Mindful Group"
              className="h-[180px] md:h-[248px] w-auto drop-shadow-[0_0_30px_rgba(26,122,92,0.3)]"
            />
          </div>
          <p className="text-white/60 text-sm uppercase tracking-[0.3em] mb-4 font-semibold">
            Reverse Engineering Poverty
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white leading-tight mb-6">
            Community First.
            <br />
            <span className="text-[#E07C3E]">Opportunity Always.</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
            Zero-tuition career training with wraparound support — child care,
            transportation, housing, and employment placement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://www.themindfulgroupinc.org/book-online"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#E07C3E] text-white font-semibold text-sm uppercase tracking-wider hover:bg-[#E8944F] transition-colors text-center rounded-md"
            >
              Enroll in a Program
            </a>
            <Link
              href="/get-involved"
              className="px-8 py-4 border border-white/30 text-white text-sm uppercase tracking-wider hover:bg-white/10 transition-colors text-center rounded-md"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </div>

      {/* Section 2: Impact Metrics */}
      <div className="w-screen h-screen flex items-center">
        <div className="max-w-4xl mx-auto px-8 md:px-16">
          <p className="text-[#E07C3E] text-sm uppercase tracking-[0.3em] mb-4 font-semibold">
            Proven Impact
          </p>
          <h2 className="text-3xl md:text-5xl font-heading text-white leading-tight mb-12">
            The Numbers <span className="text-[#E07C3E]">Speak</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { stat: "525+", label: "People Trained" },
              { stat: "90%", label: "Graduation Rate" },
              { stat: "85%", label: "Job Placement" },
              { stat: "$0", label: "Tuition Charged" },
            ].map((m) => (
              <div key={m.label} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg text-center">
                <p className="text-3xl font-heading text-white mb-1">{m.stat}</p>
                <p className="text-white/50 text-sm">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Programs */}
      <div className="w-screen h-screen flex items-center">
        <div className="max-w-4xl mx-auto px-8 md:px-16">
          <p className="text-[#1A7A5C] text-sm uppercase tracking-[0.3em] mb-4 font-semibold" style={{ color: "#93B396" }}>
            Training Programs
          </p>
          <h2 className="text-3xl md:text-5xl font-heading text-white leading-tight mb-8">
            Your Career <span className="text-[#E07C3E]">Starts Here</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "CNA/CBRF Training", tag: "Healthcare", href: "/programs/cna-cbrf" },
              { title: "Construction Training", tag: "Trades", href: "/programs/construction" },
              { title: "Career Development", tag: "Career", href: "/programs/career-development" },
            ].map((p) => (
              <Link key={p.title} href={p.href}>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#1A7A5C]/50 p-6 rounded-lg transition-all duration-300 group">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#93B396] mb-3 block">{p.tag}</span>
                  <h3 className="text-lg font-heading text-white group-hover:text-[#E07C3E] transition-colors">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/programs" className="text-[#E07C3E] text-sm uppercase tracking-wider font-semibold hover:text-[#E8944F] transition-colors">
              View All Programs →
            </Link>
          </div>
        </div>
      </div>

      {/* Section 4: Support */}
      <div className="w-screen h-screen flex items-center">
        <div className="max-w-4xl mx-auto px-8 md:px-16">
          <p className="text-sm uppercase tracking-[0.3em] mb-4 font-semibold" style={{ color: "#93B396" }}>
            Wraparound Support
          </p>
          <h2 className="text-3xl md:text-5xl font-heading text-white leading-tight mb-8">
            We Remove <span className="text-[#E07C3E]">Every Barrier</span>
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {[
              { title: "Child Care", desc: "First month childcare voucher for graduates", href: "/support/childcare" },
              { title: "Transportation", desc: "Bus passes, rideshare, driver's ed", href: "/support/transportation" },
              { title: "Housing", desc: "Emergency shelter to homeownership", href: "/support/housing" },
              { title: "Re-Entry", desc: "Court partnerships for returning citizens", href: "/support/reentry" },
            ].map((s) => (
              <Link key={s.title} href={s.href}>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#1A7A5C]/50 p-6 rounded-lg transition-all duration-300 group">
                  <h3 className="text-lg font-heading text-white group-hover:text-[#E07C3E] transition-colors mb-2">{s.title}</h3>
                  <p className="text-white/50 text-sm">{s.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Section 5: Stellar Engine Teaser */}
      <div className="w-screen h-screen flex items-center">
        <div className="max-w-3xl mx-auto px-8 md:px-16 text-center">
          <p className="text-[#E07C3E] text-sm uppercase tracking-[0.3em] mb-4 font-semibold">
            The Stellar Engine
          </p>
          <h2 className="text-3xl md:text-5xl font-heading text-white leading-tight mb-6">
            A Self-Sustaining <span className="text-[#E07C3E]">System</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Participant outcomes generate the revenue that funds the next cohort.
            Not a program — infrastructure. Built and proven in Milwaukee&apos;s 53206.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/stellar-engine"
              className="px-8 py-4 bg-[#E07C3E] text-white font-semibold text-sm uppercase tracking-wider hover:bg-[#E8944F] transition-colors rounded-md"
            >
              Explore the Engine
            </Link>
            <Link
              href="/get-involved"
              className="px-8 py-4 border border-white/30 text-white text-sm uppercase tracking-wider hover:bg-white/10 transition-colors rounded-md"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </div>

      {/* Section 6: Quote + CTA */}
      <div className="w-screen h-screen flex items-center">
        <div className="max-w-3xl mx-auto px-8 md:px-16">
          <div className="border-l-4 border-[#E07C3E] pl-8">
            <p className="text-xl md:text-2xl font-heading text-white leading-relaxed mb-6">
              We don&apos;t just build programs — we build people. Every student
              who walks through our doors leaves with more than a certificate.
              They leave with a career, a support system, and the confidence to
              build a life.
            </p>
            <p className="text-[#E07C3E] text-sm uppercase tracking-[0.2em] font-semibold">
              <a href="https://reginald-reed-site.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Reginald Reed Jr.
              </a>{" "}
              — Founder &amp; Executive Director
            </p>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <a
              href="https://www.themindfulgroupinc.org/book-online"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#E07C3E] text-white font-semibold text-sm uppercase tracking-wider hover:bg-[#E8944F] transition-colors text-center rounded-md"
            >
              Book an Orientation
            </a>
            <Link
              href="/contact"
              className="px-8 py-4 border border-white/30 text-white text-sm uppercase tracking-wider hover:bg-white/10 transition-colors text-center rounded-md"
            >
              Contact Us
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
    <ScrollControls pages={6} damping={0.15}>
      <CameraRig />
      <Globe />
      <ParticleField />
      <OrbitalRings />
      <HtmlContent />
    </ScrollControls>
  );
}

export default function GlobeExperience() {
  return (
    <div className="h-screen w-screen bg-[#0f1f2e]">
      <Canvas
        camera={{ position: [0, 2, 10], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
