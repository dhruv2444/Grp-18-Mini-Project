// frontend/src/Component/Spinner.jsx
import React from "react";

export default function Spinner({ size = 20 }) {
  return (
    <div style={{ display: "inline-block", verticalAlign: "middle" }}>
      <div className="lds-ring" style={{ width: size, height: size }}>
        <div></div><div></div><div></div><div></div>
      </div>
    </div>
  );
}
