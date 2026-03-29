"use client";

import { useState, useEffect, Suspense, lazy } from "react";

const StellarEngineTurbine = lazy(() => import("./StellarEngineTurbine"));

function useCanRender3D() {
  const [canRender, setCanRender] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) {
        setCanRender(false);
        return;
      }
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      // @ts-expect-error - deviceMemory not in all browsers
      const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
      setCanRender(!(isMobile && lowMemory));
    } catch {
      setCanRender(false);
    }
  }, []);

  return canRender;
}

export default function StellarEngineExperience({ fallback }: { fallback: React.ReactNode }) {
  const canRender = useCanRender3D();

  if (canRender === null) return <>{fallback}</>;
  if (!canRender) return <>{fallback}</>;

  return (
    <Suspense fallback={<>{fallback}</>}>
      <StellarEngineTurbine />
    </Suspense>
  );
}
