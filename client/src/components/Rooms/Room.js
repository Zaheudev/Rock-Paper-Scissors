import React from "react";
import { useSelector } from "react-redux";

import classes from "./Room.module.css";

const Room = (props) => {
  const user2Wins = useSelector((state) => state.data.user2Count);
  const user1Wins = useSelector((state) => state.data.user1Count);
  const key = useSelector((state) => state.data.userKey);
  const rounds = useSelector((state) => state.data.rounds);

  let enemyResult = null;
  let userResult = null;

  if (key === 2) {
    userResult = `${user2Wins}`;
    enemyResult = `${user1Wins}`;
  } else if (key === 1) {
    userResult = `${user1Wins}`;
    enemyResult = `${user2Wins}`;
  }

  return (
    <div className={classes.outter}>
      <h3>{`ROUND ${rounds}`}</h3>
      <div className={classes.room}>
        <h1 className={classes.purple}>{enemyResult}</h1>
        <h1>:</h1>
        <h1>{userResult}</h1>
      </div>
    </div>
  );
};

export default Room;
