"use client";

import dynamic from "next/dynamic";

const EngineRingDiagram = dynamic(() => import("@/components/EngineRingDiagram"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square max-w-xl mx-auto rounded-2xl bg-surface border border-border-light animate-pulse flex items-center justify-center">
      <p className="text-text-light text-sm">Loading diagram...</p>
    </div>
  ),
});

export default function EngineRingWrapper() {
  return <EngineRingDiagram />;
}
