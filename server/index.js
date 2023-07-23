const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "020d31ad2ac4ea4e34c0cbb1de2d8cd77025a44f72ff69349ad237de62c336ebce": 100, //PRIV-KEY: cf8305424357507cf6f5cdca1fb8be212c55b6bd422f85438e1dd45fe2fdd25f
  "02f47054a862e7393fdc90f85cd92558ab46358b26723110f4045fdaa7252040f4": 50, //PRIV-KEY: 5044b8941b23158a8a4b8d62b573602a3dccba2c90aecb14398bf7f502ee9bfe
  "034576d718b04b6f4239ad1246a0796636aba719401598a1c4b69aa6e31e9c1a7c": 75, //PRIV-KEY: a3c4077b7d3d63e49fcc8b04431df834970c474f2dfe0558b09b2468c9bbfca4
};


app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);
  

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
