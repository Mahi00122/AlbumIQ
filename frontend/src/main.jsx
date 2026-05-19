import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";

import App from "./App";
import { AppStateProvider } from "./store/AppStateContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppStateProvider>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            borderRadius: "999px",
            padding: "12px 16px",
            background: "#221827",
            color: "#fff7fb"
          }
        }}
      />
    </AppStateProvider>
  </React.StrictMode>
);
