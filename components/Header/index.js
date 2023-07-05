import Link from "next/link";
import styled from "styled-components";

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
  height: 66px;
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
              strokeWidth="1.5"
              stroke="white"
              height="30px"
              width="30px"
              fill="none"
              aria-label="go to the main page"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </Link>
        </LinkWrapper>
      ) : null}
      <Heading className={font}>{headerText}</Heading>
    </HeaderContainer>
  );
}
