const express = require("express");
const app = express();
const path = require("path");

app.get("/", (req, res) => {
  // const obj = {
  //   domain: req.host,
  //   url: req.url,
  //   hostname: req.hostname
  // };
  // res.send(obj);

  const domain = req.host;
  if (domain === "nytte.ml") {
    res.sendFile(path.join(__dirname + "/pages/index-nytte.html"));
  } else {
    res.sendFile(path.join(__dirname + "/pages/index-gomesh.html"));
  }
});

app.get("/my-site", (req, res) => {
  const obj = {
    domain: req.host,
    url: req.url,
    hostname: req.hostname
  };
  res.send(obj);
});

app.get("*", function(req, res) {
  res.status(404).send("what??? nothing here!!!! path: " + req.url);
});

app.listen(3000, () => console.log("Listening on port 3000!"));
