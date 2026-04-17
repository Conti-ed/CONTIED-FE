import { QueryClient } from "react-query";
import { AxiosError } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        const axiosError = error as AxiosError;
        // 인증 에러(401, 403) 발생 시에는 재시도 하지 않음 (이미 리다이렉트 로직이 작동 중이므로)
        const status = axiosError.response?.status;
        if (status === 401 || status === 403) return false;

        // 특정 핵심 경로에서 500 발생 시에도 재시도 중단
        const url = axiosError.config?.url;
        if (status === 500 && (url?.includes("/users/nickname") || url?.includes("/conti/myconti"))) {
          return false;
        }

        return failureCount < 2; // 그 외 에러는 최대 2회까지만 시도
      },
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 페치 비활성화
    },
  },
});
