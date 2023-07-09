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

  ${({ variant }) =>
    variant === "big" &&
    css`
      height: var(--link-big);
      width: var(--link-big);
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
      height: var(--link-medium);
      width: var(--link-medium);
      z-index: 9000;
      svg {
        height: var(--icon-medium);
        width: var(--icon-medium);
        z-index: 9001;
      }
    `}

  ${({ variant }) =>
    variant === "small" &&
    css`
      height: var(--link-small);
      width: var(--link-small);
      svg {
        height: var(--icon-small);
        width: var(--icon-small);
      }
    `}
`;
