import React, { Component, ErrorInfo, ReactNode } from "react";
import { removeTokens } from "../utils/auth";
import { router } from "../Router"; // router 인스턴스 가져옴
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
  }

  handleReset = () => {
    // 세션 이슈일 가능성이 높으므로 토큰 정리 후 시작 페이지로 이동
    removeTokens();
    router.navigate("/", { replace: true });
    
    // 강제 리셋을 위해 상태 초기화
    this.setState({ hasError: false, error: null });
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
              : "앱을 불러오는 중 오류가 발생했습니다.\n시작 페이지로 이동하여 다시 시도해주세요."}
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
