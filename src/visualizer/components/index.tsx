// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Could not find the root element");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
