import React, { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import Button from "../UI/Button";
import { authActions } from "../../store/auth";

import classes from "./HomePage.module.css";

import image from "../../assets/logo1.png";
import image2 from "../../assets/logo2.png";
import Modal from "../UI/Modal";
import CodeForm from "./CodeForm";

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
          <Modal />

          {/* <h1>HOME PAGE</h1> */}
        </div>
      </header>
      <div className={classes.page}>
        <Button title={"Play vs AI!"} action={props.sendBotData} />
        <Button title={"Play vs Stranger!"} action={props.sendMpData} />
        <Button title={"Join With Code!"} type={"submit"} action={null} form={"codeForm"}/>
        <CodeForm name={username}/>
        <Button title={"Log Out"} action={props.logOut} />
      </div>
      <footer>
        <p>{`You are logged as ${username}`}</p>
      </footer>
    </div>
  );
};

export default HomePage;
