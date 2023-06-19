import styled from "styled-components";
import Head from "next/head.js";
import Header from "../Header";
import { Roboto } from "@next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const Main = styled.main`
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem;
  position: relative;
  width: 100%;
`;

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>taskifAI</title>
      </Head>
      <Header font={roboto.className} />
      <Main className={roboto.className}>{children}</Main>
    </>
  );
}
