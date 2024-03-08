import { Box, Button, Drawer, List, ListItem, Divider } from "@mui/joy";
import { useState } from "react";
import { SongType } from "../types";
import { useSetRecoilState } from "recoil";
import { songsAtom } from "../atoms";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useForm } from "react-hook-form";

type FormValues = {
  id: number;
  title: string;
  artist: string;
  youtubeUrl?: string;
  lyrics?: string;
  duration: number;
};

function SongRegister() {
  const { register, handleSubmit } = useForm<SongType>();
  const setSongs = useSetRecoilState(songsAtom);
  const [open, setOpen] = useState(false);
  const [releaseDate, setReleaseDate] = useState<Date | null>(null);

  const onSubmit = (data: FormValues) => {
    const newSong: SongType = {
      id: data.id,
      title: data.title,
      artist: data.artist,
      releaseDate: releaseDate?.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      youtubeUrl: data.youtubeUrl,
      lyrics: data.lyrics,
      duration: data.duration,
      order: 0,
    };
    setSongs((prev) => [...prev, newSong]);
    setOpen(false);
  };

  const toggleDrawer =
    (inOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpen(inOpen);
    };

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Button
        variant={"plain"}
        color="neutral"
        onClick={toggleDrawer(true)}
        style={{ width: "100%", textAlign: "left" }}
      >
        찬양 추가하기
      </Button>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        anchor={"bottom"}
        color={"primary"}
      >
        <Box role="presentation">
          <form onSubmit={handleSubmit(onSubmit)}>
            <List>
              <ListItem>
                <input
                  placeholder="제목"
                  {...register("title", { required: true })}
                />
              </ListItem>
              <ListItem>
                <input
                  placeholder="아티스트"
                  {...register("artist", { required: true })}
                />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DemoItem>
                      <DatePicker
                        label="발매일"
                        onChange={(newDate: any) =>
                          setReleaseDate(new Date(newDate.$d))
                        }
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </ListItem>
              <ListItem>
                <input placeholder="가사" {...register("lyrics")} />
              </ListItem>
              <ListItem>
                <input placeholder="링크" {...register("youtubeUrl")} />
              </ListItem>
              <ListItem>
                <input type="submit" />
              </ListItem>
            </List>
          </form>
        </Box>
      </Drawer>
    </Box>
  );
}

export default SongRegister;
