"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";

/* ════════════════════════════════════════════════════════════════
   STELLAR ENGINE TURBINE — Interactive 3D Model
   Click a process step → engine rotates & zooms to that section.
   Sidebar navigation + free orbit controls.
   ════════════════════════════════════════════════════════════════ */

const STEEL = "#8a9aa5";
const STEEL_DARK = "#4a5a65";
const COPPER = "#b87333";
const COPPER_LIGHT = "#d4956b";
const ORANGE_GLOW = "#E07C3E";
const TEAL = "#1A7A5C";
const HOT_CORE = "#ff6633";

/* ── Step data ── */
const STEPS = [
  {
    id: "recruit",
    step: "01",
    title: "RECRUIT",
    part: "Intake Fan",
    cameraY: 8,
    cameraRadius: 7,
    cameraAngle: 0.2,
    color: TEAL,
    desc: "The intake fan draws air into the engine. The Stellar Engine draws participants from underserved communities — priority for those facing employment barriers in Milwaukee's 53206.",
    details: ["Zero-tuition enrollment", "Court & probation partnerships", "Community-based recruitment", "Walk-in orientations every other Tuesday"],
  },
  {
    id: "train",
    step: "02",
    title: "TRAIN",
    part: "Compressor Stages",
    cameraY: 5.2,
    cameraRadius: 7,
    cameraAngle: 0.8,
    color: TEAL,
    desc: "Compressor stages increase pressure and density. Accelerated certification programs compress months of training into focused, high-density cohorts.",
    details: ["CNA/CBRF Healthcare Training", "Construction & Trades", "Phlebotomy Certification", "Career Development Workshops"],
  },
  {
    id: "certify",
    step: "03",
    title: "CERTIFY",
    part: "Combustion Chamber",
    cameraY: 2.5,
    cameraRadius: 8,
    cameraAngle: 1.5,
    color: ORANGE_GLOW,
    desc: "The combustion chamber is where transformation happens. Certification is the ignition point: participants become credentialed professionals. Real credentials, not participation certificates.",
    details: ["State-recognized certifications", "90% graduation rate", "Industry-standard credentials", "Employer-validated curriculum"],
  },
  {
    id: "place",
    step: "04",
    title: "PLACE",
    part: "Turbine Blades",
    cameraY: -0.3,
    cameraRadius: 7,
    cameraAngle: 2.2,
    color: COPPER,
    desc: "Turbine blades extract energy from hot gas. The staffing arm places graduates with employers, extracting workforce revenue from every successful placement.",
    details: ["85% job placement rate", "Staffing arm generates revenue", "Employer partnership network", "Wage tracking & career support"],
  },
  {
    id: "surplus",
    step: "05",
    title: "GENERATE SURPLUS",
    part: "Exhaust Thrust",
    cameraY: -3.5,
    cameraRadius: 8,
    cameraAngle: 3.0,
    color: ORANGE_GLOW,
    desc: "Exhaust thrust is raw power output. Revenue exceeds operating costs. This is not profit — it is thrust. The force that propels the entire system forward.",
    details: ["Revenue exceeds operating cost", "Not grant-dependent", "Surplus = system fuel", "Workforce revenue is the floor"],
  },
  {
    id: "reinvest",
    step: "06",
    title: "REINVEST",
    part: "Fuel Return Loop",
    cameraY: 0,
    cameraRadius: 10,
    cameraAngle: 3.8,
    color: TEAL,
    desc: "Return loops cycle fuel back to the combustion chamber. Surplus flows back into the system that created it.",
    details: ["30% → Supportive services", "20% → Non-WIOA participant access", "30% → Program expansion", "20% → Operating reserves"],
  },
  {
    id: "scale",
    step: "07",
    title: "SCALE",
    part: "Afterburner",
    cameraY: -5.5,
    cameraRadius: 8,
    cameraAngle: 4.5,
    color: HOT_CORE,
    desc: "The afterburner amplifies thrust beyond normal output. At scale, cost per participant decreases while surplus increases. The engine gets more powerful, not less.",
    details: ["Cost per participant decreases", "Surplus per cycle increases", "Replication-ready architecture", "Proven in Milwaukee's 53206"],
  },
];

