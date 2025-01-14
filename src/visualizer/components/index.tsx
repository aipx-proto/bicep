// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App, Graph } from "./App";

export function createVisualizer(container: HTMLElement, initialData: Graph) {
  const root = createRoot(container);

  root.render(
    <StrictMode>
      <App graph={initialData} />
    </StrictMode>
  );
}
