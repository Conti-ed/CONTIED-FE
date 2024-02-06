import { Link, useNavigate } from "react-router-dom";
import { Container } from "../styles/Login.styles";
import { SERVER_URL } from "../api";
import { useForm } from "react-hook-form";
import { styled } from "styled-components";
import KakaoLogin from "react-kakao-login";
import { setFontStyle } from "../styles/UploadDrawer.styles";

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const LoginTitle = styled.h1`
  margin-bottom: 10px;
`;

const customInput = styled.input`
  border-radius: 5px;
  padding: 5px;
`;

const IDInput = styled(customInput)``;

const PWInput = styled(customInput)`
  margin-bottom: 5px;
`;

const SubmitInput = styled(customInput)`
  margin-bottom: 10px;
  ${setFontStyle}
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
      <LoginTitle>로그인</LoginTitle>
      <LoginForm onSubmit={handleSubmit(handleSignup)}>
        <IDInput {...register("email")} />
        <PWInput {...register("password")} />
        <SubmitInput type="submit" value="로그인" />
        <Link to={"/signup"}>회원가입하러 가쉴?</Link>
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
