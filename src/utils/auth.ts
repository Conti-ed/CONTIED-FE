import { supabase } from "./supabase";
import { Cookies } from "react-cookie";

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
  const cookies = new Cookies();
  cookies.remove("accessToken", { path: "/" });
  cookies.remove("refreshToken", { path: "/" });
};

// 로그아웃 처리
export const logout = async (): Promise<void> => {
  try {
    // 1. Supabase SignOut (Internal session)
    await supabase.auth.signOut();

    // 2. Clear our own app cookies
    cookies.remove("accessToken", { path: "/" });
    cookies.remove("refreshToken", { path: "/" });

    // 3. Clear specific localStorage items
    localStorage.removeItem("recentSearches");
    localStorage.removeItem("user_id"); // If used
    localStorage.removeItem("user_info"); // If used

    // 4. Clear ALL localStorage items starting with 'sb-' (Supabase storage)
    // This is crucial to prevent session ghosting in SPAs.
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("sb-")) {
        localStorage.removeItem(key);
      }
    });

    console.log("Logged out successfully, session cleared.");
  } catch (error) {
    console.error("Error during logout:", error);
  }
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

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } else {
          // 토큰 갱신 실패 → 로그인 페이지로 강제 이동
          removeTokens();
          window.location.href = "/";
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
};
