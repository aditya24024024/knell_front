import axios from "axios";
import { LOGIN_ROUTE, OTP_SEND } from "../utils/constants";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdFacebook } from "react-icons/md";
import { useRouter } from "next/router";
import { useStateProvider } from "../context/StateContext";
import { useCookies } from "react-cookie";
import { reducerCases } from "../context/constants";

function AuthWrapper({ type }) {
  const [cookies, setCookies] = useCookies();

  const [{}, dispatch] = useStateProvider();

  const [values, setValues] = useState({ email: "", password: "" });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const isValidGmail = (email) => {
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return gmailRegex.test(email);
};

  const handleClick = async () => {
    try {
      const { email, password } = values;

      if (!email || !password) {
        setErrorMessage("Email and password are required.");
        return;
      }

      if (!isValidGmail(email)) {
        setErrorMessage("Please enter a valid Gmail address.");
        return;
      }

      if (email && password) {
        if (type === "login") {
          const { data: { user, jwt }, } = await axios.post(LOGIN_ROUTE,
            { email, password },
            { withCredentials: true }
          );
          // setCookies("jwt", { jwt});
          // console.log(user);
          dispatch({ type: reducerCases.CLOSE_AUTH_MODAL });
          if (user) {
            dispatch({ type: reducerCases.SET_USER, userInfo: user });
          }
          // console.log("dsfgd");
          // console.log(userInfo);
          window.location.reload();
        }
        else {
          const { data: { user }, } = await axios.post(OTP_SEND,
            { email, password },
            { withCredentials: true }
          );
          dispatch({ type: reducerCases.CLOSE_AUTH_MODAL });
          if (user) {
            dispatch({ type: reducerCases.SET_UNVERIFIED_USER, unverifiedmail: user });
          }
          dispatch({ type: reducerCases.OTP_MODAL, otpmodal: true });
        }
      };
    } catch (err) {
      // console.log(err);
      if (err?.response && err?.response?.data) {
        setErrorMessage(err.response.data);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="fixed top-0 z-[100]">
      <div
        className="h-[100vh] w-[100vw] backdrop-blur-md fixed top-0"
        id="blur-div"
      ></div>
      <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
        <div
          className="fixed z-[101] w-[90vw] max-w-sm bg-white flex flex-col justify-center items-center rounded-md shadow-lg"
          id="auth-modal"
        >
          <button
          className="absolute top-3 right-3 text-xl text-slate-500 hover:text-slate-700"
          onClick={() => {
            dispatch({type: reducerCases.CLOSE_AUTH_MODAL});
          }}
        >
          &times;
        </button>
          <div className="flex flex-col justify-center items-center p-8 gap-7">
            <h3 className="text-2xl font-semibold text-slate-700">
  {type === "login" ? "Login to Knell" : "Create your Knell account"}
</h3>

            {/* <div className="flex flex-col gap-5">
              <button className="text-white bg-blue-500 p-3 font-semibold w-80 flex items-center justify-center relative">
                <MdFacebook className="absolute left-4 text-2xl" />
                Continue with Facebook
              </button>
              <button className="border border-slate-300 p-3 font-medium w-80 flex items-center justify-center relative">
                <FcGoogle className="absolute left-4 text-2xl" />
                Continue with Google
              </button>
            </div> */}
            {/* <div className="relative w-full text-center">
              <span className="before:content-[''] before:h-[0.5px] before:w-80 before:absolute before:top-[50%] before:left-0 before:bg-slate-400">
                <span className="bg-white relative z-10 px-2">OR</span>
              </span>
            </div> */}
            <div className="flex flex-col gap-5">
              <input
                type="text"
                name="email"
                placeholder="Email / Username"
                className="border border-slate-300 p-3 w-full max-w-xs"
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-slate-300 p-3 w-full max-w-xs"
                name="password"
                onChange={handleChange}
              />
              {errorMessage && (
    <div className="text-red-500 text-sm text-center">
      {errorMessage}
    </div>
  )}
              <button
                className="bg-[#1DBF73] text-white px-6 py-3 w-full max-w-xs"
                onClick={handleClick} // Now defined
                type="button"
              >
                Continue
              </button>
            </div>
          </div>
          <div className="py-5 w-full flex items-center justify-center border-t border-slate-400">
            <span className="text-sm text-slate-700">
              {" "}
              {type === "login" ? (
                <>
                  Not a member yet?&nbsp;
                  <span
                    className="text-[#1DBF73] cursor-pointer"
                    onClick={() => {
                      dispatch({
                        type: reducerCases.TOGGLE_SIGNUP_MODAL,
                        showSignupModal: true,
                      });
                      dispatch({
                        type: reducerCases.TOGGLE_LOGIN_MODAL,
                        showLoginModal: false,
                      });
                    }}
                  >
                    Join Now
                  </span>
                </>
              ) : (
                <>
                  Already a member?&nbsp;
                  <span
                    className="text-[#1DBF73] cursor-pointer"
                    onClick={() => {
                      dispatch({
                        type: reducerCases.TOGGLE_SIGNUP_MODAL,
                        showSignupModal: false,
                      });
                      dispatch({
                        type: reducerCases.TOGGLE_LOGIN_MODAL,
                        showLoginModal: true,
                      });
                    }}
                  >
                    Login Now
                  </span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthWrapper;
