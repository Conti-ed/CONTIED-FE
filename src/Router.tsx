import { createBrowserRouter, Navigate, useParams } from "react-router-dom";
import Root from "./Root";
import Start from "./Routes/Start";
import AuthCallback from "./Routes/AuthCallback";
import Wait from "./Routes/Wait";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Result from "./Routes/Result";
import Upload from "./Routes/Upload";
import ContiDetail from "./Routes/ContiDetail";
import MyPage from "./Routes/MyPage";
import MyUploadedContis from "./Routes/MyUploadedContis";
import MyFavoriteContis from "./Routes/MyFavoriteContis";
import Select from "./Routes/Select";
import SearchAddSong from "./Routes/AddSong";

// conti-detail/:contiId 경로를 /conti/:contiId로 리다이렉트하기 위한 컴포넌트
const ContiDetailRedirect = () => {
  const { contiId } = useParams();
  return <Navigate to={`/conti/${contiId}`} replace />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "", element: <Start /> },
      { path: "auth/callback", element: <AuthCallback /> },
      { path: "waiting", element: <Wait /> },
      { path: "select", element: <Select /> },
      { path: "home", element: <Home /> },
      { path: "search", element: <Search /> },
      { path: "searchadd", element: <SearchAddSong /> },
      { path: "result", element: <Result /> },
      { path: "upload", element: <Upload /> },
      { path: "conti/:contiId", element: <ContiDetail /> },
      { path: "conti-detail/:contiId", element: <ContiDetailRedirect /> },
      {
        path: "mypage",
        element: <MyPage />,
        children: [
          { path: "uploaded", element: <MyUploadedContis /> },
          { path: "favorites", element: <MyFavoriteContis /> },
        ],
      },
    ],
  },
]);

export default router;
