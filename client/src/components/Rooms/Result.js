import React from "react";

const Result = (props) => {
  let result = "...";
  if (props.winner === 1) {
    result = "ROUND WON BY YOU";
  } else if (props.winner === 2) {
    result = "ROUND WON BY OPPONENT";
  } else if (props.winner === 0) {
    result = "ROUND DRAW";
  }
  return (
    <div>
      <p>{`BOT SYMBOL: ${props.botSymbol}`}</p>
      <p>{result}</p>
      <p>{`CLIENT SYMBOL: ${props.client}`}</p>
    </div>
  );
};

export default Result;
