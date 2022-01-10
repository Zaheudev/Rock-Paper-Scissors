import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { client } from "../../App";
import Result from "./Result";
import { dataActions } from "../../store/data";
import { pageActions } from "../../store/page.js";
import Button from "../UI/Button";
import Room from "./Room";
import classes from "./BotRoom.module.css";

import purpleClass from "./Room.module.css";

import rock from "../../assets/rock1.png";
import paper from "../../assets/paper1.png";
import scissors from "../../assets/scissors1.png";
import ButtonsContainer from "../UI/ButtonsContainer";

import enemyRock from "../../assets/rock2.png";
import enemyPaper from "../../assets/paper2.png";
import enemyScissors from "../../assets/scissors2.png";

const BotRoom = (props) => {
  const [symbol, setSymbol] = useState("");
  const [button, setButton] = useState(false);
  const name = useSelector((state) => state.data.name);
  const enemySymbol = useSelector((state) => state.data.enemySymbol);
  const enemyName = useSelector((state) => state.data.enemyName);
  const code = useSelector((state) => state.data.code);
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
        break;
      case "playWithBotConfirm":
        insertData(msg.data.user.name, msg.data.id, msg.data.bot.name, 1);
        break;
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

  const insertData = (name, code, enemyName, key) => {
    dispatch(dataActions.setName(name));
    dispatch(dataActions.setCode(code));
    dispatch(dataActions.setEnemyName(enemyName));
    dispatch(dataActions.setUserKey(key));
  };


  const exitRoom = () => {
    client.send(JSON.stringify(new Message("ExitBotRoom", code)));
    dispatch(dataActions.clear());
    dispatch(pageActions.exitBot());
  };

  const playAgainAction = () => {
    client.send(
      JSON.stringify(new Message("playAI", localStorage.getItem("username")))
    );
    setButton(false);
    setSymbol("");
    dispatch(dataActions.playAgainWithBot());
    
  };

  let classFlag = null;

  if (!winner) {
    classFlag = purpleClass.purple;
  }

  return (
    <React.Fragment>
      <h2 className={purpleClass.purple}>{enemyName}</h2>
      <ButtonsContainer
        color={"purple"}
        state={true}
        symbolScissors={enemyScissors}
        symbolPaper={enemyPaper}
        symbolRock={enemyRock}
        actionRock={null}
        actionPaper={null}
        actionScissors={null}
      />
      <div className={classes.page}>
        <Result
          name={name}
          enemyName={enemyName}
          client={symbol}
          enemySymbol={enemySymbol}
        />
        {button && (
          <h1 className={classFlag}>{`${winner ? name : enemyName} WON`}</h1>
        )}
      </div>

      <div className={classes.buttons}>
        <ButtonsContainer
          state={winner ? true : false}
          symbolScissors={scissors}
          symbolPaper={paper}
          symbolRock={rock}
          actionRock={selectRock}
          actionPaper={selectPaper}
          actionScissors={selectScissors}
        />
      </div>
      <h2>{`YOU ARE ${name}`}</h2>
      <Button title="Exit" action={exitRoom} />
      <div className={classes.room}>
        <Room function={playAgainAction} />
      </div>
    </React.Fragment>
  );
};

export default BotRoom;
