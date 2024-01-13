import { TiDelete } from "react-icons/ti";
import InputFileUpload from "./InputFileUpload";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { contiesAtom, fileUploadAtom, isDrawerOpenAtom } from "../atoms";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { SERVER_URL } from "../api";
import { ContiType } from "../types";
import {
  Button,
  DeleteButton,
  Divider,
  DrawerBackdrop,
  Form,
  Hashtag,
  HashtagContainer,
  Input,
  KeywordInput,
  List,
  ListItem,
  ListSubheader,
  StyledDrawer,
  WarningMessage,
} from "../styles/UploadDrawer.styles";

type FormValues = {
  playlist_url: string;
  description?: string;
};

function UploadDrawer() {
  const { handleSubmit, register, resetField } = useForm<FormValues>();
  const [open, setOpen] = useRecoilState(isDrawerOpenAtom);
  const [isExceeding, setIsExceeding] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [isHashtagEmpty, setIsHashtagEmpty] = useState(false);
  const file = useRecoilValue(fileUploadAtom);
  const setConties = useSetRecoilState(contiesAtom);
  const inputFileUploadRef = useRef<{ resetUpload: () => void }>();

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
      if (newHashtag && !hashtags.includes(newHashtag) && hashtags.length < 3) {
        setHashtags([...hashtags, newHashtag]);
        setHashtagInput("");
        setIsHashtagEmpty(false);
      } else if (hashtags.length >= 3) {
        setIsExceeding(true);
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
    if (!value.trim() || hashtags.length < 3) {
      setIsExceeding(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  };

  const resetFields = () => {
    resetField("description");
    resetField("playlist_url");
    setHashtags([]);
    if (inputFileUploadRef.current) {
      inputFileUploadRef.current?.resetUpload();
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (hashtags.length === 0) {
      setIsHashtagEmpty(true);
      return;
    } else {
      setIsHashtagEmpty(false);
    }
    try {
      setIsFetching(true);
      const formData = new FormData();
      formData.append("file", file!);
      formData.append("user_id", JSON.parse(localStorage["user_info"]).id);
      formData.append("conti_info", JSON.stringify(data));
      formData.append("enctype", "multipart/form-data");
      formData.append("keywords", JSON.stringify(hashtags));
      formData.append("description", data.description || "");

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
                onKeyDown={handleKeyPress}
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
              {isHashtagEmpty && (
                <WarningMessage>
                  최소 한 개의 해시태그를 추가해야 합니다.
                </WarningMessage>
              )}
              {isExceeding && (
                <WarningMessage>
                  최대 3개의 해시태그만 추가할 수 있습니다.
                </WarningMessage>
              )}
              <HashtagContainer $hashTags={hashtags.length > 0}>
                {hashtags.map((hashtag, index) => (
                  <Hashtag key={index}>
                    #{hashtag}
                    <DeleteButton onClick={() => handleDeleteHashtag(index)}>
                      <TiDelete size="20" color="#8ab1e8" />
                    </DeleteButton>
                  </Hashtag>
                ))}
              </HashtagContainer>
            </ListItem>
            <Divider />
          </List>
          <List>
            <ListItem>
              <ListSubheader>
                악보 업로드 <span style={{ color: "teal" }}>(선택)</span>
              </ListSubheader>
              <InputFileUpload ref={inputFileUploadRef} />
            </ListItem>
            <ListItem>
              <ListSubheader>
                설명 <span style={{ color: "teal" }}>(선택)</span>
              </ListSubheader>
              <Input
                {...register("description")}
                placeholder="콘티에 대한 설명을 입력해주세요!"
              />
            </ListItem>
            <Divider />
          </List>
          <List>
            <ListItem>
              <Button type="submit" disabled={isFetching}>
                콘티 공유하기
              </Button>
            </ListItem>
          </List>
        </Form>
      </StyledDrawer>
    </>
  );
}

export default UploadDrawer;
