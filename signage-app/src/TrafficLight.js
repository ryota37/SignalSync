import React, { useState, useEffect } from "react";

const ipaddr = process.env.REACT_APP_IPADDR;

const containerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  padding: "10px",
};

const trafficLightWrapperStyle = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  maxWidth: "1200px",
  gap: "20px",
};

const trafficLightContainerStyle = {
  display: "flex",
  backgroundColor: "gray",
  padding: "10px",
  borderRadius: "10px",
  justifyContent: "space-around",
  flexGrow: 1,
};

const lightStyle = (isActive, color) => ({
  flex: "1 1 100px",
  maxWidth: "150px",
  height: "150px",
  borderRadius: "50%",
  backgroundColor: isActive ? color : "darkgray",
  margin: "10px",
  cursor: "pointer",
  transition: "background-color 0.3s",
});

const imageStyle = {
  width: "200px",
  height: "200px",
  cursor: "pointer",
};

const buttonStyle = {
  position: "absolute",
  top: "20px",
  right: "20px",
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
};


function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
    });
  } else {
    document.exitFullscreen().catch((err) => {
      console.error(`Error attempting to exit fullscreen mode: ${err.message}`);
    });
  }
}

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
    <div style={containerStyle}>
      <div style={trafficLightWrapperStyle}>
        <div style={trafficLightContainerStyle}>
          <div
            style={lightStyle(activeLight === "green", "green")}
            onClick={() => handleLightClick("green")}
          />
          <div
            style={lightStyle(activeLight === "yellow", "yellow")}
            onClick={() => handleLightClick("yellow")}
          />
          <div
            style={lightStyle(activeLight === "red", "red")}
            onClick={() => handleLightClick("red")}
          />
        </div>
        <img
          src={workRestState === "work" ? "work.png" : "rest.png"}
          alt={workRestState}
          style={imageStyle}
          onClick={handleWorkRestClick}
        />
      </div>
      <button style={buttonStyle} onClick={toggleFullScreen}>
        Fullscreen
      </button>
    </div>
  );
}

export default TrafficLight;
