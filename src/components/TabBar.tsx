import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  width: 100%;
  height: 60px;
`;

const Tab = styled.div`
  cursor: pointer;
`;

function TabBar() {
  return (
    <Container>
      <Link to={"/"}>
        <Tab>홈</Tab>
      </Link>
      <Link to={"/feed"}>
        <Tab>피드</Tab>
      </Link>
      <Link to={"/settings"}>
        <Tab>설정</Tab>
      </Link>
    </Container>
  );
}

export default TabBar;
