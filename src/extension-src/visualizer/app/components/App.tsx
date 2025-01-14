// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { type ElementDefinition } from "cytoscape";
import { type FC, useEffect, useState } from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import { darkTheme, highContrastTheme, lightTheme } from "../themes";
import { createChildlessNodeBackgroundUri, createContainerNodeBackgroundUri, Graph } from "./Graph";
import { StatusBar } from "./StatusBar";

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

interface Node {
  id: string; // lowerCamelCase name of the resource/group, format [<groupId>::]<itemId>
  type: `<module>` | string;
  hasChildren?: boolean;
  isCollection?: boolean;
}

interface Edge {
  sourceId: string;
  targetId: string;
}

async function mapToElements(graph: Graph | null, theme: DefaultTheme): Promise<ElementDefinition[]> {
  if (!graph) {
    return [];
  }

  const nodes = await Promise.all(
    graph.nodes.map(async (node) => {
      const idSegments = node.id.split("::");
      const symbol = idSegments.pop() as string;
      const parent = idSegments.length > 0 ? idSegments.join("::") : undefined;

      return {
        data: {
          id: node.id,
          parent,
          hasError: false,
          filePath: "",
          range: [],
          backgroundDataUri: node.hasChildren
            ? createContainerNodeBackgroundUri(symbol, !!node.isCollection, theme)
            : await createChildlessNodeBackgroundUri(symbol, node.type, !!node.isCollection, theme),
        },
      };
    })
  );

  const edges = graph.edges.map(({ sourceId, targetId }) => ({
    data: {
      id: `${sourceId}>${targetId}`,
      source: sourceId,
      target: targetId,
    },
  }));

  return [...nodes, ...edges];
}

const DEMO_GRAPH = {
  nodes: [
    {
      id: "weatherNotificationGroup",
      type: "<module>",
      hasChildren: true,
    },
    {
      id: "weatherNotificationGroup::azureIdentity",
      type: "microsoft.managedidentity/identities",
    },
    {
      id: "weatherNotificationGroup::azureMap",
      type: "microsoft.unknown",
    },
    {
      id: "weatherNotificationGroup::signalrDatabase",
      type: "microsoft.sql/servers/databases",
    },
    {
      id: "weatherNotificationGroup::azureCommunicationService",
      type: "microsoft.unknown",
    },
  ],
  edges: [
    {
      sourceId: "weatherNotificationGroup::azureIdentity",
      targetId: "weatherNotificationGroup::azureMap",
    },
    {
      sourceId: "weatherNotificationGroup::azureIdentity",
      targetId: "weatherNotificationGroup::signalrDatabase",
    },
    {
      sourceId: "weatherNotificationGroup::azureIdentity",
      targetId: "weatherNotificationGroup::azureCommunicationService",
    },
  ],
};

export type BasicDeploymentGraphMessage = {
  kind: "DEPLOYMENT_GRAPH";
  deploymentGraph: Graph | null;
};

export const App: FC = () => {
  const [elements, setElements] = useState<ElementDefinition[]>([]);
  const [graph, setGraph] = useState<Graph | null>(DEMO_GRAPH as any);
  const [theme, setTheme] = useState<DefaultTheme>(darkTheme);

  const handleMessageEvent = (e: MessageEvent<BasicDeploymentGraphMessage>) => {
    const message = e.data;
    if (message.kind === "DEPLOYMENT_GRAPH") {
      setGraph(message.deploymentGraph);
    }
  };

  const applyTheme = (bodyClassName: string) => {
    switch (bodyClassName) {
      case "vscode-dark":
        setTheme(darkTheme);
        break;
      case "vscode-light":
        setTheme(lightTheme);
        break;
      case "vscode-high-contrast":
        setTheme(highContrastTheme);
        break;
    }
  };

  useEffect(() => {
    void mapToElements(graph, theme).then(setElements);
  }, [graph, theme]);

  useEffect(() => {
    window.addEventListener("message", handleMessageEvent);
    return () => window.removeEventListener("message", handleMessageEvent);
  }, []);

  useEffect(() => {
    applyTheme(document.body.className);

    const observer = new MutationObserver((mutationRecords) =>
      mutationRecords.forEach((mutationRecord) => applyTheme((mutationRecord.target as HTMLElement).className))
    );

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Graph elements={elements} />
      <StatusBar errorCount={0} hasNodes={elements.length > 0} />
    </ThemeProvider>
  );
};
