import React, { useState, useEffect } from "react";

const ipaddr = "http://192.168.3.47";

function TrafficLight() {
  const [activeLight, setActiveLight] = useState(null);

  // 状態更新をサーバーに送信
  const handleLightClick = (color) => {
    fetch(`${ipaddr}:5001/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color }),
    });
  };

  // サーバーから最新の状態を取得（Long Polling）
  const fetchStatus = () => {
    fetch(`${ipaddr}:5001/status`)
      .then((res) => res.json())
      .then((data) => {
        setActiveLight(data.color);
        fetchStatus(); // 繰り返しリクエストを送る
      })
      .catch((error) => {
        console.error("Connection error:", error);
        setTimeout(fetchStatus, 3000); // 接続が失敗した場合、3秒後に再接続
      });
  };

  // コンポーネントのマウント時にfetchStatusを開始
  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          backgroundColor: "gray",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: activeLight === "green" ? "green" : "darkgray",
            margin: "10px",
            cursor: "pointer",
          }}
          onClick={() => handleLightClick("green")}
        />
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: activeLight === "yellow" ? "yellow" : "darkgray",
            margin: "10px",
            cursor: "pointer",
          }}
          onClick={() => handleLightClick("yellow")}
        />
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: activeLight === "red" ? "red" : "darkgray",
            margin: "10px",
            cursor: "pointer",
          }}
          onClick={() => handleLightClick("red")}
        />
      </div>
    </div>
  );
}

export default TrafficLight;
