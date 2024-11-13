import axios, { AxiosInstance } from "axios";
import { getAccessToken, setupTokenRefresh } from "./auth"; // auth.ts에서 토큰 갱신 로직 가져옴
import { ContiType } from "../types";

// 서버 URL 설정
export const SERVER_URL = "http://localhost:5000";
// export const SERVER_URL =
//   "https://port-0-contied-api-m3d8djgv98deef95.sel4.cloudtype.app";

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
    const token = getAccessToken();
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
    const response = await api.get(`/conti/myconti/${cid}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch conti with id ${cid}:`, error);
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
    const response = await api.post("/conti/myconti/ai", payload);
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

export default api;
