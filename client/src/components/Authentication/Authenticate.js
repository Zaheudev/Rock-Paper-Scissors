import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import Login from "./Login";
import Register from "./Register";

import classes from "./Authenticate.module.css";

import image from "../../assets/logo1.png";

import Button from "../UI/Button";

const Authenticate = () => {
  const isRegister = useSelector((state) => state.auth.isRegister);
  const isLogin = useSelector((state) => state.auth.isLoging);

  const dispatch = useDispatch();

  const LogIn = () => {
    dispatch(authActions.setIsLogingPage(true));
  };

  const SignUp = () => {
    dispatch(authActions.setIsRegisterPage(true));
  };

  let flag = (
    <div className={classes.card}>
      <Button title={"Login"} action={LogIn} />
      <Button title={"Register"} action={SignUp} />
    </div>
  );

  if (isLogin) {
    flag = <Login />;
  } else if (isRegister) {
    flag = <Register />;
  }

  return (
    <div>
      <header>
      <img alt="logo" draggable="false" src={image}></img>
      </header>
      <div>{flag}</div>
    </div>
  );
};

export default Authenticate;
