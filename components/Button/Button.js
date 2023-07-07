import styled, { css } from "styled-components";

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  height: 50px;
  width: 50px;
  background-color: var(--black-color);
  border: none;
  cursor: pointer;
 

  ${({ variant }) =>
    variant === "big" &&
    css`
      height: var(--button-big);
      width: var(--button-big);
    `}

  ${({ variant }) =>
    variant === "medium" &&
    css`
      height: var(--button-medium);
      width: var(--button-medium);
    `}


  ${({ variant }) =>
    variant === "small" &&
    css`
      height: var(--button-small);
      width: var(--button-small);
    `}


  ${({ variant }) =>
    variant === "extra-small" &&
    css`
      height: var(--button-extra-small);
      width: var(--button-extra-small);
    `}
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;

  ${({ variant }) =>
    variant === "fixed" &&
    css`
      position: fixed;
      z-index: 1;
      bottom: 20px;
      left: 0;
      right: 0;
    `}
  ${({ variant }) =>
    variant === "absolute" &&
    css`
      position: absolute;
      bottom: -20px;
      left: 0;
      right: 0;
    `};
`;
