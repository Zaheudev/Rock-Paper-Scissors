import React from "react";
import Button from "../UI/Button";

import classes from "./Auth.module.css";

import { useDispatch, useSelector } from "react-redux";

import { authActions } from "../../store/auth";
import { client } from "../../App";

function Message(type, data) {
  this.type = type;
  this.data = data;
}

const Login = () => {
  const error = useSelector((state) => state.auth.error);

  const dispatch = useDispatch();

  const SignIn = (event) => {
    let username = event.target.elements.name.value.trim();
    let pass = event.target.elements.password.value.trim();
    event.preventDefault();
    if (username.trim().length > 3 && pass.trim().length >= 6) {
      client.send(
        JSON.stringify(
          new Message("LoginIn", {
            username: username,
            password: pass,
          })
        )
      );
      console.log("Signing in");
    }
    if (username.trim().length < 3 && pass.trim().length > 6) {
      dispatch(authActions.setError("Username too short! over 3 chars"));
    } else if (pass.trim().length < 6 && username.trim().length > 3) {
      dispatch(authActions.setError("Password too short! over 6 chars"));
    } else {
      dispatch(authActions.setError("Connecting..."));
    }
  };

  const Cancel = () => {
    dispatch(authActions.setIsLogingPage(false));
    dispatch(authActions.clear());
  };

  return (
    <main className={classes.auth}>
      <h1>LOGIN PAGE</h1>
      <section>
        <form onSubmit={SignIn}>
          <div className={classes.control}>
            <label htmlFor="name"><p>Username</p></label>
            <input type="text" id="name" />
          </div>
          <div className={classes.control}>
            <label htmlFor="password"><p>Password</p></label>
            <input type="password" id="password" />
          </div>
          <p className={classes.error}>{error}</p>
          <Button title="Login" type={"submit"} />
          <Button title="Cancel" action={Cancel} type={"button"} />
        </form>
      </section>
    </main>
  );
};

export default Login;
