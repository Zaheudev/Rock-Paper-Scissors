const User = require("./User");

function aiGame(user, id) {
  this.user = user;
  this.id = id;
  this.bot = new User("BOT", "AAAAAA", 0);
  this.rounds = 3;

  this.getUser = function () {
    return this.user;
  };

  this.getBot = function () {
    return this.bot;
  };

  this.getid = function () {
    return this.id;
  };

  this.getRounds = function() {
    return this.rounds;
  }

  this.newRound = function(client, message) {
    if(this.rounds > 0){
      this.rounds--;
      client.send(message);
    }
  }

  this.setUser = function (user) {
    this.user = user;
  };
}

module.exports = aiGame;