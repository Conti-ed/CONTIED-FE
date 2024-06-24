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
        <symbol id="note" fill="none" viewBox="0 0 20 20">
          <path
            d="M7 17V4L19 1V14M7 17C7 18.1046 5.65685 19 4 19C2.34315 19 1 18.1046 1 17C1 15.8954 2.34315 15 4 15C5.65685 15 7 15.8954 7 17ZM19 14C19 15.1046 17.6569 16 16 16C14.3431 16 13 15.1046 13 14C13 12.8954 14.3431 12 16 12C17.6569 12 19 12.8954 19 14ZM7 8L19 5"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </symbol>
        <symbol id="back" fill="none" viewBox="0 0 24 24">
          <path
            d="M15 6L9 12L15 18"
            stroke="#545F71"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </symbol>
        <symbol id="add-song" fill="none" viewBox="0 0 10 10">
          <path
            d="M5 1V9M9 5L1 5"
            stroke="#9095A1"
            strokeOpacity="0.631373"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </symbol>
        <symbol id="option" fill="none" viewBox="0 0 15 3">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.49999 1.99998C1.77612 1.99998 1.99998 1.77612 1.99998 1.49999C1.99998 1.22385 1.77612 1 1.49999 1C1.22385 1 1 1.22385 1 1.49999C1 1.77612 1.22385 1.99998 1.49999 1.99998ZM1.49999 2.99998C2.32841 2.99998 2.99998 2.32841 2.99998 1.49999C2.99998 0.671567 2.32841 0 1.49999 0C0.671567 0 0 0.671567 0 1.49999C0 2.32841 0.671567 2.99998 1.49999 2.99998ZM7.67638 2.00012C7.95251 2.00012 8.17636 1.77626 8.17636 1.50013C8.17636 1.22399 7.95251 1.00014 7.67638 1.00014C7.40024 1.00014 7.17639 1.22399 7.17639 1.50013C7.17639 1.77626 7.40024 2.00012 7.67638 2.00012ZM7.67638 3.00012C8.5048 3.00012 9.17636 2.32855 9.17636 1.50013C9.17636 0.671707 8.5048 0.000139432 7.67638 0.000139432C6.84796 0.000139432 6.17639 0.671707 6.17639 1.50013C6.17639 2.32855 6.84796 3.00012 7.67638 3.00012ZM14.0003 1.50013C14.0003 1.77626 13.7765 2.00012 13.5003 2.00012C13.2242 2.00012 13.0004 1.77626 13.0004 1.50013C13.0004 1.22399 13.2242 1.00014 13.5003 1.00014C13.7765 1.00014 14.0003 1.22399 14.0003 1.50013ZM15.0003 1.50013C15.0003 2.32855 14.3288 3.00012 13.5003 3.00012C12.6719 3.00012 12.0004 2.32855 12.0004 1.50013C12.0004 0.671707 12.6719 0.000139432 13.5003 0.000139432C14.3288 0.000139432 15.0003 0.671707 15.0003 1.50013Z"
            fill="#171A1F"
            fillOpacity="0.5"
          />
        </symbol>
      </svg>
    )}
  </ClassNames>
);

export default function GlobalSVGProvider() {
  return createPortal(spriteSvgCode, document.body);
}
