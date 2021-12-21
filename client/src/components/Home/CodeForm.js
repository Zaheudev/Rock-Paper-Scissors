import React from "react";
import { client, Message } from "../../App";

const CodeForm = (props) => {
  const submit = (e) => {
    let code = e.target.elements.code.value.trim();
    e.preventDefault();
    if (code.length === 4) {
      client.send(JSON.stringify(new Message("JoinWithCode", {code: code, name: props.name})));
    }
  };

  return (
    <form onSubmit={submit} id="codeForm">
      <input type="number" placeholder="Code" id="code" />
    </form>
  );
};

export default CodeForm;
