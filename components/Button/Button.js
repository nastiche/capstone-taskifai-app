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

  ${({ variant }) =>
    variant === "positive" &&
    css`
      height: 60px;
      width: 60px;
    `}

  ${({ variant }) =>
    variant === "small" &&
    css`
      height: 40px;
      width: 40px;
    `}
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  width: 100%;

  ${({ variant }) =>
    variant === "fixed" &&
    css`
      position: fixed;
      z-index: 1;
      bottom: 20px;
      padding-right: 0.625rem;
    `}

  ${({ variant }) =>
    variant === "absolute" &&
    css`
      position: absolute;
      bottom: -25px;
      padding-right: 1.5rem;
    `}


  ${({ variant }) =>
    variant === "none" &&
    css`
      padding-left: 1.1rem;
    `}
`;
