import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Container,
  LogoContainer,
  Logo,
  HeaderRight,
  HeaderRightIcons,
} from "../styles/Header.styles";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

function Header() {
  const isDark = useRecoilValue(isDarkAtom);

  return (
    <Container>
      <LogoContainer>
        <Logo
          src={isDark ? "/images/fulllogo_dark.png" : "/images/logo.png"}
          alt="Conti:ed"
        />
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
