import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import {
  Autocomplete,
  List,
  ListItem,
  ListItemButton,
  IconButton,
} from "@mui/joy";
import { Delete, KeyboardCommandKey } from "@mui/icons-material";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { getKeywords } from "../api";
import { KeywordType } from "../types";
import { songsAtom } from "../atom";
import SongRegister from "../components/SongRegister";

const Container = styled.div`
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
`;

const Input = styled.input`
  width: 200px;
`;

const SubmitButton = styled.input`
  width: 100px;
`;

const SongContainer = styled.div``;

type FormValues = {
  image_url: string;
  keywords: string[];
};

function Upload() {
  const { register, handleSubmit, control } = useForm<FormValues>();
  const [keywords, setKeywords] = useState<KeywordType[]>([]);
  const songs = useRecoilValue(songsAtom);

  const { data: allKeywords, isLoading } = useQuery<KeywordType[]>({
    queryKey: ["keywords"],
    queryFn: getKeywords,
  });

  const onHandleSubmit = (data: FormValues) => {
    console.log({ ...data, songs });
  };

  return (
    <Container>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <>
          <SongContainer>
            <List sx={{ maxWidth: 300 }} variant={"soft"}>
              <ListItem>
                <ListItemButton>
                  <SongRegister />
                </ListItemButton>
              </ListItem>
              {songs.map((song, i) => {
                return (
                  <ListItem
                    key={i}
                    endAction={
                      <IconButton
                        aria-label="Delete"
                        size="sm"
                        color={"danger"}
                      >
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemButton>{song.title}</ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </SongContainer>
          <Form onSubmit={handleSubmit(onHandleSubmit)}>
            <Controller
              name={"keywords"}
              control={control}
              render={({ field }) => {
                const { onChange } = field;
                return (
                  <>
                    <Autocomplete
                      multiple
                      startDecorator={<KeyboardCommandKey />}
                      loading={isLoading}
                      options={allKeywords!}
                      getOptionLabel={(keyword) => keyword.name}
                      limitTags={2}
                      size="sm"
                      placeholder="Keywords"
                      onChange={(_, data) => {
                        onChange(data);
                        setKeywords(data);
                        return data;
                      }}
                    />
                  </>
                );
              }}
            />
            <Input
              type="tel"
              placeholder="image url"
              {...register("image_url", { required: false })}
            />
            <SubmitButton type="submit" value={"Save"} />
          </Form>
        </>
      )}
    </Container>
  );
}

export default Upload;
