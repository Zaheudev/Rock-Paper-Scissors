import React from "react";

import { useSelector } from "react-redux";
import data, { dataActions } from "../../store/data";

import rock from "../../assets/rock.png";
import paper from "../../assets/paper.png";
import scissors from "../../assets/scissors.png";

const Result = (props) => {
  let result = "Result";
  const key = useSelector((state) => state.data.userKey);
  const state = useSelector((state) => state.data.state);
  const enemySymbol = useSelector((state) => state.data.enemySymbol);

  if (props.winner === 1 && key === 1) {
    result = "ROUND WON BY YOU";
  } else if (props.winner === 1 && key === 2) {
    result = "ROUND WON BY OPPONENT";
  }else if(props.winner === 2 && key === 2){
    result = "ROUND WON BY YOU";
  } else if (props.winner === 2 && key === 1) {
    result = "ROUND WON BY OPPONENT";
  } else if (props.winner === 0) {
    result = "ROUND DRAW";
  }

  let clientSymbol = null;

  if(props.client === "Rock"){
    clientSymbol = <img src={rock} width="60" height="60" />
  }else if(props.client === "Paper"){
    clientSymbol = <img src={paper} width="60" height="60" />
  }else if(props.client === "Scissors"){
    clientSymbol = <img src={scissors} width="60" height="60" />
  }

  let enemySymbolRender = null;

  if(enemySymbol === "Rock"){
    enemySymbolRender = <img src={rock} width="60" height="60" />
  }else if(enemySymbol === "Paper"){
    enemySymbolRender = <img src={paper} width="60" height="60" />
  }else if(enemySymbol === "Scissors"){
    enemySymbolRender = <img src={scissors} width="60" height="60" />
  }

  return (
    <div>
      <p>{state !== "Waiting" ? `${props.enemyName} SYMBOL: ` : "WAITING FOR PLAYER"} {enemySymbolRender}</p>
      <p>{result}</p>
      <p>{`YOUR SYMBOL:`} {clientSymbol}</p>
      
    </div>
  );
};

export default Result;
