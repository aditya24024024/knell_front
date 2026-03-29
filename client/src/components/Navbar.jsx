import React, { useEffect, useState } from 'react'
import Link from "next/link";
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { GET_USER_INFO } from '../utils/constants';
import { IoSearchOutline } from "react-icons/io5";
import Image from 'next/image';
import { reducerCases } from '../context/constants';
import { useStateProvider } from '../context/StateContext';
import AuthWrapper from './AuthWrapper';
import { GiHamburgerMenu } from "react-icons/gi";
import OtpWrapper from './OtpWrapper'
import UsernameWrapper from './UsernameWrapper'
import TermsAndConditionsModal from './TermsAndConditionsModal';
import { optimizeImage } from '../utils/cloudinary';

const Navbar = () => {
  const [cookies] = useCookies()
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [navFixed, setNavFixed] = useState(false)
  const [searchData, setSearchData] = useState("")

  const [{ showLoginModal, showSignupModal, isSeller, userInfo, hamburger, otpmodal, showTermsModal, resetPass }, dispatch] = useStateProvider();

  const handleLogin = () => {
    if (showSignupModal) dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: false });
    dispatch({ type: reducerCases.TOGGLE_LOGIN_MODAL, showLoginModal: true });
  }

  const handleSignup = () => {
    if (showLoginModal) dispatch({ type: reducerCases.TOGGLE_LOGIN_MODAL, showLoginModal: false });
    dispatch({ type: reducerCases.TOGGLE_TERMS_MODAL, showTermsModal: true });
  };

  const toggleHamburger = () => dispatch({ type: reducerCases.TOGGLE_HAMBURGER });
  const closeHamburger = () => dispatch({ type: reducerCases.CLOSE_HAMBURGER });

  const handleOrdersNavigate = () => {
    closeHamburger();
    router.push(isSeller ? "/seller" : "/buyer");
  }

  const handleModeSwitch = () => {
    closeHamburger();
    dispatch({ type: reducerCases.SWITCH_MODE });
    router.push(isSeller ? "/buyer" : "/seller");
  }

  const handler = (event) => {
    if (event.key === "Enter") {
      router.push(`/search?q=${searchData}`);
      setSearchData("");
    }
  }

  const links = [
    { linkName: "Explore", handler: "https://www.instagram.com/knell.co.in/", type: "link" },
    { linkName: "Log In", handler: handleLogin, type: "button" },
    { linkName: "Join", handler: handleSignup, type: "button2" },
  ];

  const admin = () => { closeHamburger(); router.push("/admin"); }
  const adminorders = () => { closeHamburger(); router.push("/adminorders"); }
  const adminusers = () => { closeHamburger(); router.push("/adminusers"); }

  useEffect(() => {
    if (router.pathname === "/") {
      const positionNavbar = () => {
        window.pageYOffset > 0 ? setNavFixed(true) : setNavFixed(false);
      };
      window.addEventListener("scroll", positionNavbar);
      return () => window.removeEventListener("scroll", positionNavbar);
    } else {
      setNavFixed(true);
    }
  }, [router.pathname]);

  useEffect(() => {
    if (!userInfo) {
      const getUserInfo = async () => {
        try {
          const { data: { user } } = await axios.post(GET_USER_INFO, {}, { withCredentials: true });
          if (!user || !user.email) { setIsLoaded(true); return; }
          let projectedUserInfo = { ...user };
          if (user.image) projectedUserInfo.imageName = user.image;
          dispatch({ type: reducerCases.SET_USER, userInfo: projectedUserInfo });
          setIsLoaded(true);
          if (user.isProfileSet === false) router.push("/profile");
        } catch (err) {
          setIsLoaded(true);
        }
      };
      getUserInfo();
    } else {
      setIsLoaded(true);
    }
  }, [userInfo]);

  const isAdminUser = userInfo?.email === "akshajvasudeva@gmail.com" || userInfo?.email === "Kalakartik23@gmail.com";

  return (
    <>
      {(userInfo?.email) && !(userInfo?.username) && <UsernameWrapper />}
      {showLoginModal && <AuthWrapper type="login" />}
      {(showSignupModal || resetPass) && <AuthWrapper type="signup" />}
      {otpmodal && <OtpWrapper />}
      {showTermsModal && <TermsAndConditionsModal />}

      {isLoaded && (
        <nav
          className={`w-full px-4 sm:px-8 md:px-16 lg:px-24 py-4 sm:py-5 top-0 z-30 transition-all duration-300 flex items-center justify-between ${navFixed || userInfo ? "fixed" : "absolute"}`}
          style={{
            background: "#09090b",
            borderBottom: "1px solid rgba(93,201,74,0.15)",
          }}
        >
          {/* Mobile hamburger */}
          <div className="sm:hidden mr-4 text-2xl cursor-pointer" style={{ color: "#6b7a62" }} onClick={toggleHamburger}>
            <GiHamburgerMenu />
          </div>

          {/* KNELL text logo */}
          <button
            onClick={() => router.push("/")}
            style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "1.75rem",
              letterSpacing: "0.15em",
              background: "none",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
              lineHeight: 1,
            }}
          >
            <span style={{ color: "#5dc94a" }}>KN</span>
            <span style={{ color: "#ede9dc" }}>E</span>
            <span style={{ color: "#5dc94a" }}>LL</span>
          </button>

          {/* Search bar — only visible when scrolled or logged in */}
          <div
            className={`flex w-full sm:w-auto transition-opacity duration-300 ${navFixed || userInfo ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            style={{ margin: "0 1.5rem", flex: "0 1 480px" }}
          >
            <input
              type="text"
              placeholder="What service are you looking for today?"
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
              onKeyDown={handler}
              style={{
                width: "100%",
                padding: "0.6rem 1rem",
                background: "#15171c",
                border: "1px solid rgba(93,201,74,0.2)",
                borderRight: "none",
                color: "#dbd7ca",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.85rem",
                outline: "none",
              }}
            />
            <button
              onClick={() => { router.push(`/search?q=${searchData}`); setSearchData(""); }}
              style={{
                background: "#3a8a2c",
                border: "none",
                padding: "0.6rem 1rem",
                color: "#ede9dc",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#4ea83d")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#3a8a2c")}
            >
              <IoSearchOutline style={{ width: 20, height: 20 }} />
            </button>
          </div>

          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-6">
            {!userInfo ? (
              <ul className="flex gap-6 items-center" style={{ listStyle: "none" }}>
                {links.map(({ linkName, handler, type }) => (
                  <li key={linkName}>
                    {type === "link" && (
                      <Link href={handler} style={{ color: "#9ca3af", fontWeight: 500, fontSize: "0.9rem" }}>
                        {linkName}
                      </Link>
                    )}
                    {type === "button" && (
                      <button onClick={handler} style={{ color: "#9ca3af", fontWeight: 500, fontSize: "0.9rem", background: "none", border: "none", cursor: "pointer" }}>
                        {linkName}
                      </button>
                    )}
                    {type === "button2" && (
                      <button
                        onClick={handler}
                        style={{
                          fontFamily: "Space Mono, monospace",
                          fontSize: "0.7rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          border: "1px solid #5dc94a",
                          color: "#5dc94a",
                          fontWeight: 600,
                          padding: "0.4rem 1rem",
                          background: "transparent",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#3a8a2c"; e.currentTarget.style.color = "#ede9dc"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#5dc94a"; }}
                      >
                        {linkName}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="flex gap-6 items-center" style={{ listStyle: "none" }}>
                {isAdminUser && <li className="cursor-pointer font-medium" style={{ color: "#5dc94a" }} onClick={admin}>Admin</li>}
                {isAdminUser && <li className="cursor-pointer font-medium" style={{ color: "#5dc94a" }} onClick={adminusers}>All Users</li>}
                {isAdminUser && <li className="cursor-pointer font-medium" style={{ color: "#5dc94a" }} onClick={adminorders}>All Orders</li>}
                {isSeller && (
                  <li className="cursor-pointer" style={{ color: "#5dc94a" }} onClick={() => router.push("/seller/gigs/create")}>Create Gig</li>
                )}
                <li className="cursor-pointer" style={{ color: "#5dc94a" }} onClick={handleOrdersNavigate}>Orders</li>
                <li className="cursor-pointer" style={{ color: "#9ca3af" }} onClick={handleModeSwitch}>
                  {isSeller ? "Switch To Buyer" : "Switch To Seller"}
                </li>
                <li className="cursor-pointer" onClick={() => router.push("/profile/" + userInfo?.username)}>
                  {userInfo?.imageName ? (
                    <Image src={optimizeImage(userInfo.imageName, 'sm')} alt="Profile" width={38} height={38} className="rounded-full" />
                  ) : (
                    <div style={{ background: "#3a8a2c", width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#ede9dc", fontSize: "1rem", fontWeight: 600 }}>{userInfo?.email[0].toUpperCase()}</span>
                    </div>
                  )}
                </li>
              </ul>
            )}
          </div>

          {/* Mobile dropdown */}
          {hamburger && (
            <div className="absolute left-0 top-full w-full z-50 flex flex-col p-4 gap-3 sm:hidden"
              style={{ background: "#0f1014", borderTop: "1px solid rgba(93,201,74,0.15)" }}>
              {!userInfo ? (
                <>
                  <a href="https://www.instagram.com/knell.co.in/" target="_blank" rel="noopener noreferrer"
                    onClick={closeHamburger} style={{ color: "#9ca3af" }}>Explore</a>
                  {links.filter(({ linkName }) => linkName !== "Explore").map(({ linkName, handler }) => (
                    <button key={linkName} onClick={() => { handler(); closeHamburger(); }}
                      className="text-left" style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>
                      {linkName}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {isAdminUser && <button onClick={admin} className="text-left" style={{ color: "#5dc94a" }}>Admin</button>}
                  {isAdminUser && <button onClick={adminusers} className="text-left" style={{ color: "#5dc94a" }}>All Users</button>}
                  {isAdminUser && <button onClick={adminorders} className="text-left" style={{ color: "#5dc94a" }}>All Orders</button>}
                  {isSeller && <button onClick={() => { router.push("/seller/gigs/create"); closeHamburger(); }} className="text-left" style={{ color: "#5dc94a" }}>Create Gig</button>}
                  <button onClick={handleOrdersNavigate} className="text-left" style={{ color: "#9ca3af" }}>Orders</button>
                  <button onClick={handleModeSwitch} className="text-left" style={{ color: "#9ca3af" }}>{isSeller ? "Switch To Buyer" : "Switch To Seller"}</button>
                  <button onClick={() => { closeHamburger(); router.push("/profile/" + userInfo?.username); }} className="text-left" style={{ color: "#9ca3af" }}>Profile</button>
                  <button onClick={() => router.push("/logout")} className="text-left" style={{ color: "#6b7a62" }}>Logout</button>
                </>
              )}
            </div>
          )}
        </nav>
      )}
    </>
  );
};

export default Navbar;