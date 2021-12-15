import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { client } from "../../App";
import Result from "./Result";
import data, { dataActions } from "../../store/data";
import Button from "../UI/Button";

const BotRoom = (props) => {
  const [symbol, setSymbol] = useState("");
  const [botSymbol, setBotSymbol] = useState("");
  const [roundWinner, setRoundWinner] = useState(null);
  const [button, setButton] = useState(false);
  const name = useSelector((state) => state.data.name);
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
        setBotSymbol(msg.data.botSymbol);
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
        new Message("ClientSymbolBOT", { symbol: e.target.innerHTML, code: code })
      )
    );
  };

  const exitRoom = () => {
    client.send(JSON.stringify(new Message("ExitBotRoom", code)));
    dispatch(dataActions.clear());
    props.exit();
  };

  return (
    <div>
      <Result client={symbol} botSymbol={botSymbol} winner={roundWinner} />
      <div>
        <Button state={button} title="Rock" action={selectSymbol} />
        <Button state={button} title="Paper" action={selectSymbol} />
        <Button state={button} title="Scissors" action={selectSymbol} />
        <Button title="Back" action={exitRoom} />
      </div>
      <h3>{`ROUND ${rounds}`}</h3>
      {button && <h1>{`${winner ? "GEORGE" : "BOT"} WON`}</h1>}
    </div>
  );
};

export default BotRoom;
