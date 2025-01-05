require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// MySQL接続
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  } else {
    console.log("Connected to MySQL");
  }
});

let clients = [];

// Long Polling用エンドポイント（既存のDB値を初期値として返す）
app.get("/status", (req, res) => {
  // 現在の状態をDBから取得
  connection.query("SELECT * FROM status WHERE id = 1", (err, results) => {
    if (err) {
      console.error("Error fetching state from database:", err);
      res.status(500).send("Database error");
      return;
    }

    if (results.length > 0) {
      // DBに状態がある場合、それを返す
      const { color, workRestState } = results[0];
      res.json({ color, workRestState });
    } else {
      // DBに状態がない場合（初期化されていない場合）
      res.json({ color: "none", workRestState: "work" });
    }
  });
});


// 状態更新エンドポイント
app.post("/update", (req, res) => {
  const { color, workRestState } = req.body;

  if (!color || !workRestState) {
    res.status(400).send("Invalid request");
    return;
  }

  // データベースに状態を保存
  connection.query(
    "INSERT INTO status (id, color, workRestState) VALUES (1, ?, ?) ON DUPLICATE KEY UPDATE color = ?, workRestState = ?",
    [color, workRestState, color, workRestState],
    (err) => {
      if (err) {
        console.error("Error updating database:", err);
        res.status(500).send("Database error");
        return;
      }

      // 接続中の全クライアントに状態を送信
      clients.forEach((client) =>
        client.json({ color, workRestState })
      );
      clients = []; // クライアントリストをリセット

      res.sendStatus(200);
    }
  );
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
});
