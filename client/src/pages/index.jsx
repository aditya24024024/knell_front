import HeroBanner from "../components/Landing/HeroBanner";
import KnellTicker from "../components/Landing/KnellTicker";
import PopularServices from "../components/Landing/PopularServices";
import HowItWorks from "../components/Landing/HowItWorks";
import BrowseCategories from "../components/Landing/BrowseCategories";
import Joinknell from "../components/Landing/Joinknell";
import React from "react";
import Script from "next/script";
import Head from "next/head";
import AppBanner from "../components/Landing/AppBanner";

function Index() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-17643560057" />
        <Script>{`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17643560057');`}</Script>
      </Head>
      <div style={{ background: "#09090b" }}>
        <HeroBanner />
        <KnellTicker />
        <PopularServices />
        <HowItWorks />
        <BrowseCategories />
        <AppBanner />
        <Joinknell />
      </div>
    </>
  );
}

export default Index;