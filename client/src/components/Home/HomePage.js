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
      <button onClick={props.sendData}>Play Now!</button>
      <button>Join Room!</button>
      <p>{!data ? "Loading..." : data}</p>
    </Fragment>
  );
};

export default HomePage;
