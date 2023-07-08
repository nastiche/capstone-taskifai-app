import { SWRConfig } from "swr";
import GlobalStyle from "../styles";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";

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
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
      <Component {...pageProps} />
    </SWRConfig>
  );
}

// const StyledToastContainer = styled(ToastContainer).attrs({
//   className: "toast-container",
//   toastClassName: "toast",
//   bodyClassName: "body",
//   progressClassName: "progress",
// });
