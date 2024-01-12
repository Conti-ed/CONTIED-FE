// import {
//   Box,
//   Drawer,
//   List,
//   Divider,
//   ListItem,
//   Input,
//   ListSubheader,
//   Button,
// } from "@mui/joy";
import { TiDelete } from "react-icons/ti";
import InputFileUpload from "./InputFileUpload";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { contiesAtom, fileUploadAtom, isDrawerOpenAtom } from "../atoms";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { SERVER_URL } from "../api";
import { ContiType } from "../types";
import styled from "styled-components";

const setFontStyle = {
  fontFamily: "'Nunito Sans', 'Noto Sans KR', sans-serif",
};

const StyledDrawer = styled.div<DrawerProps>`
  position: fixed;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: ${(props) => props.theme.bgColor};
  transform: ${(props) => (props.open ? "translateY(0)" : "translateY(100%)")};
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
`;

const DrawerBackdrop = styled.div<DrawerProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.open ? "block" : "none")};
`;

const Form = styled.form`
  ${setFontStyle}
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: ${(props) => props.theme.bgColor};
  padding: 20px;
  border-radius: 8px;
`;

const WarningMessage = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;

const Input = styled.input`
  ${setFontStyle}
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
`;

const KeywordInput = styled(Input)<{ $isExceeding?: boolean }>`
  border: 1px solid ${({ $isExceeding }) => ($isExceeding ? "red" : "#ced4da")};

  &:focus {
    border: ${({ $isExceeding }) =>
      $isExceeding ? "1px solid red" : "1px solid #80bdff"};
    outline: none;
  }
`;

const List = styled.div`
  // margin-bottom: 10px;
`;

const ListSubheader = styled.div`
  ${setFontStyle}
  color: white;
  margin-bottom: 8px;
`;

const ListItem = styled.div`
  margin-bottom: 20px;
`;

const Button = styled.button`
  ${setFontStyle}
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0069d9;
  }
`;

const HashtagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
`;

const Hashtag = styled.span`
  ${setFontStyle}
  background-color: #e1ecf4;
  color: #3178c6;
  padding: 4px 0px 4px 8px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0px;

  & > *:last-child {
    margin-left: 0;
  }
`;

const DeleteButton = styled.button`
  padding: 0px 4px 0px 2px;
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #d1d5db;
  margin-top: 17px;
`;

type FormValues = {
  playlist_url: string;
  description?: string;
};

interface DrawerProps {
  open: boolean;
}

