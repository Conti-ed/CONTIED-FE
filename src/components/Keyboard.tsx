import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";
import Icon from "./Icon";

const keyboardLayout = [
  ["ㅂ", "ㅈ", "ㄷ", "ㄱ", "ㅅ", "ㅛ", "ㅕ", "ㅑ", "ㅐ", "ㅔ"],
  ["ㅁ", "ㄴ", "ㅇ", "ㄹ", "ㅎ", "ㅗ", "ㅓ", "ㅏ", "ㅣ"],
  ["⬆", "ㅋ", "ㅌ", "ㅊ", "ㅍ", "ㅠ", "ㅜ", "ㅡ", "⬅"],
  ["123", "🌐", " ", "←"],
];

const KeyboardContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 329px;
  width: 100%;
  background-color: #dddee6;
  position: fixed; /* 화면에 고정 */
  bottom: 0;
  left: 0;
`;

const IconContainer = styled.div`
  display: flex;
  margin-left: 3.75px;
  gap: 21.5px;
  align-items: center;
`;

const KeyboardTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #c0c0c0;
  color: #94b4ed;
  padding-left: 15px;
  padding-right: 15px;
`;

const KeyContainer = styled.div`
  margin-top: -15px;
  padding: 10px;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 8px;
`;

const Key = styled.button`
  flex: 1;
  margin: 2px;
  padding: 7px;
  height: 45px;
  font-size: 20px;
  color: #000;
  background-color: #ffffff;
  border: 1px solid #c0c0c0;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0px 2px 2px -2px gray;

  &:hover {
    background-color: #d0d0d0;
  }

  &:active {
    background-color: #a0a0a0;
  }
`;

const SpecialKey = styled(Key)`
  background-color: #d3d3d3;
`;

const SpaceKey = styled(Key)`
  flex: 3;
  font-weight: 500;
  font-size: 16px;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BottomButtons = styled.div`
  margin-top: -10px;
  display: flex;
  justify-content: space-around;
  gap: 250px;
  width: 100%;
  padding: 18px;
`;

const BottomBarContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const BottomBar = styled.div`
  width: 139px;
  height: 4px;
  background-color: #000;
  border-radius: 2.5px;
`;

const Keyboard: React.FC = () => {
  return (
    <KeyboardContainer
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.24 }}
    >
      <KeyboardTopBar>
        <IconContainer>
          <IconWrapper>
            <Icon id="up-keyboard" width="20" height="12" />
          </IconWrapper>
          <IconWrapper>
            <Icon id="down-keyboard" width="20" height="12" />
          </IconWrapper>
        </IconContainer>
        <span style={{ fontSize: "15px" }}>완료</span>
      </KeyboardTopBar>
      <KeyContainer>
        {keyboardLayout.map((row, rowIndex) => (
          <Row key={rowIndex}>
            {row.map((key, keyIndex) => {
              if (key === "⬆") {
                return (
                  <SpecialKey key={keyIndex}>
                    <IconWrapper>
                      <Icon id="shift-keyboard" width="20" height="18" />
                    </IconWrapper>
                  </SpecialKey>
                );
              } else if (key === "⬅") {
                return (
                  <SpecialKey key={keyIndex}>
                    <IconWrapper>
                      <Icon id="back-keyboard" width="23" height="18" />
                    </IconWrapper>
                  </SpecialKey>
                );
              } else if (key === "←") {
                return (
                  <SpecialKey key={keyIndex}>
                    <IconWrapper>
                      <Icon id="enter-keyboard" width="19" height="16" />
                    </IconWrapper>
                  </SpecialKey>
                );
              } else if (key === "123") {
                return (
                  <SpecialKey key={keyIndex}>
                    <IconWrapper>{key}</IconWrapper>
                  </SpecialKey>
                );
              } else if (key === " ") {
                return <SpaceKey key={keyIndex}>스페이스</SpaceKey>;
              } else if (key === "🌐") {
                return (
                  <SpecialKey key={keyIndex}>
                    <IconWrapper>
                      <Icon id="emoji-keyboard" width="21" height="20" />
                    </IconWrapper>
                  </SpecialKey>
                );
              } else {
                return <Key key={keyIndex}>{key}</Key>;
              }
            })}
          </Row>
        ))}
      </KeyContainer>
      <BottomButtons>
        <IconWrapper>
          <Icon id="global-keyboard" width="28" height="28" />
        </IconWrapper>
        <IconWrapper>
          <Icon id="mic-keyboard" width="19" height="29" />
        </IconWrapper>
      </BottomButtons>
      <BottomBarContainer>
        <BottomBar />
      </BottomBarContainer>
    </KeyboardContainer>
  );
};

export default Keyboard;
