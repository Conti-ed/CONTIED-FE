import { styled } from "styled-components";

const StatusBarStyles = styled.div`
  width: 100%;
  height: 42px;
  background-color: #e7f0fc;
`;

function StatusBar() {
  return <StatusBarStyles />;
}

export default StatusBar;
