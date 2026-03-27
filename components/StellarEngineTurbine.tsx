"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, Environment, Text } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import Link from "next/link";

/* ════════════════════════════════════════════════════════════════════
   THE STELLAR ENGINE — 3D Cutaway Torus Diagram

   A clean, full-color cross-section of the closed-loop system.
   Each of the 7 steps is a distinct colored segment of the torus,
   cut away to reveal the inner flow. Brand colors throughout.
   ════════════════════════════════════════════════════════════════════ */

// ─── Brand Colors ───
const TEAL        = "#1A7A5C";
const TEAL_LIGHT  = "#22936F";
const TEAL_PALE   = "#93B396";
const ORANGE      = "#E07C3E";
const ORANGE_WARM  = "#E8944F";
const NAVY        = "#1B3A5C";
const NAVY_LIGHT  = "#2A5580";
const WHITE       = "#f5f5f0";
const CREAM       = "#f0ebe0";

// ─── Step data ───
const STEPS = [
  {
    id: "recruit", step: "01", title: "RECRUIT", subtitle: "Intake",
    color: TEAL, emissive: "#0d4030",
    desc: "Zero-tuition enrollment from underserved communities. Court & probation partnerships. Walk-in orientations every other Tuesday.",
    details: ["Zero tuition", "Community outreach", "Court partnerships", "Walk-in orientations"],
  },
  {
    id: "train", step: "02", title: "TRAIN", subtitle: "Compression",
    color: TEAL_LIGHT, emissive: "#125538",
    desc: "Accelerated certification programs: CNA/CBRF, Construction, Phlebotomy. Industry-recognized credentials from day one.",
    details: ["CNA/CBRF", "Construction", "Phlebotomy", "Career workshops"],
  },
  {
    id: "certify", step: "03", title: "CERTIFY", subtitle: "Ignition",
    color: ORANGE, emissive: "#6a3518",
    desc: "90% graduation rate. State-recognized credentials — not participation certificates. Potential becomes power.",
    details: ["State credentials", "90% grad rate", "Employer-validated", "Industry-standard"],
  },
  {
    id: "place", step: "04", title: "PLACE", subtitle: "Output",
    color: "#b87333", emissive: "#5a3818",
    desc: "The staffing arm places graduates with employers. 85% placement rate. Every hire generates workforce revenue.",
    details: ["85% placement", "Staffing revenue", "Employer network", "Career tracking"],
  },
  {
    id: "surplus", step: "05", title: "SURPLUS", subtitle: "Thrust",
    color: ORANGE_WARM, emissive: "#704020",
    desc: "Revenue exceeds operating costs. Not profit — thrust. The economic force that propels the system without grant dependency.",
    details: ["Revenue > costs", "Grant-independent", "System fuel", "Revenue floor"],
  },
  {
    id: "reinvest", step: "06", title: "REINVEST", subtitle: "Return",
    color: NAVY_LIGHT, emissive: "#152a40",
    desc: "Surplus cycles back. 30% services, 20% non-WIOA access, 30% expansion, 20% reserves.",
    details: ["30% services", "20% access", "30% expansion", "20% reserves"],
  },
  {
    id: "scale", step: "07", title: "SCALE", subtitle: "Amplify",
    color: NAVY, emissive: "#0d1e30",
    desc: "Cost per participant decreases. Surplus per cycle increases. More powerful at volume, not less. Proven in 53206.",
    details: ["Lower unit cost", "Growing surplus", "Replication-ready", "Proven model"],
  },
];

const RING_RADIUS = 6;
const TUBE_RADIUS = 0.8;
const SEGMENT_GAP = 0.03; // small gap between segments
const STATION_COUNT = 7;

function getStationAngle(index: number): number {
  return (index / STATION_COUNT) * Math.PI * 2 - Math.PI / 2;
}