/* ── Animated camera that lerps to target ── */
function AnimatedCamera({ activeStep }: { activeStep: number | null }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(6, 6, 10));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (activeStep === null) {
      targetPos.current.set(6, 6, 10);
      targetLookAt.current.set(0, 0, 0);
    } else {
      const step = STEPS[activeStep];
      const angle = step.cameraAngle;
      const r = step.cameraRadius;
      targetPos.current.set(
        Math.sin(angle) * r,
        step.cameraY + 1,
        Math.cos(angle) * r
      );
      targetLookAt.current.set(0, step.cameraY, 0);
    }
  }, [activeStep]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.03);
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    const target = targetLookAt.current.clone().sub(camera.position).normalize();
    currentLookAt.lerp(target, 0.03);
    camera.lookAt(
      camera.position.x + currentLookAt.x * 10,
      camera.position.y + currentLookAt.y * 10,
      camera.position.z + currentLookAt.z * 10
    );
  });

  return null;
}

/* ── Clickable highlight ring ── */
function HighlightRing({ y, color, active }: { y: number; color: string; active: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    if (active) {
      mat.opacity = 0.4 + Math.sin(t * 3) * 0.15;
      ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    } else {
      mat.opacity = 0.08;
      ref.current.scale.setScalar(1);
    }
  });

  return (
    <mesh ref={ref} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[3.2, 0.04, 8, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.08} />
    </mesh>
  );
}

/* ── Fan Blades ── */
function BladeRing({
  y, radius, bladeCount, bladeLength, color, speed, reverse = false,
}: {
  y: number; radius: number; bladeCount: number; bladeLength: number;
  color: string; speed: number; reverse?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * speed * (reverse ? -1 : 1);
  });

  const blades = useMemo(() => {
    return Array.from({ length: bladeCount }, (_, i) => (i / bladeCount) * Math.PI * 2);
  }, [bladeCount]);

  return (
    <group ref={groupRef} position={[0, y, 0]}>
      <mesh>
        <cylinderGeometry args={[radius * 0.3, radius * 0.3, 0.15, 16]} />
        <meshStandardMaterial color={STEEL_DARK} metalness={0.9} roughness={0.15} />
      </mesh>
      {blades.map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(angle) * (radius * 0.5 + bladeLength * 0.3),
            0,
            Math.sin(angle) * (radius * 0.5 + bladeLength * 0.3),
          ]}
          rotation={[0, -angle + Math.PI / 2, Math.PI / 12]}
        >
          <boxGeometry args={[bladeLength, 0.04, 0.25]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Nacelle ── */
function Nacelle() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[2.8, 2.8, 18, 32, 1, true]} />
        <meshStandardMaterial color={STEEL} metalness={0.85} roughness={0.25} side={THREE.DoubleSide} transparent opacity={0.12} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[2.82, 2.82, 18, 24, 8, true]} />
        <meshBasicMaterial color={STEEL_DARK} wireframe transparent opacity={0.06} />
      </mesh>
      <mesh position={[0, 8.5, 0]}>
        <cylinderGeometry args={[3.2, 2.8, 1.5, 32]} />
        <meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.2} transparent opacity={0.1} />
      </mesh>
      <mesh position={[0, -8.5, 0]}>
        <cylinderGeometry args={[2.8, 2.0, 1.5, 32]} />
        <meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.2} transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

/* ── Intake Fan — RECRUIT ── */
function IntakeFan() {
  return (
    <group>
      <BladeRing y={8} radius={2.5} bladeCount={16} bladeLength={1.8} color={COPPER} speed={0.4} />
      <mesh position={[0, 9, 0]}>
        <coneGeometry args={[0.6, 1.5, 16]} />
        <meshStandardMaterial color={STEEL} metalness={0.95} roughness={0.1} />
      </mesh>
    </group>
  );
}

