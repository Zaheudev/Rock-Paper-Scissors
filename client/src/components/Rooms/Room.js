import React from "react";
import { useSelector } from "react-redux";

const Room = (props) => {

  const botWins = useSelector((state) => state.data.user2Count);
  const playerWins = useSelector((state) => state.data.user1Count);
  const name = useSelector((state) => state.data.name);
  const enemyName = useSelector((state) => state.data.enemyName);

  return (
    <React.Fragment>
      <div>
        <p>{`${enemyName} WINS: ${botWins}`}</p>
        <p>{`${name} WINS: ${playerWins}`}</p>
        <h2>{`YOU ARE ${name}`}</h2>
      </div>
    </React.Fragment>
  );
};

export default Room;
