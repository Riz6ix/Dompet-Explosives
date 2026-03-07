import React from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "./components/ui/index.js";
import App from "./App.jsx";
import "./App.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
