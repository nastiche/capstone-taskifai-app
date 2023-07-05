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
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  position: fixed;
  width: 100%;
  z-index: 1;
  bottom: 20px;
  padding-right: 0.5rem;
`;
