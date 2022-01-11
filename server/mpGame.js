function mpGame(user1, user2, id, private) {
  this.user1 = user1;
  this.user2 = user2;
  this.id = id;
  this.gameState = "Waiting";
  this.rounds = 3;
  this.private = private;
  if (typeof private === "undefined") {
    this.private = false;
  }

  this.getUser1 = function () {
    return this.user1;
  };

  this.getUser2 = function () {
    return this.user2;
  };

  this.getId = function () {
    return this.id;
  };

  this.getState = function () {
    return this.gameState;
  };

  this.getRounds = function () {
    return this.rounds;
  };
  
  this.getPrivate = function () {
    return this.private;
  }

  this.newRound = function () {
    if (this.rounds > 0) {
      this.rounds--;
    }
  };

  this.setUser1 = function (user) {
    this.user1 = user;
  };

  this.setUser2 = function (user) {
    this.user2 = user;
  };

  this.setState = function (state) {
    this.gameState = state;
  };
}
module.exports = mpGame;