function UploadDrawer() {
  const { handleSubmit, register, resetField } = useForm<FormValues>();
  const [open, setOpen] = useRecoilState(isDrawerOpenAtom);
  const [isExceeding, setIsExceeding] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const file = useRecoilValue(fileUploadAtom);
  const setConties = useSetRecoilState(contiesAtom);

  const handleClose = (e: MouseEvent) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClose);
    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClose);
    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);

  const handleAddHashtag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      const newHashtag = hashtagInput.trim();
      if (newHashtag === "") {
        setIsExceeding(false);
        return;
      }
      if (!hashtags.includes(newHashtag)) {
        if (hashtags.length >= 3) {
          setIsExceeding(true);
          return;
        }
        setHashtags([...hashtags, newHashtag]);
        setHashtagInput("");
      }
    }
  };

  const handleDeleteHashtag = (indexToRemove: number) => {
    const newHashtags = hashtags.filter((_, index) => index !== indexToRemove);
    setHashtags(newHashtags);

    if (newHashtags.length < 3) {
      setIsExceeding(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setHashtagInput(value);

    // 입력 필드가 비어 있으면 경고문을 숨깁니다.
    if (!value.trim() || hashtags.length < 3) {
      setIsExceeding(false);
    }
  };

  const resetFields = () => {
    resetField("description");
    resetField("playlist_url");
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsFetching(true);
      const formData = new FormData();
      formData.append("file", file!);
      formData.append("user_id", JSON.parse(localStorage["user_info"]).id);
      formData.append("conti_info", JSON.stringify(data));
      formData.append("enctype", "multipart/form-data");
      formData.append("keywords", JSON.stringify(hashtags));

      const res = await fetch(`${SERVER_URL}/api/conti`, {
        method: "POST",
        body: formData,
      });
      const resData: ContiType = await res.json();
      console.log(resData);

      if (res.ok) {
        setConties((prev) => {
          if (prev != null) return [...prev, resData];
          return [resData];
        });
        setOpen(false);
      }
    } catch (error) {
      console.error("Error during upload:", error);
    } finally {
      setIsFetching(false);
      resetFields();
    }
  };

  return (
    <>
      <DrawerBackdrop open={open} onClick={() => setOpen(false)} />
      <StyledDrawer ref={drawerRef} open={open}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <List>
            <ListItem>
              <ListSubheader>
                Youtube 플레이리스트{" "}
                <span style={{ color: "red" }}>(필수)</span>
              </ListSubheader>
              <Input
                {...register("playlist_url", { required: true })}
                placeholder="https://www.youtube.com/playlist?list=..."
              />
            </ListItem>
            <ListItem>
              <ListSubheader>
                키워드 <span style={{ color: "red" }}>(필수)</span>
              </ListSubheader>
              <KeywordInput
                value={hashtagInput}
                onChange={handleInputChange}
                onKeyDown={handleAddHashtag}
                placeholder="예수님, 사랑, 시편,..."
                $isExceeding={isExceeding}
              />
              {isExceeding && (
                <WarningMessage>
                  최대 3개의 해시태그만 추가할 수 있습니다.
                </WarningMessage>
              )}
            </ListItem>
            <HashtagContainer>
              {hashtags.map((hashtag, index) => (
                <Hashtag key={index}>
                  #{hashtag}
                  <DeleteButton onClick={() => handleDeleteHashtag(index)}>
                    <TiDelete size="20" color="#8ab1e8" />
                  </DeleteButton>
                </Hashtag>
              ))}
            </HashtagContainer>
            <Divider />
          </List>
          <List>
            <ListItem>
              <ListSubheader>
                악보 업로드 <span style={{ color: "teal" }}>(선택)</span>
              </ListSubheader>
              <InputFileUpload />
            </ListItem>
          </List>
        </Form>
      </StyledDrawer>
    </>
    // <Drawer
    //   anchor="bottom"
    //   size="lg"
    //   open={open}
    //   onClose={() => setOpen(false)}
    // >
    //   <Box role="presentation">
    //     <form onSubmit={handleSubmit(onSubmit)}>
    //       <List>
    //         <ListSubheader sx={setFontStyle}>
    //           Youtube 플레이리스트 <span style={{ color: "red" }}>(필수)</span>
    //         </ListSubheader>
    //         <ListItem>
    //           <Input
    //             sx={{
    //               width: "100%",
    //               ...setFontStyle,
    //             }}
    //             {...register("playlist_url", { required: true })}
    //             placeholder="https://www.youtube.com/playlist?list=..."
    //           />
    //         </ListItem>
    //         <ListSubheader sx={setFontStyle}>
    //           키워드 <span style={{ color: "red" }}>(필수)</span>
    //         </ListSubheader>
    //         <ListItem>
    //           <Input
    //             sx={{
    //               width: "100%",
    //               ...setFontStyle,
    //             }}
    //             value={hashtagInput}
    //             onChange={(event) => setHashtagInput(event.target.value)}
    //             onKeyDown={handleAddHashtag}
    //             placeholder="예수님, 사랑, 시편,..."
    //           />
    //         </ListItem>
    // {hashtags.map((hashtag, index) => (
    //   <ListItem key={index}>
    //     {hashtag}
    //     <Button onClick={() => handleDeleteHashtag(index)}>X</Button>
    //   </ListItem>
    // ))}
    //       </List>
    //       <Divider />
    //       <List>
    //         <ListSubheader sx={setFontStyle}>악보 업로드</ListSubheader>
    //         <ListItem>
    // <InputFileUpload />
    // <span
    //   style={{
    //     fontSize: "small",
    //     ...setFontStyle,
    //   }}
    // >
    //   {file?.name}
    // </span>
    //         </ListItem>
    //         <ListSubheader sx={setFontStyle}>설명</ListSubheader>
    //         <ListItem>
    //           <Input
    //             sx={{
    //               width: "100%",
    //               ...setFontStyle,
    //             }}
    //             {...register("description")}
    //             placeholder="설명을 입력해주세요."
    //           />
    //         </ListItem>
    //       </List>
    //       <Divider />
    //       <List>
    //         <ListItem>
    //           <Button type="submit" loading={isFetching} sx={setFontStyle}>
    //             콘티 공유하기
    //           </Button>
    //         </ListItem>
    //       </List>
    //     </form>
    //   </Box>
    // </Drawer>
  );
}

export default UploadDrawer;
