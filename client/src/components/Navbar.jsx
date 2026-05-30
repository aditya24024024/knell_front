import React, { useEffect, useState, useRef } from 'react'
import Link from "next/link";
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { GET_USER_INFO, HOST } from '../utils/constants';
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

import { io } from "socket.io-client";


const Navbar = () => {
  const [cookies] = useCookies()
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [navFixed, setNavFixed] = useState(false)
  const [searchData, setSearchData] = useState("")

  const [{ showLoginModal, showSignupModal, isSeller, userInfo, hamburger, otpmodal, showTermsModal, resetPass }, dispatch] = useStateProvider();

  const [unreadCount, setUnreadCount] = useState(0);
const [toast, setToast] = useState(null);
const navSocketRef = useRef(null);
const toastTimer = useRef(null);

useEffect(() => {
  if (!userInfo?.id) return;

  axios.get(`${HOST}/api/messages/unread-messages`, { withCredentials: true })
    .then(({ data }) => setUnreadCount(data.messages.length))
    .catch(() => {});

  const s = io(HOST, { withCredentials: true });
  navSocketRef.current = s;
  s.emit("join", userInfo.id);

  s.on("newMessage", (msg) => {
    setUnreadCount((prev) => prev + 1);
    const currentPath = window.location.pathname;
    if (!currentPath.includes(`/orders/${msg.orderId}`)) {
      setToast(msg);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 4000);
    }
  });

  return () => {
    s.disconnect();
    clearTimeout(toastTimer.current);
  };
}, [userInfo?.id]);

useEffect(() => {
  if (router.pathname.includes("/messages") || router.pathname.includes("/orders")) {
    setUnreadCount(0);
  }
}, [router.pathname]);

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
    { linkName: "Learn", handler: "/learn", type: "link" },
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
                <li className="cursor-pointer" style={{ color: "#9ca3af" }} onClick={() => router.push("/learn")}>Learn</li>
                {isSeller && (
                  <li className="cursor-pointer" style={{ color: "#5dc94a" }} onClick={() => router.push("/seller/gigs/create")}>Create Gig</li>
                )}
                <li className="cursor-pointer relative" style={{ color: "#5dc94a" }} onClick={handleOrdersNavigate}>
  Orders
  {unreadCount > 0 && (
    <span style={{
      position: "absolute", top: -6, right: -10,
      background: "#5dc94a", color: "#09090b",
      fontSize: "0.6rem", fontWeight: 700,
      borderRadius: "9999px", minWidth: 16, height: 16,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 4px",
    }}>
      {unreadCount > 9 ? "9+" : unreadCount}
    </span>
  )}
</li>
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
                  <a href="/learn" onClick={closeHamburger} style={{ color: "#9ca3af" }}>Learn</a>
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
                  <button onClick={() => { router.push("/learn"); closeHamburger(); }} className="text-left" style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>Learn</button>
                  {isSeller && <button onClick={() => { router.push("/seller/gigs/create"); closeHamburger(); }} className="text-left" style={{ color: "#5dc94a" }}>Create Gig</button>}
                 <button onClick={handleOrdersNavigate} className="text-left" style={{ color: "#9ca3af" }}>
  Orders
  {unreadCount > 0 && (
    <span style={{
      marginLeft: 8, background: "#5dc94a", color: "#09090b",
      fontSize: "0.6rem", fontWeight: 700,
      borderRadius: "9999px", padding: "2px 6px",
    }}>
      {unreadCount > 9 ? "9+" : unreadCount}
    </span>
  )}
</button>
                  <button onClick={handleModeSwitch} className="text-left" style={{ color: "#9ca3af" }}>{isSeller ? "Switch To Buyer" : "Switch To Seller"}</button>
                  <button onClick={() => { closeHamburger(); router.push("/profile/" + userInfo?.username); }} className="text-left" style={{ color: "#9ca3af" }}>Profile</button>
                  <button onClick={() => router.push("/logout")} className="text-left" style={{ color: "#6b7a62" }}>Logout</button>
                </>
              )}
            </div>
          )}
        </nav>
      )}

      {toast && (
  <div
    onClick={() => { router.push(`/orders/${toast.orderId}/messages`); setToast(null); }}
    style={{
      position: "fixed", bottom: 24, right: 24,
      background: "#15171c", border: "1px solid rgba(93,201,74,0.3)",
      borderRadius: 8, padding: "12px 16px", zIndex: 9999,
      cursor: "pointer", display: "flex", alignItems: "center",
      gap: 10, boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      maxWidth: 300, animation: "slideIn 0.2s ease",
    }}
  >
    <span style={{ fontSize: 20 }}>💬</span>
    <div>
      <p style={{ color: "#5dc94a", fontSize: "0.75rem", fontWeight: 700, margin: 0 }}>New Message</p>
      <p style={{ color: "#9ca3af", fontSize: "0.8rem", margin: 0 }}>You have a new message</p>
    </div>
    <button
      onClick={(e) => { e.stopPropagation(); setToast(null); }}
      style={{ marginLeft: "auto", background: "none", border: "none", color: "#6b7a62", cursor: "pointer", fontSize: 16 }}
    >×</button>
  </div>
)}
<style>{`
  @keyframes slideIn {
    from { transform: translateY(16px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`}</style>
    </>
  );
};

export default Navbar;