import React, { useEffect, useState } from "react";
import Icon from "../components/Icon";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import * as S from "../styles/Start.styles";

const Start: React.FC = () => {
  const [isFading, setIsFading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase 세션으로 실제 유효한 세션인지 확인 (쿠키만 체크하면 핑퐁 루프 발생 가능)
    const checkExistingSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          navigate("/home", { replace: true });
        }
      } catch {
        // 세션 확인 실패 시 Start 페이지에 머무름 (화이트스크린 방지)
      }
    };
    checkExistingSession();

    const searchParams = new URLSearchParams(location.search);
    const errorParam = searchParams.get("error");

    if (errorParam === "auth_failed") {
      setError("인증에 실패했습니다. 다시 시도해 주세요.");
      navigate("/", { replace: true });
    }
  }, []); // 초기 마운트 시 1회만 실행 (location 의존 제거로 무한 루프 방지)

  const handleLogin = async (provider: "kakao" | "google" | "github") => {
    setIsFading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(`로그인 실패: ${error.message}`);
      setIsFading(false);
    }
  };

  return (
    <S.Container $isFading={isFading}>
      <S.BackgroundCircle />
      <S.BackgroundCircleBottom />
      <S.LogoContainer>
        <S.Logo src="/images/StartLogov2.png" alt="Contied Logo" />
      </S.LogoContainer>
      <S.ButtonContainer>
        {/* Kakao Login */}
        <S.StartButton onClick={() => handleLogin("kakao")} style={{ backgroundColor: "#ffe812", marginBottom: "12px" }}>
          <S.IconContainer>
            <Icon id="kakao-start" width="24" height="24" />
          </S.IconContainer>
          <S.TextContainer>카카오 로그인</S.TextContainer>
        </S.StartButton>

        {/* Google Login */}
        <S.StartButton onClick={() => handleLogin("google")} style={{ backgroundColor: "#ffffff", border: "1px solid #ddd", marginBottom: "12px" }}>
          <S.IconContainer>
            <Icon id="google-start" width="24" height="24" />
          </S.IconContainer>
          <S.TextContainer>구글 로그인</S.TextContainer>
        </S.StartButton>

        {/* GitHub Login */}
        <S.StartButton onClick={() => handleLogin("github")} style={{ backgroundColor: "#24292e", color: "#fff" }}>
          <S.IconContainer>
            <Icon id="github-start" width="24" height="24" />
          </S.IconContainer>
          <S.TextContainer>깃허브 로그인</S.TextContainer>
        </S.StartButton>
      </S.ButtonContainer>
      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
    </S.Container>
  );
};

export default Start;
