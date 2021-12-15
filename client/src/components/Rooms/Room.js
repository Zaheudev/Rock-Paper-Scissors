import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { pageActions } from "../../store/page.js";

import BotRoom from "./BotRoom.js";
import { client } from "../../App.js";
import { Message } from "../../App.js";

const Room = (props) => {
  const dispatch = useDispatch();

  const botWins = useSelector((state) => state.data.user2Count);
  const playerWins = useSelector((state) => state.data.user1Count);
  const name = useSelector((state) => state.data.name);

  const exitRoom = () => {
    dispatch(pageActions.exit());
    client.send(JSON.stringify(new Message("quit")));
  };

  return (
    <React.Fragment>
      <BotRoom exit={exitRoom} />
      <p>{`BOT WINS: ${botWins}`}</p>
      <p>{`${name} WINS: ${playerWins}`}</p>
    </React.Fragment>
  );
};

export default Room;
