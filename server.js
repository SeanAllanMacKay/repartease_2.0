const express = require("express");
const path = require("path");

const app = express();
const http = require("http").Server(app);
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.json());

http.listen(process.env.PORT || 8080);

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
