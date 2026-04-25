/**
 * Vercel Serverless Function — 콘티별 동적 OG 메타 HTML 반환
 *
 * 동작 원리:
 *   vercel.json rewrites 설정에 따라 카카오/페이스북/슬랙 등 봇 user-agent가
 *   /conti/:id 로 접근하면 이 함수가 호출됩니다.
 *   일반 사용자는 rewrites 우선순위에 따라 SPA(/index.html)로 라우팅됩니다.
 *
 * 환경변수 설정 (Vercel 프로젝트 Settings > Environment Variables):
 *   BACKEND_URL  — 백엔드 API Base URL (예: https://api.contied.com)
 *                  미설정 시 기본값 "https://contied-backend.example" 사용
 *
 * 한계:
 *   - 카카오톡 인앱 브라우저는 사용자 user-agent를 보내므로 이 OG endpoint를
 *     경유하지 않을 수 있습니다. 카카오 SDK 직접 공유(2번 기능)로 보완하세요.
 *   - 봇 판별은 user-agent 문자열 매칭 방식으로 완벽하지 않습니다.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  const id = req.query.id;
  const baseUrl =
    process.env.BACKEND_URL || "https://contied-backend.example";
  const origin = `https://${req.headers.host || "contied.vercel.app"}`;

  let title = "CONTIED — 예배 콘티";
  let description = "키워드와 말씀으로 만드는 AI 예배 콘티";
  let image = `${origin}/images/og-default.png`;

  try {
    const r = await fetch(`${baseUrl}/api/v1/conti/${id}`);
    if (r.ok) {
      const data = (await r.json()) as {
        title?: string;
        description?: string;
        thumbnail?: string;
      };
      if (data.title) title = `${data.title} — CONTIED`;
      if (data.description)
        description = data.description.replace(/\s+/g, " ").slice(0, 200);
      if (data.thumbnail && data.thumbnail !== "/images/WhitePiano.png")
        image = data.thumbnail;
    }
  } catch {
    // 백엔드 fetch 실패 시 기본값 사용
  }

  const escape = (s: string) =>
    s.replace(
      /[&<>"']/g,
      (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
          c
        ] ?? c)
    );

  const html = `<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="utf-8" />
<title>${escape(title)}</title>
<meta property="og:title" content="${escape(title)}" />
<meta property="og:description" content="${escape(description)}" />
<meta property="og:image" content="${escape(image)}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${origin}/conti/${id}" />
<meta name="twitter:card" content="summary_large_image" />
<meta http-equiv="refresh" content="0;url=${origin}/conti/${id}" />
</head><body><a href="${origin}/conti/${id}">${escape(title)}</a></body></html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=600"
  );
  res.status(200).send(html);
}
