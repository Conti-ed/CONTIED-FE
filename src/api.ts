export const SERVER_URL =
  "https://vscode-adakm.run-us-west2.goorm.site/proxy/8000";
// export const SERVER_URL =
// "http://127.0.0.1:8000";

export async function getKeywords() {
  return (await fetch(`${SERVER_URL}/api/keyword`)).json();
}

export async function getConties() {
  return (await fetch(`${SERVER_URL}/api/conti`)).json();
}
