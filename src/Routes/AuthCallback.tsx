import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { supabase } from "../utils/supabase";
import { setTokens } from "../utils/auth";
import * as S from "../styles/AuthCallback.styles";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Supabase 세션 가져오기
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (data.session) {
          // Supabase가 준 토큰을 우리 앱의 쿠키에 저장 (axios 호환용)
          setTokens(data.session.access_token, data.session.refresh_token);
          
          // Nuclear Reset: Use window.location.href instead of navigate
          // to completely wipe Recoil and React Query memory.
          window.location.href = "/waiting";
        } else {
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        window.location.href = "/?error=auth_failed";
      }
    };
    handleAuth();
  }, [navigate, queryClient]);

  return (
    <S.Container>
      <S.BackgroundCircle />
      <S.BackgroundCircleBottom />
      <S.LogoContainer>
        <S.Logo src="/images/StartLogov2.png" alt="Contied Logo" />
        <S.LoadingText>로그인 정보를 확인 중입니다</S.LoadingText>
      </S.LogoContainer>
    </S.Container>
  );
};

export default AuthCallback;

