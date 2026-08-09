import { ImageResponse } from "next/og";

export const alt = "Paardhiv Sarakam — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          background: "#1b1d1a",
          color: "#e8ebf3",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#ff3f1a",
            marginBottom: 24,
            display: "flex",
          }}
        >
          Software Engineer
        </div>
        <div style={{ fontSize: 108, fontWeight: 700, display: "flex" }}>
          Paardhiv Sarakam
        </div>
        <div
          style={{
            fontSize: 32,
            marginTop: 28,
            color: "rgba(232,235,243,0.7)",
            display: "flex",
          }}
        >
          I build things that work, and read well.
        </div>
      </div>
    ),
    { ...size },
  );
}
