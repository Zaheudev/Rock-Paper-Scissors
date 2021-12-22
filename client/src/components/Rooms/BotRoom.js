import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { client } from "../../App";
import Result from "./Result";
import { dataActions } from "../../store/data";
import { pageActions } from "../../store/page.js";
import Button from "../UI/Button";
import Room from "./Room";
import classes from "./BotRoom.module.css";

import rock from "../../assets/rock.png";
import paper from "../../assets/paper.png";
import scissors from "../../assets/scissors.png";
import ButtonImage from "../UI/ButtonImage";

const BotRoom = (props) => {
  const [symbol, setSymbol] = useState("");
  const [roundWinner] = useState(null);
  const [button, setButton] = useState(false);
  const name = useSelector((state) => state.data.name);
  const enemySymbol = useSelector((state) => state.data.enemySymbol);
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
      default:
        break;
      case "result":
        console.log(msg.data);
        if (msg.data.result === 1) {
          dispatch(dataActions.winUser1());
        } else if (msg.data.result === 2) {
          dispatch(dataActions.winUser2());
        }
        dispatch(dataActions.setEnemySymbol(msg.data.botSymbol));
        break;
      case "Winner":
        setButton(true);
        dispatch(dataActions.setWinner(msg.data));
        break;
      case "NewRound":
        dispatch(dataActions.newRound());
    }
  };

  const selectRock = (e) => {
    setSymbol("Rock");
    client.send(
      JSON.stringify(
        new Message("ClientSymbolBOT", {
          symbol: "Rock",
          code: code,
        })
      )
    );
  };

  const selectPaper = (e) => {
    setSymbol("Paper");
    client.send(
      JSON.stringify(
        new Message("ClientSymbolBOT", {
          symbol: "Paper",
          code: code,
        })
      )
    );
  };

  const selectScissors = (e) => {
    setSymbol("Scissors");
    client.send(
      JSON.stringify(
        new Message("ClientSymbolBOT", {
          symbol: "Scissors",
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
      <h3>{`ROUND ${rounds}`}</h3>
      <div className={classes.page}>
        <Result
          name={name}
          enemyName={enemyName}
          client={symbol}
          enemySymbol={enemySymbol}
          winner={roundWinner}
        />
        {button && <h1>{`${winner ? name : enemyName} WON`}</h1>}
      </div>
      <div className={classes.buttons}>
        <ButtonImage state={winner} symbol={rock} action={selectRock} />
        <ButtonImage state={winner} symbol={paper} action={selectPaper} />
        <ButtonImage state={winner} symbol={scissors} action={selectScissors} />
      </div>
      <h2>{`YOU ARE ${name}`}</h2>
      <Button title="Exit" action={exitRoom} />
      <div className={classes.room}>
        <Room />
      </div>
    </React.Fragment>
  );
};

export default BotRoom;
