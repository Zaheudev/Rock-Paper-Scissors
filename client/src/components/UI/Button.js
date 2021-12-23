import React from "react";

import classes from "./Button.module.css";



const Button = (props) => {
  const style = {
    margin: 'auto',
    fontSize: props.size,
  };
  return (
    <button
      disabled={props.state}
      className={classes.button}
      onClick={props.action}
      type={props.type}
      form={props.form}
      src={props.src}
    >
      <p style={style}>{props.title}</p>
    </button>
  );
};

export default Button;
