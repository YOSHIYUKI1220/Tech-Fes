const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const TOKEN_FILE = "tokens.json";
const INVENTORY_FILE = "inventory.json";

if (!fs.existsSync(TOKEN_FILE)) {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify({ used: [] }));
}
if (!fs.existsSync(INVENTORY_FILE)) {
  fs.writeFileSync(INVENTORY_FILE, JSON.stringify({ "お菓子":50 }));
}

app.post("/lottery", (req, res) => {
  const token = Math.random().toString(36).substring(2, 10);
  let inventory = JSON.parse(fs.readFileSync(INVENTORY_FILE));

  const available = Object.keys(inventory).filter(k => inventory[k] > 0);

  if (available.length === 0) return res.json({ prize:"在庫切れ", token:null });

  const prize = available[Math.floor(Math.random()*available.length)];
  inventory[prize]--;
  fs.writeFileSync(INVENTORY_FILE, JSON.stringify(inventory));

  res.json({ prize, token });
});

app.post("/use", (req,res)=>{
  const {token}=req.body;
  const data = JSON.parse(fs.readFileSync(TOKEN_FILE));

  if(data.used.includes(token)) return res.json({success:false});

  data.used.push(token);
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(data));

  res.json({success:true});
});

app.get("/inventory", (req,res)=>{
  res.json(JSON.parse(fs.readFileSync(INVENTORY_FILE)));
});

app.post("/inventory", (req,res)=>{
  const {name,stock}=req.body;
  const data = JSON.parse(fs.readFileSync(INVENTORY_FILE));
  data[name]=stock;
  fs.writeFileSync(INVENTORY_FILE, JSON.stringify(data));
  res.json({success:true});
});

app.listen(PORT, ()=>console.log("Server running"));
