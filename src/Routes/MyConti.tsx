import Conti from "../components/Conti";
import { Container, HomeVariants } from "../styles/Home.styles";

function MyConti() {
  return (
    <Container
      variants={HomeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      내 콘티
    </Container>
  );
}

export default MyConti;
