"use client";

import dynamic from "next/dynamic";

const CascadingBuckets = dynamic(() => import("@/components/CascadingBuckets"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[3/5] sm:aspect-[3/4] max-w-2xl mx-auto flex items-center justify-center bg-surface/50 rounded-2xl">
      <p className="text-text-light text-sm animate-pulse">Loading visualization...</p>
    </div>
  ),
});

export default function CascadingBucketsWrapper() {
  return <CascadingBuckets />;
}
