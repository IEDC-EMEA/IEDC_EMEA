import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@/assets/styles/index.css";
import { Toaster } from "@/components2/ui/sonner";
import { AuthProvider } from "@/lib/useAuth";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster />
    </AuthProvider>
  </React.StrictMode>,
);
