import { supabase } from "./supabase";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

// 현재의 Access Token Get
export const getAccessToken = (): string | undefined => {
  return cookies.get("accessToken");
};

// Access Token과 Refresh Token을 설정
export const setTokens = (accessToken: string, refreshToken: string): void => {
  const cookies = new Cookies();
  cookies.set("accessToken", accessToken, { path: "/" });
  cookies.set("refreshToken", refreshToken, { path: "/" });
};

// Token 제거
export const removeTokens = (): void => {
  const cookies = new Cookies();
  cookies.remove("accessToken", { path: "/" });
  cookies.remove("refreshToken", { path: "/" });
  
  // LocalStorage에 저장된 사용자 정보도 함께 제거
  localStorage.removeItem("user_info");
  localStorage.removeItem("user_id");
  
  // Supabase 관련 로컬스토리지 항목들도 제거
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("sb-")) {
      localStorage.removeItem(key);
    }
  });
};

// 로그아웃 처리
export const logout = async (): Promise<void> => {
  try {
    // 1. Supabase SignOut (Internal session)
    await supabase.auth.signOut();

    // 2. Clear all tokens and local storage
    removeTokens();

    // 3. Clear specific application state if any
    localStorage.removeItem("recentSearches");

    console.log("Logged out successfully, session cleared.");
    
    // 4. Redirect to start page
    window.location.replace("/");
  } catch (error) {
    console.error("Error during logout:", error);
    // 에러가 나더라도 클라이언트 토큰은 지우고 리다이렉트
    removeTokens();
    window.location.replace("/");
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

      // 401 Unauthorized 에러 처리
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } else {
          // 토큰 갱신 실패 → 모든 정보 삭제 후 시작 페이지로 이동
          console.warn("Session expired. Redirecting to start page...");
          removeTokens();
          window.location.replace("/");
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
};
