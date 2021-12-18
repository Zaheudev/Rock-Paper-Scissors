import React from "react";
import { useSelector } from "react-redux";

const Room = (props) => {
  const user2Wins = useSelector((state) => state.data.user2Count);
  const user1Wins = useSelector((state) => state.data.user1Count);
  const name = useSelector((state) => state.data.name);
  const enemyName = useSelector((state) => state.data.enemyName);
  const key = useSelector((state) => state.data.userKey);

  let enemyResult = null;
  let userResult = null;

  if (key === 2) {
    userResult = `${name} WINS: ${user2Wins}`;
    enemyResult = `${enemyName} WINS: ${user1Wins}`;
  } else if (key === 1) {
    userResult = `${name} WINS: ${user1Wins}`;
    enemyResult = `${enemyName} WINS: ${user2Wins}`;
  }

  return (
    <React.Fragment>
      <div>
        <p>{enemyResult}</p>
        <p>{userResult}</p>
        <h2>{`YOU ARE ${name}`}</h2>
      </div>
    </React.Fragment>
  );
};

export default Room;
