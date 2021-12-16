import React, { useState, useEffect, Fragment } from "react";

const HomePage = (props) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <Fragment>
      <button onClick={props.sendBotData}>Play Now!</button>
      <button onClick={props.sendMpData}>Join Room!</button>
      <p>{!data ? "Loading..." : data}</p>
    </Fragment>
  );
};

export default HomePage;
