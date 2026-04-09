import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import { RouterProvider } from "react-router-dom";
import router from "./Router";
import GlobalSVGProvider from "./GlobalSVGProvider";

import GlobalErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // 인증 에러(401, 403) 발생 시에는 재시도 하지 않음 (이미 리다이렉트 로직이 작동 중이므로)
        const status = error.response?.status;
        if (status === 401 || status === 403) return false;
        
        // 특정 핵심 경로에서 500 발생 시에도 재시도 중단
        const url = error.config?.url;
        if (status === 500 && (url?.includes("/users/nickname") || url?.includes("/conti/myconti"))) {
          return false;
        }

        return failureCount < 2; // 그 외 에러는 최대 2회까지만 시도
      },
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 페치 비활성화 (Root.tsx에서 별도 관리)
    },
  },
});
const root = createRoot(document.getElementById("root")!);

root.render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <GlobalErrorBoundary>
        <RouterProvider router={router} />
      </GlobalErrorBoundary>
      <GlobalSVGProvider />
    </QueryClientProvider>
  </RecoilRoot>
);

// 서비스 워커 등록
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
