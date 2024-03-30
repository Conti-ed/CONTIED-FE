import {
  settingsVariants,
  SettingsContainer,
  Section,
  SectionTitle,
  IconWrapper,
  MenuItem,
  MenuTitle,
  ToggleSwitch,
  ToggleContainer,
  ToggleCircle,
} from "../styles/Settings.styles";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { HiUserCircle, HiBell } from "react-icons/hi";
import { FaGuitar } from "react-icons/fa6";
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
import { useRecoilState } from "recoil";
import { isDarkAtom, isLoginAtom } from "../atoms";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [isDark, setIsDark] = useRecoilState(isDarkAtom);
  const [isLogin, setIsLogin] = useRecoilState(isLoginAtom);
  const moonImage = "/images/moon.png";
  const sunImage = "/images/sun.png";
  const moonBackImage = "/images/moon_back.png";
  const sunBackImage = "/images/sun_back.png";
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user_info");
    setIsLogin(false);
    navigate("/login");
  };

  const toggleMode = () => {
    setIsDark(!isDark);
  };

  return (
    <SettingsContainer
      variants={settingsVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Section>
        <SectionTitle>
          <IconWrapper>
            <HiUserCircle />
          </IconWrapper>
          프로필
        </SectionTitle>
        <MenuItem>
          <MenuTitle>내 콘티의 모든 것</MenuTitle>
          <ChevronRightIcon onClick={() => navigate(`/myconti`)} />
        </MenuItem>
        <MenuItem>
          <MenuTitle>프로필 수정</MenuTitle>
          <ChevronRightIcon />
        </MenuItem>
        <MenuItem>
          <MenuTitle>기록</MenuTitle>
          <ChevronRightIcon />
        </MenuItem>
      </Section>

      <Section>
        <SectionTitle>
          <IconWrapper>
            <HiBell />
          </IconWrapper>
          알림
        </SectionTitle>
        <MenuItem>
          <MenuTitle>기본 알림</MenuTitle>
          <ToggleSwitch>
            <input type="checkbox" id="notifications-toggle" />
            <span className="slider"></span>
          </ToggleSwitch>
        </MenuItem>
        <MenuItem>
          <MenuTitle>업데이트</MenuTitle>
          <ToggleSwitch>
            <input type="checkbox" id="update-toggle" />
            <span className="slider"></span>
          </ToggleSwitch>
        </MenuItem>
      </Section>

      <Section>
        <SectionTitle>
          <IconWrapper>
            <FaGuitar />
          </IconWrapper>
          기타
        </SectionTitle>
        <MenuItem>
          <MenuTitle>다크 모드</MenuTitle>
          <div className="darkmode_button">
            <ToggleContainer
              $isdark={isDark}
              onClick={toggleMode}
              $moonbackimg={moonBackImage}
              $sunbackimg={sunBackImage}
            >
              <ToggleCircle
                $isdark={isDark}
                $moonimg={moonImage}
                $sunimg={sunImage}
              />
            </ToggleContainer>
          </div>
        </MenuItem>
        <MenuItem>
          <MenuTitle>문의 및 건의사항</MenuTitle>
          <ChevronRightIcon />
        </MenuItem>
        {isLogin ? (
          <MenuItem onClick={handleLogout}>
            <MenuTitle>로그아웃</MenuTitle>
            <IoIosLogOut />
          </MenuItem>
        ) : (
          <MenuItem onClick={() => navigate("/login")}>
            <MenuTitle>로그인</MenuTitle>
            <IoIosLogIn />
          </MenuItem>
        )}
      </Section>
    </SettingsContainer>
  );
};

export default Settings;
