import React from "react";

import { useSelector } from "react-redux";
import data, { dataActions } from "../../store/data";

const Result = (props) => {
  let result = "...";
  const key = useSelector((state) => state.data.userKey);

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

  return (
    <div>
      <p>{`${props.enemyName} SYMBOL: ${props.enemySymbol}`}</p>
      <p>{result}</p>
      <p>{`${props.name} SYMBOL: ${props.client}`}</p>
    </div>
  );
};

export default Result;
