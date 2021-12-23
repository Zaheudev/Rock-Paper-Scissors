import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import Login from "./Login";
import Register from "./Register";

import classes from "./Authenticate.module.css";

import image from "../../assets/logo1-big.png";

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
      <div className={classes.login}>
        <Button size={"40px"} title={"Login"} action={LogIn} />
      </div>
      <div className={classes.register}>
        <Button size={"40px"} title={"Register"} action={SignUp} />
      </div>
    </div>
  );

  if (isLogin) {
    flag = <Login />;
  } else if (isRegister) {
    flag = <Register />;
  }

  return (
    <div>
      <img
        className={classes.image}
        alt="logo"
        draggable="false"
        src={image}
      ></img>
      <div>{flag}</div>
    </div>
  );
};

export default Authenticate;
