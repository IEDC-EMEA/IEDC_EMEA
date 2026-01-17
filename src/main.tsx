import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@/assets/styles/index.css";
import { Toaster } from "@/components2/ui/sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>
);
