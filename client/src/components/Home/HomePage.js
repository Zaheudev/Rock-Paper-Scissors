import React from "react";
import { useSelector } from "react-redux";
import Button from "../UI/Button";
import classes from "./HomePage.module.css";

import image from "../../assets/logo1.png";
import Modal from "../UI/Modal";
import CodeForm from "./CodeForm";

const HomePage = (props) => {
  const username = useSelector((state) => state.auth.username);

  return (
    <div>
      <header>
        <div>
          <img alt="logo" draggable="false" src={image}></img>
          <Modal />
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
