import React from "react";

import Room from './Room.js'

const PvPRoom = () => {
  return (
    <div>
      {/* <Result client={symbol} botSymbol={botSymbol} winner={roundWinner} />
      <div>
        <Button state={button} title="Rock" action={selectSymbol} />
        <Button state={button} title="Paper" action={selectSymbol} />
        <Button state={button} title="Scissors" action={selectSymbol} />
        <Button title="Back" action={exitRoom} />
      </div> */}
      {/* <h3>{`ROUND ${rounds}`}</h3> */}
      {/* {button && <h1>{`${winner ? "GEORGE" : "BOT"} WON`}</h1>} */}
      <h1>MULTIPLAYER ROOM</h1>
      <Room />
    </div>
  );
};

export default PvPRoom;
