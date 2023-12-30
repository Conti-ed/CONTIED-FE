import { CiMenuKebab, CiSearch } from "react-icons/ci";
import { styled } from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  padding: 0 20px;
`;
const LogoContainer = styled.div``;
const Logo = styled.img`
  width: 132px;
`;
const HeaderRight = styled.div`
  display: flex;
  gap: 15px;
`;
const HeaderRightIcons = styled.div`
  font-size: 20px;
  cursor: pointer;
`;

function Header() {
  return (
    <Container>
      <LogoContainer>
        <Logo src="images/logo1.png" alt="왜안뜨노" />
      </LogoContainer>
      <HeaderRight>
        <HeaderRightIcons>
          <CiSearch />
        </HeaderRightIcons>
        <HeaderRightIcons>
          <CiMenuKebab />
        </HeaderRightIcons>
      </HeaderRight>
    </Container>
  );
}

export default Header;
