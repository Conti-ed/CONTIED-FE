import { Link, useLocation } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import Box from "@mui/joy/Box";
import Drawer from "@mui/joy/Drawer";
import List from "@mui/joy/List";
import Divider from "@mui/joy/Divider";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";
import { Tab, Container } from "../styles/TabBar.styles";
import { HiMiniRectangleGroup } from "react-icons/hi2";

const TabIcon = ({
  icon,
  to,
  active,
}: {
  icon: JSX.Element;
  to: string;
  active: boolean;
}) => (
  <Link to={to}>
    <Tab $isActive={active}>{icon}</Tab>
  </Link>
);

function TabBar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const handleToggleDrawer =
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
    <Container>
      <TabIcon icon={<HomeIcon />} to="/" active={pathname === "/"} />

      {pathname === "/feed" ? (
        <Tab $isActive={true} onClick={handleToggleDrawer(true)}>
          <CloudUploadIcon />
        </Tab>
      ) : (
        <TabIcon
          icon={<HiMiniRectangleGroup />}
          to="/feed"
          active={pathname === "/feed"}
        />
      )}

      <Drawer anchor="bottom" open={open} onClose={handleToggleDrawer(false)}>
        <Box
          role="presentation"
          onClick={handleToggleDrawer(false)}
          onKeyDown={handleToggleDrawer(false)}
        >
          <List>
            {["Inbox", "Starred", "Send email", "Drafts"].map((text) => (
              <ListItem key={text}>
                <ListItemButton>{text}</ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {["All mail", "Trash", "Spam"].map((text) => (
              <ListItem key={text}>
                <ListItemButton>{text}</ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <TabIcon
        icon={<SettingsIcon />}
        to="/settings"
        active={pathname === "/settings"}
      />
    </Container>
  );
}

export default TabBar;
