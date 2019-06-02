const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("root");
});

app.get("/my-site", (req, res) => {
  res.send("my-site");
});

app.get("*", function(req, res) {
  res.status(404).send("what??? nothing here!!!! path: " + req.url);
});

app.listen(3000, () => console.log("Listening on port 3000!"));
