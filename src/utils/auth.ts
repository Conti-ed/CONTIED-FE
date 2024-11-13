import { Cookies } from "react-cookie";
import api from "./axios";

const cookies = new Cookies();

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

// 현재의 Access Token Get
export const getAccessToken = (): string | undefined => {
  const accessToken = cookies.get("accessToken");
  // console.log(accessToken);
  return accessToken;
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

// Update Access Token
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = cookies.get("refreshToken");

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
