import React from "react";

import sound from "../../sounds/button.mp3";
import classes from "./Button.module.css";
import { useSound } from "use-sound";

const Button = (props) => {
  const [buttonSound] = useSound(sound, { volume: 0.6, interrupt: true, });
  const style = {
    margin: "auto",
    fontSize: props.size,
  };

  return (
    <button
      disabled={props.state}
      className={classes.button}
      type={props.type}
      form={props.form}
      src={props.src}
      onMouseDown={buttonSound}
      onClick={props.action}
    >
      <p style={style}>{props.title}</p>
    </button>
  );
};

export default Button;
