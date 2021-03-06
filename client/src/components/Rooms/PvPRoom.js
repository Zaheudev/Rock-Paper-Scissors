import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { dataActions } from "../../store/data";
import { pageActions } from "../../store/page";
import { client } from "../../App";

import Button from "../UI/Button";
import ButtonsContainer from "../UI/ButtonsContainer";
import Room from "./Room.js";
import Result from "./Result";

import classes from "./PvPRoom.module.css";
import purpleClass from "./Room.module.css";

import rock from "../../assets/rock1.png";
import paper from "../../assets/paper1.png";
import scissors from "../../assets/scissors1.png";

import enemyRock from "../../assets/rock2.png";
import enemyPaper from "../../assets/paper2.png";
import enemyScissors from "../../assets/scissors2.png";

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

  const selectRock = (e) => {
    setSymbol("Rock");
    client.send(
      JSON.stringify(
        new Message("ClientSymbolMP", {
          symbol: "Rock",
          code: code,
          name: name,
        })
      )
    );
  };

  const selectPaper = (e) => {
    setSymbol("Paper");
    client.send(
      JSON.stringify(
        new Message("ClientSymbolMP", {
          symbol: "Paper",
          code: code,
          name: name,
        })
      )
    );
  };

  const selectScissors = (e) => {
    setSymbol("Scissors");
    client.send(
      JSON.stringify(
        new Message("ClientSymbolMP", {
          symbol: "Scissors",
          code: code,
          name: name,
        })
      )
    );
  };

  const exitRoom = (e) => {
    client.send(
      JSON.stringify(new Message("ExitMPRoom", { user: key, code: code }))
    );
    dispatch(dataActions.clear());
    dispatch(pageActions.exitMP());
  };

  const playAgainAction = () => {
    dispatch(dataActions.clear());
    client.send(
      JSON.stringify(new Message("playMP", localStorage.getItem("username")))
    );
  }

  let stateRender = "Your Turn";

  if (!turn) {
    stateRender = "Enemy Turn";
  }

  let winner = null;

  let flagClass = purpleClass.purple;

  if (winnerNum === 1 && key === 1) {
    winner = name;
    flagClass = null;
  } else if (winnerNum === 2 && key === 2) {
    winner = name;
    flagClass = null;
  } else if (winnerNum === 1 && key === 2) {
    winner = enemyName;
  } else if (winnerNum === 2 && key === 1) {
    winner = enemyName;
  }

  let disable = false;

  if (state === "Waiting") {
    disable = true;
  } else if (stateRender === "Enemy Turn" || winner) {
    disable = true;
  }

  return (
    <React.Fragment>
      <h2 className={purpleClass.purple}>{enemyName}</h2>
      <ButtonsContainer
        state={disable}
        symbolScissors={enemyScissors}
        symbolPaper={enemyPaper}
        symbolRock={enemyRock}
        color={"purple"}
      />
      <h3>{`ROUND ${rounds}`}</h3>
      <div>
        <div className={classes.page}>
          <Result
            name={name}
            enemyName={enemyName}
            client={symbol}
            enemySymbol={enemySymbol}
            winner={props.result}
          />
        </div>

        {winner && <h1 className={flagClass}>{`${winner} WON`}</h1>}
        <div className={classes.buttons}>
          <ButtonsContainer
            state={disable}
            symbolScissors={scissors}
            symbolPaper={paper}
            symbolRock={rock}
            actionRock={selectRock}
            actionPaper={selectPaper}
            actionScissors={selectScissors}
          />
        </div>
        {!winner && (
          <h2>
            {state === "Waiting" ? `${state} For Player...` : stateRender}
          </h2>
        )}
        <h2>{`YOU ARE ${name}`}</h2>
        <h3>{`CODE: ${code}`}</h3>
        <Button title="Exit" action={exitRoom} />
        <div className={classes.room}>
          <Room function={playAgainAction}/>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PvPRoom;
