// export const SERVER_URL =
//   "https://vscode-adakm.run-us-west2.goorm.site/proxy/8000";

export const SERVER_URL = "http://localhost:5000";

export async function getKeywords() {
  return (await fetch(`${SERVER_URL}/keyword`)).json();
}

export async function getConties() {
  return (await fetch(`${SERVER_URL}/conti/myconti`)).json();
}

export async function getConti(cid: number) {
  return (await fetch(`${SERVER_URL}/conti/myconti/${cid}`)).json();
}

export async function getMyConties() {
  if (
    !localStorage.getItem("user_info") ||
    localStorage.getItem("user_info") === ""
  ) {
    return;
  }
  const my_id = JSON.parse(localStorage["user_info"]).id;
  return (await fetch(`${SERVER_URL}/conti?user=${my_id}`)).json();
}

export async function getContiesByKeyword(keyword: string) {
  return (await fetch(`${SERVER_URL}/conti?keyword=${keyword}`)).json();
}

export async function getSongsByKeyword(keyword: string) {
  return (await fetch(`${SERVER_URL}/song?keyword=${keyword}`)).json();
}

export async function getSavedConties(uid: number) {
  return uid ? (await fetch(`${SERVER_URL}/save?uid=${uid}`)).json() : null;
}

export async function refreshToken() {
  try {
    const response = await fetch(`${SERVER_URL}/token/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: localStorage.getItem("refreshToken"),
      }),
    });

    if (!response.ok) {
      // refresh token 요청이 실패한 경우에 대한 처리
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    const newAccessToken = data.access_token;
    // 여기서 받은 새로운 엑세스 토큰을 저장하거나 반환합니다.
    return newAccessToken;
  } catch (error) {
    // 에러 처리
    alert("일시적인 오류입니다. 잠시 후에 다시 시도해주세요.");
    throw error;
  }
}
