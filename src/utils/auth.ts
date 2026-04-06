import { Cookies } from "react-cookie";
import { supabase } from "./supabase";

const cookies = new Cookies();
// ... (TokenResponse interface can stay if needed, but not strictly required now)

// 현재의 Access Token Get
export const getAccessToken = (): string | undefined => {
  return cookies.get("accessToken");
};

// Access Token과 Refresh Token을 설정
export const setTokens = (accessToken: string, refreshToken: string): void => {
  cookies.set("accessToken", accessToken, { path: "/" });
  cookies.set("refreshToken", refreshToken, { path: "/" });
};

// Token 제거
export const removeTokens = (): void => {
  cookies.remove("accessToken", { path: "/" });
  cookies.remove("refreshToken", { path: "/" });
};

// Update Access Token (Supabase 방식)
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error || !data.session) {
      console.error("Failed to refresh token:", error?.message);
      removeTokens();
      return null;
    }
    const { access_token, refresh_token } = data.session;
    setTokens(access_token, refresh_token);
    return access_token;
  } catch (error) {
    console.error("Refresh token error:", error);
    removeTokens();
    return null;
  }
};

// Axios Instance에 token update 로직 추가
export const setupTokenRefresh = (api: any): void => {
  api.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const newAccessToken = await refreshAccessToken();
        console.log(newAccessToken);
        if (newAccessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      }

      return Promise.reject(error);
    }
  );
};
