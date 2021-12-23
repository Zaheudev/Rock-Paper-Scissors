import React from "react";

import { useSelector } from "react-redux";

import classes from "./Result.module.css";

import Card from "../UI/Card";

import rock from "../../assets/rock1.png";
import paper from "../../assets/paper1.png";
import scissors from "../../assets/scissors1.png";

import enemyRock from "../../assets/rock2.png";
import enemyPaper from "../../assets/paper2.png";
import enemyScissors from "../../assets/scissors2.png";

const Result = (props) => {
  const enemySymbol = useSelector((state) => state.data.enemySymbol);

  let clientSymbol = null;

  if (props.client === "Rock") {
    clientSymbol = <img alt="rock" src={rock} width="70" height="70" />;
  } else if (props.client === "Paper") {
    clientSymbol = <img alt="paper" src={paper} width="70" height="70" />;
  } else if (props.client === "Scissors") {
    clientSymbol = <img alt="scissors" src={scissors} width="70" height="70" />;
  }

  let enemySymbolRender = null;

  if (enemySymbol === "Rock") {
    enemySymbolRender = (
      <img alt="rock" src={enemyRock} width="70" height="70" />
    );
  } else if (enemySymbol === "Paper") {
    enemySymbolRender = (
      <img alt="paper" src={enemyPaper} width="70" height="70" />
    );
  } else if (enemySymbol === "Scissors") {
    enemySymbolRender = (
      <img alt="scissors" src={enemyScissors} width="70" height="70" />
    );
  }

  return (
    <div className={classes.result}>
      <Card color={"purple"}>{enemySymbolRender === null ? <p>??</p> : enemySymbolRender}</Card>
      <p>VS</p>
      <Card>{clientSymbol === null ? <p>??</p> : clientSymbol}</Card>
    </div>
  );
};

export default Result;
