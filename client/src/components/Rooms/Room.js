import React from "react";
import { useSelector } from "react-redux";
import Button from "../UI/Button";

import binanceImg from '../../assets/binance.png';
import classes from "./Room.module.css";

const Room = (props) => {
  const user2Wins = useSelector((state) => state.data.user2Count);
  const user1Wins = useSelector((state) => state.data.user1Count);
  const key = useSelector((state) => state.data.userKey);
  const rounds = useSelector((state) => state.data.rounds);

  let enemyResult = null;
  let userResult = null;
  let showButton = false;

  if (key === 2) {
    userResult = `${user2Wins}`;
    enemyResult = `${user1Wins}`;
  } else if (key === 1) {
    userResult = `${user1Wins}`;
    enemyResult = `${user2Wins}`;
  }

  if (user1Wins >= 2 || user2Wins >= 2) {
    showButton = true;
  }

  return (
    <React.Fragment>
      <div className={classes.outter}>
        <h3>{`ROUND ${rounds}`}</h3>
        <div className={classes.room}>
          <h1 className={classes.purple}>{enemyResult}</h1>
          <h1>:</h1>
          <h1>{userResult}</h1>
        </div>
        {showButton && (
          <Button title="Play Again!" action={props.function}></Button>
        )}
      </div>
      <div className={classes.outterContainer}>
        <div className={classes.container}>
          <h2>Balance</h2>
          <p>0.00 <img src={binanceImg} alt="binance-logo" width="35" height="35"></img></p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Room;
