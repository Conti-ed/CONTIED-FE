import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import { RouterProvider } from "react-router-dom";
import router from "./Router";
import GlobalSVGProvider from "./GlobalSVGProvider";

const queryClient = new QueryClient();
const root = createRoot(document.getElementById("root")!);

root.render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
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
