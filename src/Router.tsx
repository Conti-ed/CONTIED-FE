import { createBrowserRouter, Navigate, useParams } from "react-router-dom";
import { lazy } from "react";
import Root from "./Root";

const Start = lazy(() => import("./Routes/Start"));
const AuthCallback = lazy(() => import("./Routes/AuthCallback"));
const Wait = lazy(() => import("./Routes/Wait"));
const Home = lazy(() => import("./Routes/Home"));
const Search = lazy(() => import("./Routes/Search"));
const Result = lazy(() => import("./Routes/Result"));
const Upload = lazy(() => import("./Routes/Upload"));
const ContiDetail = lazy(() => import("./Routes/ContiDetail"));
const MyPage = lazy(() => import("./Routes/MyPage"));
const MyUploadedContis = lazy(() => import("./Routes/MyUploadedContis"));
const MyFavoriteContis = lazy(() => import("./Routes/MyFavoriteContis"));
const Select = lazy(() => import("./Routes/Select"));
const SearchAddSong = lazy(() => import("./Routes/AddSong"));

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
