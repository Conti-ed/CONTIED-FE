import { ThemeProvider, createGlobalStyle } from "styled-components";
import { lightTheme, darkTheme } from "./Theme";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "./atoms";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import TabBar from "./components/TabBar";

function Root() {
  const isDark = useRecoilValue(isDarkAtom);
  return (
    <>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        {/* <Header /> */}
        <Outlet />
        {/* <TabBar /> */}
      </ThemeProvider>
    </>
  );
}

const GlobalStyle = createGlobalStyle`
html, body, div, span, Rootlet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
@font-face {
      font-family: 'Gong Gothic';
      src: url('/fonts/ESAMANRU BOLD.TTF') format('truetype');
      font-weight: bold;
      font-style: normal;
  }
@font-face {
    font-family: 'Gong Gothic';
    src: url('/fonts/ESAMANRU MEDIUM.TTF') format('truetype');
    font-weight: 500;
    font-style: normal;
}
@font-face {
    font-family: 'Gong Gothic';
    src: url('/fonts/ESAMANRU LIGHT.TTF') format('truetype');
    font-weight: 300;
    font-style: normal;
}
body {
  line-height: 1;
  font-family: 'Gong Gothic', 'Noto Sans KR', sans-serif;
  background-color:${(props) => props.theme.bgColor};
  color:${(props) => props.theme.textColor};
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
* {
  box-sizing: border-box;
}
a {
  text-decoration:none;
  color: inherit;
}
button {
  font-family: 'Gong Gothic', 'Noto Sans KR', sans-serif;
  background-color:${(props) => props.theme.bgColor};
  color:${(props) => props.theme.textColor};
}
`;

export default Root;
