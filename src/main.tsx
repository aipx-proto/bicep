import { createVisualizer } from "./visualizer/components/index";

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

createVisualizer(document.getElementById("root")!, DEMO_GRAPH);
