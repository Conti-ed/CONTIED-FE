// export const SERVER_URL =
//   "https://vscode-adakm.run-us-west2.goorm.site/proxy/8000";
export const SERVER_URL = "http://127.0.0.1:8000";
const access_token = localStorage["accessToken"];

export async function getKeywords() {
  return (
    await fetch(`${SERVER_URL}/api/keyword`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
  ).json();
}

export async function getConties() {
  return (
    await fetch(`${SERVER_URL}/api/conti`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
  ).json();
}

export async function getConti(cid: number) {
  return (
    await fetch(`${SERVER_URL}/api/conti/${cid}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
  ).json();
}

export async function getMyConties() {
  const my_id = JSON.parse(localStorage["user_info"]).id;
  return (
    await fetch(`${SERVER_URL}/api/conti?user=${my_id}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
  ).json();
}

export async function getContiesByKeyword(keyword: string) {
  return (
    await fetch(`${SERVER_URL}/api/conti?keyword=${keyword}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
  ).json();
}

export async function getSongsByKeyword(keyword: string) {
  return (
    await fetch(`${SERVER_URL}/api/song?keyword=${keyword}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
  ).json();
}
