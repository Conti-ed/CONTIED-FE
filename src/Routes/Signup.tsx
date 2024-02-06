import { Link } from "react-router-dom";
import { Container } from "../styles/Login.styles";
import { useForm } from "react-hook-form";
import { styled } from "styled-components";

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
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
      <h1>회원가입</h1>
      <SignupForm onSubmit={handleSubmit(handleLogin)}>
        <input {...register("email")} />
        <input {...register("name")} />
        <input {...register("password")} />
        <input {...register("passwordConfirm")} />
        <input type="submit" value="회원가입" />
      </SignupForm>
      <Link to={"/login"}>로그인하러 가실?</Link>
    </Container>
  );
}

export default Signup;
