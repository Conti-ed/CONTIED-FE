import { motion } from "framer-motion";
import styled from "styled-components";

export const Container = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 15px;
  padding: 20px;
  justify-content: center;
  align-content: start;
  margin-bottom: 30px;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const FeedVariants = {
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
