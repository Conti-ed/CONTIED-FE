/**
 * 카카오 SDK 초기화 및 공유 헬퍼
 *
 * 환경변수 설정 방법:
 *   프로젝트 루트의 .env 파일에 아래 항목을 추가하세요.
 *   VITE_KAKAO_JS_KEY=발급받은_카카오_JavaScript_키
 *
 *   카카오 개발자 콘솔(https://developers.kakao.com)에서
 *   앱을 생성한 뒤 "앱 키 > JavaScript 키"를 복사해서 붙여넣으세요.
 *   키를 코드에 직접 하드코딩하지 마세요.
 */

export function ensureKakaoInit(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (!w.Kakao) return false;
  if (!w.Kakao.isInitialized()) {
    const key = import.meta.env.VITE_KAKAO_JS_KEY;
    if (!key) {
      console.warn(
        "[Kakao] VITE_KAKAO_JS_KEY 미설정 — 카카오 공유 버튼이 비활성화됩니다."
      );
      return false;
    }
    w.Kakao.init(key);
  }
  return w.Kakao.isInitialized();
}

export function shareToKakao(opts: {
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl: string;
}): boolean {
  if (!ensureKakaoInit()) return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: opts.title,
      description: opts.description,
      imageUrl:
        opts.imageUrl || `${window.location.origin}/images/og-default.png`,
      link: { mobileWebUrl: opts.linkUrl, webUrl: opts.linkUrl },
    },
    buttons: [
      {
        title: "콘티 보기",
        link: { mobileWebUrl: opts.linkUrl, webUrl: opts.linkUrl },
      },
    ],
  });
  return true;
}
