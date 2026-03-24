"use client";

export default function StellarEngineDiagram() {
  // 7 steps around the circle
  const steps = [
    { label: "Recruit", short: "01" },
    { label: "Train", short: "02" },
    { label: "Certify", short: "03" },
    { label: "Place", short: "04" },
    { label: "Surplus", short: "05" },
    { label: "Reinvest", short: "06" },
    { label: "Scale", short: "07" },
  ];

  const cx = 250;
  const cy = 250;
  const r = 170;

  // Position steps around the circle (starting from top, going clockwise)
  const stepPositions = steps.map((_, i) => {
    const angle = (i / steps.length) * 2 * Math.PI - Math.PI / 2;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });

  // Arrow path between consecutive nodes (curved along the circle)
  const getArcPath = (i: number) => {
    const from = stepPositions[i];
    const to = stepPositions[(i + 1) % steps.length];

    // Offset start/end to not overlap circles
    const nodeR = 28;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / dist;
    const uy = dy / dist;

    const sx = from.x + ux * nodeR;
    const sy = from.y + uy * nodeR;
    const ex = to.x - ux * nodeR;
    const ey = to.y - uy * nodeR;

    // Curve outward slightly
    const mx = (sx + ex) / 2 + (sy - ey) * 0.15;
    const my = (sy + ey) / 2 + (ex - sx) * 0.15;

    return `M${sx},${sy} Q${mx},${my} ${ex},${ey}`;
  };

  return (
    <div className="w-full max-w-[540px] mx-auto">
      <svg viewBox="0 0 500 520" className="w-full h-auto" aria-label="Stellar Engine closed-loop architecture diagram">
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#1A7A5C" />
          </marker>
          <marker id="arrowhead-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#E07C3E" />
          </marker>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Center label */}
        <circle cx={cx} cy={cy} r="58" fill="#EFF5F0" stroke="#1A7A5C" strokeWidth="2" />
        <text x={cx} y={cy - 12} textAnchor="middle" fill="#1A7A5C" fontSize="11" fontWeight="700" fontFamily="Georgia, serif" letterSpacing="0.1em">
          STELLAR
        </text>
        <text x={cx} y={cy + 6} textAnchor="middle" fill="#1A7A5C" fontSize="11" fontWeight="700" fontFamily="Georgia, serif" letterSpacing="0.1em">
          ENGINE
        </text>
        <text x={cx} y={cy + 22} textAnchor="middle" fill="#6B7280" fontSize="8" fontFamily="Inter, sans-serif">
          Closed-Loop System
        </text>

        {/* Connection arcs with arrows */}
        {steps.map((_, i) => (
          <path
            key={`arc-${i}`}
            d={getArcPath(i)}
            fill="none"
            stroke="#1A7A5C"
            strokeWidth="2"
            strokeDasharray={i === 6 ? "6 3" : "none"}
            markerEnd="url(#arrowhead)"
            opacity={0.5}
          />
        ))}

        {/* Step nodes */}
        {steps.map((step, i) => {
          const pos = stepPositions[i];
          const isHighlight = i === 4; // Surplus is the key node
          return (
            <g key={step.label} filter="url(#shadow)">
              <circle
                cx={pos.x}
                cy={pos.y}
                r="28"
                fill={isHighlight ? "#1A7A5C" : "white"}
                stroke={isHighlight ? "#1A7A5C" : "#D1D5DB"}
                strokeWidth="2"
              />
              <text
                x={pos.x}
                y={pos.y - 5}
                textAnchor="middle"
                fill={isHighlight ? "white" : "#1A7A5C"}
                fontSize="9"
                fontWeight="700"
                fontFamily="Inter, sans-serif"
              >
                {step.short}
              </text>
              <text
                x={pos.x}
                y={pos.y + 8}
                textAnchor="middle"
                fill={isHighlight ? "white" : "#1F2937"}
                fontSize="8"
                fontWeight="600"
                fontFamily="Inter, sans-serif"
              >
                {step.label}
              </text>
            </g>
          );
        })}

        {/* Revenue streams flowing IN to the loop (at Place node, step 4) */}
        {/* Training Revenue - from left */}
        <g>
          <rect x="8" y="295" width="95" height="44" rx="6" fill="white" stroke="#1B3A5C" strokeWidth="1.5" filter="url(#shadow)" />
          <text x="55" y="312" textAnchor="middle" fill="#1B3A5C" fontSize="7.5" fontWeight="700" fontFamily="Inter, sans-serif">
            Training Rev
          </text>
          <text x="55" y="326" textAnchor="middle" fill="#6B7280" fontSize="6.5" fontFamily="Inter, sans-serif">
            WIOA / Tuition
          </text>
          <line x1="103" y1="317" x2="135" y2="317" stroke="#1B3A5C" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        </g>

        {/* Placement Revenue - from right */}
        <g>
          <rect x="397" y="205" width="95" height="44" rx="6" fill="white" stroke="#1B3A5C" strokeWidth="1.5" filter="url(#shadow)" />
          <text x="445" y="222" textAnchor="middle" fill="#1B3A5C" fontSize="7.5" fontWeight="700" fontFamily="Inter, sans-serif">
            Placement Rev
          </text>
          <text x="445" y="236" textAnchor="middle" fill="#6B7280" fontSize="6.5" fontFamily="Inter, sans-serif">
            Staffing Arm
          </text>
          <line x1="397" y1="227" x2="365" y2="240" stroke="#1B3A5C" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        </g>

        {/* Surplus distribution flowing OUT (from Surplus node, step 5) */}
        {/* Surplus node is at bottom-left area */}
        {(() => {
          const surplusPos = stepPositions[4];
          const distributions = [
            { label: "Supportive Svcs", pct: "30%", dy: 0 },
            { label: "Non-WIOA Access", pct: "20%", dy: 20 },
            { label: "Expansion", pct: "30%", dy: 40 },
            { label: "Reserves", pct: "20%", dy: 60 },
          ];

          // Position the distribution box below-left of surplus
          const boxX = 8;
          const boxY = 410;

          return (
            <g>
              {/* Connector line from surplus to distribution */}
              <path
                d={`M${surplusPos.x},${surplusPos.y + 28} Q${surplusPos.x - 30},${boxY - 10} ${boxX + 75},${boxY}`}
                fill="none"
                stroke="#E07C3E"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                markerEnd="url(#arrowhead-accent)"
              />

              {/* Distribution box */}
              <rect x={boxX} y={boxY} width="150" height="100" rx="8" fill="white" stroke="#E07C3E" strokeWidth="1.5" filter="url(#shadow)" />
              <text x={boxX + 75} y={boxY + 16} textAnchor="middle" fill="#E07C3E" fontSize="8" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="0.05em">
                SURPLUS ALLOCATION
              </text>
              {distributions.map((d, i) => (
                <g key={d.label}>
                  <text x={boxX + 12} y={boxY + 34 + i * 16} fill="#1A7A5C" fontSize="8" fontWeight="700" fontFamily="Inter, sans-serif">
                    {d.pct}
                  </text>
                  <text x={boxX + 42} y={boxY + 34 + i * 16} fill="#1F2937" fontSize="7.5" fontFamily="Inter, sans-serif">
                    {d.label}
                  </text>
                </g>
              ))}
            </g>
          );
        })()}

        {/* Sub-model labels */}
        <g>
          <rect x="335" y="440" width="155" height="65" rx="8" fill="white" stroke="#1A7A5C" strokeWidth="1.5" filter="url(#shadow)" />
          <text x="412" y="458" textAnchor="middle" fill="#1A7A5C" fontSize="8" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="0.05em">
            CONFIGURATIONS
          </text>
          <circle cx="355" cy="474" r="4" fill="#1B3A5C" />
          <text x="365" y="477" fill="#1F2937" fontSize="7.5" fontWeight="600" fontFamily="Inter, sans-serif">
            Little Dipper
          </text>
          <text x="365" y="488" fill="#6B7280" fontSize="6.5" fontFamily="Inter, sans-serif">
            Placement only
          </text>
          <circle cx="355" cy="498" r="4" fill="#1A7A5C" />
          <text x="365" y="501" fill="#1F2937" fontSize="7.5" fontWeight="600" fontFamily="Inter, sans-serif">
            Big Dipper
          </text>
          <text x="365" y="512" fill="#6B7280" fontSize="6.5" fontFamily="Inter, sans-serif">
            Training + Placement
          </text>
        </g>
      </svg>
    </div>
  );
}
