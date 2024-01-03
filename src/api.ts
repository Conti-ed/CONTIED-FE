const SERVER_URL = "http://127.0.0.1:8000";
export async function getKeywords() {
  return (await fetch(`${SERVER_URL}/api/keyword`)).json();
}
