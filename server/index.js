const express = require("express");
const WebSocketServer = require("websocket").server;
const http = require("http");
const indexRouter = require("./routes/routes");
const aiGame = require("./aiGame.js");
const mpGame = require("./mpGame.js");
const User = require("./User.js");
const Message = require("./message.js");
const sqlite3 = require('sqlite3').verbose();

const PORT = process.env.PORT || 3001;
const app = express();

const server = http.createServer(app).listen(PORT);

var websockets = new Map();
var users = new Map();
var aiGames = new Map();
var mpGames = new Map();
var usersLogged = new Map();
var conId = 0;

app.get("/api", indexRouter);

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

var db = new sqlite3.Database('./storage.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) =>{
  if(err) {
    console.error(err.message);
  }
  console.log("connected to db");
});

db.serialize(() => {
  db.run('create table if not exists users(_id integer primary key, name text not null unique, password integer not null);');
  db.each('select * from users', (err, row) =>{
    console.log(row._id + "|" + row.name + "|" + row.password + "|" + row.counter);
  });
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
        let codeAI = generateCode(4);
        aiGames.set(
          codeAI,
          new aiGame(new User(msg.data, con.id, con, 1), codeAI)
        );
        users.set(con.id, aiGames.get(codeAI).getUser());
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
            if (game.getUser2() === null && game.getState() === "Waiting" && !game.getPrivate()) {
                if(game.getUser1().getName() !== msg.data){
                  gameFound = true;
                  game.setUser2(new User(msg.data, con.id, con, false, 2));
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
              }else {
                console.log("Same client!");
              }
            }
          }
          if (!gameFound) {
            console.log("No free game, creating new game");

            let codeMP = generateCode(4);
            mpGames.set(
              codeMP,
              new mpGame(new User(msg.data, con.id, con, true, 1), null, codeMP)
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
          let codeMP = generateCode(4);
          mpGames.set(
            codeMP,
            new mpGame(new User(msg.data, con.id, con, true, 1), null, codeMP)
          );
          users.set(con.id, mpGames.get(codeMP).getUser1());
          con.send(
            JSON.stringify(
              new Message("playMpConfirm", mpGames.get(codeMP)),
              getCircularReplacer()
            )
          );
          console.log(codeMP);
        }
        break;
      case "createRoom":
        console.log("Creating room...");
        let codeMP = generateCode(4);
        mpGames.set(
          codeMP,
          new mpGame(new User(msg.data, con.id, con, true, 1), null, codeMP, true)
        );
        users.set(con.id, mpGames.get(codeMP).getUser1());
        con.send(
          JSON.stringify(
            new Message("playMpConfirm", mpGames.get(codeMP)),
            getCircularReplacer()
          )
        );
        break;
      case "ClientSymbolMP":
        let tempGame = mpGames.get(msg.data.code);
        let tempName = null;
        if (tempGame) {
          for (const [id, user] of users) {
            if (id === con.id) {
              if (user.getHisTurn()) {
                if (user.getSymbol() === null) {
                  user.setSymbol(msg.data.symbol);
                  user.setHisTurn(false);
                  tempName = user.getName();
                  console.log(
                    `${user.getName()} HAS SYMBOL ${user.getSymbol()}`
                  );
                  for (const [id, user] of users) {
                    if (user.getSymbol() === null) {
                      if (user.getName() !== tempName) {
                        user.setHisTurn(true);
                        user.getWs().send(JSON.stringify(new Message("enemyTurned", user),getCircularReplacer()));
                        console.log(
                          `${user.getName()} HAS SYMBOL ${user.getSymbol()}`
                        );
                      }
                    } else {
                      if (user.getName() !== tempName) {
                        let user1 = tempGame.getUser1();
                        let user2 = tempGame.getUser2();
                        if(user1 && user2){
                          if(
                            tempGame.getRounds() > 0 &&
                            user1.getWinCounter() < 2 &&
                            tempGame.getRounds() > 0 &&
                            user2.getWinCounter() < 2
                          ){
                            console.log("END ROUND");
                            let roundResult = gameLogic(user1.getSymbol(), user2.getSymbol());
                            user.setHisTurn(true);
                            user1.getWs().send(JSON.stringify(new Message("RoundEnded", {game: tempGame, result: roundResult}),getCircularReplacer()));
                            user2.getWs().send(JSON.stringify(new Message("RoundEnded", {game: tempGame, result: roundResult}),getCircularReplacer()));
                            user.getWs().send(JSON.stringify(new Message("enemyTurned", user),getCircularReplacer()));
                            user1.setSymbol(null);
                            user2.setSymbol(null);

                            if(roundResult === 1){
                              user1.getWs().send(JSON.stringify(new Message("Round Won")));
                              user2.getWs().send(JSON.stringify(new Message("Round Lost")));
                              tempGame.newRound();

                              user1.winner();
                            }else if(roundResult === 2){
                              user2.getWs().send(JSON.stringify(new Message("Round Won")));
                              user1.getWs().send(JSON.stringify(new Message("Round Lost")));
                              tempGame.newRound();
                              user2.winner();
                            }

                            if(user1.getWinCounter() === 2){
                              user1.getWs().send(JSON.stringify(new Message("GameWon", {game: tempGame, user: 1}), getCircularReplacer()));
                              user2.getWs().send(JSON.stringify(new Message("GameLost", {game: tempGame, user: 1}), getCircularReplacer()));
                              increaseWin(user1.getName());
                              console.log(mpGames.delete(msg.data.code));
                            }else if(user2.getWinCounter() === 2){
                              user2.getWs().send(JSON.stringify(new Message("GameWon", {game: tempGame, user: 2}), getCircularReplacer()));
                              user1.getWs().send(JSON.stringify(new Message("GameLost", {game: tempGame, user: 2}), getCircularReplacer()));
                              increaseWin(user2.getName());
                              console.log(mpGames.delete(msg.data.code));
                            }
                          }                        
                        }
                      }  
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
                }
              } else {
                console.log("HACKER");
              }
            }
          }
        }

        break;
      case "ClientSymbolBOT":
        let result = gameBot(msg.data.symbol);
        let game = aiGames.get(msg.data.code);
        let winner = false;
        console.log(result);
        if (game) {
          if (
            game.getRounds() > 0 &&
            game.getUser().getWinCounter() < 2 &&
            game.getRounds() > 0 &&
            game.getBot().getWinCounter() < 2
          ) {
            if (result.result === 1) {
              aiGames.get(msg.data.code).getUser().winner();
              console.log(`CLIENT WINS: ${game.getUser().getWinCounter()}`);
            } else if (result.result === 2) {
              game.getBot().winner();
              console.log(`BOT WINS: ${game.getBot().getWinCounter()}`);
            } else {
              con.send(JSON.stringify(new Message("result", result)));
              console.log(game.getRounds());
              break;
            }
            if (
              game.getBot().getWinCounter() === 2 ||
              game.getUser().getWinCounter() === 2
            ) {
              console.log("WINNER TRIGGER");
              if (game.getUser().getWinCounter() === 2) {
                winner = true;
              }
              con.send(JSON.stringify(new Message("Winner", winner)));
              aiGames.delete(msg.data.code);
            }
            con.send(JSON.stringify(new Message("result", result)));
            game.newRound(con, JSON.stringify(new Message("NewRound")));
            console.log(game.getRounds());
          }
        }

        break;
      case "ExitBotRoom":
        console.log(aiGames.delete(msg.data));
        break;
      case "ExitMPRoom":
          let room = mpGames.get(msg.data.code);
          if(room && room.getState() != "Waiting"){
            if(msg.data.user === 1){
              room.getUser2().getWs().send(JSON.stringify(new Message("GameWon", {user: 2}), getCircularReplacer()));
            }else if(msg.data.user === 2){
              room.getUser1().getWs().send(JSON.stringify(new Message("GameWon", {user: 1}), getCircularReplacer()));
            }
        }
        mpGames.delete(msg.data.code);
        break;
      case "Register":
        db.run('INSERT INTO users(name, password, counter) VALUES(?, ?, ?)', [msg.data.username, msg.data.password, 0], (err) => {
          if(err) {
            con.send(JSON.stringify(new Message("RegisterFail")));
            return;
          }
          console.log(`User ${msg.data.username} was added to database`);
          con.send(JSON.stringify(new Message("RegisterValidated")));
        });
        break;
      case "LoginIn":
        let flag = false;
        db.each('select * from users', (err, row) =>{
          console.log(row);
          if(row.name === msg.data.username && row.password.toString() === msg.data.password){
            flag = true;
            console.log("CORRECT DATA");
            con.send(JSON.stringify(new Message("CorrectData", msg.data.username)));
            usersLogged.set(con.id, msg.data.username);
          }
        });
        if(!flag){
          con.send(JSON.stringify(new Message("WrongCredentials")));
        }
        break;
      case "JoinWithCode":
        let gm = mpGames.get(msg.data.code);
        if(gm){
          if(gm.getUser2() != null){
            break;
          }
          gm.setUser2(new User(msg.data.name, con.id, con, false, 2));
          users.set(con.id, gm.getUser2());
          gm.setState("Starting Game");
          con.send(
            JSON.stringify(
              new Message("joinRoom", gm),
              getCircularReplacer()
            )
          );
          gm
            .getUser1()
            .getWs()
            .send(
              JSON.stringify(
                new Message("enemyJoin", gm),
                getCircularReplacer()
              )
            );
          break;
        }
        break;
    }
  });

  con.on("close", function (reasonCode, description) {
    console.log(`Connection ${con.id} left`);
    for(const[key, game] of mpGames) {
      if(game.getUser2() != null){
        if(game.getUser1().getId() === con.id || game.getUser2().getId() === con.id){
          if(game.getUser1().getId() === con.id){
            game.getUser2().getWs().send(JSON.stringify(new Message("GameWon", {user: 2}), getCircularReplacer()));
          }else if(game.getUser2().getId() === con.id){
            game.getUser1().getWs().send(JSON.stringify(new Message("GameWon", {user: 1}), getCircularReplacer()));
          }
          users.delete(con.id);
          mpGames.delete(key);
        }
      }else {
        users.delete(con.id);
        mpGames.delete(key);
      }
    }
  });
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
    "01234567890123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function increaseWin(user){
  db.run(`update users set counter=counter+1 where name="${user}";`);
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
