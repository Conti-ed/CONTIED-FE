import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    bgColor: string;
    titleColor: string;
    textColor: string;
    accentColor: string;
    tabBgColor: string;
    lightGray: string;
    greenColor: string;
    redColor: string;
    blackColor: string;
    toggleBorder: string;
    gradient: string;
  }
}
