import styled from "styled-components";

const Heading = styled.h1`
  text-align: center;
  margin: 0.5rem;
`;
export default function Header({ font }) {
  return <Heading className={font}>taskifAI</Heading>;
}
