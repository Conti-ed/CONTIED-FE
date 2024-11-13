import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        navigate("/waiting");
      } catch (error) {
        console.error("인증 과정에서 오류가 발생했습니다:", error);
        navigate("/?error=auth_failed");
      }
    };
    handleAuth();
  }, [navigate]);
  return null;
};

export default AuthCallback;
