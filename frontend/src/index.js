import React from "react";
import ReactDOM from "react-dom/client";  // ✅ Correct way for React 18
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
