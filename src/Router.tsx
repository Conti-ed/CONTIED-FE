import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import Start from "./Routes/Start";
import Wait from "./Routes/Wait";
// import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Feed from "./Routes/Feed";
import Upload from "./Routes/Upload";
import Settings from "./Routes/Settings";
import Login from "./Routes/Login";
import MyConti from "./Routes/MyConti";
import ContiDetail from "./Routes/ContiDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "", element: <Start /> },
      { path: "waiting", element: <Wait /> },
      //{ path: "", element: <Home /> },
      { path: "search", element: <Search /> },
      { path: "feed", element: <Feed /> },
      { path: "upload", element: <Upload /> },
      { path: "settings", element: <Settings /> },
      { path: "login", element: <Login /> },
      { path: "myconti", element: <MyConti /> },
      { path: "conti/:id", element: <ContiDetail /> },
    ],
  },
]);

export default router;
