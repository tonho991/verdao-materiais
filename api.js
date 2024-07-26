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
    return res.status(400).send({
      error: "Invalid params"
    })

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
    return res.status(400).send({ error: "Invalid params" })
  }

  comments.push(req.body);
  fs.writeFileSync("./comments.json", JSON.stringify(comments, null, 4));
}

app.listen(3000, () => {
  console.log("[ API Online ]");
})