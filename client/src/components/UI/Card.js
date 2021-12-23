import React from "react";

import classes from './Card.module.css';

const Card = (props) => {
  let class1 = classes.container;
  class1 = props.color === "purple" ? classes.enemyContainer : classes.container;
  
  return <div className={class1}>{props.children}</div>;
};

export default Card;
