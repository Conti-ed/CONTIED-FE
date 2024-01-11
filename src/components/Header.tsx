import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FaWifi, FaSignal } from "react-icons/fa";
import { IoIosBatteryFull } from "react-icons/io";
import {
  TopIconsContainer,
  Icon,
  RightIconGroup,
  Container,
  LogoContainer,
  Logo,
  HeaderRight,
  HeaderRightIcons,
  Clock,
} from "../styles/Header.styles";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

function Header() {
  const isDark = useRecoilValue(isDarkAtom);

  return (
    <>
      <TopIconsContainer>
        <Clock>19:41</Clock>
        <RightIconGroup>
          <Icon>
            <FaSignal size="20" />
          </Icon>
          <Icon>
            <FaWifi size="20" />
          </Icon>
          <Icon>
            <IoIosBatteryFull size="30" />
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
