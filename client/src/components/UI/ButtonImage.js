import React from "react";

import classes from './Button.module.css';

const ButtonImage = (props) => {
  return (
    <button
      disabled={props.state}
      className={classes.button}
      onClick={props.action}
      type={props.type}
    >
      <img src={props.symbol} width="50" height="50"/>
    </button>
  );
};

export default ButtonImage;