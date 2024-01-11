import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FaWifi, FaSignal } from "react-icons/fa";
import { FaBatteryFull } from "react-icons/fa6";
import {
  TopIconsContainer,
  Icon,
  RightIconGroup,
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
    <>
      <TopIconsContainer>
        <div>19:41</div>
        <RightIconGroup>
          <Icon>
            <FaSignal />
          </Icon>
          <Icon>
            <FaWifi />
          </Icon>
          <Icon>
            <FaBatteryFull />
          </Icon>
        </RightIconGroup>
      </TopIconsContainer>
      <Container>
        <LogoContainer>
          <Logo
            src={
              isDark
                ? "/images/fulllogo_dark.png"
                : "/images/fulllogo_light.png"
            }
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
    </>
  );
}

export default Header;
