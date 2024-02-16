import { SERVER_URL } from "../api";
import { useForm } from "react-hook-form";
import { styled } from "styled-components";
import KakaoLogin from "react-kakao-login";
import { setFontStyle } from "../styles/UploadDrawer.styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSetRecoilState } from "recoil";
import { isLoginAtom } from "../atoms";

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
  position: relative;
`;

const FormWrapper = styled.div`
  min-height: 235px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TabGroup = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
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
  position: relative;
  border: none;
  background: none;
  cursor: pointer;
  color: ${colors.grayLight};
  font-size: 17px;
  padding: 15px;
  transition: 0.5s ease;
  min-height: 48px;
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

const ActiveTabIndicator = styled(motion.div)`
  height: 2px;
  background-color: ${colors.main};
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
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

const KakaoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

type FormValues = {
  email: string;
  password: string;
  name: string;
};

function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const setIsLogin = useSetRecoilState(isLoginAtom);
  const [errorMsg, setErrorMsg] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<FormValues>();

  const switchTab = (tabName: "login" | "signup") => {
    resetField("email");
    resetField("name");
    resetField("password");
    setActiveTab(tabName);
  };

  const handleLogin = async (formValues: FormValues) => {
    setIsFetching(true);
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
      localStorage.setItem("user_info", JSON.stringify(data.user_info));
      setIsLogin(true);
      navigate("/");
    } else if (res.status === 401) {
      setErrorMsg("이메일 또는 비밀번호를 잘못 입력했습니다.");
    } else {
      setErrorMsg(
        "일시적인 오류로 서비스 접속에 실패했습니다. 잠시 후 다시 시도해주세요."
      );
    }
    setIsFetching(false);
  };

  const handleSignup = async (formValues: FormValues) => {
    setIsFetching(true);
    const res = await fetch(`${SERVER_URL}/api/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    });
    const data = await res.json();
    console.log(data, res.status);
    if (res.ok) {
      switchTab("login");
    } else if (res.status === 400) {
      setErrorMsg("이메일 형식에 맞지 않은 메일주소입니다. 다시 시도해주세요.");
    } else if (res.status === 409) {
      setErrorMsg(data.message);
    } else {
      setErrorMsg(
        "일시적인 오류로 서비스 접속에 실패했습니다. 잠시 후 다시 시도해주세요."
      );
    }
    setIsFetching(false);
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
          <li>
            <TabButton
              className={activeTab === "login" ? "active" : ""}
              onClick={() => switchTab("login")}
            >
              로그인
              {activeTab === "login" && (
                <ActiveTabIndicator layoutId="underline" />
              )}
            </TabButton>
          </li>
          <li>
            <TabButton
              className={activeTab === "signup" ? "active" : ""}
              onClick={() => switchTab("signup")}
            >
              회원가입
              {activeTab === "signup" && (
                <ActiveTabIndicator layoutId="underline" />
              )}
            </TabButton>
          </li>
        </TabGroup>
        {activeTab === "login" ? (
          <FormWrapper>
            <Title>로그인</Title>
            <Form onSubmit={handleSubmit(handleLogin)}>
              <Input
                {...register("email", {
                  required: { value: true, message: "이메일을 입력해주세요" },
                })}
                placeholder="이메일"
              />
              <Input
                {...register("password", {
                  required: { value: true, message: "비밀번호를 입력해주세요" },
                  minLength: {
                    value: 8,
                    message: "8자리 ~ 20자리 이내로 입력해주세요.",
                  },
                  maxLength: {
                    value: 20,
                    message: "8자리 ~ 20자리 이내로 입력해주세요.",
                  },
                })}
                placeholder="비밀번호"
                type="password"
              />
              <Button type="submit">{isFetching ? "loading" : "로그인"}</Button>
            </Form>
            {/* <KakaoContainer>
              <KakaoLogin
                token={"ca220974886e2ef4eb4a37d21b258d7c"}
                onSuccess={kakaoResponse}
                onFail={console.error}
                onLogout={console.info}
              />
            </KakaoContainer> */}
          </FormWrapper>
        ) : (
          <FormWrapper>
            <Title>회원가입</Title>
            <Form onSubmit={handleSubmit(handleSignup)}>
              <Input
                {...register("email", {
                  required: { value: true, message: "이메일를 입력해주세요" },
                })}
                placeholder="이메일"
              />
              <Input
                {...register("password", {
                  required: { value: true, message: "비밀번호를 입력해주세요" },
                })}
                placeholder="비밀번호"
                type="password"
              />
              <Input
                {...register("name", {
                  required: { value: true, message: "이름을 입력해주세요" },
                })}
                placeholder="이름"
              />
              <Button type="submit">
                {isFetching ? "loading" : "회원가입"}
              </Button>
            </Form>
          </FormWrapper>
        )}
        <span
          style={{
            position: "absolute",
            bottom: 0,
            fontSize: "12px",
            color: "#ff3e3e",
          }}
        >
          {errors.email
            ? errors.email.message
            : errors.password
            ? errors.password.message
            : errors.name
            ? errors.name.message
            : errorMsg}
        </span>
      </FormContainer>
    </AppContainer>
  );
}

export default Login;
