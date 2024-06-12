import styled from "styled-components";

interface InputSafariSpaceProps {
  $isFocused: boolean;
}

const Container = styled.div<InputSafariSpaceProps>`
  width: 100%;
  height: ${(props) => (props.$isFocused ? "15px" : "0")};
  position: absolute;
  bottom: ${(props) =>
    props.$isFocused ? "119px" : "0px"}; /* TabBarWrapper 바로 위에 위치 */
  display: ${(props) => (props.$isFocused ? "flex" : "none")};
  background-color: #f3f7fc;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  transition: bottom 3s ease;
`;

const AddressText = styled.span`
  font-size: 12.66px;
  font-weight: 500;
  color: #000000;
`;

const InputSafariSpace: React.FC<InputSafariSpaceProps> = ({ $isFocused }) => {
  return (
    <Container $isFocused={$isFocused}>
      <AddressText>contied.com</AddressText>
    </Container>
  );
};

export default InputSafariSpace;
