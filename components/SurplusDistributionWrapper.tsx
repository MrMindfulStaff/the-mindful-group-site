"use client";

import dynamic from "next/dynamic";

const SurplusDistribution = dynamic(
  () => import("@/components/SurplusDistribution"),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full flex items-center justify-center"
        style={{
          height: "100vh",
          minHeight: "600px",
          background: "radial-gradient(ellipse at center, #0a0d14 0%, #000 75%)",
        }}
      >
        <span className="text-[10px] tracking-[0.4em]" style={{ color: "#ffd896" }}>
          INITIALIZING &middot; DISTRIBUTION FLOW
        </span>
      </div>
    ),
  }
);

interface Props {
  height?: string;
}

export default function SurplusDistributionWrapper({ height }: Props) {
  return <SurplusDistribution height={height} />;
}
