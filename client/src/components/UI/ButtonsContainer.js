import React from "react";
import { useSound } from "use-sound";

import rockSound from "../../sounds/rock.mp4";
import paperSound from "../../sounds/paper.mp4";
import scissorsSound from "../../sounds/scissor.mp4";
import classes from "./ButtonsContainer.module.css";

const ButtonContainer = (props) => {
  const [rockEvent] = useSound(rockSound, {interrupt:true, volume: 0.1});
  const [paperEvent] = useSound(paperSound, {interrupt:true, volume: 0.5});
  const [scissorsEvent] = useSound(scissorsSound, {interrupt:true, volume: 0.3});
  let class1 = null;
  class1 =
    props.color === "purple" ? classes.containerPurple : classes.container;
  return (
    <div className={class1}>
      <button
        disabled={props.state}
        className={classes.button}
        onMouseDown={rockEvent}
        onClick={props.actionRock}
        type={props.type}
      >
        <img
          className={classes.image}
          alt={"Rock"}
          src={props.symbolRock}
          width="50"
          height="50"
        />
      </button>

      <button
        disabled={props.state}
        className={classes.button}
        onMouseDown={paperEvent}
        onClick={props.actionPaper}
        type={props.type}
      >
        <img
          className={classes.image}
          alt={"Paper"}
          src={props.symbolPaper}
          width="50"
          height="50"
        />
      </button>

      <button
        disabled={props.state}
        className={classes.button}
        onMouseDown={scissorsEvent}
        onClick={props.actionScissors}
        type={props.type}
      >
        <img
          className={classes.image}
          alt={"Scissors"}
          src={props.symbolScissors}
          width="50"
          height="50"
        />
      </button>
    </div>
  );
};

export default ButtonContainer;
