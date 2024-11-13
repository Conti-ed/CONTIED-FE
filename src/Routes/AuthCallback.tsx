import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const token = Cookies.get("accessToken");
      if (token) {
        navigate("/waiting");
      } else {
        navigate("/?error=auth_failed");
      }
    };
    handleAuth();
  }, [navigate]);

  return null;
};

export default AuthCallback;
