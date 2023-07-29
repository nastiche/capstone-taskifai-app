import styled from "styled-components";
import css from "styled-jsx/css";

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ variant }) =>
    variant === "fixed" &&
    css`
      position: fixed;
      display: flex;
      justify-content: center;
      align-items: center;
      bottom: 10px;
      gap: 50px;
      left: 0;
      right: 0;
    `}
  ${({ variant }) =>
    variant === "absolute" &&
    css`
      position: absolute;
      bottom: -2.5rem;
      left: 0;
      right: 0;
      height: 3.125rem;
      gap: 60px;
    `};
`;
