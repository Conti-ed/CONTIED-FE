import {
  SettingsContainer,
  Section,
  MenuItem,
  MenuTitle,
  ToggleSwitch,
} from '../styles/Settings.styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Settings = () => {
  return (
    <SettingsContainer>
      {/* 프로필 섹션 */}
      <Section>
        <MenuItem>
          <MenuTitle>내 콘티</MenuTitle>
          <ChevronRightIcon />
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

      {/* 알림 섹션 */}
      <Section>
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

      {/* 기타 섹션 */}
      <Section>
        <MenuItem>
          <MenuTitle>다크 모드</MenuTitle>
          <ToggleSwitch>
            <input type="checkbox" id="dark-mode-toggle" />
            <span className="slider"></span>
          </ToggleSwitch>
        </MenuItem>
        <MenuItem>
          <MenuTitle>문의 및 건의사항</MenuTitle>
          <ChevronRightIcon />
        </MenuItem>
      </Section>
    </SettingsContainer>
  );
};

export default Settings;
