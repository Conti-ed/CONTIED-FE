import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../utils/axios";
import { supabase } from "../utils/supabase";
import { setTokens } from "../utils/auth"; // auth.ts에서 setTokens 가져옴

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Supabase 세션 가져오기
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (data.session) {
          // Supabase가 준 토큰을 우리 앱의 쿠키에 저장 (axios 호환용)
          setTokens(data.session.access_token, data.session.refresh_token);
        }

        navigate("/waiting");
      } catch (error) {
        console.error("인증 과정에서 오류가 발생했습니다:", error);
        navigate("/?error=auth_failed");
      }
    };
    handleAuth();
  }, [navigate]);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#92b5f0', color: 'white' }}>
      잠시만 기다려 주세요...
    </div>
  );
};

export default AuthCallback;
