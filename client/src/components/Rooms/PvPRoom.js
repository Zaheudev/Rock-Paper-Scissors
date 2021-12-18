import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { dataActions } from "../../store/data";
import { pageActions } from "../../store/page";
import { client } from "../../App";

import Button from "../UI/Button";
import Room from "./Room.js";
import Result from "./Result";

const PvPRoom = (props) => {
  const [symbol, setSymbol] = useState("");
  const enemySymbol = useSelector((state) => state.data.enemySymbol);
  const state = useSelector((state) => state.data.state);
  const name = useSelector((state) => state.data.name);
  const enemyName = useSelector((state) => state.data.enemyName);
  const code = useSelector((state) => state.data.code);
  const rounds = useSelector((state) => state.data.rounds);
  const winnerNum = useSelector((state) => state.data.winner);
  const turn = useSelector((state) => state.data.turn);
  const key = useSelector((state) => state.data.userKey);

  const dispatch = useDispatch();

  function Message(type, data) {
    this.type = type;
    this.data = data;
  }

  const selectSymbol = (e) => {
    setSymbol(e.target.innerHTML);
    client.send(
      JSON.stringify(
        new Message("ClientSymbolMP", {
          symbol: e.target.innerHTML,
          code: code,
          name: name,
        })
      )
    );
  };

  const exitRoom = (e) => {
    client.send(JSON.stringify(new Message("ExitMPRoom", {user: key, code: code})));
    dispatch(dataActions.clear());
    dispatch(pageActions.exitMP());
  }

  let flag = true;
  let stateRender = "Your Turn";

  if (!turn) {
    stateRender = "Enemy Turn";
  }

  if (state != "Waiting" && turn != false) {
    flag = false;
  }

  let winner = null;

  if (winnerNum === 1 && key === 1) {
    winner = name;
  } else if (winnerNum === 2 && key === 2) {
    winner = name;
  } else if (winnerNum === 1 && key === 2) {
    winner = enemyName;
  } else if (winnerNum === 2 && key === 1) {
    winner = enemyName;
  }

  return (
    <div>
      <Result
        name={name}
        enemyName={enemyName}
        client={symbol}
        enemySymbol={enemySymbol}
        winner={props.result}
      />
      <div>
        <Button state={flag} title="Rock" action={selectSymbol} />
        <Button state={flag} title="Paper" action={selectSymbol} />
        <Button state={flag} title="Scissors" action={selectSymbol} />
        <Button title="Exit" action={exitRoom} />
      </div>
      <h3>{`ROUND ${rounds}`}</h3>
      {winner && <h1>{`${winner} WON`}</h1>}
      {/* <h3>MULTIPLAYER ROOM</h3> */}
      {!winner && <h2>{state === "Waiting" ? state : stateRender}</h2>}
      <Room />
    </div>
  );
};

export default PvPRoom;
