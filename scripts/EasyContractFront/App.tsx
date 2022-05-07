import React from "react";
import * as ReactDOM from "react-dom/client";
import { GeneralPage } from "./GeneralPage";

const container = document.getElementById("root");

if (container) {
  const root = ReactDOM.createRoot(container);

  root.render(<GeneralPage />);
}
