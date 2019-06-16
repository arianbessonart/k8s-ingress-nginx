const express = require("express");
const app = express();
const path = require("path");
const k8sService = require("./k8s-service");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,PATCH,DELETE,OPTIONS"
  );
  next();
});

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

app.get("/pods", (req, res) => {
  const pods = k8sService.getPods();
  res.send(pods);
});

app.get("/certificates", (req, res) => {
  const certificates = k8sService.getCertificates();
  res.send(certificates);
});

app.get("/certificates-v2", (req, res) => {
  const certificates = k8sService.getCertificatesV2();
  res.send(JSON.stringify(certificates));
});

app.post("/certificates-v2", (req, res) => {
  const certificate = k8sService.postCertificatesV2();
  res.send(JSON.stringify(certificate));
});

app.get("/ingresses", (req, res) => {
  const ingresses = k8sService.getIngresses();
  res.send(ingresses);
});

app.get("/inspect-api", (req, res) => {
  const inspect = k8sService.inspectApi();
  res.send(inspect);
});

app.post("/new-domain", async (req, res) => {
  const domain = req.body.domain;

  // 1- Create ingress
  // 2- Create certificate

  const ingressResult = await k8sService.createIngress(domain);
  const certificateResult = await k8sService.createCertificate(domain);

  res.send({ ingress: ingressResult, certificate: certificateResult });
});

app.get("*", function(req, res) {
  res.status(404).send("what??? nothing here!!!! path: " + req.url);
});

app.listen(3000, () => console.log("Listening on port 3000!"));
