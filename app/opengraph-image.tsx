import { ImageResponse } from "next/og";

export const alt = "PingMe — Say it. Forget it. We’ll remember.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F8FC", fontFamily: "sans-serif" }}><div style={{ width: 1050, height: 490, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 66, borderRadius: 48, color: "white", background: "linear-gradient(135deg,#635BFF,#4D45E6 62%,#8B83FF)" }}><div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 38, fontWeight: 800 }}><span style={{ width: 58, height: 50, borderRadius: 18, display: "flex", background: "white", position: "relative" }} />PingMe</div><div style={{ display: "flex", flexDirection: "column" }}><div style={{ display: "flex", flexDirection: "column", fontSize: 74, lineHeight: 1.05, fontWeight: 800, letterSpacing: -3 }}><span>Say it. Forget it.</span><span>We’ll remember.</span></div><div style={{ marginTop: 28, fontSize: 25, opacity: .84 }}>Your calm, local-first AI memory companion.</div></div></div></div>, size);
}
