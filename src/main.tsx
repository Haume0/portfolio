import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./snow.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="snow z-50 pointer-events-none"></div>
    <App />
  </StrictMode>
);
