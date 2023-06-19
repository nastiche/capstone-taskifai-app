import styled from "styled-components";

const Heading = styled.h1`
  text-align: center;
`;
export default function Header({ font }) {
  return <Heading className={font}>taskifAI</Heading>;
}
