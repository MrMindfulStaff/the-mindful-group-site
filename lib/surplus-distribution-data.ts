// ============================================================
// Surplus Distribution — data definitions
// Edit allocations here without touching the 3D rendering code.
// ============================================================

export interface Allocation {
  pct: number;
  name: string;
  description: string;
}

export const ALLOCATIONS: Allocation[] = [
  {
    pct: 30,
    name: "Supportive Services",
    description:
      "Housing assistance, transportation, childcare, and mental health support. Removes the non-training barriers that cause dropout.",
  },
  {
    pct: 20,
    name: "Non-WIOA Access",
    description:
      "Funds training slots for participants not eligible for government subsidies \u2014 ensuring zero-tuition extends beyond the WIOA-eligible population.",
  },
  {
    pct: 30,
    name: "Program Expansion",
    description:
      "Capital for new cohorts, new training tracks, and new geographies. Surplus funds the growth rather than external grants.",
  },
  {
    pct: 20,
    name: "Operational Reserves",
    description:
      "Financial stability buffer. Ensures the system absorbs enrollment fluctuations without collapsing or cutting services.",
  },
];
