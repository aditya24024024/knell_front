import Companies from "../components/Landing/Companies";
import Everything from "../components/Landing/Everything";
import KnellBusiness from "../components/Landing/KnellBusiness";
import HeroBanner from "../components/Landing/HeroBanner";
import Joinknell from "../components/Landing/Joinknell";
import PopularServices from "../components/Landing/PopularServices";
import Services from "../components/Landing/Services";
import React from "react";
import AuthWrapper from "../components/AuthWrapper";
import { useStateProvider } from "../context/StateContext";

import Footer from "../components/Footer";

function Index() {
  const [{ showLoginModal, showSignupModal }] = useStateProvider();
  return (
    
    <div>
      
      <HeroBanner/>
      <Companies/>
      <PopularServices/>
      <Everything/>
      <Services/>
      <KnellBusiness/>
      <Joinknell/>
      {(showLoginModal || showSignupModal) && (
        <AuthWrapper type={showLoginModal ? "login" : "signup"} />
      )}
      
    </div>
  );
    
}
export default Index;