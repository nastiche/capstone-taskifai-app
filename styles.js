import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  body {
    margin: 0;
  }
  textarea, input, button, select {
    font-family: inherit;
    font-size: inherit;
  }

`;
