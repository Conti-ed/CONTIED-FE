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
  StyledLink,
  SearchInput,
} from "../styles/Header.styles";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, useAnimation } from "framer-motion";

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const isDark = useRecoilValue(isDarkAtom);
  const inputAnimation = useAnimation();

  const handleSearchIconClick = () => {
    if (searchOpen) {
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      inputAnimation.start({ scaleX: 1 });
      setSearchQuery("");
    }
    setSearchOpen((prev) => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
            <StyledLink to="/search">
              <motion.svg
                onClick={handleSearchIconClick}
                animate={{
                  x: searchOpen ? 23 : 160,
                  fill: searchOpen ? "black" : "white",
                  width: searchOpen ? "14px" : "17px",
                }}
                transition={{ ease: "linear" }}
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6.3833 12.8767C7.76953 12.8767 9.04785 12.4285 10.0938 11.6814L14.0283 15.616C14.2109 15.7986 14.4517 15.8899 14.709 15.8899C15.2485 15.8899 15.6304 15.4749 15.6304 14.9436C15.6304 14.6946 15.5474 14.4539 15.3647 14.2795L11.4551 10.3616C12.2769 9.28247 12.7666 7.94604 12.7666 6.49341C12.7666 2.98218 9.89453 0.110107 6.3833 0.110107C2.88037 0.110107 0 2.97388 0 6.49341C0 10.0046 2.87207 12.8767 6.3833 12.8767ZM6.3833 11.4988C3.64404 11.4988 1.37793 9.23267 1.37793 6.49341C1.37793 3.75415 3.64404 1.48804 6.3833 1.48804C9.12256 1.48804 11.3887 3.75415 11.3887 6.49341C11.3887 9.23267 9.12256 11.4988 6.3833 11.4988Z" />
              </motion.svg>
              <SearchInput
                type="text"
                placeholder="키워드 검색"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleSearch}
                autoFocus
                transition={{ ease: "linear" }}
                initial={{ scaleX: 0 }}
                animate={inputAnimation}
                exit={{ scaleX: 0 }}
              />
            </StyledLink>
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
