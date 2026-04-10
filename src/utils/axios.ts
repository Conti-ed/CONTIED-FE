import axios, { AxiosInstance } from "axios";
import { getAccessToken, setupTokenRefresh } from "./auth"; // auth.ts에서 토큰 갱신 로직 가져옴
import { ContiType } from "../types";

// 서버 URL 설정
const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
export const SERVER_URL = rawBaseUrl.endsWith("/api/v1") 
  ? rawBaseUrl 
  : `${rawBaseUrl}/api/v1`;

// Axios Instance 생성
const api: AxiosInstance = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // CORS 이슈 해결을 위한 설정
});

// 요청 interceptors: Authorization header에 token 추가
api.interceptors.request.use(
  (config) => {
    // 인증이 반드시 필요한 경로들
    const authRequiredPaths = ["/users/nickname", "/conti/myconti", "/users/profile"];
    const isAuthRequired = authRequiredPaths.some(path => config.url?.includes(path));
    
    const token = getAccessToken();
    
    // 토큰이 없는데 인증 필수 경로를 요청하는 경우 사전에 차단 (불필요한 403/500 방지)
    if (isAuthRequired && !token) {
      console.warn(`Request to ${config.url} blocked: No access token found.`);
      return Promise.reject(new Error("No access token"));
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터를 통해 자동으로 토큰 갱신 설정
setupTokenRefresh(api);

// API 호출 함수들
// 키워드 가져오기
export async function getKeywords() {
  try {
    const response = await api.get("/keyword");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch keywords:", error);
    throw error;
  }
}

export async function getUserNickname(): Promise<string> {
  try {
    const response = await api.get("/users/nickname");
    return response.data.nickname;
  } catch (error) {
    console.error("Failed to fetch user nickname:", error);
    throw error;
  }
}

export async function getUserProfile(): Promise<{ id: number; nickname: string; email: string; role: string }> {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
}

// 모든 콘티 가져오기
export async function getConties() {
  try {
    const response = await api.get("/conti");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch conties:", error);
    throw error;
  }
}

// 특정 콘티 가져오기
export async function getConti(cid: number) {
  try {
    const response = await api.get(`/conti/${cid}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch conti with id ${cid}:`, error);
    throw error;
  }
}

// 좋아요 한 콘티 가져오기
export async function getLikedContis(): Promise<ContiType[]> {
  try {
    const response = await api.get("/conti/like");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch liked contis:", error);
    throw error;
  }
}

// 콘티 좋아요
export async function likeConti(id: number): Promise<void> {
  try {
    await api.post(`/conti/${id}/like`);
  } catch (error) {
    console.error(`Failed to like conti with id ${id}:`, error);
    throw error;
  }
}

// 콘티 좋아요 취소
export async function unlikeConti(id: number): Promise<void> {
  try {
    await api.delete(`/conti/${id}/like`);
  } catch (error) {
    console.error(`Failed to unlike conti with id ${id}:`, error);
    throw error;
  }
}

// 사용자 정보로 콘티 가져오기
export interface GetMyContiesResponse {
  myContiData: ContiType[];
  nextCursor: number | null;
}

export async function getMyConties(
  cursor: number = 0,
  take: number = 100
): Promise<GetMyContiesResponse> {
  try {
    const response = await api.get("/conti/myconti", {
      params: { cursor, take },
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch user's conties:", error);
    throw error;
  }
}

export async function getAllMyConties(): Promise<ContiType[]> {
  let allContis: ContiType[] = [];
  let cursor = 0;
  const take = 100;

  while (true) {
    const response = await getMyConties(cursor, take);
    allContis = allContis.concat(response.myContiData);
    if (response.nextCursor === null || response.myContiData.length < take) {
      break;
    }
    cursor = response.nextCursor;
  }

  return allContis;
}

export async function postContiByAi(
  keywordsArray: string[],
  bibleVerseRange: string | null
) {
  const payload: { keywords: string[]; bible_verse_range?: string } = {
    keywords: keywordsArray,
  };

  if (bibleVerseRange) {
    payload.bible_verse_range = bibleVerseRange;
  }

  console.log("Payload to be sent:", payload); // 추가된 디버그 로그

  try {
    const response = await api.post("/conti/myconti/ai", payload, {
      timeout: 120000, // AI 생성은 Gemini API 호출이 여러 번 들어가므로 120초로 넉넉하게
    });
    console.log("Response data:", response.data); // 응답 데이터 확인용 로그
    return response.data;
  } catch (error) {
    console.error("Failed to create AI-based conti:", error);
    throw error;
  }
}

// 콘티 정보 수정하기
export interface PatchContiDto {
  title?: string;
  description?: string;
  songs: number[];
}

export async function patchConti(contiId: number, dto: PatchContiDto) {
  try {
    const response = await api.patch(`/conti/myconti/${contiId}`, dto);
    return response.data;
  } catch (error: any) {
    console.error(`Failed to patch conti with id ${contiId}:`, error);
    throw error;
  }
}

// 모든 곡들 가져오기
export async function getAllSongs(cursor = 0, take = 500) {
  try {
    const response = await api.get(`/song`, {
      params: { cursor, take },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all songs:", error);
    throw error;
  }
}

// 키워드로 콘티 검색하기
export async function getContiesByKeyword(keyword: string) {
  try {
    const response = await api.get(`/conti?keyword=${keyword}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch conties by keyword "${keyword}":`, error);
    throw error;
  }
}

// 키워드로 곡 검색하기
export async function getSongsByKeyword(keyword: string) {
  try {
    const response = await api.get(`/song?keyword=${keyword}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch songs by keyword "${keyword}":`, error);
    throw error;
  }
}

// 저장된 콘티 가져오기
export async function getSavedConties(uid: number) {
  if (!uid) {
    console.warn("No user id provided");
    return null;
  }
  try {
    const response = await api.get(`/save?uid=${uid}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch saved conties for user ${uid}:`, error);
    throw error;
  }
}

export async function postContiByYouTube(
  playlistUrl: string,
  description: string
) {
  try {
    const response = await api.post("/conti/myconti/youtube", {
      youtubeURL: playlistUrl,
      description: description || "",
    }, {
      timeout: 60000,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create conti with YouTube URL:", error);
    throw error;
  }
}

export async function deleteContiById(contiId: number) {
  try {
    const response = await api.delete(`/conti/myconti/${contiId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete conti with id ${contiId}:`, error);
    throw error;
  }
}

// 최근 검색어 관련 API
export async function getRecentSearches() {
  try {
    const response = await api.get("/search/recent");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch recent searches:", error);
    throw error;
  }
}

export async function postRecentSearch(query: string) {
  try {
    await api.post(`/search/recent?query=${encodeURIComponent(query)}`);
  } catch (error) {
    console.error("Failed to save recent search:", error);
    throw error;
  }
}

export async function deleteRecentSearch(id: number) {
  try {
    await api.delete(`/search/recent/${id}`);
  } catch (error) {
    console.error(`Failed to delete recent search with id ${id}:`, error);
    throw error;
  }
}

export async function clearAllRecentSearches() {
  try {
    await api.delete("/search/recent/all");
  } catch (error) {
    console.error("Failed to clear all recent searches:", error);
    throw error;
  }
}

export default api;
