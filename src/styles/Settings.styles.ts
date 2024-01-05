import styled from 'styled-components';

export const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  height: 100%;
`;

export const Section = styled.section`
  margin-top: 50px;
`;

export const SectionTitle = styled.span`
  font-size: 23px;
  padding: 20px 0px 15px 20px;
  display: flex;
`;

export const IconWrapper = styled.div`
  margin-right: 10px;
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

export const ToggleContainer = styled.div<{
  $isdarkmode: boolean;
  $moonbackimg: string;
  $sunbackimg: string;
}>`
  position: relative;
  display: inline-block;
  width: 60px; // Width of the switch
  height: 34px; // Height of the switch
  background-image: ${({ $isdarkmode, $moonbackimg, $sunbackimg }) =>
    $isdarkmode ? `url(${$moonbackimg})` : `url(${$sunbackimg})`};
  background-size: cover;
  border-radius: 34px; // Rounded corners for the switch
  transition: background-color 0.4s;
`;

export const ToggleCircle = styled.span<{
  $isdarkmode: boolean;
  $moonimg: string;
  $sunimg: string;
}>`
  position: absolute;
  content: '';
  height: 26px; // Circle size
  width: 26px;
  left: ${({ $isdarkmode }) =>
    $isdarkmode ? '30px' : '4px'}; // Position changes with mode
  bottom: 4px;
  background-color: white; // Circle color
  transition: left 0.4s;
  border-radius: 50%; // Circular shape for the circle
  box-shadow: 0 0 1px #2b4485; // Shadow effect
  background-image: ${({ $isdarkmode, $moonimg, $sunimg }) =>
    $isdarkmode ? `url(${$moonimg})` : `url(${$sunimg})`};
  background-size: cover;
`;
