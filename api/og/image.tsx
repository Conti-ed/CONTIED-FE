import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const baseUrl = process.env.BACKEND_URL || "";

  let title = "CONTIED — 예배 콘티";
  let songCount = 0;

  try {
    const r = await fetch(`${baseUrl}/api/v1/conti/${id}`);
    if (r.ok) {
      const data = (await r.json()) as {
        title?: string;
        ContiToSong?: unknown[];
      };
      title = data.title || title;
      songCount = Array.isArray(data.ContiToSong) ? data.ContiToSong.length : 0;
    }
  } catch {
    // 백엔드 fetch 실패 시 기본값 사용
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #94b4ed 0%, #6f95df 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.85, marginBottom: 24, letterSpacing: "0.04em" }}>
          CONTI:ED — AI 예배 콘티
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, textAlign: "center", lineHeight: 1.2, marginBottom: 32 }}>
          {title}
        </div>
        {songCount > 0 && (
          <div style={{
            fontSize: 26,
            background: "rgba(255,255,255,0.18)",
            padding: "12px 28px",
            borderRadius: 999,
          }}>
            🎵 총 {songCount}곡
          </div>
        )}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
