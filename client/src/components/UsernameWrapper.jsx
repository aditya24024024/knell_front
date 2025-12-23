import { useState } from "react";
import { SET_USERNAME } from "../utils/constants";
import axios from "axios";
import { toast } from "react-toastify";

export default function UsernameWrapper() {
  const [errorMessage, setErrorMessage] = useState("")
  const [username, setusername] = useState("")

  async function setup_username() {
    try {
      const response = await axios.post(
        SET_USERNAME,
        { username },
        { withCredentials: true }
      );
      if (response?.data?.emptyFieldError) {
        setErrorMessage("Username can not be empty.");
        return;
      }
      if (response?.data?.usernameError) {
        setErrorMessage("Username already taken.");
        return;
      }
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
          <div className="flex flex-col justify-center items-center p-8 gap-7">
            <h3 className="text-2xl font-semibold text-slate-700">
              Enter your username here
            </h3>
            <div className="flex flex-col gap-5">
              <input
                className="border border-slate-300 p-3 w-full max-w-xs"
                type="text"
                value={username}
                onChange={e => setusername(e.target.value)}
                placeholder="Enter username"
              />
              {errorMessage && (
                <div className="text-red-500 text-sm text-center">
                  {errorMessage}
                </div>
              )}
              <button
                className="bg-[#1DBF73] text-white px-6 py-3 w-full max-w-xs"
                onClick={setup_username}
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
