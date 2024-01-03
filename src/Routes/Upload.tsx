import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import Autocomplete from "@mui/joy/Autocomplete";
import { KeywordType } from "../types";
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey";
import { useQuery } from "react-query";
import { getKeywords } from "../api";

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

type FormValues = {
  image_url: string;
  keywords: string[];
};

function Upload() {
  const { register, handleSubmit, control } = useForm<FormValues>();
  const [keywords, setKeywords] = useState<KeywordType[]>([]);
  const [songs, setSongs] = useState([]);

  const { data: allKeywords, isLoading } = useQuery<KeywordType[]>({
    queryKey: ["keywords"],
    queryFn: getKeywords,
  });

  const onHandleSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <Container>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <Form onSubmit={handleSubmit(onHandleSubmit)}>
          <Controller
            name={"keywords"}
            control={control}
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <Autocomplete
                  multiple
                  startDecorator={<KeyboardCommandKeyIcon />}
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
      )}
    </Container>
  );
}

export default Upload;
