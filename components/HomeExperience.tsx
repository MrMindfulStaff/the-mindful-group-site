"use client";

import { useState, useEffect, Suspense, lazy } from "react";

const GlobeExperience = lazy(() => import("./GlobeExperience"));

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

export default function HomeExperience({ fallback }: { fallback: React.ReactNode }) {
  const canRender = useCanRender3D();

  // Still checking
  if (canRender === null) return <>{fallback}</>;

  // Can't render 3D
  if (!canRender) return <>{fallback}</>;

  // Full 3D experience
  return (
    <Suspense fallback={<>{fallback}</>}>
      <GlobeExperience />
    </Suspense>
  );
}