function getStationPosition(index: number): [number, number, number] {
  const angle = getStationAngle(index);
  return [Math.cos(angle) * RING_RADIUS, 0, Math.sin(angle) * RING_RADIUS];
}

/* ════════════════════════════════════════════
   TORUS SEGMENTS — Each step is a colored arc
   with a cutaway cross-section on one side
   ════════════════════════════════════════════ */

function TorusSegment({ index, active, onClick }: { index: number; active: boolean; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const step = STEPS[index];

  const startAngle = getStationAngle(index) + SEGMENT_GAP;
  const endAngle = getStationAngle((index + 1) % STATION_COUNT) - SEGMENT_GAP;
  const arcLength = endAngle > startAngle ? endAngle - startAngle : endAngle + Math.PI * 2 - startAngle;

  // Create torus segment geometry
  const geometry = useMemo(() => {
    const tubularSegments = 32;
    const radialSegments = 24;
    const geo = new THREE.TorusGeometry(RING_RADIUS, TUBE_RADIUS, radialSegments, tubularSegments, arcLength);
    // Rotate to correct starting angle
    geo.rotateY(-startAngle);
    return geo;
  }, [startAngle, arcLength]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const targetEmissiveIntensity = active ? 0.6 : 0.08;
    mat.emissiveIntensity += (targetEmissiveIntensity - mat.emissiveIntensity) * 0.05;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      castShadow
    >
      <meshStandardMaterial
        color={step.color}
        emissive={step.emissive}
        emissiveIntensity={0.08}
        roughness={0.35}
        metalness={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ════════════════════════════════════════════
   CUTAWAY CROSS-SECTION — Shows inner flow
   A half-torus revealing the interior channel
   ════════════════════════════════════════════ */

function CutawaySection() {
  // Inner tube visible through the cut — shows energy flowing inside
  return (
    <group>
      {/* Inner channel walls — darker shade */}
      <mesh rotation={[0, Math.PI * 0.75, 0]}>
        <torusGeometry args={[RING_RADIUS, TUBE_RADIUS * 0.45, 16, 48, Math.PI * 0.5]} />
        <meshStandardMaterial
          color={NAVY}
          emissive="#0a1520"
          emissiveIntensity={0.3}
          roughness={0.5}
          metalness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner glow tube — the energy channel */}
      <mesh rotation={[0, Math.PI * 0.75, 0]}>
        <torusGeometry args={[RING_RADIUS, TUBE_RADIUS * 0.2, 12, 48, Math.PI * 0.5]} />
        <meshBasicMaterial color={TEAL_PALE} transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Cross-section disc at cut point — shows the ring profile */}
      {[Math.PI * 0.75, Math.PI * 1.25].map((angle, i) => {
        const x = Math.cos(-angle) * RING_RADIUS;
        const z = Math.sin(-angle) * RING_RADIUS;
        return (
          <group key={i} position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
            {/* Outer ring cross-section */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <ringGeometry args={[TUBE_RADIUS * 0.45, TUBE_RADIUS, 32]} />
              <meshStandardMaterial color={TEAL} roughness={0.4} metalness={0.3} side={THREE.DoubleSide} />
            </mesh>
            {/* Inner channel cross-section */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[TUBE_RADIUS * 0.45, 32]} />
              <meshStandardMaterial color={NAVY} emissive="#0a1520" emissiveIntensity={0.4} roughness={0.5} side={THREE.DoubleSide} />
            </mesh>
            {/* Glowing core */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[TUBE_RADIUS * 0.2, 24]} />
              <meshBasicMaterial color={TEAL_PALE} transparent opacity={0.4} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ════════════════════════════════════════════
   FLOW PARTICLES — Energy moving through torus
   ════════════════════════════════════════════ */

function FlowParticles() {
  const count = 400;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      speed: 0.12 + Math.random() * 0.08,
      tubeAngle: Math.random() * Math.PI * 2,
      tubeRadius: Math.random() * TUBE_RADIUS * 0.35,
      size: 0.015 + Math.random() * 0.025,
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      const mainAngle = p.angle + t * p.speed;
      const cx = Math.cos(mainAngle) * RING_RADIUS;
      const cz = Math.sin(mainAngle) * RING_RADIUS;
      // Offset within the tube
      const ox = Math.cos(p.tubeAngle) * p.tubeRadius;
      const oy = Math.sin(p.tubeAngle) * p.tubeRadius;
      // Project offset perpendicular to torus center
      const nx = -Math.sin(mainAngle);
      const nz = Math.cos(mainAngle);
      dummy.position.set(cx + nx * ox, oy, cz + nz * ox);
      dummy.scale.setScalar(p.size * (0.8 + Math.sin(t * 2 + p.angle * 3) * 0.2));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={TEAL_PALE} transparent opacity={0.5} />
    </instancedMesh>
  );
}

/* ════════════════════════════════════════════
   STATION MARKERS — Node at each step position
   ════════════════════════════════════════════ */

function StationMarker({ index, active, onClick }: { index: number; active: boolean; onClick: () => void }) {
  const [x, , z] = getStationPosition(index);
  const step = STEPS[index];
  const markerRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!markerRef.current) return;
    const t = state.clock.elapsedTime;
    const targetScale = active ? 1.3 : 1;
    const currentScale = markerRef.current.scale.x;
    const newScale = currentScale + (targetScale - currentScale) * 0.06;
    markerRef.current.scale.setScalar(newScale);
    markerRef.current.position.y = TUBE_RADIUS + 0.3 + (active ? Math.sin(t * 2) * 0.05 : 0);
  });

  return (
    <group position={[x, 0, z]}>
      {/* Vertical connector line */}
      <mesh position={[0, TUBE_RADIUS * 0.7, 0]}>
        <cylinderGeometry args={[0.008, 0.008, TUBE_RADIUS * 0.6, 4]} />
        <meshBasicMaterial color={step.color} transparent opacity={active ? 0.6 : 0.2} />
      </mesh>

      {/* Marker diamond */}
      <group ref={markerRef} position={[0, TUBE_RADIUS + 0.3, 0]}>
        <Float speed={2} floatIntensity={active ? 0.15 : 0.05}>
          <mesh onClick={(e) => { e.stopPropagation(); onClick(); }}>
            <octahedronGeometry args={[0.18, 0]} />
            <meshStandardMaterial
              color={step.color}
              emissive={step.color}
              emissiveIntensity={active ? 0.8 : 0.15}
              roughness={0.2}
              metalness={0.5}
            />
          </mesh>
          {/* Step number label */}
          <Text
            position={[0, 0.35, 0]}
            fontSize={0.12}
            color={active ? WHITE : "#aaa"}
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter-var.woff2"
          >
            {step.step}
          </Text>
          <Text
            position={[0, 0.22, 0]}
            fontSize={0.08}
            color={active ? step.color : "#777"}
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter-var.woff2"
          >
            {step.title}
          </Text>
        </Float>
      </group>
    </group>
  );
}

/* ════════════════════════════════════════════
   CENTRAL CORE — Glowing dodecahedron hub
   ════════════════════════════════════════════ */

function CentralCore() {
  const coreRef = useRef<THREE.Group>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) coreRef.current.rotation.y = t * 0.08;
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.08 + Math.sin(t * 0.8) * 0.03;
    }
  });

  return (
    <group>
      <group ref={coreRef}>
        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.15}>
          {/* Wireframe core */}
          <mesh>
            <dodecahedronGeometry args={[0.9, 0]} />
            <meshStandardMaterial
              color={TEAL}
              emissive={TEAL}
              emissiveIntensity={1.2}
              wireframe
              transparent
              opacity={0.5}
            />
          </mesh>
          {/* Solid inner glow */}
          <mesh>
            <dodecahedronGeometry args={[0.5, 0]} />
            <meshBasicMaterial color={TEAL} transparent opacity={0.12} />
          </mesh>
          {/* Hot center */}
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color={WHITE} transparent opacity={0.1} />
          </mesh>
        </Float>
      </group>
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.08} />
      </mesh>
      <pointLight intensity={3} color={TEAL} distance={8} />
    </group>
  );
}

