import { NavigateOptions, To } from "react-router-dom";

/**
 * 전역 내비게이션 브리지
 * Circular Dependency(순환 참조) 문제를 해결하면서 
 * React 컴포넌트 외부(유틸리티, 인터셉터 등)에서도 SPA 내비게이션을 사용할 수 있게 합니다.
 */

type NavigateFunction = (to: To, options?: NavigateOptions) => void;

let navigateFn: NavigateFunction | null = null;

/**
 * Router 초기화 시 이 함수를 호출하여 실제 navigate 함수를 등록합니다.
 */
export const setGlobalNavigate = (fn: NavigateFunction) => {
  navigateFn = fn;
};

/**
 * 어디서든 호출 가능한 SPA 내비게이션 함수
 */
export const globalNavigate = (to: To, options?: NavigateOptions) => {
  if (navigateFn) {
    navigateFn(to, options);
  } else {
    // 만약 브리지가 초기화되기 전이라면 window.location을 폴백으로 사용
    const url = typeof to === "string" ? to : to.pathname || "/";
    if (options?.replace) {
      window.location.replace(url);
    } else {
      window.location.href = url;
    }
  }
};
