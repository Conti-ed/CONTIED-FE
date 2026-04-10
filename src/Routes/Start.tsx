import React, { useEffect, useState } from "react";
import Icon from "../components/Icon";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { getAccessToken } from "../utils/auth";
import * as S from "../styles/Start.styles";

const Start: React.FC = () => {
  const [isFading, setIsFading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 이미 로그인된 토큰이 있는 경우 홈으로 리다이렉트
    const token = getAccessToken();
    if (token) {
      navigate("/home", { replace: true });
    }

    const searchParams = new URLSearchParams(location.search);
    const errorParam = searchParams.get("error");

    if (errorParam === "auth_failed") {
      setError("인증에 실패했습니다. 다시 시도해 주세요.");
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

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
