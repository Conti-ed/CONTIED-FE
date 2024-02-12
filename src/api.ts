export const SERVER_URL =
  "https://vscode-adakm.run-us-west2.goorm.site/proxy/8000";
// export const SERVER_URL = "http://127.0.0.1:8000";

export async function getKeywords() {
  return (await fetch(`${SERVER_URL}/api/keyword`)).json();
}

export async function getConties() {
  return (await fetch(`${SERVER_URL}/api/conti`)).json();
}

export async function getConti(cid: number) {
  return (await fetch(`${SERVER_URL}/api/conti/${cid}`)).json();
}

export async function getMyConties() {
  if (
    !localStorage.getItem("user_info") ||
    localStorage.getItem("user_info") === ""
  ) {
    return;
  }
  const my_id = JSON.parse(localStorage["user_info"]).id;
  return (await fetch(`${SERVER_URL}/api/conti?user=${my_id}`)).json();
}

export async function getContiesByKeyword(keyword: string) {
  return (await fetch(`${SERVER_URL}/api/conti?keyword=${keyword}`)).json();
}

export async function getSongsByKeyword(keyword: string) {
  return (await fetch(`${SERVER_URL}/api/song?keyword=${keyword}`)).json();
}
