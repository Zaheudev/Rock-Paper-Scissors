import React, { useState } from "react";
import { useSelector } from "react-redux";
import Button from "../UI/Button";
import classes from "./HomePage.module.css";

import image from "../../assets/logo1-big.png";
import Modal from "../UI/Modal";
import CodeForm from "./CodeForm";
import { client, Message } from "../../App";

const HomePage = (props) => {
  const username = useSelector((state) => state.auth.username);
  const [showForm, setShowForm] = useState(false);

  const showFormButton = () => {
    if (showForm) {
      let form = document.getElementById('codeForm');
      let code = form.elements.code.value.trim();
      if (code.length === 4) {
        client.send(
          JSON.stringify(
            new Message("JoinWithCode", { code: code, name: username })
          )
        );
      }
      form.elements.code.value = "";
    }
    setShowForm(!showForm);
  };

  return (
    <div>
      <header>
        <div>
          <img alt="logo" draggable="false" src={image}></img>
          <Modal />
        </div>
      </header>
      <div className={classes.page}>
        <Button title={"Play vs Stranger!"} action={props.sendMpData} />
        <Button title={"Play vs BOT!"} action={props.sendBotData} />
        <Button
          title={"Join Room!"}
          action={showFormButton}
        />
        {showForm && <CodeForm name={username} />}
      </div>
      <footer>
        <p>{`You are logged as ${username}`}</p>
        <Button title={"Log Out"} action={props.logOut} />
      </footer>
    </div>
  );
};

export default HomePage;
