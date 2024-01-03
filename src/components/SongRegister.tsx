import { Box, Button, Drawer, List, ListItem, Divider } from "@mui/joy";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SongType } from "../types";
import { useSetRecoilState } from "recoil";
import { songsAtom } from "../atom";

function SongRegister() {
  const { register, handleSubmit } = useForm<SongType>();
  const setSongs = useSetRecoilState(songsAtom);
  const [open, setOpen] = useState(false);

  const onSubmit = (data: SongType) => {
    setSongs((prev) => [...prev, data]);
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
                  placeholder="가수"
                  {...register("singer", { required: true })}
                />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem>
                <input placeholder="출시일" {...register("releaseDate")} />
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
