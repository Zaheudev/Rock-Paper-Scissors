import React from "react";
import Button from "../UI/Button";

import classes from "./Auth.module.css";

import { useSelector, useDispatch } from "react-redux";

import { authActions } from "../../store/auth";

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
    let username = event.target.elements.name.value.trim();
    let pass = event.target.elements.password.value.trim();
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
    if(username.trim().length < 3 && pass.trim().length > 6){
      dispatch(authActions.setError("Username too short! over 3 chars"));
    }else if(pass.trim().length < 6 && username.trim().length > 3){
      dispatch(authActions.setError("Password too short! over 6 chars"));
    }else {
      dispatch(authActions.setError("Signing..."))
    }
  };

  const clearError = () => {
    dispatch(authActions.setError(null));
  };

  const Cancel = (event) => {
    dispatch(authActions.setIsRegisterPage(false));
    dispatch(authActions.clear());
  };
  return (
    <main className={classes.auth}>
      <h1>REGISTER PAGE</h1>
      <section>
        <form onSubmit={SignUp}>
          <div className={classes.control}>
            <label htmlFor="name"><p>Username</p></label>
            <input onChange={clearError} type="text" id="name" />
          </div> 
          <div className={classes.control}>
            <label htmlFor="password"><p>Password</p></label>
            <input onChange={clearError} type="password" id="password" />
          </div>
          <p className={classes.error}>{error}</p>
          <Button size={"25px"} className={classes.paragraph} title="Register" type={"submit"} />
          <Button title="Cancel" action={Cancel} type={"button"} />
        </form>
      </section>
    </main>
  );
};

export default Register;
