import styled from "styled-components";

const Container = styled.div`
  width: 129px;
  height: 129px;
  border-radius: 20px;
  background-color: #c4d9f9;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function AlbumPlaceholder() {
  return (
    <Container>
      <img
        src="/images/WhitePiano.png"
        alt="Logo"
        style={{ width: "51px", height: "auto" }}
      />
    </Container>
  );
}

export default AlbumPlaceholder;
