import Footer from "../components/Footer";
import "../styles/globals.css";
import { useEffect } from "react";
import { StateProvider } from "../context/StateContext";
import reducer, { initialState } from "../context/StateReducers";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Head>
        <link rel="shortcut icon" href="/unnamed.jpg" />
        <title>knell</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="relative flex flex-col min-h-screen">
        <Navbar />
        <main
          className={`mb-auto w-full px-4 md:px-10 mx-auto ${
            router.pathname !== "/" ? "mt-20 md:mt-36" : ""
          }`}
        >
          <Component {...pageProps} />
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </StateProvider>
  );
}

