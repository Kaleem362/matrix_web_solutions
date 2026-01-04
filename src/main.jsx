import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ContextProvider, store } from "./Context/store";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ContextProvider store={store}>
    <App />
  </ContextProvider>
);
