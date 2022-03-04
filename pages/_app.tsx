import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import { AppWrapper, useAppContext } from "../src/context/state";
import type { AppProps } from "next/app";
import Amplify, { Auth } from "aws-amplify";
import config from "../src/aws-exports";
import { AppNavBar } from "../src/components/AppNavBar";
import { Container } from "react-bootstrap";
Amplify.configure({
  ...config,
  ssr: true,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppWrapper>
      <AppNavBar />
      <div>
        <Component style={{}} {...pageProps} />
      </div>
    </AppWrapper>
  );
}

export default MyApp;
