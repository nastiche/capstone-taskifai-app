import styled from "styled-components";
import { StyledLink } from "../NavigationLink/NavigationLink.js";
import { Icon } from "../Icon";

export default function Header({ headerText, font }) {
  return (
    <>
      <HeaderContainer>
        <Heading className={font}>{headerText}</Heading>
      </HeaderContainer>
      <DummyContainerLeft />
      <DummyContainerRight />
    </>
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
  z-index: 9990;
  background-color: black;
  height: 3rem;
`;

const DummyContainerRight = styled.div`
  position: fixed;
  z-index: 9990;
  top: 3rem;
  right: 0.3rem;
  background-color: transparent;
  height: 50px;
  width: 25px;
  border: none;
  border-top-right-radius: 1.5rem;
  box-shadow: 0 -1.5rem 0 0 black;
`;

const DummyContainerLeft = styled.div`
  position: fixed;
  z-index: 9990;
  top: 3rem;
  left: 0.3rem;
  border: none;
  background-color: transparent;
  height: 50px;
  width: 25px;
  border-top-left-radius: 1.5rem;
  box-shadow: 0 -1.5rem 0 0 black;
`;
