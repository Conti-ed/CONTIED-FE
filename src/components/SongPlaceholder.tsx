import styled from "styled-components";

const Container = styled.div`
  background-color: #e7f0fc;
  position: absolute;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function SongPlaceholder() {
  return (
    <Container>
      <img
        src="/images/WhitePiano.png"
        alt="Logo"
        style={{ width: "16px", height: "auto" }}
      />
    </Container>
  );
}

export default SongPlaceholder;
