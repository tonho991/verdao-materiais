const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer")();
const Recaptcha = require("express-recaptcha").RecaptchaV2; 
const cors = require("cors");

const recaptcha = new Recaptcha("6LfIrRgqAAAAAMWzrrgiW-EeckPfiItlps1-pguX", "6LfIrRgqAAAAAP54V_0Lt9HVBzO8-lfDEYp6UEgm");

app.use(cors());

app.post("/api/comment", multer.none(), recaptcha.middleware.verify, async (req, res) => {

  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "86400"
  });


  if (req.recaptcha.error) {
    return res.send("Falha na validacao do reCAPTCHA.")
  }

  return saveComment(req, res);
});



function saveComment(req, res) {
  let comments = fs.readFileSync("./comments.json", "UTF-8");
  comments = JSON.parse(comments);

  if (
    !req.query.nome ||
    !req.query.email ||
    !req.query.telefone ||
    !req.query.assunto ||
    !req.query.mensagem
  ) {
    return res.status(200).send("Preencha todos os campos.")
  }

  req.body.forEach(element => {
    if(element.trim() === "") return res.send("Preencha todos os campos.")
  });

  comments.push(req.body);
  fs.writeFileSync("./comments.json", JSON.stringify(comments, null, 4));

  res.send(200).send("Comentario enviado com sucesso!");
}


app.listen(3000, () => {
  console.log("[ API Online ]");
});