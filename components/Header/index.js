import styled from "styled-components";
import { StyledLink } from "../NavigationLink/NavigationLink.js";
import { Icon } from "../Icon";

export default function Header({ headerText, font, homeButtonShow }) {
  return (
    <HeaderContainer>
      <Heading className={font}>{headerText}</Heading>
    </HeaderContainer>
  );
}

const Heading = styled.h1`
  position: absolute;
  margin: 10px;
  color: white;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1;
  background-color: black;
  height: 3rem;
`;