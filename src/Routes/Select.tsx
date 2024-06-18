import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StatusBar from "../components/StatusBar";
import SafariSpace from "../components/SafariSpace";
import { Oval } from "react-loader-spinner";

const Container = styled.div`
  height: 100vh;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 663px;
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
  padding: 15px;
  border-radius: 10px;
  background-color: ${({ $isSelected }) =>
    $isSelected ? "#94b4ed" : "#f0f0f0"};
  width: 300px;
  cursor: pointer;
  transition: background-color 0.3s ease; /* 트랜지션 시간 단축 */
`;

const Text = styled.div<{ $isSelected: boolean }>`
  font-size: 15px;
  font-weight: 500;
  color: ${({ $isSelected }) => ($isSelected ? "#f0f0f0" : "#000")};
  transition: color 0.3s ease; /* 트랜지션 시간 단축 */
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  background-color: #4f8eec;
  border: 2px solid #94b4ed;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #4f8eec;
  }
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

const Select: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleBoxClick = (index: number) => {
    setSelected(index);
  };

  const handleButtonClick = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/home");
    }, 2000);
  };

  return (
    <Container>
      <StatusBar />
      <Content>
        <Title>주로 어떤 역할이신가요?!</Title>
        <TextContainer>
          {["리더", "연주자", "참여자"].map((text, index) => (
            <Box
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              $isSelected={selected === index}
              onClick={() => handleBoxClick(index)}
            >
              <Text $isSelected={selected === index}>{text}</Text>
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
            {loading ? (
              <Oval
                height={15}
                width={15}
                color="#ffffff"
                secondaryColor="#94b4ed"
                strokeWidth={5}
                strokeWidthSecondary={5}
              />
            ) : (
              "완료"
            )}
          </Button>
        )}
      </Content>
      <SafariSpace $isFocused={false} />
    </Container>
  );
};

export default Select;
