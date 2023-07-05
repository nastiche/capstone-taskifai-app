import React from "react";
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
  margin-top: 2.5rem;
  margin-bottom: 3rem;
  padding: 1rem;
  position: relative;
  width: 100%;
`;

export default function Layout({ headerText, children, homeButtonShow }) {
  return (
    <>
      <Head>
        <title>taskifAI</title>
      </Head>
      <Header
        font={roboto.className}
        headerText={headerText}
        homeButtonShow={homeButtonShow}
      ></Header>
      <Main className={roboto.className}>{children}</Main>
    </>
  );
}
