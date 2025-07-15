import React, { useEffect, useState } from 'react'
import Link from "next/link";
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { GET_USER_INFO, HOST } from '../utils/constants';
import { IoSearchOutline } from "react-icons/io5";
import Image from 'next/image';
import { reducerCases } from '../context/constants';
import { useStateProvider } from '../context/StateContext';
import img from './unnamed 1.svg'
import ContextMenu from './ContextMenu';
import AuthWrapper from './AuthWrapper';
import { GiHamburgerMenu } from "react-icons/gi";
import OtpWrapper from './OtpWrapper'
import TermsAndConditionsModal from './TermsAndConditionsModal';


const Navbar = () => {
  const [cookies] = useCookies()
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [navFixed, setNavFixed] = useState(false)
  // const [showTermsModal, setShowTermsModal] = useState(false);

  const [searchData, setSearchData] = useState("")
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false)

const [{ showLoginModal, showSignupModal, isSeller, userInfo, hamburger, otpmodal, showTermsModal }, dispatch] = useStateProvider();


  const handleLogin = () => {
    if (showSignupModal) {
      dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: false });
    }
    dispatch({ type: reducerCases.TOGGLE_LOGIN_MODAL, showLoginModal: true });
  }

  const handleSignup = () => {
  if (showLoginModal) {
    dispatch({ type: reducerCases.TOGGLE_LOGIN_MODAL, showLoginModal: false });
  }
  dispatch({ type: reducerCases.TOGGLE_TERMS_MODAL, showTermsModal: true });
 // Show Terms modal first
};


  const toggleHamburger = () => {
    dispatch({ type: reducerCases.TOGGLE_HAMBURGER });
  }

  const closeHamburger = () => {
    dispatch({ type: reducerCases.CLOSE_HAMBURGER });
  }

  const handleOrdersNavigate = () => {
    closeHamburger();
    if (isSeller) router.push("/seller");
    else router.push("/buyer");
  }

  const handleModeSwitch = () => {
    closeHamburger();
    if (isSeller) {
      dispatch({ type: reducerCases.SWITCH_MODE });
      router.push("/buyer");
    } else {
      dispatch({ type: reducerCases.SWITCH_MODE });
      router.push("/seller");
    }
  }

  const handler = (event) => {
    if (event.key === "Enter") {
      router.push(`/search?q=${searchData}`);
      setSearchData("");
    }
  }

  const links = [
    { linkName: "Explore", handler: "https://www.instagram.com/knell.co.in/", type: "link" },
    //{ linkName: "English", handler: "#", type: "link" },
    //{ linkName: "Become a Seller", handler: "#", type: "link" },
    { linkName: "Log In", handler: handleLogin, type: "button" },
    { linkName: "Join", handler: handleSignup, type: "button2" },
  ];

  const admin = () => {
    closeHamburger();
    router.push("/admin");
  }
  
  const adminorders = () => {
    closeHamburger();
    router.push("/adminorders");
  }

  const ContextMenuData = [
    {
      name: "Profile",
      callback: (e) => {
        e.stopPropagation();
        setIsContextMenuVisible(false);
        router.push("/profile");
      },
    },
    {
      name: "Logout",
      callback: (e) => {
        e.stopPropagation();
        setIsContextMenuVisible(false);
        router.push("/logout");
      },
    },
  ];

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
    // if (!userInfo) {
    // console.log("nav")
    //   // console.log(cookies.jwt);
    //   // console.log(cookies);
    //   const getUserInfo = async () => {
    //     try {
    //       const {
    //         data: { user },
    //       } = await axios.post(
    //         GET_USER_INFO,
    //         {},
    //         {
    //           withCredentials: true,
    //           // headers: {
    //           // Authorization: `Bearer ${cookies.jwt}`,
    //           // },
    //         }
    //       );

    //       let projectedUserInfo = { ...user };
    //       if (user.image) {
    //         projectedUserInfo = {
    //           ...projectedUserInfo,
    //           imageName: HOST + "/" + user.image,
    //         };
    //       }
    //       delete projectedUserInfo.image;
    //       dispatch({
    //         type: reducerCases.SET_USER,
    //         userInfo: projectedUserInfo,
    //       });
    //       setIsLoaded(true);
    //       if (user.isProfileSet === false) {
    //         router.push("/profile");
    //       }
    //     } catch (err) {
    //       console.log(err);
    //     }
    //   };

    //   getUserInfo();
    // } else {
    //   setIsLoaded(true);
    // }
      if (!userInfo) {
    const getUserInfo = async () => {
      try {
        const {
          data: { user },
        } = await axios.post(
          GET_USER_INFO,
          {},
          {
            withCredentials: true, 
          }
        );
        // console.log("afkmd");
        // console.log("user",{user});
        let projectedUserInfo = { ...user };
        if (user.image) {
          projectedUserInfo.imageName = user.image;
        }

        dispatch({
          type: reducerCases.SET_USER,
          userInfo: projectedUserInfo,
        });

        setIsLoaded(true);

        if (user.isProfileSet === false) {
          router.push("/profile");
        }
      } catch (err) {
        console.log("Auth check failed", err);
        setIsLoaded(true); 
      }
    };
        // console.log('abcdef');
    getUserInfo();
  } else {
        // console.log('ghijkl');
    setIsLoaded(true);
  }
  }, [userInfo, dispatch]);

  useEffect(() => {
    const clickListener = (e) => {
      e.stopPropagation();
      if (isContextMenuVisible) setIsContextMenuVisible(false);
    };
    if (isContextMenuVisible) {
      window.addEventListener("click", clickListener);
    }
    return () => {
      window.removeEventListener("click", clickListener);
    };
  }, [isContextMenuVisible]);


  return (
    <>
      {showLoginModal && <AuthWrapper type="login" />}
      {otpmodal && <OtpWrapper/>}
      {showSignupModal && <AuthWrapper type="signup" />}
      {showTermsModal && <TermsAndConditionsModal />}

      
{/* ✅ Terms and Conditions Modal */}
{/* {showTermsModal && (
  <div className="fixed top-0 left-0 w-full h-full z-[200] bg-black bg-opacity-60 flex justify-center items-center">
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full relative">
      <h2 className="text-xl font-semibold mb-4">Terms and Conditions</h2>
      <p className="text-sm text-gray-700 mb-4 overflow-y-auto max-h-64">
        By signing up to Knell, you agree to our Terms of Service and Privacy Policy.
        Please read them carefully before continuing.
      </p>
      <div className="flex justify-end gap-4">
        <button
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
          onClick={() => setShowTermsModal(false)}
        >
          Cancel
        </button>
        <button
          className="bg-[#1DBF73] text-white px-4 py-2 rounded"
          onClick={() => {
            setShowTermsModal(false);
            dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: true });
          }}
        >
          I Agree
        </button>
      </div>
    </div>
  </div>
)} */}

      {isLoaded && (
        <nav className={`w-full px-4 sm:px-8 md:px-16 lg:px-24 py-4 sm:py-6 top-0 z-30 transition-all duration-300 
          ${navFixed || userInfo ? "fixed bg-white border-b border-gray-200" : "absolute bg-transparent border-transparent"} 
          flex items-center justify-between`}>

          {/* ✅ Hamburger for mobile (left-aligned) */}
          <div className="sm:hidden mr-4 text-2xl text-gray-700 cursor-pointer" onClick={toggleHamburger}>
            <GiHamburgerMenu />
          </div>

          {/* ✅ Logo */}
          <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
            <button onClick={() => router.push("/")}>
              <Image
                src={img}
                className={`${!navFixed ? "bg-white" : "bg-[#404145]"} rounded-full`}
                alt="Knell"
                width={50}
                height={50}
              />
            </button>
          </div>

          {/* ✅ Search Bar */}
          <div className={`flex w-full sm:w-auto ${navFixed || userInfo ? "opacity-100" : "opacity-0"}`}>
            <input
              type="text"
              placeholder="What service are you looking for today?"
              className="w-full sm:w-[20rem] md:w-[25rem] lg:w-[30rem] py-2.5 px-4 border"
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
              onKeyDown={handler}
            />
            <button
              className="bg-gray-900 py-1.5 text-white w-16 flex justify-center items-center"
              onClick={() => {
                router.push(`/search?q=${searchData}`);
                setSearchData("");
              }}
            >
              <IoSearchOutline className="h-6 w-6" />
            </button>
          </div>

          {/* ✅ Desktop Nav Links */}
          <div className="hidden sm:flex items-center gap-6">
            {!userInfo ? (
              <ul className="flex gap-6 items-center">
                {links.map(({ linkName, handler, type }) => (
                  <li key={linkName} className={`${navFixed ? "text-black" : "text-white"} font-medium`}>
                    {type === "link" && <Link href={handler}>{linkName}</Link>}
                    {type === "button" && <button onClick={handler}>{linkName}</button>}
                    {type === "button2" && (
                      <button
                        onClick={handler}
                        className={`border text-md font-semibold py-1 px-3 rounded-sm ${
                          navFixed ? "border-[#1DBF73] text-[#1DBF73]" : "border-white text-white"
                        } hover:bg-[#1DBF73] hover:text-white transition-all duration-500`}
                      >
                        {linkName}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="flex gap-6 items-center">
                {(userInfo?.email === "akshajvasudeva@gmail.com"||userInfo?.email ==="Kalakartik23@gmail.com") && (
                  <li className="cursor-pointer text-[#1DBF73] font-medium" onClick={admin}>Admin</li>
                )}
                {(userInfo?.email === "akshajvasudeva@gmail.com"||userInfo?.email ==="Kalakartik23@gmail.com") && (
                  <li className="cursor-pointer text-[#1DBF73] font-medium" onClick={adminorders}>All Orders</li>
                )}
                {isSeller && <li className="cursor-pointer text-[#1DBF73]" onClick={() => router.push("/seller/gigs/create")}>Create Gig</li>}
                <li className="cursor-pointer text-[#1DBF73]" onClick={handleOrdersNavigate}>Orders</li>
                <li className="cursor-pointer" onClick={handleModeSwitch}>
                  {isSeller ? "Switch To Buyer" : "Switch To Seller"}
                </li>
                <li className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setIsContextMenuVisible(true); }}>
                  {userInfo?.imageName ? (
                    <Image src={userInfo.imageName} alt="Profile" width={40} height={40} className="rounded-full" />
                  ) : (
                    <div className="bg-purple-500 h-10 w-10 flex items-center justify-center rounded-full">
                      <span className="text-xl text-white">{userInfo?.email[0].toUpperCase()}</span>
                    </div>
                  )}
                </li>
              </ul>
            )}
            {isContextMenuVisible && <ContextMenu data={ContextMenuData} />}
          </div>

          {/* ✅ Mobile Dropdown Nav */}
{hamburger && (
  <div className="absolute left-0 top-full w-full bg-white shadow-md z-50 flex flex-col p-4 gap-3 sm:hidden">
    {!userInfo ? (
      <>
        {/* 🚀 Explore Link - opens Instagram */}
        <a
          href="https://www.instagram.com/knell.co.in/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeHamburger}
          className="text-left"
        >
          Explore
        </a>

        {/* Render remaining links normally */}
        {links
          .filter(({ linkName }) => linkName !== "Explore")
          .map(({ linkName, handler }) => (
            <button
              key={linkName}
              onClick={() => {
                handler();
                closeHamburger();
              }}
              className="text-left"
            >
              {linkName}
            </button>
          ))}
      </>
    ) : (
      <>
        {(userInfo?.email === "akshajvasudeva@gmail.com"||userInfo?.email ==="Kalakartik23@gmail.com") && (
          <button onClick={admin} className="text-left">Admin</button>
        )}
        {(userInfo?.email === "akshajvasudeva@gmail.com"||userInfo?.email ==="Kalakartik23@gmail.com") && (
          <button onClick={adminorders} className="text-left">All Orders</button>
        )}
        {isSeller && (
          <button
            onClick={() => {
              router.push("/seller/gigs/create");
              closeHamburger();
            }}
            className="text-left"
          >
            Create Gig
          </button>
        )}
        <button onClick={handleOrdersNavigate} className="text-left">Orders</button>
        <button onClick={handleModeSwitch} className="text-left">
          {isSeller ? "Switch To Buyer" : "Switch To Seller"}
        </button>
        <button onClick={() => router.push("/profile")} className="text-left">Profile</button>
        <button onClick={() => router.push("/logout")} className="text-left">Logout</button>
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
