import React from "react";

import classes from "./Button.module.css";

const Button = (props) => {
  return (
    <button
      disabled={props.state}
      className={classes.button}
      onClick={props.action}
      type={props.type}
    >
      {props.title}
    </button>
  );
};

export default Button;
