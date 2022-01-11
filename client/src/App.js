import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./App.css";
import HomePage from "./components/Home/HomePage";
import BotRoom from "./components/Rooms/BotRoom";
import { pageActions } from "./store/page.js";
import { dataActions } from "./store/data.js";
import { authActions } from "./store/auth.js";
import PvPRoom from "./components/Rooms/PvPRoom";
import Authenticate from "./components/Authentication/Authenticate";
import backgroundImage1 from "../src/assets/background1.png";
import backgroundImage2 from "../src/assets/background2.png";
import ReconnectingWebSocket from "reconnecting-websocket";

export var client = new ReconnectingWebSocket(
  "wss://cryptongames.net/server",
  "echo-protocol",
  {
    reconnectInterval: 50,
    minReconnectionDelay: 0,
    reconnectionDelayGrowFactor: 100,
  }
);

export class Message {
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }
}

const App = () => {
  const isPlayingBot = useSelector((state) => state.page.isPlayingAI);
  const isPlayingMP = useSelector((state) => state.page.isPlayingMP);
  const homePage = useSelector((state) => state.page.homePage);
  const IsAuthenticated = useSelector((state) => state.auth.IsAuthenticated);
  const key = useSelector((state) => state.data.userKey);
  const [roundWinner, setRoundWinner] = useState(null);
  const [status, setStatus] = useState("CONNECTING...");
  const dispatch = useDispatch();

  client.onerror = function () {
    console.log("Connection Error");
    setStatus("connection failed, be patient. Reconnecting...");
  };

  client.onopen = function () {
    console.log("WebSocket Client Connected");
    setStatus("connected to server");
  };

  client.onclose = function () {
    console.log("echo-protocol Client Closed");
    setStatus("connection failed, , be patient. Reconnecting...");
  };

  client.onmessage = function (message) {
    let msg = JSON.parse(message.data);
    console.log(msg);
    switch (msg.type) {
      default:
        break;
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
        if (key === 2) {
          dispatch(dataActions.setEnemySymbol(msg.data.game.user1.symbol));
        } else if (key === 1) {
          dispatch(dataActions.setEnemySymbol(msg.data.game.user2.symbol));
        }
        if (msg.data.result === 1) {
          dispatch(dataActions.winUser1());
          dispatch(dataActions.newRound());
          setRoundWinner(msg.data.result);
        } else if (msg.data.result === 2) {
          dispatch(dataActions.winUser2());
          dispatch(dataActions.newRound());
          setRoundWinner(msg.data.result);
        } else {
          setRoundWinner(msg.data.result);
          dispatch(dataActions.newRound());
        }
        break;
      case "GameWon":
        dispatch(dataActions.setWinner(msg.data.user));
        break;
      case "GameLost":
        dispatch(dataActions.setWinner(msg.data.user));
        break;
      case "RegisterFail":
        dispatch(authActions.setError("Username already in use"));
        break;
      case "RegisterValidated":
        dispatch(authActions.setIsRegisterPage(false));
        break;
      case "CorrectData":
        dispatch(authActions.login(msg.data));
        dispatch(pageActions.setHomePage());
        break;
      case "WrongCredentials":
        dispatch(authActions.setError("Credentials wrong"));
        break;
    }
  };

  const sendBotMsj = () => {
    client.send(
      JSON.stringify(new Message("playAI", localStorage.getItem("username")))
    );
  };

  const sendMultiplayerMsj = () => {
    client.send(
      JSON.stringify(new Message("playMP", localStorage.getItem("username")))
    );
  };

  const sendCreateRoomMsj = () => {
    client.send(
      JSON.stringify(
        new Message("createRoom", localStorage.getItem("username"))
      )
    );
  };

  const changeScreenBot = () => {
    dispatch(pageActions.joinBot());
  };

  const changeScreenMP = () => {
    dispatch(pageActions.joinMP());
  };

  const logOut = () => {
    dispatch(authActions.logout());
    dispatch(pageActions.exitHomePage());
  };

  let flag = <Authenticate />;

  if (localStorage.getItem("auth") === "true") {
    dispatch(pageActions.setHomePage());
  }

  let bg = backgroundImage1;

  if (isPlayingBot) {
    flag = <BotRoom />;
    bg = backgroundImage2;
  } else if (isPlayingMP) {
    flag = <PvPRoom result={roundWinner} />;
    bg = backgroundImage2;
  } else if (homePage) {
    flag = (
      <HomePage
        logOut={logOut}
        sendMpData={sendMultiplayerMsj}
        sendBotData={sendBotMsj}
        createRoom={sendCreateRoomMsj}
      />
    );
    bg = backgroundImage2;
  } else if (!IsAuthenticated && localStorage.getItem("auth") === "false") {
    flag = <Authenticate />;
  }

  const insertData = (name, code, enemyName, key, state, turn) => {
    dispatch(dataActions.setName(name));
    dispatch(dataActions.setCode(code));
    dispatch(dataActions.setEnemyName(enemyName));
    dispatch(dataActions.setUserKey(key));
    dispatch(dataActions.setState(state));
    dispatch(dataActions.setTurn(turn));
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
        backgroundRepeat: `no-repeat`,
        backgroundSize: `100% 100%`,
      }}
      className="App"
    >
      {flag}
      <p>{status}</p>
    </div>
  );
};

export default App;

// I KNOW THE CODE IS A BITT MESSY BUT I LL FIX IN FUTURE VERSION (NOT ENOUGH TIME FOR CLEANUP CODE AND STUFF LIKE THAT) I FOCUSED ONLY ON MAKE IT WORK FOR DEMO
