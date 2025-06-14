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
// import ContextMenu

const Navbar = () => {
  const [cookies]=useCookies()
  const router=useRouter()
  const [isLoaded,setIsLoaded]=useState(false)
  // const [isFixed,setisFixed]=useState(false)
  const [navFixed,setNavFixed]=useState(false)
  const [searchData,setSearchData]=useState("")
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [{ showLoginModal, showSignupModal, isSeller, userInfo }, dispatch] =
    useStateProvider()

  const handleLogin=()=>{
    if (showSignupModal) {
      dispatch({
        type: reducerCases.TOGGLE_SIGNUP_MODAL,
        showSignupModal: false,
      });
    }
    dispatch({
      type: reducerCases.TOGGLE_LOGIN_MODAL,
      showLoginModal: true,
    });
  }

  const admin=()=>{
    router.push("/admin");
  }

  const handler=(event)=>{
    if(event.key=="Enter"){
      router.push(`/search?q=${searchData}`);
    }
  }

  const handleSignup=()=>{
    if (showLoginModal) {
      dispatch({
        type: reducerCases.TOGGLE_LOGIN_MODAL,
        showLoginModal: false,
      });
    }
    dispatch({
      type: reducerCases.TOGGLE_SIGNUP_MODAL,
      showSignupModal: true,
    });
  }
  
  const handleOrdersNavigate = () => {
    if (isSeller) router.push("/seller/orders");
    router.push("/buyer/orders");
  };

  const handleModeSwitch = () => {
    if (isSeller) {
      dispatch({ type: reducerCases.SWITCH_MODE });
      router.push("/buyer/orders");
    } else {
      dispatch({ type: reducerCases.SWITCH_MODE });
      router.push("/seller");
    }
  };

  const links = [
    // { linkName: "Fiverr Business", handler: "#", type: "link" },
    { linkName: "Explore", handler: "https://www.instagram.com/knell.co.in/", type: "link" },
    { linkName: "English", handler: "#", type: "link" },
    { linkName: "Become a Seller", handler: "#", type: "link" },
    { linkName: "Sign in", handler: handleLogin, type: "button" },
    { linkName: "Join", handler: handleSignup, type: "button2" },
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
  if (!userInfo) {
    const getUserInfo = async () => {
      try {
        const {
          data: { user },
        } = await axios.post(
          GET_USER_INFO,
          {},
          {
            withCredentials: true, // ✅ this sends the jwt cookie
          }
        );

        let projectedUserInfo = { ...user };
        if (user.image) {
          projectedUserInfo.imageName = HOST + "/" + user.image;
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
        setIsLoaded(true); // Even if it fails, set the UI to load
      }
    };

    getUserInfo();
  } else {
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



    return (
    <>
      {showLoginModal && <AuthWrapper type="login" />}
      {showSignupModal && <AuthWrapper type="signup" />}
          {isLoaded && (
        <nav
          className={`w-full px-4 sm:px-8 md:px-16 lg:px-24 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center py-4 sm:py-6 top-0 z-30 transition-all duration-300 ${
          navFixed || userInfo
          ? "fixed bg-white border-b border-gray-200"
          : "absolute bg-transparent border-transparent"
          }`}
        >
          <div  className={`w-[50px] h-[50px] rounded-full overflow-hidden` }>
            {/* <div> */}
            <button onClick={()=>router.push("/")}>
            <Image
                    src={img}
                    // className="absolute left-4"
                    className={`${!navFixed ? "bg-white" : "bg-[#404145]"} rounded-full`}
                    alt = "Knell"
                    width={50}
                    height={50}
                  />
            </button>

          </div>
          <div
            className={`flex w-full sm:w-auto $ ${
              navFixed || userInfo ? "opacity-100" : "opacity-0"
            }`}
          >
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
                setSearchData("");
                router.push(`/search?q=${searchData}`);
              }}
            >
              <IoSearchOutline className="fill-white text-white h-6 w-6" />
            </button>
          </div>
          {!userInfo ? (
            <ul className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10 items-center text-center">
              {links.map(({ linkName, handler, type }) => {
                return (
                  <li
                    key={linkName}
                    className={`${
                      navFixed ? "text-black" : "text-white"
                    } font-medium`}
                  >
                    {type === "link" && <Link href={handler}>{linkName}</Link>}
                    {type === "button" && (
                      <button onClick={handler}>{linkName}</button>
                    )}
                    {type === "button2" && (
                      <button
                        onClick={handler}
                        className={`border   text-md font-semibold py-1 px-3 rounded-sm ${
                          navFixed
                            ? "border-[#1DBF73] text-[#1DBF73]"
                            : "border-white text-white"
                        } hover:bg-[#1DBF73] hover:text-white hover:border-[#1DBF73] transition-all duration-500`}
                      >
                        {linkName}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10 items-center text-center">
              {userInfo?.email=="akshajvasudeva@gmail.com"?
              <li
                className="cursor-pointer text-[#1DBF73] font-medium"
                onClick={admin}
              >
                Admin
              </li>:
              <li></li>}
              {isSeller && (
                <li
                  className="cursor-pointer text-[#1DBF73] font-medium"
                  onClick={() => router.push("/seller/gigs/create")}
                >
                  Create Gig
                </li>
              )}
              <li
                className="cursor-pointer text-[#1DBF73] font-medium"
                onClick={handleOrdersNavigate}
              >
                Orders
              </li>

              {isSeller ? (
                <li
                  className="cursor-pointer font-medium"
                  onClick={handleModeSwitch}
                >
                  Switch To Buyer
                </li>
              ) : (
                <li
                  className="cursor-pointer font-medium"
                  onClick={handleModeSwitch}
                >
                  Switch To Seller
                </li>
              )}
              <li
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsContextMenuVisible(true);
                }}
                title="Profile"
              >
                {userInfo?.imageName ? (
                  <Image
                    src={userInfo.imageName}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="bg-purple-500 h-10 w-10 flex items-center justify-center rounded-full relative">
                    <span className="text-xl text-white">
                      {userInfo &&
                        userInfo?.email &&
                        userInfo?.email.split("")[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </li>
            </ul>
          )}
          {isContextMenuVisible && <ContextMenu data={ContextMenuData} />}
        </nav>
      )}

    </>)
}

export default Navbar
