// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
// declare function acquireVsCodeApi(): {
//   postMessage(message: unknown): void;
//   setState(state: unknown): void;
//   getState<T>(): T;
// };

// mock the vscode API
function acquireVsCodeApi() {
  return {
    postMessage: (message: unknown) => {
      console.log("postMessage", message);
    },
    setState: (state: unknown) => {
      console.log("setState", state);
    },
    getState: <T>() => {
      console.log("getState");
      return {} as T;
    },
  };
}

export const vscode = acquireVsCodeApi();
