import Link from "next/link";
import styled from "styled-components";

const Heading = styled.h1`
  position: absolute;
  margin: 10px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1;
  background-color: white;
  height: 3.5rem;
`;

const LinkWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  border: none;
  border-radius: 100px;
  background-color: black;
  position: absolute;
  left: 7px;
  top: 7px;
`;

export default function Header({ headerText, font, homeButtonShow }) {
  return (
    <HeaderContainer>
      {homeButtonShow ? (
        <LinkWrapper>
          <Link href={`/`} passHref legacyBehavior aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="white"
              height="30px"
              width="30px"
              fill="none"
              aria-label="go to the main page"
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
          </Link>
        </LinkWrapper>
      ) : null}
      <Heading className={font}>{headerText}</Heading>
    </HeaderContainer>
  );
}
