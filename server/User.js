function User(name, id, ws) {
  this.name = name;
  this.id = id;
  this.winCounter = 0;
  this.ws = ws;

  this.getName = function () {
    return this.name;
  };

  this.getId = function () {
    return this.id;
  };

  this.winner = function () {
    this.winCounter++;
  }

  this.getWinCounter = function () {
    return this.winCounter;
  };
}

module.exports = User;