import SearchIcon from "@mui/icons-material/Search";
import { ImEqualizer2 } from "react-icons/im";
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
  SearchInput,
} from "../styles/Header.styles";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Header() {
  const [showInput, setShowInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const isDark = useRecoilValue(isDarkAtom);

  const handleSearchIconClick = () => {
    setShowInput(true); // 입력창 표시
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInputBlur = () => {
    setShowInput(false);
    setSearchQuery("");
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

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
            <Link to="/search">
              {showInput ? (
                <SearchInput
                  type="text"
                  placeholder="키워드 검색"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleSearch}
                  onBlur={handleInputBlur}
                  autoFocus
                />
              ) : (
                <SearchIcon onClick={handleSearchIconClick} />
              )}
            </Link>
          </HeaderRightIcons>
          <HeaderRightIcons>
            <ImEqualizer2 />
          </HeaderRightIcons>
        </HeaderRight>
      </Container>
    </>
  );
}

export default Header;