/* ── Compressor — TRAIN ── */
function CompressorStages() {
  return (
    <group>
      {[6, 5.3, 4.6, 3.9].map((y, i) => (
        <BladeRing
          key={i} y={y} radius={2.2 - i * 0.15} bladeCount={20 + i * 4}
          bladeLength={1.2 - i * 0.1} color={i % 2 === 0 ? COPPER : COPPER_LIGHT}
          speed={0.6 + i * 0.15} reverse={i % 2 === 1}
        />
      ))}
      {[5.65, 4.95, 4.25].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.0 - i * 0.1, 0.03, 8, 32]} />
          <meshStandardMaterial color={STEEL_DARK} metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Combustion Chamber — CERTIFY ── */
function CombustionChamber({ active }: { active: boolean }) {
  const glowRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const intensity = active ? 1 : 0.4;
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        intensity * (0.25 + Math.sin(t * 3) * 0.1);
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = t * 0.3;
      (innerRef.current.material as THREE.MeshBasicMaterial).opacity =
        intensity * (0.12 + Math.sin(t * 5) * 0.05);
    }
  });

  return (
    <group position={[0, 2.5, 0]}>
      <mesh>
        <cylinderGeometry args={[2.4, 2.4, 2.5, 24, 1, true]} />
        <meshStandardMaterial color={STEEL_DARK} metalness={0.85} roughness={0.3} side={THREE.DoubleSide} transparent opacity={0.2} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 2.35, 0, Math.sin(angle) * 2.35]} rotation={[0, -angle, 0]}>
            <ringGeometry args={[0.08, 0.15, 8]} />
            <meshBasicMaterial color={ORANGE_GLOW} transparent opacity={active ? 0.7 : 0.3} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      <mesh ref={glowRef}>
        <cylinderGeometry args={[1.5, 1.5, 2, 16]} />
        <meshBasicMaterial color={HOT_CORE} transparent opacity={0.15} />
      </mesh>
      <mesh ref={innerRef}>
        <torusGeometry args={[0.8, 0.4, 8, 16]} />
        <meshBasicMaterial color={ORANGE_GLOW} transparent opacity={0.1} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 2.1, 0.8, Math.sin(angle) * 2.1]} rotation={[Math.PI / 6, -angle, 0]}>
            <coneGeometry args={[0.06, 0.4, 6]} />
            <meshStandardMaterial color={COPPER} metalness={0.9} roughness={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ── Turbine — PLACE ── */
function TurbineSection() {
  return (
    <group>
      {[0.5, -0.3, -1.1].map((y, i) => (
        <BladeRing key={i} y={y} radius={2.0} bladeCount={24 - i * 2} bladeLength={1.3}
          color={i === 0 ? ORANGE_GLOW : COPPER} speed={0.5 - i * 0.05} reverse={i % 2 === 0} />
      ))}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 3, 12]} />
        <meshStandardMaterial color={STEEL} metalness={0.95} roughness={0.1} />
      </mesh>
    </group>
  );
}

/* ── Exhaust Particles — SURPLUS ── */
function ExhaustSection() {
  const particlesRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 80;

  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      angle: Math.random() * Math.PI * 2,
      speed: 1 + Math.random() * 2,
      r: Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
    })), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      const cycle = ((t * p.speed * 0.3 + p.phase) % 1);
      const yPos = -3 - cycle * 4;
      const spread = cycle * p.r;
      dummy.position.set(Math.cos(p.angle) * spread, yPos, Math.sin(p.angle) * spread);
      dummy.scale.setScalar(0.025 * (1 - cycle));
      dummy.updateMatrix();
      particlesRef.current.setMatrixAt(i, dummy.matrix);
    });
    particlesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.8, -3.5, Math.sin(angle) * 1.8]} rotation={[0.1, -angle, 0]}>
            <boxGeometry args={[0.6, 1.5, 0.03]} />
            <meshStandardMaterial color={STEEL_DARK} metalness={0.85} roughness={0.25} />
          </mesh>
        );
      })}
      <instancedMesh ref={particlesRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color={ORANGE_GLOW} transparent opacity={0.45} />
      </instancedMesh>
    </group>
  );
}

