import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import data, { dataActions } from "../../store/data";
import { client } from "../../App";

import Button from "../UI/Button";
import Room from "./Room.js";
import Result from "./Result";

const PvPRoom = () => {
  const [symbol, setSymbol] = useState("");
  const [botSymbol, setBotSymbol] = useState("");
  const [roundWinner, setRoundWinner] = useState(null);
  const state = useSelector((state) => state.data.state);
  const name = useSelector((state) => state.data.name);
  const enemyName = useSelector((state) => state.data.enemyName);
  const code = useSelector((state) => state.data.code);
  const rounds = useSelector((state) => state.data.rounds);
  const winner = useSelector((state) => state.data.winner);
  const turn = useSelector((state) => state.data.turn);

  const dispatch = useDispatch();

  function Message(type, data) {
    this.type = type;
    this.data = data;
  }

  let flag = true;
  let stateRender = "Your Turn";

  if(!turn){
    stateRender = "Enemy Turn";
  }

  if (state != "Waiting" && turn != false) {
    flag = false;
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

  return (
    <div>
      <Result
        name={name}
        enemyName={enemyName}
        client={symbol}
        botSymbol={botSymbol}
        winner={roundWinner}
      />
      <div>
        <Button state={flag} title="Rock" action={selectSymbol} />
        <Button state={flag} title="Paper" action={selectSymbol} />
        <Button state={flag} title="Scissors" action={selectSymbol} />
        <Button title="Back" action={null} />
      </div>
      <h3>{`ROUND ${rounds}`}</h3>
      {winner && <h1>{`${winner ? name : enemyName} WON`}</h1>}
      <h3>MULTIPLAYER ROOM</h3>
      <h2>{state === "Waiting" ? state : stateRender}</h2>
      <Room />
    </div>
  );
};

export default PvPRoom;
