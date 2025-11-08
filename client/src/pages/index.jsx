import Companies from "../components/Landing/Companies";
import Everything from "../components/Landing/Everything";
import KnellBusiness from "../components/Landing/KnellBusiness";
import HeroBanner from "../components/Landing/HeroBanner";
import Joinknell from "../components/Landing/Joinknell";
import PopularServices from "../components/Landing/PopularServices";
import Services from "../components/Landing/Services";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Script from "next/script";
import Head from "next/head";

function Index() {
  const router=useRouter();
  // const redirected=router.query.redirected
  // useEffect(() => {
  //   if (redirected === 'true') {
  //     toast.warn("Please login/signup first")
  //     // Create a new query object without 'redirected'
  //     const { redirected, ...restQuery } = router.query;

  //     router.replace(
  //       {
  //         pathname: router.pathname,
  //         query: restQuery, // cleaned-up query
  //       },
  //       undefined,
  //       { shallow: true } // prevents full page reload
  //     );
  //   }
  // }, [redirected, router]);
  return (
    <>
    <Head>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-17643560057"/>
        <Script>
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'AW-17643560057');`}
        </Script>
    </Head>
    <div>
      <HeroBanner/>
      <Companies/>
      <PopularServices/>
      <Everything/>
      <Services/>
      <KnellBusiness/>
      <Joinknell/>
    </div>
      </>
  );
    
}
export default Index;