/* ── Fuel Return Pipes — REINVEST ── */
function FuelReturnLoop() {
  return (
    <group>
      {[0, Math.PI * 0.667, Math.PI * 1.333].map((angle, i) => (
        <group key={i} rotation={[0, angle, 0]}>
          <mesh position={[3.5, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 16, 8]} />
            <meshStandardMaterial color={TEAL} metalness={0.7} roughness={0.3} transparent opacity={0.35} />
          </mesh>
          {[-6, -3, 0, 3, 6].map((y, j) => (
            <mesh key={j} position={[3.5, y, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.12, 0.3, 6]} />
              <meshBasicMaterial color={TEAL} transparent opacity={0.25} />
            </mesh>
          ))}
          <mesh position={[3.1, 7.5, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.06, 0.06, 1.5, 8]} />
            <meshStandardMaterial color={TEAL} metalness={0.7} roughness={0.3} transparent opacity={0.3} />
          </mesh>
          <mesh position={[3.1, -7.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.06, 0.06, 1.5, 8]} />
            <meshStandardMaterial color={TEAL} metalness={0.7} roughness={0.3} transparent opacity={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ── Afterburner — SCALE ── */
function AfterburnerSection() {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.08);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.15 + Math.sin(t * 3) * 0.05;
    }
  });

  return (
    <group position={[0, -5.5, 0]}>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.15, 8, 24]} />
        <meshBasicMaterial color={HOT_CORE} transparent opacity={0.15} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.2, 0, Math.sin(angle) * 1.2]}>
            <boxGeometry args={[0.15, 0.6, 0.08]} />
            <meshStandardMaterial color={STEEL_DARK} metalness={0.9} roughness={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ── Drive shaft ── */
function DriveShaft() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => { ref.current.rotation.y = state.clock.elapsedTime * 0.8; });
  return (
    <mesh ref={ref} position={[0, 2, 0]}>
      <cylinderGeometry args={[0.15, 0.15, 20, 8]} />
      <meshStandardMaterial color={STEEL} metalness={0.95} roughness={0.1} />
    </mesh>
  );
}

/* ── Scene ── */
function EngineScene({ activeStep }: { activeStep: number | null }) {
  return (
    <>
      <ambientLight intensity={0.3} color="#8ab4c8" />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <directionalLight position={[-3, -5, 3]} intensity={0.3} color="#ff8844" />
      <pointLight position={[0, 2.5, 0]} intensity={1.5} color={ORANGE_GLOW} distance={6} />
      <pointLight position={[0, -5.5, 0]} intensity={0.8} color={HOT_CORE} distance={4} />

      <AnimatedCamera activeStep={activeStep} />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={5}
        maxDistance={18}
        enableDamping
        dampingFactor={0.05}
      />

      <Nacelle />
      <DriveShaft />
      <IntakeFan />
      <CompressorStages />
      <CombustionChamber active={activeStep === 2} />
      <TurbineSection />
      <ExhaustSection />
      <FuelReturnLoop />
      <AfterburnerSection />

      {/* Highlight rings for each step */}
      {STEPS.map((step, i) => (
        <HighlightRing key={step.id} y={step.cameraY} color={step.color} active={activeStep === i} />
      ))}
    </>
  );
}

