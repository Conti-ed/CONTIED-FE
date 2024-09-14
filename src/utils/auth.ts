import Cookies from "js-cookie";
import api from "./axios";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export const getAccessToken = (): string | undefined => {
  return Cookies.get("accessToken");
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
  Cookies.set("accessToken", accessToken);
  Cookies.set("refreshToken", refreshToken);
};

export const removeTokens = (): void => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};

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

    setTokens(access_token, refresh_token);
    return access_token;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    removeTokens();
    return null;
  }
};

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
