import React, { useState } from "react";

function TrafficLight() {
  const [activeLight, setActiveLight] = useState(null);

  const handleLightClick = (color) => {
    setActiveLight((prev) => (prev === color ? null : color));
  };

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
            backgroundColor: activeLight === "red" ? "red" : "darkgray",
            margin: "10px",
            cursor: "pointer",
          }}
          onClick={() => handleLightClick("red")}
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
            backgroundColor: activeLight === "green" ? "green" : "darkgray",
            margin: "10px",
            cursor: "pointer",
          }}
          onClick={() => handleLightClick("green")}
        />
      </div>
    </div>
  );
}

export default TrafficLight;
