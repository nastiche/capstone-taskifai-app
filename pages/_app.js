import { SWRConfig } from "swr";
import GlobalStyle from "../styles";

export default function App({ Component, pageProps }) {
  //define fetcher
  const fetcher = async (...args) => {
    const response = await fetch(...args);
    if (!response.ok) {
      throw new Error(`Request with ${JSON.stringify(args)} failed.`);
    }
    return await response.json();
  };

  return (
    <SWRConfig value={{ fetcher }}>
      <GlobalStyle />
      <Component {...pageProps} />
    </SWRConfig>
  );
}
