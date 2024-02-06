import { Link, useNavigate } from "react-router-dom";
import { Container } from "../styles/Login.styles";
import { SERVER_URL } from "../api";
import { useForm } from "react-hook-form";
import { styled } from "styled-components";
import KakaoLogin from "react-kakao-login";

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

type formValues = {
  email: string;
  password: string;
};

function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<formValues>();
  const handleSignup = (data: formValues) => {
    console.log(data);
  };

  const kakaoResponse = async (response: {
    response: { access_token: any };
  }) => {
    console.log(response.response.access_token);

    let res = await fetch(
      `${SERVER_URL}/rest-auth/kakao/?code=${response.response.access_token}`,
      {
        method: "GET",
      }
    );
    let data = await res.json();
    localStorage.setItem("accessToken", data.kakao_data.access_token);
    localStorage.setItem("refreshToken", data.kakao_data.refresh_token);
    localStorage.setItem("user_info", JSON.stringify(data.user_info));
    console.log(res, data);

    navigate("/");
  };

  return (
    <Container>
      <h1>로그인</h1>
      <LoginForm onSubmit={handleSubmit(handleSignup)}>
        <input {...register("email")} />
        <input {...register("password")} />
        <input type="submit" value="로그인" />
        <Link to={"/signup"}>회원가입하러 가실?</Link>
      </LoginForm>
      <KakaoLogin
        token={"ca220974886e2ef4eb4a37d21b258d7c"}
        onSuccess={kakaoResponse}
        onFail={console.error}
        onLogout={console.info}
      />
    </Container>
  );
}

export default Login;
