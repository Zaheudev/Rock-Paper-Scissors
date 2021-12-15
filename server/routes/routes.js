var express = require("express");
var router = express.Router();
var app = express();

router.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

module.exports = router;
