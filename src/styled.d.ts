import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    bgColor: string;
    textColor: string;
    mainTextColor: string;
    brandColor: string;
    accentColor: string;
    tabBgColor: string;
    keywordColor: string;
  }
}
