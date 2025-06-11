import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { LOGOUT_ROUTE } from "../utils/constants";
import axios from "axios";

function Logout() {
  const [cookies, setCookies, removeCookie] = useCookies();
  const [{}, dispatch] = useStateProvider();

  const router = useRouter();
  useEffect(() => {
  (async () => {
    try {
      await axios.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );

      // Clear cookies and state only after successful logout
      removeCookie("jwt");
      dispatch({ type: reducerCases.SET_USER, userInfo: undefined });
      window.location.href = window.location.origin;

    } catch (err) {
      console.error("Logout failed:", err);
    }
  })();
}, [removeCookie, dispatch]);
  return (
    <div className="h-[80vh] flex items-center px-20 pt-20 flex-col">
      <h1 className="text-4xl text-center">
        Logout successful. You are being redirected to the main page.
      </h1>
    </div>
  );
}

export default Logout;
