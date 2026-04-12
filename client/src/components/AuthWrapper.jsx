import axios from "axios";
import { LOGIN_ROUTE, OTP_SEND, SEND_FORGOT_OTP, GOOGLE_AUTH_ROUTE } from "../utils/constants";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";
import { useGoogleLogin } from "@react-oauth/google";

function AuthWrapper({ type }) {
  const [{ resetPass }, dispatch] = useStateProvider();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const isValidGmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      // Get user info from Google using the access token
      const googleUser = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });

      // Exchange with our backend
      const { data: { user, jwt } } = await axios.post(
        GOOGLE_AUTH_ROUTE,
        { idToken: tokenResponse.access_token, googleUser: googleUser.data },
        { withCredentials: true }
      );

      dispatch({ type: reducerCases.CLOSE_AUTH_MODAL });
      if (user) {
        dispatch({ type: reducerCases.SET_USER, userInfo: user });
      }
      window.location.reload();
    } catch (err) {
      setErrorMessage("Google sign-in failed. Please try again.");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setErrorMessage("Google sign-in failed. Please try again."),
  });

  const handleClick = async () => {
    try {
      const { email, password } = values;
      if (!email || !password) { setErrorMessage("Email and password are required."); return; }
      if (!isValidGmail(email)) { setErrorMessage("Please enter a valid Gmail address."); return; }

      if (type === "login") {
        const { data: { user, jwt } } = await axios.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
        dispatch({ type: reducerCases.CLOSE_AUTH_MODAL });
        if (user) dispatch({ type: reducerCases.SET_USER, userInfo: user });
        window.location.reload();
      } else {
        const { data: { user } } = await axios.post(
          resetPass ? SEND_FORGOT_OTP : OTP_SEND,
          { email, password },
          { withCredentials: true }
        );
        dispatch({ type: reducerCases.CLOSE_AUTH_MODAL });
        if (user) dispatch({ type: reducerCases.SET_UNVERIFIED_USER, unverifiedmail: user });
        dispatch({ type: reducerCases.OTP_MODAL, otpmodal: true });
      }
    } catch (err) {
      if (err?.response?.data) {
        setErrorMessage(err.response.data?.message || "Something went wrong.");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="fixed top-0 z-[100]">
      <div className="h-[100vh] w-[100vw] backdrop-blur-md fixed top-0" id="blur-div"></div>
      <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
        <div className="fixed z-[101] w-[90vw] max-w-sm bg-white flex flex-col justify-center items-center rounded-md shadow-lg" id="auth-modal">
          <button
            className="absolute top-3 right-3 text-xl text-slate-500 hover:text-slate-700"
            onClick={() => {
              dispatch({ type: reducerCases.CLOSE_AUTH_MODAL });
              dispatch({ type: reducerCases.RESET_PASS, resetPass: false });
            }}
          >
            &times;
          </button>

          <div className="flex flex-col justify-center items-center p-8 gap-7">
            <h3 className="text-2xl font-semibold text-slate-700">
              {resetPass ? "Update Password" : type === "login" ? "Login to Knell" : "Create your Knell account"}
            </h3>

            <div className="flex flex-col gap-5 w-full">
              {/* Google Button */}
              {!resetPass && (
              <button
  onClick={() => googleLogin()}
  type="button"
  className="border border-slate-300 p-3 font-medium w-full max-w-xs flex items-center justify-center gap-3 hover:bg-slate-50"
>
  <FcGoogle className="text-2xl" />
  Continue with Google
</button>
              )}

              {/* Divider */}
              {!resetPass && (
                <div className="relative w-full text-center">
                  <div className="absolute top-1/2 left-0 w-full h-[0.5px] bg-slate-300" />
                  <span className="bg-white relative z-10 px-2 text-sm text-slate-400">OR</span>
                </div>
              )}

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
              {errorMessage && <div className="text-red-500 text-sm text-center">{errorMessage}</div>}
              <button className="bg-[#1DBF73] text-white px-6 py-3 w-full max-w-xs" onClick={handleClick} type="button">
                Continue
              </button>
            </div>
          </div>

          <div className="py-5 w-full flex items-center justify-center border-t border-slate-400">
            <span className="text-sm text-slate-700">
              {type === "login" ? (
                <>
                  Not a member yet?&nbsp;
                  <span className="text-[#1DBF73] cursor-pointer" onClick={() => {
                    dispatch({ type: reducerCases.TOGGLE_LOGIN_MODAL, showLoginModal: false });
                    dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: true });
                    dispatch({ type: reducerCases.RESET_PASS, resetPass: false });
                  }}>Join Now</span>
                  <div className="mt-2 flex justify-end">
                    <span className="text-[#1DBF73] cursor-pointer" onClick={() => {
                      dispatch({ type: reducerCases.RESET_PASS, resetPass: true });
                      dispatch({ type: reducerCases.TOGGLE_LOGIN_MODAL, showLoginModal: false });
                      dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: false });
                    }}>Forgot Password?</span>
                  </div>
                </>
              ) : (
                <>
                  Already a member?&nbsp;
                  <span className="text-[#1DBF73] cursor-pointer" onClick={() => {
                    dispatch({ type: reducerCases.RESET_PASS, resetPass: false });
                    dispatch({ type: reducerCases.TOGGLE_LOGIN_MODAL, showLoginModal: true });
                    dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: false });
                  }}>Login Now</span>
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