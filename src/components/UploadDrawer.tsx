import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  Input,
  ListSubheader,
  Button,
} from '@mui/joy';
import InputFileUpload from './InputFileUpload';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { contiesAtom, fileUploadAtom, isDrawerOpenAtom } from '../atoms';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { SERVER_URL } from '../api';
import { ContiType } from '../types';

type FormValues = {
  playlist_url: string;
  keywords: string;
  description?: string;
};

function UploadDrawer() {
  const { handleSubmit, register, resetField } = useForm<FormValues>();
  const [open, setOpen] = useRecoilState(isDrawerOpenAtom);
  const [isFetching, setIsFetching] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const file = useRecoilValue(fileUploadAtom);
  const setConties = useSetRecoilState(contiesAtom);
  const setFontStyle = {
    fontFamily: "'Nunito Sans', 'Noto Sans KR', sans-serif",
  };

  const handleAddHashtag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && hashtagInput.trim() !== '') {
      if (!hashtags.includes(hashtagInput)) {
        setHashtags([...hashtags, hashtagInput]);
      }
      setHashtagInput('');
    }
  };

  const handleDeleteHashtag = (indexToRemove: number) => {
    setHashtags(hashtags.filter((_, index) => index !== indexToRemove));
  };

  const resetFields = () => {
    resetField('description');
    resetField('keywords');
    resetField('playlist_url');
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsFetching(true);
      const formData = new FormData();
      formData.append('file', file!);
      formData.append('user_id', JSON.parse(localStorage['user_info']).id);
      formData.append('conti_info', JSON.stringify(data));
      formData.append('enctype', 'multipart/form-data');

      const res = await fetch(`${SERVER_URL}/api/conti`, {
        method: 'POST',
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
      console.error('Error during upload:', error);
    } finally {
      setIsFetching(false);
      resetFields();
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
            <ListSubheader sx={setFontStyle}>
              Youtube 플레이리스트 <span style={{ color: 'red' }}>(필수)</span>
            </ListSubheader>
            <ListItem>
              <Input
                sx={{
                  width: '100%',
                  ...setFontStyle,
                }}
                {...register('playlist_url', { required: true })}
                placeholder="https://www.youtube.com/playlist?list=..."
              />
            </ListItem>
            <ListSubheader sx={setFontStyle}>
              키워드 <span style={{ color: 'red' }}>(필수)</span>
            </ListSubheader>
            <ListItem>
              <Input
                sx={{
                  width: '100%',
                  ...setFontStyle,
                }}
                value={hashtagInput}
                onChange={(event) => setHashtagInput(event.target.value)}
                onKeyDown={handleAddHashtag}
                placeholder="예수님, 사랑, 시편,..."
              />
            </ListItem>
            {hashtags.map((hashtag, index) => (
              <ListItem key={index}>
                {hashtag}
                <Button onClick={() => handleDeleteHashtag(index)}>X</Button>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListSubheader sx={setFontStyle}>악보 업로드</ListSubheader>
            <ListItem>
              <InputFileUpload />
              <span
                style={{
                  fontSize: 'small',
                  ...setFontStyle,
                }}
              >
                {file?.name}
              </span>
            </ListItem>
            <ListSubheader sx={setFontStyle}>설명</ListSubheader>
            <ListItem>
              <Input
                sx={{
                  width: '100%',
                  ...setFontStyle,
                }}
                {...register('description')}
                placeholder="설명을 입력해주세요."
              />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem>
              <Button type="submit" loading={isFetching} sx={setFontStyle}>
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
