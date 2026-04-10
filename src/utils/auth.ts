import { supabase } from "./supabase";
import { Cookies } from "react-cookie";
import { globalNavigate } from "./navigation"; // 브리지 사용
import { queryClient } from "./queryClient"; // standalone queryClient 사용

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

// Token 제거 (방어적으로 각 단계를 try-catch)
export const removeTokens = (): void => {
  try {
    const cookies = new Cookies();
    cookies.remove("accessToken", { path: "/" });
    cookies.remove("refreshToken", { path: "/" });
  } catch (e) {
    console.warn("쿠키 삭제 실패:", e);
  }

  try {
    // LocalStorage에 저장된 사용자 정보도 함께 제거
    localStorage.removeItem("user_info");
    localStorage.removeItem("user_id");

    // Supabase 관련 로컬스토리지 항목들도 제거
    const keysToRemove = Object.keys(localStorage).filter((key) =>
      key.startsWith("sb-")
    );
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (e) {
    console.warn("로컬스토리지 삭제 실패:", e);
  }

  try {
    // QueryClient 캐시 초기화
    queryClient.clear();
  } catch (e) {
    console.warn("QueryClient 캐시 초기화 실패:", e);
  }
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
    
    // 4. Redirect to start page (SPA navigation)
    globalNavigate("/", { replace: true });
  } catch (error) {
    console.error("Error during logout:", error);
    // 에러가 나더라도 클라이언트 토큰은 지우고 리다이렉트
    removeTokens();
    globalNavigate("/", { replace: true });
  }
};

// Update Access Token (Supabase 방식)
// 동시 호출 방지를 위한 lock
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const refreshAccessToken = async (): Promise<string | null> => {
  // 이미 갱신 중이면 진행 중인 Promise를 재사용 (중복 요청 방지)
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error || !data.session) {
        console.error("Failed to refresh token:", error?.message);
        removeTokens();
        globalNavigate("/", { replace: true });
        return null;
      }
      const { access_token, refresh_token } = data.session;
      setTokens(access_token, refresh_token);
      return access_token;
    } catch (error) {
      console.error("Refresh token error:", error);
      removeTokens();
      globalNavigate("/", { replace: true });
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Axios Instance에 token update 로직 추가
export const setupTokenRefresh = (api: any): void => {
  api.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const originalRequest = error.config;
      const status = error.response?.status;
      const url = originalRequest.url;

      // 401 Unauthorized 또는 403 Forbidden 에러 처리
      if ((status === 401 || status === 403) && !originalRequest._retry) {
        originalRequest._retry = true;

        console.warn(`Auth Error (${status}) on ${url}. Attempting to refresh token...`);
        const newAccessToken = await refreshAccessToken();
        
        if (newAccessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } else {
          // 토큰 갱신 실패 → 모든 정보 삭제 후 시작 페이지로 이동
          console.error("Session expired or refresh failed. Redirecting to start page...");
          removeTokens();
          globalNavigate("/", { replace: true });
          return Promise.reject(error);
        }
      }

      // 특정 인증 필수 엔드포인트에서 500 에러 발생 시 세션 만료로 간주
      // (백엔드 세션 처리 미흡으로 인한 크래시 대응)
      const authRequiredPaths = ["/users/nickname", "/conti/myconti", "/users"];
      const isAuthPath = authRequiredPaths.some(path => url?.includes(path));

      if (status === 500 && isAuthPath) {
        console.error(`Critical Auth Error (500) on ${url}. Force logout...`);
        removeTokens();
        globalNavigate("/", { replace: true });
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );
};
