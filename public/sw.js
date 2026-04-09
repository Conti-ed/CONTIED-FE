const CACHE_NAME = "contied-v1";
const urlsToCache = ["/", "/index.html", "/favicon.ico", "/logo192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. 서비스 워커가 무시해야 할 요청들 (Exclusion Rules)
  const shouldSkip =
    url.protocol === "chrome-extension:" ||
    url.hostname === "localhost" && (url.port === "8080" || url.pathname.includes("@react-refresh") || url.pathname.includes("@vite") || url.pathname.includes("__vite_ping")) ||
    url.hostname.includes("supabase.co") ||
    url.pathname.includes("node_modules");

  if (shouldSkip) return;

  // 2. 캐시 우선 전략 (정적 자산 전용)
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) return response;

      // 캐시에 없으면 네트워크 요청 시도 (에러 핸들링 포함)
      return fetch(request).catch((err) => {
        console.warn("[SW] Fetch failed for:", request.url, err);
        // 네트워크 실패 시 브라우저 기본 에러가 나도록 함 (Promise 리젝트 방식 방지)
        return new Response("Network error occurred", {
          status: 408,
          statusText: "Network Error",
        });
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
