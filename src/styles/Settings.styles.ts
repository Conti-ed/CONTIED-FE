import styled from 'styled-components';

export const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  height: 100%;
`;

export const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  height: 50px;
  border-bottom: 1px solid #333;
  &:last-child {
    border-bottom: none;
  }
`;

export const MenuTitle = styled.span`
  font-size: 16px;
`;

export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;

  & input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #76ee59;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #76ee59;
  }

  input:checked + .slider:before {
    transform: translateX(26px);
  }
`;

export const BottomNav = styled.nav`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
`;

export const ArrowIcon = styled.div``;

export const Section = styled.section`
  & + & {
    margin-top: 20px;
  }
`;
