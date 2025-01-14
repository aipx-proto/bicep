import { createVisualizer } from "./lib";

const DEMO_GRAPH = {
  nodes: [
    {
      id: "testGroup1",
      type: "<module>",
      hasChildren: true,
    },
    {
      id: "testGroup1::azureIdentity",
      type: "microsoft.managedidentity/identities",
    },
    {
      id: "testGroup1::azureMap",
      type: "microsoft.unknown",
    },
    {
      id: "testGroup1::signalrDatabase",
      type: "microsoft.sql/servers/databases",
    },
    {
      id: "testGroup2",
      type: "<module>",
      hasChildren: true,
    },
    {
      id: "testGroup2::azureCommunicationService",
      type: "microsoft.unknown",
    },
  ],
  edges: [
    {
      sourceId: "testGroup1::azureIdentity",
      targetId: "testGroup1::azureMap",
    },
    {
      sourceId: "testGroup1::azureIdentity",
      targetId: "testGroup1::signalrDatabase",
    },
    {
      sourceId: "testGroup1::azureIdentity",
      targetId: "testGroup2::azureCommunicationService",
    },
    {
      sourceId: "testGroup2",
      targetId: "testGroup1",
    },
  ],
};

// DEMO
createVisualizer(document.getElementById("root")!, DEMO_GRAPH);
