import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Container,
  Form,
  Input,
  SubmitButton,
  SongContainer,
} from '../styles/Upload.styles';
import {
  Autocomplete,
  List,
  ListItem,
  ListItemButton,
  IconButton,
} from '@mui/joy';
import { Delete, KeyboardCommandKey } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { SERVER_URL, getKeywords } from '../api';
import { KeywordType } from '../types';
import { songsAtom } from '../atoms';
import SongRegister from '../components/SongRegister';

type FormValues = {
  description: string;
  image_url: string;
  keywords: string[];
};

function Upload() {
  const { register, handleSubmit, control } = useForm<FormValues>();
  const [keywords, setKeywords] = useState<KeywordType[]>([]);
  const songs = useRecoilValue(songsAtom);

  const { data: allKeywords, isLoading } = useQuery<KeywordType[]>({
    queryKey: ['keywords'],
    queryFn: getKeywords,
  });

  const onHandleSubmit = async (formData: FormValues) => {
    const res = await fetch(`${SERVER_URL}/api/conti`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        ...formData,
        songs,
        user_info: JSON.parse(localStorage['user_info']),
      }),
    });
    const resData = await res.json();
    console.log(res.status, resData);
  };

  return (
    <Container>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <>
          <SongContainer>
            <List sx={{ maxWidth: 300 }} variant={'soft'}>
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
                        color={'danger'}
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
              name={'keywords'}
              control={control}
              render={({ field }: any) => {
                const { onChange } = field;
                return (
                  <>
                    <Autocomplete
                      multiple
                      startDecorator={<KeyboardCommandKey />}
                      loading={isLoading}
                      options={allKeywords!}
                      getOptionLabel={(keyword) => keyword.name}
                      isOptionEqualToValue={(option, value) =>
                        option.name === value.name
                      }
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
              placeholder="Descriptionl"
              {...register('description', { required: false })}
            />
            <Input
              type="tel"
              placeholder="image url"
              {...register('image_url', { required: false })}
            />
            <SubmitButton type="submit" value={'Save'} />
          </Form>
        </>
      )}
    </Container>
  );
}

export default Upload;
