import styled, { css } from "styled-components";

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
  width: 100%;
  z-index: 1;
  bottom: 20px;
  padding-right: 0.5rem;
`;
