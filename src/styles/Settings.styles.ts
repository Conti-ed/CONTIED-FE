import { motion } from "framer-motion";
import styled from "styled-components";

export const SettingsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-bottom: 100px;
`;

export const Section = styled.section`
  margin: 30px 0px 0px 0px;
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
    content: "";
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
  $isdark: boolean;
  $moonbackimg: string;
  $sunbackimg: string;
}>`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  background-image: ${(props) =>
    props.$isdark ? `url(${props.$moonbackimg})` : `url(${props.$sunbackimg})`};
  background-size: cover;
  border-radius: 34px; // Rounded corners for the switch
  transition: background-color 0.4s;
`;

export const ToggleCircle = styled.span<{
  $isdark: boolean;
  $moonimg: string;
  $sunimg: string;
}>`
  position: absolute;
  content: "";
  height: 26px; // Circle size
  width: 26px;
  left: ${(props) => (props.$isdark ? "30px" : "4px")};
  bottom: 4px;
  background-color: white; // Circle color
  transition: left 0.4s;
  border-radius: 50%; // Circular shape for the circle
  box-shadow: 0 0 1px #2b4485; // Shadow effect
  background-image: ${(props) =>
    props.$isdark ? `url(${props.$moonimg})` : `url(${props.$sunimg})`};
  background-size: cover;
`;

export const settingsVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};
