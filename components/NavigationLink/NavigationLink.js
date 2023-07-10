import Link from "next/link";
import styled, { css } from "styled-components";

export const StyledLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background-color: var(--black-color);
  border: none;
  cursor: pointer;

  :active {
    background-color: #cec7ff;
    box-shadow: 0 5px #cec7ff;
    transform: translateY(2px);
  }

  ${({ variant }) =>
    variant === "big" &&
    css`
      height: var(--link-big);
      width: var(--link-big);
      z-index: 9500;
      svg {
        height: var(--icon-big);
        width: var(--icon-big);
        z-index: 9600;
      }
    `}

  ${({ variant }) =>
    variant === "medium" &&
    css`
      height: var(--link-medium);
      width: var(--link-medium);
      z-index: 9500;
      svg {
        height: var(--icon-medium);
        width: var(--icon-medium);
        z-index: 9600;
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
`;
