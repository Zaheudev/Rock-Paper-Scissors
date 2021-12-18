import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./App.css";
import HomePage from "./components/Home/HomePage";
import BotRoom from "./components/Rooms/BotRoom";
import { pageActions } from "./store/page.js";
import { dataActions } from "./store/data.js";
import { authActions } from "./store/auth.js";
import Login from "./components/Authentication/Login";
import Register from "./components/Authentication/Register";
import PvPRoom from "./components/Rooms/PvPRoom";
import Authenticate from "./components/Authentication/Authenticate";

var W3CWebSocket = require("websocket").w3cwebsocket;

export var client = new W3CWebSocket("ws://localhost:3001/", "echo-protocol");

client.onerror = function () {
  console.log("Connection Error");
};

client.onopen = function () {
  console.log("WebSocket Client Connected");
};

client.onclose = function () {
  console.log("echo-protocol Client Closed");
};

export function Message(type, data) {
  this.type = type;
  this.data = data;
}

const App = () => {
  const isPlayingBot = useSelector((state) => state.page.isPlayingAI);
  const isPlayingMP = useSelector((state) => state.page.isPlayingMP);
  const IsAuthenticated = useSelector((state) => state.auth.IsAuthenticated);
  const key = useSelector((state) => state.data.userKey);
  const [roundWinner, setRoundWinner] = useState(null);

  const dispatch = useDispatch();

  client.onmessage = function (message) {
    let msg = JSON.parse(message.data);
    console.log(msg);
    switch (msg.type) {
      case "playWithBotConfirm":
        insertData(msg.data.user.name, msg.data.id, msg.data.bot.name, 1);
        changeScreenBot();
        break;
      case "playMpConfirm":
        insertData(
          msg.data.user1.name,
          msg.data.id,
          null,
          1,
          msg.data.gameState,
          msg.data.user1.hisTurn
        );
        changeScreenMP();
        break;
      case "joinRoom":
        insertData(
          msg.data.user2.name,
          msg.data.id,
          msg.data.user1.name,
          2,
          msg.data.gameState,
          msg.data.user2.hisTurn
        );
        changeScreenMP();
        break;
      case "enemyJoin":
        insertData(
          msg.data.user1.name,
          msg.data.id,
          msg.data.user2.name,
          1,
          msg.data.gameState,
          msg.data.user1.hisTurn
        );
        break;
      case "You Turned":
        dispatch(dataActions.setTurn(false));
        break;
      case "enemyTurned":
        dispatch(dataActions.setTurn(true));
        break;
      case "RoundEnded":
        dispatch(dataActions.newRound());
        if (key === 2) {
          dispatch(dataActions.setEnemySymbol(msg.data.game.user1.symbol));
        } else if (key === 1) {
          dispatch(dataActions.setEnemySymbol(msg.data.game.user2.symbol));
        }
        if (msg.data.result === 1) {
          dispatch(dataActions.winUser1());
          setRoundWinner(msg.data.result);
        } else if (msg.data.result === 2) {
          dispatch(dataActions.winUser2());
          setRoundWinner(msg.data.result);
        }
      case "GameWon":
        dispatch(dataActions.setWinner(msg.data.user));
        break;
      case "GameLost":
        dispatch(dataActions.setWinner(msg.data.user));
        break;
    }
  };

  const sendBotMsj = () => {
    client.send(JSON.stringify(new Message("playAI")));
  };

  const sendMultiplayerMsj = () => {
    client.send(JSON.stringify(new Message("playMP")));
  };

  const changeScreenBot = () => {
    dispatch(pageActions.joinBot());
  };

  const changeScreenMP = () => {
    dispatch(pageActions.joinMP());
  };

  let flag = (
    <HomePage sendMpData={sendMultiplayerMsj} sendBotData={sendBotMsj} />
  );

  if (isPlayingBot) {
    flag = <BotRoom />;
  } else if (isPlayingMP) {
    flag = <PvPRoom result={roundWinner} />;
  }else if(!IsAuthenticated){
    flag = <Authenticate />
  }

  const insertData = (name, code, enemyName, key, state, turn) => {
    dispatch(dataActions.setName(name));
    dispatch(dataActions.setCode(code));
    dispatch(dataActions.setEnemyName(enemyName));
    dispatch(dataActions.setUserKey(key));
    dispatch(dataActions.setState(state));
    dispatch(dataActions.setTurn(turn));
  };

  return <div className="App">{flag}</div>;
};

export default App;