/* ── Main export with sidebar ── */
export default function StellarEngineTurbine() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const handleStepClick = useCallback((index: number) => {
    setActiveStep((prev) => (prev === index ? null : index));
  }, []);

  const activeData = activeStep !== null ? STEPS[activeStep] : null;

  return (
    <div className="h-screen w-screen bg-[#0a1018] flex">
      {/* Sidebar */}
      <div className="w-72 lg:w-80 shrink-0 bg-black/60 backdrop-blur-md border-r border-white/5 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/5">
          <p className="text-[#E07C3E] text-[10px] uppercase tracking-[0.4em] mb-2 font-semibold">
            System Architecture
          </p>
          <h1 className="text-2xl font-heading text-white leading-tight">
            The Stellar <span className="text-[#E07C3E]">Engine</span>
          </h1>
          <p className="text-white/30 text-xs mt-2 leading-relaxed">
            Click a component to inspect. Drag to rotate. Scroll to zoom.
          </p>
        </div>

        {/* Step list */}
        <div className="flex-1 py-2">
          {STEPS.map((step, i) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(i)}
              className={`w-full text-left px-6 py-4 transition-all duration-300 border-l-2 ${
                activeStep === i
                  ? "bg-white/5 border-[#E07C3E]"
                  : "border-transparent hover:bg-white/[0.02] hover:border-white/10"
              }`}
            >
              <div className="flex items-baseline gap-3">
                <span
                  className="font-heading text-lg"
                  style={{ color: activeStep === i ? step.color : "rgba(255,255,255,0.25)" }}
                >
                  {step.step}
                </span>
                <div>
                  <p
                    className={`text-sm font-semibold tracking-wider transition-colors ${
                      activeStep === i ? "text-white" : "text-white/50"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-white/20 text-[10px] uppercase tracking-wider mt-0.5">
                    {step.part}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Configurations footer */}
        <div className="p-6 border-t border-white/5">
          <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] mb-3">Configurations</p>
          <div className="space-y-2">
            <div className="px-3 py-2 bg-white/[0.03] rounded border border-white/5 text-xs">
              <span className="text-white/40">A.</span>{" "}
              <span className="text-white/60">Little Dipper</span>
              <span className="text-white/20 ml-1">— workforce only</span>
            </div>
            <div className="px-3 py-2 bg-white/[0.03] rounded border border-[#E07C3E]/10 text-xs">
              <span className="text-[#E07C3E]/50">B.</span>{" "}
              <span className="text-white/60">Big Dipper</span>
              <span className="text-white/20 ml-1">— full power</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-6 border-t border-white/5 space-y-3">
          <Link
            href="/programs"
            className="block w-full px-4 py-3 bg-[#E07C3E] text-white text-xs font-semibold uppercase tracking-wider text-center rounded-md hover:bg-[#E8944F] transition-colors"
          >
            Explore Programs
          </Link>
          <Link
            href="/get-involved"
            className="block w-full px-4 py-3 border border-white/15 text-white text-xs uppercase tracking-wider text-center rounded-md hover:bg-white/5 transition-colors"
          >
            Partner With Us
          </Link>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <Canvas camera={{ position: [6, 6, 10], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
          <EngineScene activeStep={activeStep} />
        </Canvas>

        {/* Detail panel — slides in when a step is active */}
        {activeData && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-8 pt-16">
            <div className="max-w-2xl">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-[#E07C3E] font-heading text-3xl">{activeData.step}</span>
                <h2 className="text-xl font-heading text-white tracking-wider">{activeData.title}</h2>
                <span className="text-white/20 text-xs uppercase tracking-wider">— {activeData.part}</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-4 max-w-lg">{activeData.desc}</p>
              <div className="flex flex-wrap gap-2">
                {activeData.details.map((d) => (
                  <span key={d} className="px-3 py-1 bg-white/5 border border-white/10 rounded text-white/50 text-xs">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reset view button */}
        {activeStep !== null && (
          <button
            onClick={() => setActiveStep(null)}
            className="absolute top-6 right-6 px-4 py-2 bg-white/5 border border-white/10 rounded text-white/50 text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
          >
            Reset View
          </button>
        )}
      </div>
    </div>
  );
}
