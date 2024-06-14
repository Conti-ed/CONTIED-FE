import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import Start from "./Routes/Start";
import Wait from "./Routes/Wait";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Result from "./Routes/Result";
// import Feed from "./Routes/Feed";
import Upload from "./Routes/Upload";
// import Settings from "./Routes/Settings";
import Login from "./Routes/Login";
import ContiDetail from "./Routes/ContiDetail";
import MyPage from "./Routes/MyPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "", element: <Start /> },
      { path: "waiting", element: <Wait /> },
      { path: "home", element: <Home /> },
      { path: "search", element: <Search /> },
      { path: "result", element: <Result /> },
      // { path: "feed", element: <Feed /> },
      { path: "upload", element: <Upload /> },
      { path: "conti-detail/:contiId", element: <ContiDetail /> },
      // { path: "settings", element: <Settings /> },
      { path: "login", element: <Login /> },
      { path: "my", element: <MyPage /> },
    ],
  },
]);

export default router;