/* ════════════════════════════════════════════
   DIRECTIONAL ARROWS — Show flow direction
   ════════════════════════════════════════════ */

function FlowArrows() {
  const arrowCount = 14;
  const arrowsRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!arrowsRef.current) return;
    const t = state.clock.elapsedTime;
    arrowsRef.current.children.forEach((child, i) => {
      (child as THREE.Mesh).material && ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity !== undefined &&
        ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(t * 1.5 + i * 0.5) * 0.1;
    });
  });

  return (
    <group ref={arrowsRef}>
      {Array.from({ length: arrowCount }, (_, i) => {
        const angle = (i / arrowCount) * Math.PI * 2;
        const x = Math.cos(angle) * RING_RADIUS;
        const z = Math.sin(angle) * RING_RADIUS;
        const tangentAngle = angle + Math.PI / 2;
        return (
          <mesh key={i} position={[x, TUBE_RADIUS + 0.05, z]} rotation={[Math.PI / 2, 0, -tangentAngle]}>
            <coneGeometry args={[0.06, 0.15, 3]} />
            <meshBasicMaterial color={ORANGE} transparent opacity={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ════════════════════════════════════════════
   BRAND BACKGROUND — Abstract geometric pattern
   ════════════════════════════════════════════ */

function BrandBackground() {
  const bgRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!bgRef.current) return;
    bgRef.current.rotation.y = state.clock.elapsedTime * 0.005;
  });

  return (
    <group ref={bgRef}>
      {/* Gradient sky sphere */}
      <BrandSky />

      {/* Floating abstract shapes — brand colors */}
      {Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const r = 15 + (i % 4) * 3;
        const y = -4 + (i % 5) * 2;
        const colors = [TEAL, NAVY, ORANGE, TEAL_LIGHT, NAVY_LIGHT];
        const color = colors[i % colors.length];
        const size = 0.3 + (i % 3) * 0.2;
        return (
          <Float key={i} speed={0.5 + (i % 3) * 0.3} floatIntensity={0.3}>
            <mesh position={[Math.cos(angle) * r, y, Math.sin(angle) * r]}>
              {i % 3 === 0 ? <octahedronGeometry args={[size, 0]} /> :
               i % 3 === 1 ? <dodecahedronGeometry args={[size, 0]} /> :
               <icosahedronGeometry args={[size, 0]} />}
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.1}
                roughness={0.6}
                metalness={0.3}
                transparent
                opacity={0.12}
              />
            </mesh>
          </Float>
        );
      })}

      {/* Concentric rings on the ground — blueprint style */}
      {[10, 14, 18, 22].map((r, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
          <ringGeometry args={[r - 0.02, r + 0.02, 80]} />
          <meshBasicMaterial color={TEAL} transparent opacity={0.04 - i * 0.008} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Radial lines */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * 16;
        const z = Math.sin(angle) * 16;
        return (
          <mesh key={i} position={[x / 2, -3, z / 2]} rotation={[-Math.PI / 2, 0, -angle + Math.PI / 2]}>
            <boxGeometry args={[0.01, 32, 0.005]} />
            <meshBasicMaterial color={TEAL} transparent opacity={0.02} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

function BrandSky() {
  const skyRef = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    if (!skyRef.current) return;
    const geo = skyRef.current.geometry;
    const posAttr = geo.getAttribute("position");
    const colors = new Float32Array(posAttr.count * 3);
    const bottom = new THREE.Color("#1a2a3a"); // dark navy
    const mid = new THREE.Color("#0f3a4a");    // teal-navy blend
    const top = new THREE.Color("#0a1520");     // near black
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      const t = (y / 30 + 1) / 2;
      const c = new THREE.Color();
      if (t < 0.4) c.lerpColors(bottom, mid, t / 0.4);
      else c.lerpColors(mid, top, (t - 0.4) / 0.6);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  }, []);

  return (
    <mesh ref={skyRef}>
      <sphereGeometry args={[30, 32, 24]} />
      <meshBasicMaterial vertexColors side={THREE.BackSide} />
    </mesh>
  );
}

/* ════════════════════════════════════════════
   ORBITAL RINGS — Thin rings around the torus
   ════════════════════════════════════════════ */

function OrbitalRings() {
  const ring1 = useRef<THREE.Mesh>(null!);
  const ring2 = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1.current) {
      ring1.current.rotation.x = Math.PI / 6 + Math.sin(t * 0.15) * 0.05;
      ring1.current.rotation.z = t * 0.02;
    }
    if (ring2.current) {
      ring2.current.rotation.x = -Math.PI / 5;
      ring2.current.rotation.z = -t * 0.015;
    }
  });

  return (
    <>
      <mesh ref={ring1}>
        <torusGeometry args={[RING_RADIUS + 1.5, 0.008, 8, 100]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.15} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[RING_RADIUS + 2, 0.005, 8, 100]} />
        <meshBasicMaterial color={TEAL_PALE} transparent opacity={0.1} />
      </mesh>
    </>
  );
}

