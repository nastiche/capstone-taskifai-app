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
      svg {
        height: var(--icon-big);
        width: var(--icon-big);
      }
    `}

  ${({ variant }) =>
    variant === "medium" &&
    css`
      height: var(--link-medium);
      width: var(--link-medium);
      svg {
        height: var(--icon-medium);
        width: var(--icon-medium);
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

export const NavigationLinkWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  width: 50px;
  height: 50px;
  background-color: var(--black-color);
  border: none;

  ${({ variant }) =>
    variant === "positive" &&
    css`
      height: 60px;
      width: 60px;
    `}
`;

export const NavigationLinksContainer = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  z-index: 1;
  bottom: 20px;
`;
