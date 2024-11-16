const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

let currentLight = null;
let clients = [];

// Long Polling用エンドポイント
app.get("/status", (req, res) => {
  clients.push(res);

  // クライアントが接続を切った場合
  req.on("close", () => {
    clients = clients.filter(client => client !== res);
  });
});

// 状態更新エンドポイント
app.post("/update", (req, res) => {
  currentLight = req.body.color;

  // 接続中の全クライアントに状態を送信
  clients.forEach(client => client.json({ color: currentLight }));
  clients = []; // クライアントリストをリセット
  res.sendStatus(200);
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server running on http://192.168.3.15:${PORT}`);
});
