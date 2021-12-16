import React from "react";
import { useSelector } from "react-redux";

const Room = (props) => {

  const botWins = useSelector((state) => state.data.user2Count);
  const playerWins = useSelector((state) => state.data.user1Count);
  const name = useSelector((state) => state.data.name);

  return (
    <React.Fragment>
      <div>
        <p>{`BOT WINS: ${botWins}`}</p>
        <p>{`${name} WINS: ${playerWins}`}</p>
      </div>
    </React.Fragment>
  );
};

export default Room;
