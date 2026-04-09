import React, { useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: calc(54px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: ${(props) =>
    props.theme.bgColor === "#292929"
      ? "rgba(41, 41, 41, 0.8)"
      : "rgba(255, 255, 255, 0.85)"};
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-top: 1px solid
    ${(props) =>
      props.theme.bgColor === "#292929" ? "#404040" : "rgba(0, 0, 0, 0.05)"};
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.03);
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  padding-bottom: 4px; /* 바닥에 너무 붙지 않게 미세한 여백 */
`;

const NavItems = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 10px;
`;

interface ButtonProps {
  $active?: boolean;
}

const Button = styled.button<ButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  padding: 0;
  width: 60px;
  height: 100%;
  font-size: 11px;
  font-weight: 400;
  color: ${({ $active }) => ($active ? "#94b4ed" : "#8C8C8C")};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    opacity: 0.7;
    transform: scale(0.95);
  }

  & svg {
    margin-bottom: 3px;
    width: 22px;
    height: 22px;
    path {
      fill: ${({ $active }) => ($active ? "#94b4ed" : "#8C8C8C")};
    }
  }
`;

interface TabBarProps {
  onHomeClick?: () => void;
}

const PATH_INDEX: Record<string, number> = {
  home: 0,
  search: 1,
  mypage: 2,
};

const TabBar: React.FC<TabBarProps> = ({ onHomeClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPathKey = useCallback((path: string) => {
    if (path.startsWith("/search") || path === "/result") return "search";
    if (path.startsWith("/mypage")) return "mypage";
    return "home";
  }, []);

  const getActiveButton = useCallback(() => {
    return getPathKey(location.pathname);
  }, [location.pathname, getPathKey]);

  const [activeButton, setActiveButton] = React.useState(getActiveButton);

  useEffect(() => {
    setActiveButton(getActiveButton());
  }, [location.pathname, getActiveButton]);

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    }
    const currentPathKey = getPathKey(location.pathname);
    const targetPathKey = "home";
    const direction =
      PATH_INDEX[targetPathKey] > PATH_INDEX[currentPathKey] ? 1 : -1;

    setActiveButton("home");
    navigate("/home", { state: { fromTabBar: true, direction } });
  };

  return (
    <Container>
      <NavItems>
        <Button $active={activeButton === "home"} onClick={handleHomeClick}>
          <svg
            width="22"
            height="23"
            viewBox="0 0 22 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.9264 0.983398L11.5221 1.71381L11.9905 2.28818C14.3965 5.23858 17.0561 7.97063 19.9379 10.4534H20.3783V10.8295C20.877 11.2514 21.3822 11.6659 21.8937 12.0729L20.9597 13.2467C20.765 13.0918 20.5712 12.9358 20.3783 12.7788V21.5791V22.5791H18.8783H14.0863V22.5795H12.5863H9.2948H7.7948V22.5791H3.00378H1.50378V21.5791V12.7967C1.30688 12.9511 1.10892 13.1042 0.909904 13.2561L0 12.0636C0.508368 11.6757 1.0097 11.2791 1.50378 10.8742V10.4534H2.01095C4.99491 7.94753 7.70652 5.13061 10.0991 2.04894L10.6175 2.45144L10.0991 2.04894L10.3484 1.72785L10.9264 0.983398ZM14.0863 21.5791V21.0795V14.1585V12.6585H12.5863H9.2948H7.7948V14.1585V21.0795V21.5791H3.00378V11.5784C3.05323 11.5368 3.10261 11.4952 3.15191 11.4534H3.60144V11.0687C6.28606 8.74689 8.74799 6.17623 10.9538 3.38995C13.1919 6.11774 15.6425 8.66172 18.2817 10.9984V11.4534H18.801L18.8783 11.5204V21.5791H14.0863ZM9.2948 14.1585H12.5863V21.0795H9.2948V14.1585Z"
              fill="#8C8C8C"
            />
          </svg>
          홈
        </Button>
        <Button
          $active={activeButton === "search"}
          onClick={() => {
            const currentPathKey = getPathKey(location.pathname);
            const targetPathKey = "search";
            const direction =
              PATH_INDEX[targetPathKey] > PATH_INDEX[currentPathKey] ? 1 : -1;

            setActiveButton("search");
            navigate("/search", { state: { fromTabBar: true, direction } });
          }}
        >
          <svg
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.93564 16.8029C12.7718 16.8029 15.8713 13.7041 15.8713 9.89413C15.8713 6.08419 12.7718 2.98535 8.93564 2.98535C5.09951 2.98535 2 6.08419 2 9.89413C2 13.7041 5.09951 16.8029 8.93564 16.8029ZM15.4005 16.0442C16.9313 14.4452 17.8713 12.2791 17.8713 9.89413C17.8713 4.97395 13.8707 0.985352 8.93564 0.985352C4.00062 0.985352 0 4.97395 0 9.89413C0 14.8143 4.00062 18.8029 8.93564 18.8029C10.8968 18.8029 12.7104 18.173 14.184 17.1051L15.3167 18.2343L18.8646 21.7716C19.4067 22.312 20.1153 22.5854 20.8257 22.5915C21.5526 22.5978 22.2814 22.3245 22.836 21.7716L21.4197 20.3595L17.8718 16.8223C17.3297 16.2818 16.6211 16.0085 15.9107 16.0023C15.74 16.0009 15.5692 16.0148 15.4005 16.0442ZM6.11995 8.15692C6.02137 8.3942 5.9707 8.64832 5.9707 8.9048H3.9707C3.9707 8.38484 4.07343 7.86996 4.27301 7.38958C4.47259 6.9092 4.76512 6.47271 5.1339 6.10504C5.50268 5.73737 5.94048 5.44572 6.42231 5.24674C6.90414 5.04776 7.42057 4.94534 7.9421 4.94534V6.94534C7.68238 6.94534 7.42534 6.99635 7.18571 7.09531C6.9461 7.19426 6.72877 7.33914 6.54598 7.52138C6.36321 7.70361 6.21854 7.91961 6.11995 8.15692Z"
              fill="#8C8C8C"
            />
          </svg>
          검색
        </Button>
        <Button
          $active={activeButton === "mypage"}
          onClick={() => {
            const currentPathKey = getPathKey(location.pathname);
            const targetPathKey = "mypage";
            const direction =
              PATH_INDEX[targetPathKey] > PATH_INDEX[currentPathKey] ? 1 : -1;

            setActiveButton("mypage");
            navigate("/mypage", { state: { fromTabBar: true, direction } });
          }}
        >
          <svg
            width="30"
            height="7"
            viewBox="0 0 30 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3 4.9429C3.55797 4.9429 4 4.49355 4 3.95192C4 3.41029 3.55797 2.96094 3 2.96094C2.44203 2.96094 2 3.41029 2 3.95192C2 4.49355 2.44203 4.9429 3 4.9429ZM3 6.9429C4.65685 6.9429 6 5.60379 6 3.95192C6 2.30005 4.65685 0.960938 3 0.960938C1.34315 0.960938 0 2.30005 0 3.95192C0 5.60379 1.34315 6.9429 3 6.9429ZM14.9999 4.9429C15.5579 4.9429 15.9999 4.49355 15.9999 3.95192C15.9999 3.41029 15.5579 2.96094 14.9999 2.96094C14.442 2.96094 13.9999 3.41029 13.9999 3.95192C13.9999 4.49355 14.442 4.9429 14.9999 4.9429ZM14.9999 6.9429C16.6568 6.9429 18 5.60379 18 3.95192C18 2.30005 16.6568 0.960938 14.9999 0.960938C13.3431 0.960938 11.9999 2.30005 11.9999 3.95192C11.9999 5.60379 13.3431 6.9429 14.9999 6.9429ZM27.9999 3.95192C27.9999 4.49355 27.5579 4.9429 26.9999 4.9429C26.4419 4.9429 25.9999 4.49355 25.9999 3.95192C25.9999 3.41029 26.4419 2.96094 26.9999 2.96094C27.5579 2.96094 27.9999 3.41029 27.9999 3.95192ZM29.9999 3.95192C29.9999 5.60379 28.6568 6.9429 26.9999 6.9429C25.343 6.9429 23.9999 5.60379 23.9999 3.95192C23.9999 2.30005 25.343 0.960938 26.9999 0.960938C28.6568 0.960938 29.9999 2.30005 29.9999 3.95192Z"
              fill="#8C8C8C"
            />
          </svg>
          MY
        </Button>
      </NavItems>
    </Container>
  );
};

export default TabBar;
