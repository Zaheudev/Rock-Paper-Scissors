import React from "react";
import { useSelector, useDispatch } from "react-redux";

import "./App.css";
import HomePage from "./components/Home/HomePage";
import Room from "./components/Rooms/Room";
import { pageActions } from "./store/page.js";
import { dataActions } from "./store/data.js";

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
  const isPlaying = useSelector((state) => state.page.isPlaying);
  const dispatch = useDispatch();

  client.onmessage = function (message) {
    let msg = JSON.parse(message.data);
    console.log(msg);
    if (msg.type === "playWithBotConfirm") {
      insertData(msg.data.user.name, msg.data.id);
      changeScreen();
    }
  };

  const sendData = () => {
    client.send(JSON.stringify(new Message("play")));
  };

  const changeScreen = () => {
    dispatch(pageActions.join());
  };

  const insertData = (name, code) => {
    dispatch(dataActions.setName(name));
    dispatch(dataActions.setCode(code));
  };

  return (
    <div className="App">
      {!isPlaying ? <HomePage sendData={sendData} /> : <Room />}
    </div>
  );
};

export default App;
