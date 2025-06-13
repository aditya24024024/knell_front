import Companies from "../components/Landing/Companies";
import Everything from "../components/Landing/Everything";
import KnellBusiness from "../components/Landing/KnellBusiness";
import HeroBanner from "../components/Landing/HeroBanner";
import Joinknell from "../components/Landing/Joinknell";
import PopularServices from "../components/Landing/PopularServices";
import Services from "../components/Landing/Services";
import React from "react";
import { useCookies } from 'react-cookie';

function Index() {
  const [cookies] = useCookies();
  return (
    <div>
      <HeroBanner/>
      <Companies/>
      <PopularServices/>
      <Everything/>
      <Services/>
      <KnellBusiness/>
      <Joinknell/>
    </div>
  );
    
}
export default Index;
