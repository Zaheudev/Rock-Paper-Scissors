import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { client } from "../../App";
import Result from "./Result";
import data, { dataActions } from "../../store/data";
import { pageActions } from "../../store/page.js";
import Button from "../UI/Button";
import Room from "./Room";

const BotRoom = (props) => {
  const [symbol, setSymbol] = useState("");
  const [enemySymbol, setEnemySymbol] = useState("");
  const [roundWinner, setRoundWinner] = useState(null);
  const [button, setButton] = useState(false);
  const name = useSelector((state) => state.data.name);
  const enemyName = useSelector((state) => state.data.enemyName);
  const code = useSelector((state) => state.data.code);
  const rounds = useSelector((state) => state.data.rounds);
  const winner = useSelector((state) => state.data.winner);

  const dispatch = useDispatch();

  function Message(type, data) {
    this.type = type;
    this.data = data;
  }
  
  client.onmessage = function (message) {
    let msg = JSON.parse(message.data);
    console.log(msg);
    switch (msg.type) {
      case "result":
        console.log(msg.data);
        if (msg.data.result === 1) {
          dispatch(dataActions.winUser1());
        } else if (msg.data.result === 2) {
          dispatch(dataActions.winUser2());
        }
        setEnemySymbol(msg.data.botSymbol);
        setRoundWinner(msg.data.result);
        break;
      case "Winner":
        setButton(true);
        dispatch(dataActions.setWinner(msg.data));
        break;
      case "NewRound":
        dispatch(dataActions.newRound());
    }
  };

  const selectSymbol = (e) => {
    setSymbol(e.target.innerHTML);
    client.send(
      JSON.stringify(
        new Message("ClientSymbolBOT", {
          symbol: e.target.innerHTML,
          code: code,
        })
      )
    );
  };

  const exitRoom = () => {
    client.send(JSON.stringify(new Message("ExitBotRoom", code)));
    dispatch(dataActions.clear());
    dispatch(pageActions.exitBot());
  };

  return (
    <React.Fragment>
      <div>
        <Result name={name} enemyName={enemyName} client={symbol} enemySymbol={enemySymbol} winner={roundWinner} />
        <div>
          <Button state={button} title="Rock" action={selectSymbol} />
          <Button state={button} title="Paper" action={selectSymbol} />
          <Button state={button} title="Scissors" action={selectSymbol} />
          <Button title="Back" action={exitRoom} />
        </div>
        <h3>{`ROUND ${rounds}`}</h3>
        {button && <h1>{`${winner ? name : enemyName} WON`}</h1>}
      </div>
      <Room/>
    </React.Fragment>
  );
};

export default BotRoom;
