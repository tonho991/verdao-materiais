const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const fs = require("fs");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: true
}))

app.post("/api", (req, res) => {
  const action = req.query.action;

  if (action) {
    switch (action) {
      case "sendComment":
        return saveComment(req, res);
    }
  } else
    return res.status(200).send("Parametros errados")

});

function saveComment(req, res) {
  let comments = fs.readFileSync("./comments.json", "UTF-8");
  comments = JSON.parse(comments);
  console.log(req.body);
  
  if (
    !req.query.nome ||
    !req.query.email ||
    !req.query.telefone ||
    !req.query.assunto ||
    !req.query.mensagem
  ) {
    return res.status(200).send("Parametros errados")
  }

  comments.push(req.body);
  fs.writeFileSync("./comments.json", JSON.stringify(comments, null, 4));

  res.send(200).send("Comentario enviado com sucesso!");
}

app.listen(3000, () => {
  console.log("[ API Online ]");
});