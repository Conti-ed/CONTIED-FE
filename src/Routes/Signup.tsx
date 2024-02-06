import { Link } from "react-router-dom";
import { Container } from "../styles/Login.styles";
import { useForm } from "react-hook-form";
import { styled } from "styled-components";
import { setFontStyle } from "../styles/UploadDrawer.styles";

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const SignupTitle = styled.h1`
  margin-bottom: 10px;
`;

const customInput = styled.input`
  border-radius: 5px;
  padding: 5px;
`;

const SignupInput = styled(customInput)``;

const ConfirmInput = styled(customInput)`
  margin-bottom: 5px;
`;

const SubmitInput = styled(customInput)`
  margin-bottom: 10px;
  ${setFontStyle}
`;

type formValues = {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
};

function Signup() {
  const { register, handleSubmit } = useForm<formValues>();
  const handleLogin = (data: formValues) => {
    console.log(data);
  };
  return (
    <Container>
      <SignupTitle>회원가입</SignupTitle>
      <SignupForm onSubmit={handleSubmit(handleLogin)}>
        <SignupInput {...register("email")} />
        <SignupInput {...register("name")} />
        <SignupInput {...register("password")} />
        <ConfirmInput {...register("passwordConfirm")} />
        <SubmitInput type="submit" value="회원가입" />
      </SignupForm>
      <Link to={"/login"}>로그인하러 가쉴?</Link>
    </Container>
  );
}

export default Signup;
