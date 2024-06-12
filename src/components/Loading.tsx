import { styled } from "styled-components";

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 48%;
  transform: translateY(-50%);
`;

const LoadingImage = styled.img`
  margin-bottom: 8px;
`;

const LoadingText = styled.div`
  font-size: 10px;
  font-weight: 300;
  color: #828282;
  text-align: center;
`;

const Loading: React.FC = () => {
  return (
    <LoadingContainer>
      <LoadingImage src="images/WhitePiano.png" alt="Empty state" />
      <LoadingText>잠시만요...</LoadingText>
    </LoadingContainer>
  );
};

export default Loading;
