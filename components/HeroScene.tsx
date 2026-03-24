"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function ParticleFlow() {
  const count = 400;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      // Particles flow in a toroidal path (closed loop)
      const angle = (i / count) * Math.PI * 2;
      const radius = 3 + Math.random() * 1.5;
      const speed = 0.15 + Math.random() * 0.1;
      const yOffset = (Math.random() - 0.5) * 2;
      const phase = Math.random() * Math.PI * 2;
      const size = 0.015 + Math.random() * 0.025;
      arr.push({ angle, radius, speed, yOffset, phase, size });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      const a = p.angle + t * p.speed;
      const r = p.radius + Math.sin(t * 0.5 + p.phase) * 0.3;
      dummy.position.set(
        Math.cos(a) * r,
        p.yOffset + Math.sin(t * 0.3 + p.phase) * 0.5,
        Math.sin(a) * r
      );
      dummy.scale.setScalar(p.size * (1 + Math.sin(t + p.phase) * 0.3));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#93B396" transparent opacity={0.7} />
    </instancedMesh>
  );
}

function FlowRings() {
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);
  const ring3Ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.sin(t * 0.2) * 0.1;
      ring1Ref.current.rotation.z = t * 0.05;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.15) * 0.1;
      ring2Ref.current.rotation.y = t * 0.03;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = Math.sin(t * 0.1) * 0.2;
      ring3Ref.current.rotation.z = -t * 0.04;
    }
  });

  return (
    <>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#1A7A5C" transparent opacity={0.3} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[4, 0.01, 16, 100]} />
        <meshBasicMaterial color="#E07C3E" transparent opacity={0.2} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[4.5, 0.008, 16, 100]} />
        <meshBasicMaterial color="#1B3A5C" transparent opacity={0.15} />
      </mesh>
    </>
  );
}

function CoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.05);
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshBasicMaterial
          color="#1A7A5C"
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshBasicMaterial color="#E07C3E" transparent opacity={0.15} />
      </mesh>
    </Float>
  );
}

function StepNodes() {
  const steps = [
    { label: "Recruit", angle: 0 },
    { label: "Train", angle: (Math.PI * 2) / 7 },
    { label: "Certify", angle: (2 * Math.PI * 2) / 7 },
    { label: "Place", angle: (3 * Math.PI * 2) / 7 },
    { label: "Surplus", angle: (4 * Math.PI * 2) / 7 },
    { label: "Reinvest", angle: (5 * Math.PI * 2) / 7 },
    { label: "Scale", angle: (6 * Math.PI * 2) / 7 },
  ];

  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {steps.map((step, i) => {
        const r = 3.5;
        const x = Math.cos(step.angle) * r;
        const z = Math.sin(step.angle) * r;
        const isKey = i === 4; // Surplus node
        return (
          <Float key={step.label} speed={2} floatIntensity={0.2}>
            <mesh position={[x, 0, z]}>
              <octahedronGeometry args={[isKey ? 0.18 : 0.12, 0]} />
              <meshBasicMaterial
                color={isKey ? "#E07C3E" : "#1A7A5C"}
                transparent
                opacity={0.8}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <CoreSphere />
      <ParticleFlow />
      <FlowRings />
      <StepNodes />
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
