import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "The Mindful Group — Community First. Opportunity Always.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
          height: "100%",
          backgroundColor: "#1B3A5C",
          padding: "80px",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            width: 80,
            height: 6,
            backgroundColor: "#E07C3E",
            marginBottom: 32,
            borderRadius: 3,
          }}
        />
        {/* Eyebrow */}
        <div
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.3em",
            textTransform: "uppercase" as const,
            marginBottom: 24,
            fontFamily: "sans-serif",
          }}
        >
          Reverse Engineering Poverty
        </div>
        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "white",
            lineHeight: 1.1,
            marginBottom: 8,
            fontFamily: "serif",
          }}
        >
          Community First.
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#E07C3E",
            lineHeight: 1.1,
            marginBottom: 40,
            fontFamily: "serif",
          }}
        >
          Opportunity Always.
        </div>
        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 48,
          }}
        >
          {[
            { stat: "525+", label: "Trained" },
            { stat: "90%", label: "Graduation" },
            { stat: "85%", label: "Job Placement" },
            { stat: "$65M+", label: "Wages" },
          ].map((m) => (
            <div
              key={m.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: "white",
                  fontFamily: "serif",
                }}
              >
                {m.stat}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.15em",
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>
        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 80,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.4)",
              fontFamily: "sans-serif",
            }}
          >
            The Mindful Group Inc. — Milwaukee, WI
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
