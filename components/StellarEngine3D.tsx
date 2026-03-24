"use client";

import Scene3DWrapper from "./Scene3DWrapper";

export default function StellarEngine3D() {
  return (
    <div className="bg-surface rounded-lg overflow-hidden">
      <Scene3DWrapper scene="stellar-engine" />
    </div>
  );
}
