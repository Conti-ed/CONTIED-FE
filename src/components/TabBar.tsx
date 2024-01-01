import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { CiHome, CiGrid41, CiSquarePlus, CiSettings } from "react-icons/ci";

const Container = styled.div`
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  width: 100%;
  height: 60px;
  background: ${(props) => props.theme.tabBgColor};
`;

const Tab = styled.div<{ $isActive: Boolean }>`
  font-size: 24px;
  color: ${(props) => (props.$isActive ? "white" : "gray")};
  cursor: pointer;
`;

function TabBar() {
  const { pathname } = useLocation();

  return (
    <Container>
      <Link to={"/"}>
        <Tab $isActive={pathname === "/"}>
          <CiHome />
        </Tab>
      </Link>
      <Link to={"/feed"}>
        <Tab $isActive={pathname === "/feed"}>
          <CiGrid41 />
        </Tab>
      </Link>
      <Link to={"/upload"}>
        <Tab $isActive={pathname === "/upload"}>
          <CiSquarePlus />
        </Tab>
      </Link>
      <Link to={"/settings"}>
        <Tab $isActive={pathname === "/settings"}>
          <CiSettings />
        </Tab>
      </Link>
    </Container>
  );
}

export default TabBar;
