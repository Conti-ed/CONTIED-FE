import { SERVER_URL } from "../api";
import { useForm } from "react-hook-form";
import { styled } from "styled-components";
import KakaoLogin from "react-kakao-login";
import { setFontStyle } from "../styles/UploadDrawer.styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const colors = {
  main: "#96c9ed",
  mainDark: "#113e7a",
  white: "#ffffff",
  formBg: "#13232f",
  grayLight: "#a0b3b0",
};

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75vh;
`;

const FormContainer = styled.div`
  background: rgba(${colors.formBg}, 0.9);
  padding: 40px;
  width: 100%;
  border-radius: 4px;
  margin: 0 auto;
  box-shadow: 0 4px 10px 4px rgba(${colors.formBg}, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TabGroup = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 30px 0;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
  li button {
    border-radius: 10px;
    display: block;
    text-decoration: none;
    padding: 15px;
    background: rgba(${colors.grayLight}, 0.25);
    color: ${colors.grayLight};
    font-size: 17px;
    float: left;
    width: 50%;
    text-align: center;
    cursor: pointer;
    transition: 0.5s ease;
    &:hover {
      background: ${colors.mainDark};
      color: ${colors.white};
    }
  }
  .active a {
    background: ${colors.main};
    color: ${colors.white};
  }
`;

const TabButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  color: ${colors.grayLight};
  font-size: 17px;
  padding: 15px;
  transition: 0.5s ease;
  width: 50%;
  text-align: center;

  &:hover,
  &:focus {
    background: ${colors.mainDark};
    color: ${colors.white};
    outline: none;
  }

  &.active {
    background: ${colors.main};
    color: ${colors.white};
  }
`;

const Title = styled.h1`
  margin-bottom: 10px;
`;

const Input = styled.input`
  ${setFontStyle};
  border-radius: 5px;
  padding: 5px;
  margin-bottom: 10px;
  border: 1px solid #a0b3b0;
  background: transparent;
  color: #ffffff;

  &:focus {
    outline: none;
    border-color: #113e7a;
  }
`;

const Button = styled.button`
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #113e7a;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;

  &:hover {
    background-color: darken(#113e7a, 5%);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

type FormValues = {
  email: string;
  password: string;
  name: string;
  passwordConfirm?: string;
};

function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const switchTab = (tabName: "login" | "signup") => {
    setActiveTab(tabName);
  };

  const { register, handleSubmit, watch } = useForm<FormValues>();

  const handleLogin = async (formValues: FormValues) => {
    const res = await fetch(`${SERVER_URL}/api/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    });
    const data = await res.json();
    console.log(data, res.status);
    if (res.ok) {
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("user_info", JSON.stringify(data.user_data));
      navigate("/");
    }
  };

  const handleSignup = async (formValues: FormValues) => {
    const res = await fetch(`${SERVER_URL}/api/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    });
    const data = await res.json();
    console.log(data, res.status);
    if (res.ok) {
      switchTab("login");
    }
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
    <AppContainer>
      <FormContainer>
        <TabGroup>
          <li className={activeTab === "login" ? "active" : ""}>
            <TabButton onClick={() => switchTab("login")}>로그인</TabButton>
          </li>
          <li className={activeTab === "signup" ? "active" : ""}>
            <TabButton onClick={() => switchTab("signup")}>회원가입</TabButton>
          </li>
        </TabGroup>
        {activeTab === "login" ? (
          <>
            <Title>로그인</Title>
            <Form onSubmit={handleSubmit(handleLogin)}>
              <Input
                {...register("email", { required: true })}
                placeholder="이메일"
              />
              <Input
                {...register("password", { required: true })}
                placeholder="비밀번호"
                type="password"
              />
              <Button type="submit">로그인</Button>
            </Form>
            <KakaoLogin
              token={"ca220974886e2ef4eb4a37d21b258d7c"}
              onSuccess={kakaoResponse}
              onFail={console.error}
              onLogout={console.info}
            />
          </>
        ) : (
          <>
            <Title>회원가입</Title>
            <Form onSubmit={handleSubmit(handleSignup)}>
              <Input
                {...register("email", { required: true })}
                placeholder="이메일"
              />
              <Input
                {...register("name", { required: true })}
                placeholder="이름"
              />
              <Input
                {...register("password", { required: true })}
                placeholder="비밀번호"
                type="password"
              />
              <Input
                {...register("passwordConfirm", {
                  required: true,
                  validate: (val: string | undefined) => {
                    if (watch("password") !== val) {
                      console.log("Your passwords do no match");
                      return "Your passwords do no match";
                    }
                  },
                })}
                placeholder="비밀번호 확인"
                type="password"
              />
              <Button type="submit">회원가입</Button>
            </Form>
          </>
        )}
      </FormContainer>
    </AppContainer>
  );
}

export default Login;
