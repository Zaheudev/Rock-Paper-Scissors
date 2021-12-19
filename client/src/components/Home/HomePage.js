import React, { useState, useEffect, Fragment } from "react";
import Button from "../UI/Button";

const HomePage = (props) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <Fragment>
      <Button title={"Play Now!"} action={props.sendBotData} />
      <Button title={"Join Room!"} action={props.sendMpData} />
      <Button title={"Log Out"} action={props.logOut} />
      <p>{!data ? "Loading..." : data}</p>
    </Fragment>
  );
};

export default HomePage;
