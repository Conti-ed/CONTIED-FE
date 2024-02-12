import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { contiesAtom, fileUploadAtom, isDrawerOpenAtom } from "../atoms";
import { SERVER_URL, refreshToken } from "../api";
import { ContiType } from "../types";
import InputFileUpload from "./InputFileUpload";
import HashtagComponent from "./HashtagComponent";
import useHashtags from "../useHashtags";
import {
  Button,
  Divider,
  DrawerBackdrop,
  Form,
  Input,
  KeywordInput,
  List,
  ListItem,
  ListSubheader,
  StyledDrawer,
  WarningMessage,
} from "../styles/UploadDrawer.styles";
import { Spinner } from "../styles/Feed.styles";
import useFormReset from "../useFormReset";

export type FormValues = {
  playlist_url: string;
  description?: string;
};

export interface InputFileUploadRef {
  resetUpload: () => void;
}

function UploadDrawer() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const {
    hashtags,
    setHashtags,
    deleteHashtag,
    isExceeding,
    hashtagInput,
    handleInputChange,
    handleAddHashtag,
  } = useHashtags();

  const inputFileUploadRef = useRef<InputFileUploadRef>(null);
  const resetAllFields = useFormReset(reset, setHashtags, inputFileUploadRef);

  const [open, setOpen] = useRecoilState(isDrawerOpenAtom);
  const [isHashtagEmpty, setIsHashtagEmpty] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const file = useRecoilValue(fileUploadAtom);
  const setConties = useSetRecoilState(contiesAtom);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBodyClick = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.body.addEventListener("mousedown", handleBodyClick);
    return () => {
      document.body.removeEventListener("mousedown", handleBodyClick);
    };
  }, [setOpen]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  }, []);

  const handleFormSubmit = useCallback(
    async (data: FormValues) => {
      if (hashtags.length === 0) {
        setIsHashtagEmpty(true);
        return;
      }
      setIsHashtagEmpty(false);
      setIsFetching(true);
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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formData,
        });
        const resData: ContiType = await res.json();
        console.log(res.status, resData);

        if (res.ok) {
          setConties((prev) => [...(prev || []), resData]);
          setOpen(false);
          resetAllFields();
        } else if (res.status === 401) {
          const newAccessToken = await refreshToken();
          console.log(newAccessToken);
          const refreshedResponse = await fetch(`${SERVER_URL}/api/conti`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
            body: formData,
          });
          const data = await refreshedResponse.json();
          console.log(refreshedResponse.status, data);
          if (refreshedResponse.ok) {
            localStorage.setItem("accessToken", newAccessToken);
            setConties((prev) => [...(prev || []), data]);
            setOpen(false);
            resetAllFields();
          }
        } else {
          alert("일시적인 문제입니다. 잠시 후에 다시 시도해주세요.");
        }
      } catch (error) {
        console.error("Error during upload:", error);
      } finally {
        setIsFetching(false);
      }
    },
    [hashtags, file, setConties, setOpen, resetAllFields]
  );

  return (
    <>
      <DrawerBackdrop open={open} onClick={() => setOpen(false)} />
      <StyledDrawer ref={drawerRef} open={open}>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <List>
            <ListItem>
              <ListSubheader>
                Youtube 플레이리스트{" "}
                <span style={{ color: "red" }}>(필수)</span>
              </ListSubheader>
              <Input
                {...register("playlist_url", {
                  required: "Playlist URL은 필수입니다!",
                })}
                placeholder="https://www.youtube.com/playlist?list=..."
                onKeyDown={handleKeyPress}
              />
              {errors.playlist_url && (
                <WarningMessage>{errors.playlist_url.message}</WarningMessage>
              )}
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
                  최소 한 개의 해시태그를 추가해야 합니다!
                </WarningMessage>
              )}
              {isExceeding && (
                <WarningMessage>
                  최대 3개의 해시태그만 추가할 수 있습니다!
                </WarningMessage>
              )}
              <HashtagComponent
                hashtags={hashtags}
                onDeleteHashtag={deleteHashtag}
              />
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
                onKeyDown={(event) => {
                  if (event.keyCode === 13) {
                    event.preventDefault();
                  }
                }}
              />
            </ListItem>
            <Divider />
          </List>
          <List>
            <ListItem>
              <Button type="submit" disabled={isFetching}>
                {isFetching ? <Spinner /> : <>콘티 공유하기</>}
              </Button>
            </ListItem>
          </List>
        </Form>
      </StyledDrawer>
    </>
  );
}

export default UploadDrawer;
