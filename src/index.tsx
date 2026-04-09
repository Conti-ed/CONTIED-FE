import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router"; // Named import
import GlobalSVGProvider from "./GlobalSVGProvider";

import GlobalErrorBoundary from "./components/ErrorBoundary";
import { queryClient } from "./utils/queryClient";

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
