import React, { useState, useEffect } from "react";

const ipaddr = process.env.REACT_APP_IPADDR;

function TrafficLight() {
  const [activeLight, setActiveLight] = useState(null);
  const [workRestState, setWorkRestState] = useState("work");

  // 状態更新をサーバーに送信
  const handleLightClick = (color) => {
    fetch(`${ipaddr}:5001/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color, workRestState }),
    });
  };

  // サーバーから最新の状態を取得（Long Polling）
  const fetchStatus = () => {
    fetch(`${ipaddr}:5001/status`)
      .then((res) => res.json())
      .then((data) => {
        setActiveLight(data.color);
        setWorkRestState(data.workRestState);
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

  // workRestStateを画像クリックで変更
  const handleWorkRestClick = () => {
    const newWorkRestState = workRestState === "work" ? "rest" : "work";
    setWorkRestState(newWorkRestState);
    fetch(`${ipaddr}:5001/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color: activeLight, workRestState: newWorkRestState }),
    });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ display: "flex", backgroundColor: "gray", padding: "20px", borderRadius: "10px" }}>
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
      <div style={{ marginLeft: "20px" }}>
        <img
          src={workRestState === "work" ? "/work.png" : "/rest.png"} 
          alt={workRestState}
          style={{ width: "150px", height: "150px" }}
          onClick={handleWorkRestClick}
        />
      </div>
    </div>
  );
}

export default TrafficLight;
