import React from "react";
import styled from "styled-components";

interface EmptyStateContainerProps {
  $top: string;
}

const EmptyStateContainer = styled.div<EmptyStateContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: ${(props) => props.$top};
  transform: translateY(-50%);
`;

const EmptyStateImage = styled.img`
  margin-bottom: 8px;
`;

const EmptyStateText1 = styled.div`
  font-size: 15px;
  font-weight: 300;
  color: #171a1f;
  text-align: center;
  margin-bottom: 9px;
`;

const EmptyStateText2 = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: #828282;
  text-align: center;
`;

interface EmptyStateProps {
  message: string;
  top: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, top }) => {
  return (
    <EmptyStateContainer $top={top}>
      <EmptyStateImage src="images/WhitePiano.png" alt="Empty state" />
      <EmptyStateText1>앗!</EmptyStateText1>
      <EmptyStateText2>{message}</EmptyStateText2>
    </EmptyStateContainer>
  );
};

export default EmptyState;
