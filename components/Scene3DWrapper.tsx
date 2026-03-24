"use client";

import { useState, useEffect, Suspense, lazy, type ComponentType } from "react";

interface Scene3DWrapperProps {
  scene: "hero" | "stellar-engine";
  fallback?: React.ReactNode;
}

// Lazy load the 3D scenes
const HeroScene = lazy(() => import("./HeroScene"));
const StellarEngineScene = lazy(() => import("./StellarEngineScene"));

function useCanRender3D() {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    // Check for WebGL support and device capability
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) {
        setCanRender(false);
        return;
      }

      // Check if mobile with low memory (rough heuristic)
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      // @ts-expect-error - deviceMemory is not in all browsers
      const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;

      // Allow on desktop always, on mobile only if decent device
      if (isMobile && lowMemory) {
        setCanRender(false);
      } else {
        setCanRender(true);
      }
    } catch {
      setCanRender(false);
    }
  }, []);

  return canRender;
}

export default function Scene3DWrapper({ scene, fallback }: Scene3DWrapperProps) {
  const canRender = useCanRender3D();

  if (!canRender) {
    return <>{fallback}</> || null;
  }

  const SceneComponent: ComponentType = scene === "hero" ? HeroScene : StellarEngineScene;

  return (
    <Suspense
      fallback={
        <div className="absolute inset-0 z-0" />
      }
    >
      <SceneComponent />
    </Suspense>
  );
}