/* ════════════════════════════════════════════
   CAMERA CONTROLLER
   ════════════════════════════════════════════ */

function CameraController({ activeStep }: { activeStep: number | null }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(6, 5, 10));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (activeStep !== null) {
      const [x, , z] = getStationPosition(activeStep);
      const camDist = 5;
      const angle = getStationAngle(activeStep);
      targetPos.current.set(
        x + Math.cos(angle) * camDist,
        3,
        z + Math.sin(angle) * camDist
      );
      targetLook.current.set(x, 0.5, z);
    } else {
      targetPos.current.set(6, 5, 10);
      targetLook.current.set(0, 0, 0);
    }
  }, [activeStep]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.025);
    const currentLook = new THREE.Vector3();
    camera.getWorldDirection(currentLook);
    currentLook.multiplyScalar(10).add(camera.position);
    currentLook.lerp(targetLook.current, 0.03);
  });

  return null;
}

/* ════════════════════════════════════════════
   SCENE ASSEMBLY
   ════════════════════════════════════════════ */

function Scene({ activeStep, onStepClick }: { activeStep: number | null; onStepClick: (i: number) => void }) {
  return (
    <>
      <Environment preset="night" background={false} environmentIntensity={0.3} />

      {/* Lighting */}
      <ambientLight intensity={0.3} color="#6080a0" />
      <directionalLight position={[10, 15, 8]} intensity={0.8} color="#e8e0d0" />
      <directionalLight position={[-8, 10, -5]} intensity={0.3} color="#a0c0e0" />
      <hemisphereLight color="#4a6a8a" groundColor="#1a2a1a" intensity={0.2} />

      <CameraController activeStep={activeStep} />
      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={5}
        maxDistance={20}
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI * 0.75}
        minPolarAngle={Math.PI * 0.15}
      />

      {/* Brand background */}
      <BrandBackground />

      {/* The torus — 7 colored segments */}
      {STEPS.map((_, i) => (
        <TorusSegment key={i} index={i} active={activeStep === i} onClick={() => onStepClick(i)} />
      ))}

      {/* Cutaway cross-section */}
      <CutawaySection />

      {/* Flow particles inside the torus */}
      <FlowParticles />

      {/* Flow direction arrows */}
      <FlowArrows />

      {/* Station markers with labels */}
      {STEPS.map((_, i) => (
        <StationMarker key={i} index={i} active={activeStep === i} onClick={() => onStepClick(i)} />
      ))}

      {/* Central core */}
      <CentralCore />

      {/* Orbital accent rings */}
      <OrbitalRings />

      {/* Station lights */}
      {STEPS.map((step, i) => {
        const [x, , z] = getStationPosition(i);
        return <pointLight key={i} position={[x, 2, z]} intensity={activeStep === i ? 2 : 0.1} color={step.color} distance={4} />;
      })}

      {/* Post-processing */}
      <EffectComposer>
        <Bloom intensity={0.3} luminanceThreshold={0.5} luminanceSmoothing={0.4} mipmapBlur />
        <Vignette offset={0.3} darkness={0.5} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT — Sidebar + Canvas
   ════════════════════════════════════════════ */

export default function StellarEngineTurbine() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const handleStepClick = useCallback((index: number) => {
    setActiveStep((prev) => (prev === index ? null : index));
  }, []);

  const activeData = activeStep !== null ? STEPS[activeStep] : null;

  return (
    <div className="h-screen w-screen bg-[#0a1520] flex">
      {/* Sidebar */}
      <div className="w-56 lg:w-64 shrink-0 bg-[#0d1a28]/90 backdrop-blur-md border-r border-white/[0.04] flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.04]">
          <p className="text-[#E07C3E] text-[9px] uppercase tracking-[0.5em] mb-1.5 font-semibold">
            System Architecture
          </p>
          <h1 className="text-lg font-heading text-white leading-tight">
            The Stellar <span className="text-[#E07C3E]">Engine</span>
          </h1>
          <p className="text-white/20 text-[10px] mt-1.5 leading-relaxed">
            Click segments to inspect. Drag to orbit.
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
                  ? "border-l-current bg-white/[0.04]"
                  : "border-l-transparent hover:bg-white/[0.02]"
              }`}
              style={{ borderColor: activeStep === i ? step.color : undefined }}
            >
              <div className="flex items-baseline gap-2">
                <span
                  className="text-[11px] font-heading"
                  style={{ color: activeStep === i ? step.color : "#555" }}
                >
                  {step.step}
                </span>
                <span className={`text-[11px] tracking-wider ${activeStep === i ? "text-white" : "text-white/40"}`}>
                  {step.title}
                </span>
              </div>
              <p className="text-white/15 text-[9px] mt-0.5">{step.subtitle}</p>
            </button>
          ))}
        </div>

        {/* Footer links */}
        <div className="p-5 border-t border-white/[0.04] space-y-2">
          <Link
            href="/programs"
            className="block text-center px-4 py-2 bg-[#E07C3E] text-white text-[10px] uppercase tracking-wider font-semibold hover:bg-[#E8944F] transition-colors rounded-md"
          >
            Explore Programs
          </Link>
          <Link
            href="/get-involved"
            className="block text-center px-4 py-2 border border-white/10 text-white/50 text-[10px] uppercase tracking-wider hover:bg-white/[0.04] transition-colors rounded-md"
          >
            Partner With Us
          </Link>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [6, 5, 10], fov: 40 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color("#0a1520"));
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
        >
          <Scene activeStep={activeStep} onStepClick={handleStepClick} />
        </Canvas>

        {/* Detail panel */}
        {activeData && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a1520] via-[#0a1520]/80 to-transparent pt-12 pb-6 px-8">
            <div className="max-w-xl">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[#E07C3E] font-heading text-xl">{activeData.step}</span>
                <h2 className="text-sm font-heading text-white tracking-wider">{activeData.title}</h2>
                <span className="text-white/15 text-[10px] uppercase tracking-wider">— {activeData.subtitle}</span>
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

        {/* Watermark */}
        {activeStep === null && (
          <div className="absolute bottom-6 left-8 pointer-events-none">
            <p className="text-white/[0.06] text-[10px] uppercase tracking-[0.5em]">
              The Mindful Group — Milwaukee, WI
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
