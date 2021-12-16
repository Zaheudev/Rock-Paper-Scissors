const express = require("express");
const WebSocketServer = require("websocket").server;
const http = require("http");
const indexRouter = require("./routes/routes");
const aiGame = require("./aiGame.js");
const mpGame = require("./mpGame.js");
const User = require("./User.js");
const Message = require("./message.js");

const PORT = process.env.PORT || 3001;
const app = express();

const server = http.createServer(app).listen(PORT);

var websockets = new Map();
var users = new Map();
var aiGames = new Map();
var mpGames = new Map();
var conId = 0;

app.get("/api", indexRouter);

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on("request", function (request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log(
      new Date() + " Connection from origin " + request.origin + " rejected."
    );
    return;
  }

  let con = request.accept("echo-protocol", request.origin);
  conId++;
  con.id = conId;
  websockets.set(con.id, con);
  console.log(`Connection ${con.id} accepted.`);

  con.on("message", function (message) {
    let msg = JSON.parse(message.utf8Data);
    console.log(msg);
    switch (msg.type) {
      case "playAI":
        let codeAI = generateCode(6);
        aiGames.set(
          codeAI,
          new aiGame(new User("George", con.id, con), codeAI)
        );
        users.set(con.id, aiGames.get(codeAI).getUser1());
        con.send(
          JSON.stringify(
            new Message("playWithBotConfirm", aiGames.get(codeAI)),
            getCircularReplacer()
          )
        );
        break;
      case "playMP":
        if (mpGames.size != 0) {
          let gameFound = false;
          for (const [id, game] of mpGames) {
            if (game.getUser2() === null && game.getState() === "Waiting") {
              gameFound = true;
              game.setUser2(new User("Daniel", con.id, con, false));
              users.set(con.id, game.getUser2());
              game.setState("Starting Game");
              con.send(
                JSON.stringify(
                  new Message("joinRoom", game),
                  getCircularReplacer()
                )
              );
              game
                .getUser1()
                .getWs()
                .send(
                  JSON.stringify(
                    new Message("enemyJoin", game),
                    getCircularReplacer()
                  )
                );
              console.log("Game found, joining room " + id);
              break;
            }
          }
          if (!gameFound) {
            console.log("No free game, creating new game");

            let codeMP = generateCode(6);
            mpGames.set(
              codeMP,
              new mpGame(new User("George", con.id, con, true), null, codeMP)
            );
            users.set(con.id, mpGames.get(codeMP).getUser1());
            con.send(
              JSON.stringify(
                new Message("playMpConfirm", mpGames.get(codeMP)),
                getCircularReplacer()
              )
            );
          }
        } else {
          let codeMP = generateCode(6);
          mpGames.set(
            codeMP,
            new mpGame(new User("George", con.id, con, true), null, codeMP)
          );
          users.set(con.id, mpGames.get(codeMP).getUser1());
          con.send(
            JSON.stringify(
              new Message("playMpConfirm", mpGames.get(codeMP)),
              getCircularReplacer()
            )
          );
        }
        break;
      case "ClientSymbolMP":
        let tempGame = mpGames.get(msg.data.code);
        let tempName = null;
        for (const [id, user] of users) {
          if (id === con.id) {
            if (user.getHisTurn()) {
              user.setSymbol(msg.data.symbol);
              user.setHisTurn(false);
              tempName = user.getName();
              for (const [id, user] of users) {
                if (user.getName() != tempName) {
                  user.setHisTurn(true);
                  user
                    .getWs()
                    .send(
                      JSON.stringify(
                        new Message("enemyTurned", user),
                        getCircularReplacer()
                      )
                    );
                }
              }
              user
                .getWs()
                .send(
                  JSON.stringify(
                    new Message("You Turned", user),
                    getCircularReplacer()
                  )
                );
            } else {
              console.log("HACKER");
            }
          }
        }
        break;
      case "ClientSymbolBOT":
        let result = gameBot(msg.data.symbol);
        let game = aiGames.get(msg.data.code);
        let winner = false;
        console.log(result);
        if (tempGame) {
          if (
            tempGame.rounds > 0 &&
            tempGame.getUser().getWinCounter() < 2 &&
            tempGame.rounds > 0 &&
            tempGame.getBot().getWinCounter() < 2
          ) {
            if (result.result === 1) {
              aiGames.get(msg.data.code).getUser().winner();
              console.log(`CLIENT WINS: ${tempGame.getUser().getWinCounter()}`);
            } else if (result.result === 2) {
              tempGame.getBot().winner();
              console.log(`BOT WINS: ${tempGame.getBot().getWinCounter()}`);
            } else {
              con.send(JSON.stringify(new Message("result", result)));
              console.log(tempGame.getRounds());
              break;
            }
            if (
              tempGame.getBot().getWinCounter() === 2 ||
              tempGame.getUser().getWinCounter() === 2
            ) {
              console.log("WINNER TRIGGER");
              if (tempGame.getUser().getWinCounter() === 2) {
                winner = true;
              }
              con.send(JSON.stringify(new Message("Winner", winner)));
              aiGames.delete(msg.data.code);
            }
            con.send(JSON.stringify(new Message("result", result)));
            tempGame.newRound(con, JSON.stringify(new Message("NewRound")));
            console.log(tempGame.getRounds());
          }
        }

        break;
      case "ExitBotRoom":
        console.log(aiGames.delete(msg.data));
        break;
    }
  });
  con.on("close", function (reasonCode, description) {});
});

function gameLogic(symbol1, symbol2) {
  //this function returns 1 if symbol 1 wins, 2 if symbol2 wins and 0 if it's draw
  if (symbol1 === "Rock" && symbol2 === "Scissors") {
    return 1;
  } else if (symbol1 === "Paper" && symbol2 === "Rock") {
    return 1;
  } else if (symbol1 === "Scissors" && symbol2 === "Paper") {
    return 1;
  } else if (symbol2 === "Paper" && symbol1 === "Rock") {
    return 2;
  } else if (symbol2 === "Scissors" && symbol1 === "Paper") {
    return 2;
  } else if (symbol2 === "Rock" && symbol1 === "Scissors") {
    return 2;
  } else {
    return 0;
  }
}

function gameBot(clientSymbol) {
  let botSymbol = generateSymbol();
  console.log(`Bot symbol is: ${botSymbol}`);
  const result = gameLogic(clientSymbol, botSymbol);
  return { result: result, botSymbol: botSymbol };
}

function generateSymbol() {
  let symbols = ["Rock", "Paper", "Scissors"];
  let num = Math.floor(Math.random() * 3 + 0);
  return symbols[num];
}

function generateCode(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getCircularReplacer() {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}

console.log("Server started on port " + PORT);
