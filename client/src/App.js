import React from "react";
import { useSelector, useDispatch } from "react-redux";

import "./App.css";
import HomePage from "./components/Home/HomePage";
import BotRoom from "./components/Rooms/BotRoom";
import { pageActions } from "./store/page.js";
import { dataActions } from "./store/data.js";
import PvPRoom from "./components/Rooms/PvPRoom";

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
  const dispatch = useDispatch();

  client.onmessage = function (message) {
    let msg = JSON.parse(message.data);
    console.log(msg);
    switch (msg.type) {
      case "playWithBotConfirm":
        insertData(msg.data.user.name, msg.data.id, msg.data.bot.name);
        changeScreenBot();
        break;
      case "playMpConfirm":
        insertData(
          msg.data.user1.name,
          msg.data.id,
          null,
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
    flag = <PvPRoom />;
  }

  const insertData = (name, code, enemyName, state, turn) => {
    dispatch(dataActions.setName(name));
    dispatch(dataActions.setCode(code));
    dispatch(dataActions.setEnemyName(enemyName));
    dispatch(dataActions.setState(state));
    dispatch(dataActions.setTurn(turn));
  };

  return <div className="App">{flag}</div>;
};

export default App;
