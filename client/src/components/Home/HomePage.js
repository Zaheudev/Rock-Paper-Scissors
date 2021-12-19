import React, { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import Button from "../UI/Button";
import { authActions } from "../../store/auth";

import classes from "./HomePage.module.css";

import image from "../../assets/logo1.png";
import image2 from '../../assets/logo2.png';


const HomePage = (props) => {
  const [data, setData] = useState(null);
  const username = useSelector((state) => state.auth.username);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div>
      <header>
        <div>
          <img draggable="false" src={image}></img>
          {/* <h1>HOME PAGE</h1> */}
        </div>
      </header>
      <div className={classes.page}>
        <Button title={"Play Now!"} action={props.sendBotData} />
        <Button title={"Join Room!"} action={props.sendMpData} />
        <Button title={"Log Out"} action={props.logOut} />
      </div>
      <footer>
        <p>{`You are logged as ${username}`}</p>
      </footer>
    </div>
  );
};

export default HomePage;
