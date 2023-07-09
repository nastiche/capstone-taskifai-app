import styled, { css } from "styled-components";

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background-color: var(--black-color);
  border: none;
  cursor: pointer;

  ${({ variant }) =>
    variant === "big" &&
    css`
      height: var(--button-big);
      width: var(--button-big);
      z-index: 9000;
      svg {
        height: var(--icon-big);
        width: var(--icon-big);
        z-index: 9001;
      }
    `}

  ${({ variant }) =>
    variant === "medium" &&
    css`
      z-index: 9000;
      height: var(--button-medium);
      width: var(--button-medium);
      svg {
        height: var(--icon-medium);
        width: var(--icon-medium);
        z-index: 9001;
      }
    `}


  ${({ variant }) =>
    variant === "small" &&
    css`
      height: var(--button-small);
      width: var(--button-small);
      svg {
        height: var(--icon-small);
        width: var(--icon-small);
      }
    `}


  ${({ variant }) =>
    variant === "extra-small" &&
    css`
      height: var(--button-extra-small);
      width: var(--button-extra-small);
      svg {
        height: var(--icon-extra-small);
        width: var(--icon-extra-small);
      }
    `}
`;
