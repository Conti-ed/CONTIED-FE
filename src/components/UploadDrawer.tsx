import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  Input,
  ListSubheader,
  Button,
} from "@mui/joy";
import InputFileUpload from "./InputFileUpload";
import { useRecoilState, useRecoilValue } from "recoil";
import { fileUploadAtom, isDrawerOpenAtom } from "../atoms";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { SERVER_URL } from "../api";

type FormValues = {
  playlist_url: string;
  keywords: string;
  description?: string;
};

function UploadDrawer() {
  const { handleSubmit, register, resetField } = useForm<FormValues>();
  const [open, setOpen] = useRecoilState(isDrawerOpenAtom);
  const [isFetching, setIsFetching] = useState(false);
  const file = useRecoilValue(fileUploadAtom);

  const resetFields = () => {
    resetField("description");
    resetField("keywords");
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

      const res = await fetch(`${SERVER_URL}/api/conti`, {
        method: "POST",
        body: formData,
      });
      const resData = await res.json();
      console.log(res.ok, resData);

      if (res.ok) setOpen(true);
    } catch (error) {
      console.error("Error during upload:", error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Drawer
      anchor="bottom"
      size="lg"
      open={open}
      onClose={() => setOpen(false)}
    >
      <Box role="presentation">
        <form onSubmit={handleSubmit(onSubmit)}>
          <List>
            <ListSubheader>
              Youtube 플레이리스트 <span style={{ color: "red" }}>(필수)</span>
            </ListSubheader>
            <ListItem>
              <Input
                sx={{ width: "100%" }}
                {...register("playlist_url", { required: true })}
                placeholder="https://www.youtube.com/playlist?list=..."
              />
            </ListItem>
            <ListSubheader>
              키워드 <span style={{ color: "red" }}>(필수)</span>
            </ListSubheader>
            <ListItem>
              <Input
                sx={{ width: "100%" }}
                {...register("keywords", { required: true })}
                placeholder="예수님, 사랑, ..."
              />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListSubheader>악보 업로드</ListSubheader>
            <ListItem>
              <InputFileUpload />
              <span style={{ fontSize: "small" }}>{file?.name}</span>
            </ListItem>
            <ListSubheader>설명</ListSubheader>
            <ListItem>
              <Input
                sx={{ width: "100%" }}
                {...register("description")}
                placeholder="설명을 입력해주세요."
              />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem>
              <Button type="submit" loading={isFetching}>
                콘티 공유하기
              </Button>
            </ListItem>
          </List>
        </form>
      </Box>
    </Drawer>
  );
}

export default UploadDrawer;
