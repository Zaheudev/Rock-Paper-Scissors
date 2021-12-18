import React from "react";
import { useSelector, useDispatch } from "react-redux";
import auth, { authActions } from "../../store/auth";
import Login from "./Login";
import Register from "./Register";

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
    <div>
      <Button title={"Login In"} action={LogIn} />
      <Button title={"Register"} action={SignUp} />
    </div>
  );

  if (isLogin) {
    flag = <Login />;
  } else if (isRegister) {
    flag = <Register />;
  }

  return <div>{flag}</div>;
};

export default Authenticate;
