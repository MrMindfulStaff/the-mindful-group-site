"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Live wages ticker — starts at a base amount and ticks upward
 * continuously like a clock, simulating ongoing economic impact.
 *
 * Base: $65,000,000 (current cumulative wages as of April 2026)
 * Rate: estimated ~$3.2M/year ≈ $6.08/second
 *
 * The base and rate can be updated as real numbers come in.
 * The ticker always starts from the base when the page loads,
 * then counts upward in real time.
 */

const BASE_WAGES = 65_000_000;     // $65M — update this when real data changes
const BASE_DATE = new Date("2026-04-10T00:00:00"); // when the base was set
const ANNUAL_RATE = 3_200_000;     // ~$3.2M/year estimated ongoing generation
const PER_SECOND = ANNUAL_RATE / (365.25 * 24 * 60 * 60); // ~$0.1014/sec

function formatDollars(amount: number): string {
  if (amount >= 1_000_000) {
    return "$" + (amount / 1_000_000).toFixed(amount >= 100_000_000 ? 1 : 2) + "M";
  }
  return "$" + amount.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function WagesTicker({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(formatDollars(BASE_WAGES));
  const [started, setStarted] = useState(false);

  // Initial count-up animation (like AnimatedCounter)
  useEffect(() => {
    if (!isInView || started) return;

    let frame: number;
    const duration = 2500; // ms for initial count-up
    const startTime = performance.now();
    const targetValue = BASE_WAGES + ((Date.now() - BASE_DATE.getTime()) / 1000) * PER_SECOND;

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * targetValue;
      setDisplay(formatDollars(current));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setStarted(true);
      }
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView, started]);

  // Continuous ticking after initial animation
  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      const secondsSinceBase = (Date.now() - BASE_DATE.getTime()) / 1000;
      const current = BASE_WAGES + secondsSinceBase * PER_SECOND;
      setDisplay(formatDollars(current));
    }, 100); // update 10x/sec for smooth ticking

    return () => clearInterval(interval);
  }, [started]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
