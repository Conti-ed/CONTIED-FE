import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Container,
  LogoContainer,
  Logo,
  HeaderRight,
  HeaderRightIcons,
} from '../styles/Header.styles';

function Header() {
  return (
    <Container>
      <LogoContainer>
        <Logo src="images/fulllogo_dark.png" alt="Conti:ed" />
      </LogoContainer>
      <HeaderRight>
        <HeaderRightIcons>
          <SearchIcon />
        </HeaderRightIcons>
        <HeaderRightIcons>
          <MoreVertIcon />
        </HeaderRightIcons>
      </HeaderRight>
    </Container>
  );
}

export default Header;
