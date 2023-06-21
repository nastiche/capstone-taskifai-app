import Link from "next/link";
import styled from "styled-components";

const StyledNavigation = styled.div`
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: black;
  padding: 10px;
`;

const StyledNavigationLink = styled(Link)`
  color: white;
  text-decoration: none;
`;

export default function Navigation({ font }) {
  return (
    <StyledNavigation>
      <StyledNavigationLink href={"/"} className={font}>
        tasks
      </StyledNavigationLink>
      <StyledNavigationLink href={"/create"} className={font}>
        create
      </StyledNavigationLink>
    </StyledNavigation>
  );
}
