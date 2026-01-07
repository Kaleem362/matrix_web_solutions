import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ContextProvider } from "./Context/store";
import { useStore } from "./Context/UseStore";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ContextProvider store={useStore}>
    <App />
  </ContextProvider>
);
