import Cookies from "js-cookie";
import api from "./axios";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

// 현재의 Access Token Get
export const getAccessToken = (): string | undefined => {
  return Cookies.get("accessToken");
};

// Access Token과 Refresh Token을 설정
export const setTokens = (accessToken: string, refreshToken: string): void => {
  Cookies.set("accessToken", accessToken);
  Cookies.set("refreshToken", refreshToken);
};

// Token 제거
export const removeTokens = (): void => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};

// Update Access Token
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = Cookies.get("refreshToken");

  if (!refreshToken) {
    console.error("Refresh token not found");
    return null;
  }

  try {
    const response = await api.post<TokenResponse>("/auth/refresh", {
      refresh_token: refreshToken,
    });
    const { access_token, refresh_token } = response.data;

    setTokens(access_token, refresh_token); // new token 설정
    return access_token;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    removeTokens(); // update 실패 시, token 제거
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
        if (newAccessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      }

      return Promise.reject(error);
    }
  );
};
