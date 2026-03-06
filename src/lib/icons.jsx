import React from "react";

const icons = {
  /**
   * HomeIcon is a functional component that renders an SVG icon representing a home.
   * It is primarily used as a visual cue for navigation links pointing to the homepage.
   */
  HomeIcon: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_214_2373)">
        <path
          d="M20.4201 10.18L12.7101 2.30001C12.6172 2.20628 12.5066 2.13189 12.3847 2.08112C12.2628 2.03035 12.1321 2.00421 12.0001 2.00421C11.8681 2.00421 11.7374 2.03035 11.6155 2.08112C11.4937 2.13189 11.3831 2.20628 11.2901 2.30001L3.58012 10.19C3.39355 10.3781 3.24621 10.6013 3.14664 10.8468C3.04708 11.0923 2.99727 11.3551 3.00012 11.62V20C2.99934 20.5119 3.19489 21.0046 3.54649 21.3767C3.89809 21.7488 4.37898 21.9719 4.89012 22H19.1101C19.6213 21.9719 20.1021 21.7488 20.4537 21.3767C20.8053 21.0046 21.0009 20.5119 21.0001 20V11.62C21.0009 11.0829 20.7929 10.5666 20.4201 10.18ZM10.0001 20V14H14.0001V20H10.0001ZM19.0001 20H16.0001V13C16.0001 12.7348 15.8948 12.4804 15.7072 12.2929C15.5197 12.1054 15.2653 12 15.0001 12H9.00012C8.7349 12 8.48055 12.1054 8.29301 12.2929C8.10547 12.4804 8.00012 12.7348 8.00012 13V20H5.00012V11.58L12.0001 4.43001L19.0001 11.62V20Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="clip0_214_2373">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  arrowRightSvg: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      fill="currentColor"
      className="bi bi-arrow-right-short"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
      />
    </svg>
  ),
  arrowRightSvgDark: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      fill="dark"
      className="bi bi-arrow-right-short"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
      />
    </svg>
  ),
  pointCharacteristicSvg: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="6"
      height="6"
      fill="currentColor"
      className="bi bi-circle-fill pe-1"
      viewBox="0 0 16 16"
    >
      <circle cx="8" cy="8" r="8" />
    </svg>
  ),
  exitButtonSvg: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      fill="white"
      fillRule="evenodd"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      className="bi bi-x-lg"
      viewBox="0 0 16 16"
      onClick={() => window.history.back()}
      aria-label="Modal Video Exit Button"
      role="button"
      tabIndex={0}
    >
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
    </svg>
  ),
  serviceSvg: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="currentColor"
      className="bi bi-check-circle-fill"
      viewBox="0 0 16 16"
    >
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
    </svg>
  ),
  checkSvg: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="currentColor"
      className="bi bi-check-circle-fill"
      viewBox="0 0 16 16"
    >
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
    </svg>
  ),
  clockSvg: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      fill="currentColor"
      className="bi bi-clock mt-4"
      viewBox="0 0 16 16"
    >
      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
    </svg>
  ),
  addressSvg: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="currentColor"
      className="bi bi-geo-alt mt-4"
      viewBox="0 0 16 16"
    >
      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
      <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
    </svg>
  ),
  phoneSvg: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      fill="currentColor"
      className="bi bi-phone mt-4"
      viewBox="0 0 16 16"
    >
      <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
      <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
    </svg>
  ),
  facebookSvg: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="currentColor"
      className="bi bi-facebook"
      viewBox="0 0 16 16"
    >
      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
    </svg>
  ),
  instagramSvg: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="currentColor"
      className="bi bi-instagram"
      viewBox="0 0 16 16"
    >
      <path d="M8 3c1.654 0 1.85.006 2.497.036.645.03.997.138 1.23.23.31.12.532.265.765.498.233.233.378.455.498.765.092.233.2.585.23 1.23C12.994 6.15 13 6.346 13 8c0 1.654-.006 1.85-.036 2.497-.03.645-.138.997-.23 1.23-.12.31-.265.532-.498.765-.233.233-.455.378-.765.498-.233.092-.585.2-1.23.23C9.85 12.994 9.654 13 8 13c-1.654 0-1.85-.006-2.497-.036-.645-.03-.997-.138-1.23-.23a2.013 2.013 0 0 1-.765-.498 2.013 2.013 0 0 1-.498-.765c-.092-.233-.2-.585-.23-1.23C3.006 9.85 3 9.654 3 8c0-1.654.006-1.85.036-2.497.03-.645.138-.997.23-1.23.12-.31.265-.532.498-.765.233-.233.455-.378.765-.498.233-.092.585-.2 1.23-.23C6.15 3.006 6.346 3 8 3zm0-1.5C6.326 1.5 6.102 1.507 5.354 1.537c-.75.03-1.262.14-1.71.29a3.49 3.49 0 0 0-1.262.708A3.49 3.49 0 0 0 1.537 3.646c-.15.448-.26.96-.29 1.71C1.507 6.102 1.5 6.326 1.5 8c0 1.674.007 1.898.037 2.646.03.75.14 1.262.29 1.71.15.448.34.832.708 1.262.43.368.814.558 1.262.708.448.15.96.26 1.71.29C6.102 14.493 6.326 14.5 8 14.5c1.674 0 1.898-.007 2.646-.037.75-.03 1.262-.14 1.71-.29.448-.15.832-.34 1.262-.708.368-.43.558-.814.708-1.262.15-.448.26-.96.29-1.71.03-.748.037-.972.037-2.646 0-1.674-.007-1.898-.037-2.646-.03-.75-.14-1.262-.29-1.71a3.49 3.49 0 0 0-.708-1.262 3.49 3.49 0 0 0-1.262-.708c-.448-.15-.96-.26-1.71-.29C9.898 1.507 9.674 1.5 8 1.5z" />
      <path d="M8 5.5A2.5 2.5 0 1 0 8 10.5a2.5 2.5 0 0 0 0-5zm0 4A1.5 1.5 0 1 1 8 6.5a1.5 1.5 0 0 1 0 3z" />
      <circle cx="12.5" cy="3.5" r="1" />
    </svg>
  ),
  playVideoSvg: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="31"
      height="31"
      style={{ marginLeft: "12px" }}
      fill="currentColor"
      className="bi bi-play-circle"
      viewBox="0 0 16 16"
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
      <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445" />
    </svg>
  ),
  rightArrowSvg: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      fill="currentColor"
      className="bi bi-arrow-right-short"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
      />
    </svg>
  ),
};
export default icons;
export const {
  HomeIcon,
  arrowRightSvg,
  arrowRightSvgDark,
  pointCharacteristicSvg,
  exitButtonSvg,
  serviceSvg,
  checkSvg,
  clockSvg,
  addressSvg,
  phoneSvg,
  facebookSvg,
  instagramSvg,
  playVideoSvg,
  rightArrowSvg,
} = icons;
