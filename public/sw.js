const CACHE_NAME = "contied-v2";
const urlsToCache = ["/", "/index.html", "/favicon.ico", "/logo192.png"];

self.addEventListener("install", (event) => {
  // 새 서비스 워커 즉시 활성화
  self.skipWaiting();
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

  // 2. SPA 네비게이션 요청: 항상 네트워크 우선 → 실패 시 캐시된 index.html 폴백
  //    이렇게 해야 세션 만료 등 서버 응답을 정확히 받을 수 있음
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 정상 응답을 캐시에도 업데이트
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put("/index.html", responseClone);
          });
          return response;
        })
        .catch(() => {
          // 오프라인일 때는 캐시된 index.html 제공
          return caches.match("/index.html").then((response) => {
            return response || new Response("오프라인 상태입니다. 네트워크 연결을 확인해주세요.", {
              status: 503,
              statusText: "Offline",
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            });
          });
        })
    );
    return;
  }

  // 3. 정적 자산 (JS/CSS/이미지 등): 네트워크 우선, 캐시 폴백
  event.respondWith(
    fetch(request)
      .then((response) => {
        // 성공한 응답을 캐시에 저장
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 네트워크 실패 시 캐시에서 제공
        return caches.match(request).then((response) => {
          if (response) return response;
          return new Response("Network error occurred", {
            status: 408,
            statusText: "Network Error",
          });
        });
      })
  );
});

self.addEventListener("activate", (event) => {
  // 새 서비스 워커 즉시 클레임
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // 이전 버전 캐시 삭제
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});
