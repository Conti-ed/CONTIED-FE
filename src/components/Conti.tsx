import { styled } from "styled-components";

const Container = styled.div`
  width: 115px;
  height: 158px;
  margin-bottom: 9px;
  cursor: pointer;
`;
const ContiImage = styled.img`
  width: 115px;
  height: 115px;
  border-radius: 10px;
  margin-bottom: 8px;
`;
const ContiTitle = styled.div`
  margin-bottom: 5px;
`;
const Contikeyword = styled.div`
  background-color: ${(props) => props.theme.keywordColor};
  display: grid;
  place-content: center;
  width: 48px;
  height: 18px;
  font-size: 9px;
  font-weight: 400;
  border-radius: 8px;
  white-space: nowrap;
  cursor: pointer;
  letter-spacing: 1px;
`;

function Conti() {
  const onclick = async () => {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(`http://127.0.0.1:8000/api/conti/1`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(res, data);
  };

  return (
    <Container onClick={onclick}>
      <ContiImage src="https://www.wolflair.com/wp-content/uploads/2017/01/placeholder.jpg" />
      <ContiTitle>타이틀</ContiTitle>
      <Contikeyword>키워드</Contikeyword>
    </Container>
  );
}

export default Conti;
