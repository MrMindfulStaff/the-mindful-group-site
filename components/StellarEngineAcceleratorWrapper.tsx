"use client";

import dynamic from "next/dynamic";

const StellarEngineAccelerator = dynamic(
  () => import("@/components/StellarEngineAccelerator"),
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
        <span
          className="text-[10px] tracking-[0.4em]"
          style={{ color: "#c9a57a" }}
        >
          INITIALIZING &middot; STELLAR ENGINE
        </span>
      </div>
    ),
  }
);

interface Props {
  height?: string;
}

export default function StellarEngineAcceleratorWrapper({ height }: Props) {
  return <StellarEngineAccelerator height={height} />;
}
