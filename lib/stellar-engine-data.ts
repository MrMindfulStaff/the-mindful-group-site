// ============================================================
// Stellar Engine — data definitions
// Edit section labels, icons, and definitions here without
// touching the 3D rendering code.
// ============================================================

export interface StellarSection {
  id: string;
  name: string;
  icon: string;
  definition: string;
}

export const SECTIONS: StellarSection[] = [
  {
    id: "recruit",
    name: "Recruit",
    icon: "\u{1F465}",
    definition:
      "Participants are recruited from underserved communities, with priority given to individuals facing employment barriers \u2014 returning citizens, single parents, and chronically unemployed residents.",
  },
  {
    id: "train",
    name: "Train",
    icon: "\u{1F4DA}",
    definition:
      "Participants complete accelerated, industry-recognized certification programs \u2014 CNA/CBRF, Construction Pre-Apprenticeship, Phlebotomy \u2014 with wraparound support removing every barrier.",
  },
  {
    id: "certify",
    name: "Certify",
    icon: "\u{1F393}",
    definition:
      "Graduates earn credentials that meet employer standards \u2014 not participation certificates, but industry-required qualifications that open career doors immediately.",
  },
  {
    id: "place",
    name: "Place",
    icon: "\u{1F91D}",
    definition:
      "The staffing arm places graduates with employer partners. This placement event generates workforce revenue \u2014 the fuel that powers the entire engine.",
  },
  {
    id: "surplus",
    name: "Generate Surplus",
    icon: "\u{1F4C8}",
    definition:
      "Revenue from placement and training exceeds operating costs, creating surplus. This is not profit for extraction \u2014 it is fuel for the next cycle.",
  },
  {
    id: "reinvest",
    name: "Reinvest",
    icon: "\u{1F504}",
    definition:
      "Surplus is allocated: 30% supportive services, 20% non-WIOA participant access, 30% program expansion, and 20% operational reserves.",
  },
  {
    id: "scale",
    name: "Scale",
    icon: "\u{1F680}",
    definition:
      "As enrollment grows, costs per participant decrease and surplus increases \u2014 the system becomes more efficient at scale, not less. Then the loop repeats.",
  },
];

export const PALETTE = {
  platinum: 0xd8dce4,
  brushedSteel: 0x8a92a0,
  darkSteel: 0x3a4150,
  charcoal: 0x1a1f28,
  copper: 0xb87333,
  copperBright: 0xc9a57a,
  copperDeep: 0x8a5020,
  coreWhite: 0xffffff,
  coreWarm: 0xffd896,
  coreHot: 0xfff5e0,
  orbitGlow: 0xffb870,
} as const;
