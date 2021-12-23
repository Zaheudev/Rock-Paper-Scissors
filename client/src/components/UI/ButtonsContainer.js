import React from "react";

import classes from "./ButtonsContainer.module.css";

const ButtonContainer = (props) => {
  let class1 = null;
  class1 =
    props.color === "purple" ? classes.containerPurple : classes.container;
  return (
    <div className={class1}>
      <button
        disabled={props.state}
        className={classes.button}
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
