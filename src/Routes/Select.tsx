import React, { useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import Icon from "../components/Icon";
import { Oval } from "react-loader-spinner";

const Container = styled.div`
  height: calc(var(--vh, 1vh) * 100);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: #fff;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #4f8eec;
  margin-bottom: 30px;
`;

const TextContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
`;

const Box = styled(motion.div)<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 10px;
  background: ${({ $isSelected }) =>
    $isSelected
      ? "linear-gradient(140.12deg, #94B4ED 22.86%, #FFFFFF 126.99%)"
      : "#f0f0f0"};
  width: 300px;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const Text = styled.div<{ $isSelected: boolean }>`
  font-size: 15px;
  font-weight: 500;
  color: ${({ $isSelected }) => ($isSelected ? "#f0f0f0" : "#000")};
  transition: color 0.3s ease;
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 300px;
  height: 40px;
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  background-color: #4f8eec;
  border: 2px solid #94b4ed;
  border-radius: 10px;
  cursor: pointer;
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
`;

const SpinnerContainer = styled(motion.div)`
  position: absolute;
  right: -10px;
`;

const CheckContainer = styled(motion.div)`
  position: absolute;
  right: 45%;
  bottom: -8px;
`;

const textVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.5,
      duration: 0.5,
    },
  }),
};

const buttonVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const roleMapping = [
  { display: "리더", value: "LEADER" },
  { display: "연주자", value: "PLAYER" },
  { display: "참여자", value: "PARTICIPANT" },
];

const Select: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [buttonText, setButtonText] = useState("완료");
  const [showSpinner, setShowSpinner] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const navigate = useNavigate();

  const handleBoxClick = (index: number) => {
    setSelected(index);
  };

  const handleButtonClick = async () => {
    if (selected === null) return;

    setButtonText("설정 중...");
    setShowSpinner(true);

    const selectedRole = roleMapping[selected].value;

    try {
      await api.post("/users/role", { role: selectedRole });

      setShowSpinner(false);
      setTimeout(() => {
        setButtonText("");
        setShowCheck(true);
        setTimeout(() => {
          setShowCheck(false);
          navigate("/home");
        }, 1000);
      }, 500);
    } catch (error) {
      console.error("역할 설정 중 오류:", error);
      setButtonText("문제가 있는 것 같아요...");
      setShowSpinner(false);
    }
  };

  return (
    <Container>
      <Content>
        <Title>주로 어떤 역할이신가요?!</Title>
        <TextContainer>
          {roleMapping.map((role, index) => (
            <Box
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              $isSelected={selected === index}
              onClick={() => handleBoxClick(index)}
            >
              <Text $isSelected={selected === index}>{role.display}</Text>
            </Box>
          ))}
        </TextContainer>
        {selected !== null && (
          <Button
            initial="hidden"
            animate="visible"
            variants={buttonVariants}
            onClick={handleButtonClick}
          >
            <ButtonContent>
              <AnimatePresence>
                {showSpinner && (
                  <SpinnerContainer
                    key="spinner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Oval
                      height={20}
                      width={20}
                      color="#ffffff"
                      secondaryColor="#94b4ed"
                      strokeWidth={5}
                      strokeWidthSecondary={5}
                    />
                  </SpinnerContainer>
                )}
                {showCheck && (
                  <CheckContainer
                    key="check"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      x: { duration: 0.5 },
                      opacity: { duration: 0.5 },
                    }}
                  >
                    <Icon id="confirm-select" width="24" height="24" />
                  </CheckContainer>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {buttonText && (
                  <motion.div
                    key="buttonText"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {buttonText}
                  </motion.div>
                )}
              </AnimatePresence>
            </ButtonContent>
          </Button>
        )}
      </Content>
    </Container>
  );
};

export default Select;
