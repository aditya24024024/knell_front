import { useState } from "react";
import { OTP_VERIFICATION, SIGNUP_ROUTE } from "../utils/constants";
import axios from "axios";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";

export default function OtpWrapper() {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("")
  const [{ unverifiedmail }, dispatch] = useStateProvider()


  async function verifyOtp() {
    try {
      const email = unverifiedmail.email;
      const response = await axios.post(
        OTP_VERIFICATION,
        { email, otp },
        { withCredentials: true }
      );
      // console.log(response);
      const password = response.data.password;
      const { data: { user, jwt }, } = await axios.post(SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (user) {
        dispatch({ type: reducerCases.SET_USER, userInfo: user });
      }
      dispatch({ type: reducerCases.SET_UNVERIFIED_USER, unverifiedmail: undefined });
      dispatch({ type: reducerCases.OTP_MODAL, otpmodal: false });
      window.location.reload();
    } catch (err) {
      if (err?.response && err?.response?.data) {
        setErrorMessage(err.response.data);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  }

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
              dispatch({ type: reducerCases.OTP_MODAL, otpmodal: false });
            }}
          >
            &times;
          </button>
          <div className="flex flex-col justify-center items-center p-8 gap-7">
            <h3 className="text-2xl font-semibold text-slate-700">

            </h3>
            <div className="flex flex-col gap-5">
              <input
                className="border border-slate-300 p-3 w-full max-w-xs"
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
              {errorMessage && (
                <div className="text-red-500 text-sm text-center">
                  {errorMessage}
                </div>
              )}
              <button
                className="bg-[#1DBF73] text-white px-6 py-3 w-full max-w-xs"
                onClick={verifyOtp}
                type="button"
              >
                Submit
              </button>
            </div>
          </div>
          <div className="py-5 w-full flex items-center justify-center border-t border-slate-400">
            <span className="text-sm text-slate-700">
              {" "}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}