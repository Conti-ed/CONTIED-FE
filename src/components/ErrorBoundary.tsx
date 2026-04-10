import React, { Component, ErrorInfo, ReactNode } from "react";
import { removeTokens } from "../utils/auth";
import { globalNavigate } from "../utils/navigation"; // 브리지 사용
import {
  ErrorContainer,
  IllustrationWrapper,
  Title,
  Description,
  ActionButton,
} from "../styles/ErrorBoundary.styles";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
  private autoRecoveryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);

    // 5초 후 자동 복구 시도
    this.autoRecoveryTimer = setTimeout(() => {
      this.handleReset();
    }, 5000);
  }

  componentWillUnmount() {
    if (this.autoRecoveryTimer) {
      clearTimeout(this.autoRecoveryTimer);
    }
  }

  handleReset = async () => {
    if (this.autoRecoveryTimer) {
      clearTimeout(this.autoRecoveryTimer);
      this.autoRecoveryTimer = null;
    }

    // 세션 이슈일 가능성이 높으므로 토큰 정리
    removeTokens();

    // 오래된 서비스 워커 캐시 삭제 (반복 에러 방지)
    try {
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
    } catch (e) {
      console.warn("캐시 삭제 실패:", e);
    }

    // 상태 초기화
    this.setState({ hasError: false, error: null });

    // SPA 내비게이션 시도 → 실패 시 전체 리로드 폴백
    try {
      globalNavigate("/", { replace: true });
    } catch {
      window.location.href = "/";
    }
  };

  render() {
    if (this.state.hasError) {
      const isSessionError =
        this.state.error?.message?.includes("session") ||
        this.state.error?.message?.includes("auth") ||
        this.state.error?.message?.includes("null") ||
        this.state.error?.message?.includes("401");

      return (
        <ErrorContainer>
          <IllustrationWrapper>
            <span style={{ fontSize: "40px" }}>
              {isSessionError ? "🔐" : "⚠️"}
            </span>
          </IllustrationWrapper>
          <Title>
            {isSessionError ? "세션이 만료되었습니다" : "문제가 발생했습니다"}
          </Title>
          <Description>
            {isSessionError
              ? "보안을 위해 다시 로그인해주세요.\n더욱 안전한 서비스를 제공해 드릴게요."
              : "앱을 불러오는 중 오류가 발생했습니다.\n잠시 후 시작 페이지로 자동 이동합니다."}
          </Description>
          <Description style={{ fontSize: "12px", marginTop: "8px", opacity: 0.6 }}>
            5초 후 자동으로 이동합니다...
          </Description>
          <ActionButton onClick={this.handleReset}>
            시작 페이지로 이동하기
          </ActionButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
