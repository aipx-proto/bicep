// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import type { Range } from "vscode";
import type { DeploymentGraph } from "../../language/protocol";

interface SimpleMessage<T> {
  kind: T;
}

type MessageWithPayload<T, U = Record<string, unknown>> = SimpleMessage<T> & U;

export type ReadyMessage = SimpleMessage<"READY">;

export type DeploymentGraphMessage = MessageWithPayload<
  "DEPLOYMENT_GRAPH",
  {
    documentPath: string;
    deploymentGraph: DeploymentGraph | null;
  }
>;

export type RevealFileRangeMessage = MessageWithPayload<
  "REVEAL_FILE_RANGE",
  {
    filePath: string;
    range: Range;
  }
>;

export type Message = ReadyMessage | DeploymentGraphMessage | RevealFileRangeMessage;

function createSimpleMessage<T>(kind: T): SimpleMessage<T> {
  return { kind };
}

function createMessageWithPayload<T extends string, U = Record<string, unknown>>(kind: T, payload: U): MessageWithPayload<T, U> {
  return {
    kind,
    ...payload,
  };
}

export const READY_MESSAGE: ReadyMessage = createSimpleMessage("READY");

export function createDeploymentGraphMessage(documentPath: string, deploymentGraph: DeploymentGraph | null): DeploymentGraphMessage {
  return createMessageWithPayload("DEPLOYMENT_GRAPH", {
    documentPath,
    deploymentGraph,
  });
}

export function createRevealFileRangeMessage(filePath: string, range: Range): RevealFileRangeMessage {
  return createMessageWithPayload("REVEAL_FILE_RANGE", {
    filePath,
    range,
  });
}
