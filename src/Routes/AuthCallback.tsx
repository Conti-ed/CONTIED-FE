import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuth = async () => {
      //   const searchParams = new URLSearchParams(location.search);
      //   const code = searchParams.get("code");

      //   if (!code) {
      //     console.error("인증 코드를 찾을 수 없습니다.");
      //     navigate("/");
      //     return;
      //   }

      try {
        // 토큰 요청
        // const response = await api.post("/auth/token", { code });
        // const { access_token, refresh_token } = response.data;

        // setTokens(access_token, refresh_token);

        // 인증 처리가 완료되면 즉시 Waiting 페이지로 리다이렉트
        navigate("/waiting");
      } catch (error) {
        console.error("인증 과정에서 오류가 발생했습니다:", error);
        navigate("/?error=auth_failed");
      }
    };

    handleAuth();
  }, [navigate, location]);
  return null;
};

export default AuthCallback;
