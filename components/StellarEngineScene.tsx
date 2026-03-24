"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function ClosedLoopRing() {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2.5;
      ringRef.current.rotation.z = t * 0.03;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[3, 0.03, 16, 100]} />
      <meshBasicMaterial color="#1A7A5C" transparent opacity={0.5} />
    </mesh>
  );
}

function EnergyParticles() {
  const count = 300;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      const speed = 0.2 + Math.random() * 0.15;
      const offset = (Math.random() - 0.5) * 0.5;
      const yOff = (Math.random() - 0.5) * 1;
      const size = 0.01 + Math.random() * 0.02;
      // Color: 0 = teal (training), 1 = orange (revenue)
      const stream = Math.random() > 0.7 ? 1 : 0;
      arr.push({ t, speed, offset, yOff, size, stream });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      const a = p.t + time * p.speed;
      const r = 3 + p.offset;
      const tilt = Math.PI / 2.5;
      const x = Math.cos(a) * r;
      const rawY = Math.sin(a) * r;
      const y = rawY * Math.cos(tilt) + p.yOff * 0.3;
      const z = rawY * Math.sin(tilt);

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(p.size * (1 + Math.sin(time * 2 + p.t) * 0.4));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#93B396" transparent opacity={0.6} />
      </instancedMesh>
    </>
  );
}

function RevenueStreams() {
  const stream1Ref = useRef<THREE.Points>(null!);
  const stream2Ref = useRef<THREE.Points>(null!);

  const streamGeo1 = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      const t = i / 60;
      positions[i * 3] = -5 + t * 3;
      positions[i * 3 + 1] = Math.sin(t * Math.PI) * 0.5 - 0.5;
      positions[i * 3 + 2] = 0;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const streamGeo2 = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      const t = i / 60;
      positions[i * 3] = 5 - t * 3;
      positions[i * 3 + 1] = Math.sin(t * Math.PI) * 0.5 + 0.5;
      positions[i * 3 + 2] = 0;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (stream1Ref.current) {
      stream1Ref.current.rotation.y = Math.sin(t * 0.2) * 0.1;
    }
    if (stream2Ref.current) {
      stream2Ref.current.rotation.y = Math.sin(t * 0.2 + 1) * 0.1;
    }
  });

  return (
    <>
      <points ref={stream1Ref} geometry={streamGeo1}>
        <pointsMaterial color="#1B3A5C" size={0.04} transparent opacity={0.5} />
      </points>
      <points ref={stream2Ref} geometry={streamGeo2}>
        <pointsMaterial color="#E07C3E" size={0.04} transparent opacity={0.5} />
      </points>
    </>
  );
}

function SurplusRadiation() {
  const count = 80;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 0.5;
      const maxR = 2 + Math.random() * 3;
      const phase = Math.random() * Math.PI * 2;
      arr.push({ angle, speed, maxR, phase });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      const cycle = ((t * p.speed * 0.3 + p.phase) % 1);
      const r = cycle * p.maxR;
      const opacity = 1 - cycle;
      dummy.position.set(
        Math.cos(p.angle) * r,
        -2 + Math.sin(p.angle) * r * 0.3,
        Math.sin(p.angle) * r * 0.5
      );
      dummy.scale.setScalar(0.03 * opacity);
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

function EngineCore() {
  const coreRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.1;
      coreRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
      coreRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.05);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh ref={coreRef}>
        <dodecahedronGeometry args={[0.6, 0]} />
        <meshBasicMaterial color="#1A7A5C" wireframe transparent opacity={0.6} />
      </mesh>
      <mesh>
        <dodecahedronGeometry args={[0.45, 0]} />
        <meshBasicMaterial color="#E07C3E" transparent opacity={0.1} />
      </mesh>
    </Float>
  );
}

function StepMarkers() {
  const steps = ["Recruit", "Train", "Certify", "Place", "Surplus", "Reinvest", "Scale"];
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <group ref={groupRef} rotation={[Math.PI / 2.5, 0, 0]}>
      {steps.map((step, i) => {
        const angle = (i / steps.length) * Math.PI * 2;
        const r = 3;
        const isKey = i === 4;
        return (
          <Float key={step} speed={1.5} floatIntensity={0.15}>
            <mesh position={[Math.cos(angle) * r, Math.sin(angle) * r, 0]}>
              <octahedronGeometry args={[isKey ? 0.2 : 0.12, 0]} />
              <meshBasicMaterial
                color={isKey ? "#E07C3E" : "#1A7A5C"}
                transparent
                opacity={0.9}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <EngineCore />
      <ClosedLoopRing />
      <EnergyParticles />
      <StepMarkers />
      <RevenueStreams />
      <SurplusRadiation />
    </group>
  );
}

export default function StellarEngineScene() {
  return (
    <div className="w-full h-[500px] lg:h-[600px]">
      <Canvas
        camera={{ position: [0, 3, 9], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
