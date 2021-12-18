function User(name, id, ws, hisTurn, key) {
  this.name = name;
  this.id = id;
  this.winCounter = 0;
  this.ws = ws;
  this.hisTurn = hisTurn;
  this.symbol = null;
  this.key = key;

  this.getName = function () {
    return this.name;
  };

  this.getId = function () {
    return this.id;
  };

  this.getHisTurn = function () {
    return this.hisTurn;
  };

  this.winner = function () {
    this.winCounter++;
  };

  this.getWinCounter = function () {
    return this.winCounter;
  };

  this.getWs = function () {
    return this.ws;
  };

  this.getSymbol = function () {
    return this.symbol;
  };

  this.getKey = function () {
    return this.key;
  };

  this.setHisTurn = function (boolean) {
    this.hisTurn = boolean;
  };

  this.setSymbol = function (symbol) {
    this.symbol = symbol;
  };
}

module.exports = User;
