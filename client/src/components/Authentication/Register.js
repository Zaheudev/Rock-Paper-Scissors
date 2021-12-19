import React from "react";
import Button from "../UI/Button";

import classes from "./Auth.module.css";

import { useSelector, useDispatch } from "react-redux";

import auth, { authActions } from "../../store/auth";

import { client } from "../../App";

function Message(type, data) {
  this.type = type;
  this.data = data;
}

const Register = () => {
  const error = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();

  const SignUp = (event) => {
    event.preventDefault();
    let username = event.target.elements.name.value;
    let pass = event.target.elements.password.value;
    event.preventDefault();
    if (username.trim().length > 3 && pass.trim().length >= 6) {
      client.send(
        JSON.stringify(
          new Message("Register", {
            username: username,
            password: pass,
          })
        )
      );
      console.log("Signing in");
    }
  };

  const clearError = () => {
    dispatch(authActions.setError(null));
  };

  const Cancel = (event) => {
    dispatch(authActions.setIsRegisterPage(false));
  };
  return (
    <main className={classes.auth}>
      <h1>REGISTER PAGE</h1>
      <section>
        <form onSubmit={SignUp}>
          <div className={classes.control}>
            <label htmlFor="name">Name</label>
            <input onChange={clearError} type="text" id="name" />
          </div>
          <div className={classes.control}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" />
          </div>
          <p>{error}</p>
          <Button title="Register" type={"submit"} />
          <Button title="Cancel" action={Cancel} type={"button"} />
        </form>
      </section>
    </main>
  );
};

export default Register;
