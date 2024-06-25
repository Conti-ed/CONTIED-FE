import { ClassNames } from "@emotion/react";
import { createPortal } from "react-dom";

const spriteSvgCode = (
  <ClassNames>
    {({ css }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={css`
          display: none;
        `}
      >
        <symbol id="kakao-start" fill="none" viewBox="0 0 32 32">
          <g clipPath="url(#clip0_924_3971)">
            <path
              d="M32 29.5C32 30.8808 30.8808 32 29.5 32H2.5C1.11925 32 0 30.8808 0 29.5V2.5C0 1.11925 1.11925 0 2.5 0H29.5C30.8808 0 32 1.11925 32 2.5V29.5Z"
              fill="#FFE812"
            />
            <path
              d="M15.6361 8.72754C11.017 8.72754 7.27246 11.6488 7.27246 15.2522C7.27246 17.5819 8.83791 19.6261 11.1928 20.7804C11.0646 21.2176 10.3695 23.5927 10.3418 23.7793C10.3418 23.7793 10.3252 23.9195 10.4169 23.973C10.5087 24.0264 10.6166 23.9849 10.6166 23.9849C10.8798 23.9485 13.668 22.0107 14.1506 21.6742C14.6327 21.7418 15.1291 21.7769 15.6361 21.7769C20.2552 21.7769 23.9997 18.8557 23.9997 15.2522C23.9997 11.6488 20.2552 8.72754 15.6361 8.72754Z"
              fill="black"
            />
          </g>
          <defs>
            <clipPath id="clip0_924_3971">
              <rect width="32" height="32" rx="16" fill="white" />
            </clipPath>
          </defs>
        </symbol>
        <symbol id="note-home" fill="none" viewBox="0 0 20 20">
          <path
            d="M7 17V4L19 1V14M7 17C7 18.1046 5.65685 19 4 19C2.34315 19 1 18.1046 1 17C1 15.8954 2.34315 15 4 15C5.65685 15 7 15.8954 7 17ZM19 14C19 15.1046 17.6569 16 16 16C14.3431 16 13 15.1046 13 14C13 12.8954 14.3431 12 16 12C17.6569 12 19 12.8954 19 14ZM7 8L19 5"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </symbol>
        <symbol id="back-upload" fill="none" viewBox="0 0 9 16">
          <path
            d="M8 15L1 8L8 1"
            stroke="#545F71"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </symbol>
        <symbol id="remove-search" fill="none" viewBox="0 0 18 18">
          <path
            d="M4.5 13.5L13.5 4.5M4.5 4.5L13.5 13.5"
            stroke="#545F71"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </symbol>
        <symbol id="clear-search" fill="none" viewBox="0 0 18 18">
          <path
            d="M4.5 13.5L13.5 4.5M4.5 4.5L13.5 13.5"
            stroke="#545F71"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </symbol>
        <symbol id="search-search" fill="none">
          <path
            d="M17.25 17.25L11.75 11.75M13.5833 7.16667C13.5833 10.7105 10.7105 13.5833 7.16667 13.5833C3.62284 13.5833 0.75 10.7105 0.75 7.16667C0.75 3.62284 3.62284 0.75 7.16667 0.75C10.7105 0.75 13.5833 3.62284 13.5833 7.16667Z"
            stroke="#545F71"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </symbol>
        <symbol id="back-detail" fill="none" viewBox="0 0 24 24">
          <path
            d="M15 6L9 12L15 18"
            stroke="#545F71"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </symbol>
        <symbol id="option-detail" fill="none" viewBox="0 0 15 3">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.49999 1.99998C1.77612 1.99998 1.99998 1.77612 1.99998 1.49999C1.99998 1.22385 1.77612 1 1.49999 1C1.22385 1 1 1.22385 1 1.49999C1 1.77612 1.22385 1.99998 1.49999 1.99998ZM1.49999 2.99998C2.32841 2.99998 2.99998 2.32841 2.99998 1.49999C2.99998 0.671567 2.32841 0 1.49999 0C0.671567 0 0 0.671567 0 1.49999C0 2.32841 0.671567 2.99998 1.49999 2.99998ZM7.67638 2.00012C7.95251 2.00012 8.17636 1.77626 8.17636 1.50013C8.17636 1.22399 7.95251 1.00014 7.67638 1.00014C7.40024 1.00014 7.17639 1.22399 7.17639 1.50013C7.17639 1.77626 7.40024 2.00012 7.67638 2.00012ZM7.67638 3.00012C8.5048 3.00012 9.17636 2.32855 9.17636 1.50013C9.17636 0.671707 8.5048 0.000139432 7.67638 0.000139432C6.84796 0.000139432 6.17639 0.671707 6.17639 1.50013C6.17639 2.32855 6.84796 3.00012 7.67638 3.00012ZM14.0003 1.50013C14.0003 1.77626 13.7765 2.00012 13.5003 2.00012C13.2242 2.00012 13.0004 1.77626 13.0004 1.50013C13.0004 1.22399 13.2242 1.00014 13.5003 1.00014C13.7765 1.00014 14.0003 1.22399 14.0003 1.50013ZM15.0003 1.50013C15.0003 2.32855 14.3288 3.00012 13.5003 3.00012C12.6719 3.00012 12.0004 2.32855 12.0004 1.50013C12.0004 0.671707 12.6719 0.000139432 13.5003 0.000139432C14.3288 0.000139432 15.0003 0.671707 15.0003 1.50013Z"
            fill="#171A1F"
            fillOpacity="0.5"
          />
        </symbol>
        <symbol id="add-song-detail" fill="none" viewBox="0 0 10 10">
          <path
            d="M5 1V9M9 5L1 5"
            stroke="#9095A1"
            strokeOpacity="0.631373"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </symbol>
      </svg>
    )}
  </ClassNames>
);

export default function GlobalSVGProvider() {
  return createPortal(spriteSvgCode, document.body);
}
