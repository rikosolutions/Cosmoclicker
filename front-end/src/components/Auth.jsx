import React from "react";
import { Navigate } from "react-router-dom";
import { isAuth } from "../utlis/localstorage";
import { initTG, getTGUser } from "../utlis/tg";

function Auth({ children }) {

  return isAuth() === true ? (
    children
  ) : (
    <Navigate to={{ pathname: "/" }} />
  );
}

export default Auth;