import Footer from "../components/Footer";
import "../styles/globals.css";
import { useEffect } from "react";
import { StateProvider } from "../context/StateContext";
import reducer, { initialState } from "../context/StateReducers";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the toastify styles

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Head>
        <link rel="shortcut icon" href="/unnamed.jpg" />
        <title>knell</title>
      </Head>
      <div className="relative flex flex-col h-screen justify-between">
        <Navbar />
        <main className={`mb-auto w-full mx-auto ${router.pathname !== "/" ? "mt-36" : ""}`}>
          <Component {...pageProps} />
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} /> {/* 🔔 Popups here */}
      </div>
    </StateProvider>
  );
}
