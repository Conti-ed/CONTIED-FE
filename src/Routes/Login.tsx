import KakaoLogin from "react-kakao-login";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";

const Container = styled.div`
  display: grid;
  place-content: center;
  height: 80vh;
`;

function Login() {
  const navigate = useNavigate();
  const kakaoResponse = async (response: {
    response: { access_token: any };
  }) => {
    console.log(response.response.access_token);

    let res = await fetch(
      `http://127.0.0.1:8000/rest-auth/kakao/?code=${response.response.access_token}`,
      {
        method: "GET",
      }
    );
    let data = await res.json();
    localStorage.setItem("accessToken", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);
    console.log(res, data);

    navigate("/");
  };
  return (
    <Container>
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
