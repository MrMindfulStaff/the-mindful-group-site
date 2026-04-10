"use client";

import dynamic from "next/dynamic";

const WagesTicker = dynamic(() => import("@/components/WagesTicker"), {
  ssr: false,
  loading: () => <span>$65M+</span>,
});

export default function WagesTickerWrapper({ className }: { className?: string }) {
  return <WagesTicker className={className} />;
}
