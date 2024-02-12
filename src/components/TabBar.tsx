import { Link, useLocation } from "react-router-dom";
import { Settings, Home, CloudUpload } from "@mui/icons-material";
import { Tab, Container } from "../styles/TabBar.styles";
import { HiMiniRectangleGroup } from "react-icons/hi2";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isDrawerOpenAtom, isLoginAtom } from "../atoms";
import UploadDrawer from "./UploadDrawer";

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
  const setOpen = useSetRecoilState(isDrawerOpenAtom);
  const isLogin = useRecoilValue(isLoginAtom);

  return (
    <Container>
      <TabIcon icon={<Home />} to="/" active={pathname === "/"} />

      {pathname === "/feed" && isLogin === true ? (
        <Tab $isActive={true} onClick={() => setOpen(true)}>
          <CloudUpload />
        </Tab>
      ) : (
        <TabIcon
          icon={<HiMiniRectangleGroup />}
          to="/feed"
          active={pathname === "/feed"}
        />
      )}
      <UploadDrawer />
      <TabIcon
        icon={<Settings />}
        to="/settings"
        active={pathname === "/settings"}
      />
    </Container>
  );
}

export default TabBar;
