import styled from "styled-components";
import { StyledLink } from "../NavigationLink/NavigationLink.js";
import { Icon } from "../Icon";

export default function Header({ headerText, font, homeButtonShow }) {
  return (
    <HeaderContainer>
      {homeButtonShow ? (
        <StyledHomeLink href={`/`} aria-hidden="true" variant="medium">
          <Icon labelText={"go to the main page"} />
        </StyledHomeLink>
      ) : null}
      <Heading className={font}>{headerText}</Heading>
    </HeaderContainer>
  );
}

const StyledHomeLink = styled(StyledLink)`
  position: absolute;
  left: 7px;
  top: 7px;
`;

const Heading = styled.h1`
  position: absolute;
  margin: 10px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1;
  background-color: white;
  height: 3rem;
`;
