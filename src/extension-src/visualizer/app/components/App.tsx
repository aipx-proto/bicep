// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
// import cytoscape from "cytoscape";
import { ElementDefinition } from "cytoscape";
import { FC, useEffect, useState } from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import { DeploymentGraph } from "../../../language/protocol";
import { DeploymentGraphMessage, Message, READY_MESSAGE } from "../messages";
import { darkTheme, highContrastTheme, lightTheme } from "../themes";
import { vscode } from "../vscode";
import { createChildlessNodeBackgroundUri, createContainerNodeBackgroundUri, Graph } from "./Graph";
import { StatusBar } from "./StatusBar";

async function mapToElements(graph: DeploymentGraphMessage["deploymentGraph"], theme: DefaultTheme): Promise<ElementDefinition[]> {
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
          hasError: node.hasError,
          filePath: node.filePath,
          range: node.range,
          backgroundDataUri: node.hasChildren
            ? createContainerNodeBackgroundUri(symbol, node.isCollection, theme)
            : await createChildlessNodeBackgroundUri(symbol, node.type, node.isCollection, theme),
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
      id: "aiServices",
      type: "<module>",
      hasChildren: true,
    },
    {
      id: "aiServices::aiServices",
      type: "Microsoft.CognitiveServices/accounts",
      hasChildren: false,
    },
    {
      id: "aiServices::aiServicesDiagnosticSettings",
      type: "Microsoft.Insights/diagnosticSettings",
      hasChildren: false,
    },
    {
      id: "aiServices::cognitiveServicesContributorRoleAssignment",
      type: "Microsoft.Authorization/roleAssignments",
      hasChildren: false,
    },
    {
      id: "aiServices::cognitiveServicesContributorRoleDefinition",
      type: "Microsoft.Authorization/roleDefinitions",
      hasChildren: false,
    },
    {
      id: "aiServices::cognitiveServicesUserIdentityRoleAssignment",
      type: "Microsoft.Authorization/roleAssignments",
      hasChildren: false,
    },
    {
      id: "aiServices::cognitiveServicesUserRoleDefinition",
      type: "Microsoft.Authorization/roleDefinitions",
      hasChildren: false,
    },
    {
      id: "aiServices::cognitiveServicesUserUserRoleAssignment",
      type: "Microsoft.Authorization/roleAssignments",
      hasChildren: false,
    },
    {
      id: "aiServices::model",
      type: "Microsoft.CognitiveServices/accounts/deployments",
      hasChildren: false,
    },
    {
      id: "applicationInsights",
      type: "<module>",
      hasChildren: true,
    },
    {
      id: "applicationInsights::applicationInsights",
      type: "Microsoft.Insights/components",
      hasChildren: false,
    },
    {
      id: "containerRegistry",
      type: "<module>",
      hasChildren: true,
    },
    {
      id: "containerRegistry::containerRegistry",
      type: "Microsoft.ContainerRegistry/registries",
      hasChildren: false,
    },
    {
      id: "containerRegistry::diagnosticSettings",
      type: "Microsoft.Insights/diagnosticSettings",
      hasChildren: false,
    },
    {
      id: "hub",
      type: "<module>",
      hasChildren: true,
    },
    {
      id: "hub::aiServices",
      type: "Microsoft.CognitiveServices/accounts",
      hasChildren: false,
    },
    {
      id: "hub::aiServicesConnection",
      type: "Microsoft.MachineLearningServices/workspaces/connections",
      hasChildren: false,
    },
    {
      id: "hub::azureMLDataScientistRole",
      type: "Microsoft.Authorization/roleDefinitions",
      hasChildren: false,
    },
    {
      id: "hub::azureMLDataScientistUserRoleAssignment",
      type: "Microsoft.Authorization/roleAssignments",
      hasChildren: false,
    },
    {
      id: "hub::diagnosticSettings",
      type: "Microsoft.Insights/diagnosticSettings",
      hasChildren: false,
    },
    {
      id: "hub::hub",
      type: "Microsoft.MachineLearningServices/workspaces",
      hasChildren: false,
    },
    {
      id: "keyVault",
      type: "<module>",
      hasChildren: true,
    },
    {
      id: "keyVault::diagnosticSettings",
      type: "Microsoft.Insights/diagnosticSettings",
      hasChildren: false,
    },
    {
      id: "keyVault::keyVault",
      type: "Microsoft.KeyVault/vaults",
      hasChildren: false,
    },
    {
      id: "keyVault::keyVaultAdministratorRoleDefinition",
      type: "Microsoft.Authorization/roleDefinitions",
      hasChildren: false,
    },
    {
      id: "keyVault::keyVaultAdministratorUserRoleAssignment",
      type: "Microsoft.Authorization/roleAssignments",
      hasChildren: false,
    },
    {
      id: "network",
      type: "<module>",
      hasChildren: true,
    },
    {
      id: "network::bastionDiagnosticSettings",
      type: "Microsoft.Insights/diagnosticSettings",
      hasChildren: false,
    },
    {
      id: "network::bastionHost",
      type: "Microsoft.Network/bastionHosts",
      hasChildren: false,
    },
    {
      id: "network::bastionPublicIpAddress",
      type: "Microsoft.Network/publicIPAddresses",
      hasChildren: false,
    },
    {
      id: "network::bastionSubnetNsg",
      type: "Microsoft.Network/networkSecurityGroups",
      hasChildren: false,
    },
    {
      id: "network::bastionSubnetNsgDiagnosticSettings",
      type: "Microsoft.Insights/diagnosticSettings",
      hasChildren: false,
    },
    {
      id: "network::natGateway",
      type: "Microsoft.Network/natGateways",
      hasChildren: false,
    },
    {
      id: "network::natGatewayPublicIp",
      type: "Microsoft.Network/publicIPAddresses",
      hasChildren: false,
    },
    {
      id: "network::vmSubnetNsg",
      type: "Microsoft.Network/networkSecurityGroups",
      hasChildren: false,
    },
    {
      id: "network::vmSubnetNsgDiagnosticSettings",
      type: "Microsoft.Insights/diagnosticSettings",
      hasChildren: false,
    },
    {
      id: "network::vnet",
      type: "Microsoft.Network/virtualNetworks",
      hasChildren: false,
    },
    {
      id: "network::vnetDiagnosticSettings",
      type: "Microsoft.Insights/diagnosticSettings",
      hasChildren: false,
    },
    {
      id: "privateEndpoints",
      type: "<module>",
      hasChildren: true,
    },
    {
      id: "privateEndpoints::acrPrivateDnsZone",
      type: "Microsoft.Network/privateDnsZones",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::acrPrivateDnsZoneGroup",
      type: "Microsoft.Network/privateEndpoints/privateDnsZoneGroups",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::acrPrivateDnsZoneVirtualNetworkLink",
      type: "Microsoft.Network/privateDnsZones/virtualNetworkLinks",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::acrPrivateEndpoint",
      type: "Microsoft.Network/privateEndpoints",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::aiServicesPrivateDnsZoneGroup",
      type: "Microsoft.Network/privateEndpoints/privateDnsZoneGroups",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::aiServicesPrivateEndpoint",
      type: "Microsoft.Network/privateEndpoints",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::blobPrivateDnsZone",
      type: "Microsoft.Network/privateDnsZones",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::blobPrivateDnsZoneVirtualNetworkLink",
      type: "Microsoft.Network/privateDnsZones/virtualNetworkLinks",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::blobStorageAccountPrivateDnsZoneGroupName",
      type: "Microsoft.Network/privateEndpoints/privateDnsZoneGroups",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::blobStorageAccountPrivateEndpoint",
      type: "Microsoft.Network/privateEndpoints",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::cognitiveServicesPrivateDnsZone",
      type: "Microsoft.Network/privateDnsZones",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::cognitiveServicesPrivateDnsZoneVirtualNetworkLink",
      type: "Microsoft.Network/privateDnsZones/virtualNetworkLinks",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::filePrivateDnsZone",
      type: "Microsoft.Network/privateDnsZones",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::filePrivateDnsZoneVirtualNetworkLink",
      type: "Microsoft.Network/privateDnsZones/virtualNetworkLinks",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::fileStorageAccountPrivateDnsZoneGroupName",
      type: "Microsoft.Network/privateEndpoints/privateDnsZoneGroups",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::fileStorageAccountPrivateEndpoint",
      type: "Microsoft.Network/privateEndpoints",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::hubWorkspacePrivateDnsZoneGroup",
      type: "Microsoft.Network/privateEndpoints/privateDnsZoneGroups",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::hubWorkspacePrivateEndpoint",
      type: "Microsoft.Network/privateEndpoints",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::keyVaultPrivateDnsZone",
      type: "Microsoft.Network/privateDnsZones",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::keyVaultPrivateDnsZoneGroupName",
      type: "Microsoft.Network/privateEndpoints/privateDnsZoneGroups",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::keyVaultPrivateDnsZoneVirtualNetworkLink",
      type: "Microsoft.Network/privateDnsZones/virtualNetworkLinks",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::keyVaultPrivateEndpoint",
      type: "Microsoft.Network/privateEndpoints",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::mlApiPrivateDnsZone",
      type: "Microsoft.Network/privateDnsZones",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::mlApiPrivateDnsZoneVirtualNetworkLink",
      type: "Microsoft.Network/privateDnsZones/virtualNetworkLinks",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::mlNotebooksPrivateDnsZone",
      type: "Microsoft.Network/privateDnsZones",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::mlNotebooksPrivateDnsZoneVirtualNetworkLink",
      type: "Microsoft.Network/privateDnsZones/virtualNetworkLinks",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::openAiPrivateDnsZone",
      type: "Microsoft.Network/privateDnsZones",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::openAiPrivateDnsZoneVirtualNetworkLink",
      type: "Microsoft.Network/privateDnsZones/virtualNetworkLinks",
      hasChildren: false,
    },
    {
      id: "privateEndpoints::vnet",
      type: "Microsoft.Network/virtualNetworks",
      hasChildren: false,
    },
    {
      id: "project",
      type: "<module>",
      hasChildren: true,
    },
    {
      id: "project::azureMLDataScientistManagedIdentityRoleAssignment",
      type: "Microsoft.Authorization/roleAssignments",
      hasChildren: false,
    },
    {
      id: "project::azureMLDataScientistRole",
      type: "Microsoft.Authorization/roleDefinitions",
      hasChildren: false,
    },
    {
      id: "project::azureMLDataScientistUserRoleAssignment",
      type: "Microsoft.Authorization/roleAssignments",
      hasChildren: false,
    },
    {
      id: "project::diagnosticSettings",
      type: "Microsoft.Insights/diagnosticSettings",
      hasChildren: false,
    },
    {
      id: "project::project",
      type: "Microsoft.MachineLearningServices/workspaces",
      hasChildren: false,
    },
    {
      id: "storageAccount",
      type: "<module>",
      hasChildren: true,
    },
    {
      id: "storageAccount::blobService",
      type: "Microsoft.Storage/storageAccounts/blobServices",
      hasChildren: false,
    },
    {
      id: "storageAccount::blobServiceDiagnosticSettings",
      type: "Microsoft.Insights/diagnosticSettings",
      hasChildren: false,
    },
    {
      id: "storageAccount::containers",
      type: "Microsoft.Storage/storageAccounts/blobServices/containers",
      hasChildren: false,
    },
    {
      id: "storageAccount::storageAccount",
      type: "Microsoft.Storage/storageAccounts",
      hasChildren: false,
    },
    {
      id: "storageAccount::storageAccountContributorRoleDefinition",
      type: "Microsoft.Authorization/roleDefinitions",
      hasChildren: false,
    },
    {
      id: "storageAccount::storageAccountContributorUserRoleAssignment",
      type: "Microsoft.Authorization/roleAssignments",
      hasChildren: false,
    },
    {
      id: "storageAccount::storageBlobDataContributorManagedIdentityRoleAssignment",
      type: "Microsoft.Authorization/roleAssignments",
      hasChildren: false,
    },
    {
      id: "storageAccount::storageBlobDataContributorRoleDefinition",
      type: "Microsoft.Authorization/roleDefinitions",
      hasChildren: false,
    },
    {
      id: "storageAccount::storageBlobDataContributorUserRoleAssignment",
      type: "Microsoft.Authorization/roleAssignments",
      hasChildren: false,
    },
    {
      id: "storageAccount::storageFileDataPrivilegedContributorRoleDefinition",
      type: "Microsoft.Authorization/roleDefinitions",
      hasChildren: false,
    },
    {
      id: "storageAccount::storageFileDataPrivilegedContributorUserRoleAssignment",
      type: "Microsoft.Authorization/roleAssignments",
      hasChildren: false,
    },
    {
      id: "storageAccount::storageTableDataContributorRoleDefinition",
      type: "Microsoft.Authorization/roleDefinitions",
      hasChildren: false,
    },
    {
      id: "storageAccount::storageTableDataContributorUserRoleAssignment",
      type: "Microsoft.Authorization/roleAssignments",
      hasChildren: false,
    },
    {
      id: "virtualMachine",
      type: "<module>",
      hasChildren: true,
    },
    {
      id: "virtualMachine::amaExtension",
      type: "Microsoft.Compute/virtualMachines/extensions",
      hasChildren: false,
    },
    {
      id: "virtualMachine::dcrEventLogs",
      type: "Microsoft.Insights/dataCollectionRules",
      hasChildren: false,
    },
    {
      id: "virtualMachine::dcrEventLogsAssociation",
      type: "Microsoft.Insights/dataCollectionRuleAssociations",
      hasChildren: false,
    },
    {
      id: "virtualMachine::dcrPerfLaw",
      type: "Microsoft.Insights/dataCollectionRules",
      hasChildren: false,
    },
    {
      id: "virtualMachine::dcrPerfLawAssociation",
      type: "Microsoft.Insights/dataCollectionRuleAssociations",
      hasChildren: false,
    },
    {
      id: "virtualMachine::dependencyExtension",
      type: "Microsoft.Compute/virtualMachines/extensions",
      hasChildren: false,
    },
    {
      id: "virtualMachine::entraExtension",
      type: "Microsoft.Compute/virtualMachines/extensions",
      hasChildren: false,
    },
    {
      id: "virtualMachine::storageAccount",
      type: "Microsoft.Storage/storageAccounts",
      hasChildren: false,
    },
    {
      id: "virtualMachine::virtualMachine",
      type: "Microsoft.Compute/virtualMachines",
      hasChildren: false,
    },
    {
      id: "virtualMachine::virtualMachineAdministratorLoginRoleDefinition",
      type: "Microsoft.Authorization/roleDefinitions",
      hasChildren: false,
    },
    {
      id: "virtualMachine::virtualMachineAdministratorLoginUserRoleAssignment",
      type: "Microsoft.Authorization/roleAssignments",
      hasChildren: false,
    },
    {
      id: "virtualMachine::virtualMachineNic",
      type: "Microsoft.Network/networkInterfaces",
      hasChildren: false,
    },
    {
      id: "workspace",
      type: "<module>",
      hasChildren: true,
    },
    {
      id: "workspace::logAnalyticsWorkspace",
      type: "Microsoft.OperationalInsights/workspaces",
      hasChildren: false,
    },
  ],
  edges: [
    {
      sourceId: "aiServices::aiServicesDiagnosticSettings",
      targetId: "aiServices::aiServices",
    },
    {
      sourceId: "aiServices::cognitiveServicesContributorRoleAssignment",
      targetId: "aiServices::aiServices",
    },
    {
      sourceId: "aiServices::cognitiveServicesContributorRoleAssignment",
      targetId: "aiServices::cognitiveServicesContributorRoleDefinition",
    },
    {
      sourceId: "aiServices::cognitiveServicesUserIdentityRoleAssignment",
      targetId: "aiServices::aiServices",
    },
    {
      sourceId: "aiServices::cognitiveServicesUserIdentityRoleAssignment",
      targetId: "aiServices::aiServices",
    },
    {
      sourceId: "aiServices::cognitiveServicesUserIdentityRoleAssignment",
      targetId: "aiServices::cognitiveServicesUserRoleDefinition",
    },
    {
      sourceId: "aiServices::cognitiveServicesUserUserRoleAssignment",
      targetId: "aiServices::aiServices",
    },
    {
      sourceId: "aiServices::cognitiveServicesUserUserRoleAssignment",
      targetId: "aiServices::cognitiveServicesUserRoleDefinition",
    },
    {
      sourceId: "aiServices::model",
      targetId: "aiServices::aiServices",
    },
    {
      sourceId: "aiServices",
      targetId: "workspace",
    },
    {
      sourceId: "applicationInsights",
      targetId: "workspace",
    },
    {
      sourceId: "containerRegistry::diagnosticSettings",
      targetId: "containerRegistry::containerRegistry",
    },
    {
      sourceId: "containerRegistry",
      targetId: "workspace",
    },
    {
      sourceId: "hub::aiServicesConnection",
      targetId: "hub::aiServices",
    },
    {
      sourceId: "hub::aiServicesConnection",
      targetId: "hub::aiServices",
    },
    {
      sourceId: "hub::aiServicesConnection",
      targetId: "hub::hub",
    },
    {
      sourceId: "hub::azureMLDataScientistUserRoleAssignment",
      targetId: "hub::azureMLDataScientistRole",
    },
    {
      sourceId: "hub::azureMLDataScientistUserRoleAssignment",
      targetId: "hub::hub",
    },
    {
      sourceId: "hub::diagnosticSettings",
      targetId: "hub::hub",
    },
    {
      sourceId: "hub",
      targetId: "aiServices",
    },
    {
      sourceId: "hub",
      targetId: "applicationInsights",
    },
    {
      sourceId: "hub",
      targetId: "containerRegistry",
    },
    {
      sourceId: "hub",
      targetId: "keyVault",
    },
    {
      sourceId: "hub",
      targetId: "storageAccount",
    },
    {
      sourceId: "hub",
      targetId: "workspace",
    },
    {
      sourceId: "keyVault::diagnosticSettings",
      targetId: "keyVault::keyVault",
    },
    {
      sourceId: "keyVault::keyVaultAdministratorUserRoleAssignment",
      targetId: "keyVault::keyVault",
    },
    {
      sourceId: "keyVault::keyVaultAdministratorUserRoleAssignment",
      targetId: "keyVault::keyVaultAdministratorRoleDefinition",
    },
    {
      sourceId: "keyVault",
      targetId: "workspace",
    },
    {
      sourceId: "network::bastionDiagnosticSettings",
      targetId: "network::bastionHost",
    },
    {
      sourceId: "network::bastionHost",
      targetId: "network::bastionPublicIpAddress",
    },
    {
      sourceId: "network::bastionHost",
      targetId: "network::vnet",
    },
    {
      sourceId: "network::bastionSubnetNsgDiagnosticSettings",
      targetId: "network::bastionSubnetNsg",
    },
    {
      sourceId: "network::natGateway",
      targetId: "network::natGatewayPublicIp",
    },
    {
      sourceId: "network::natGateway",
      targetId: "network::natGatewayPublicIp",
    },
    {
      sourceId: "network::vmSubnetNsgDiagnosticSettings",
      targetId: "network::vmSubnetNsg",
    },
    {
      sourceId: "network::vnet",
      targetId: "network::bastionSubnetNsg",
    },
    {
      sourceId: "network::vnet",
      targetId: "network::natGateway",
    },
    {
      sourceId: "network::vnet",
      targetId: "network::vmSubnetNsg",
    },
    {
      sourceId: "network::vnetDiagnosticSettings",
      targetId: "network::vnet",
    },
    {
      sourceId: "network",
      targetId: "workspace",
    },
    {
      sourceId: "privateEndpoints::acrPrivateDnsZoneGroup",
      targetId: "privateEndpoints::acrPrivateDnsZone",
    },
    {
      sourceId: "privateEndpoints::acrPrivateDnsZoneGroup",
      targetId: "privateEndpoints::acrPrivateEndpoint",
    },
    {
      sourceId: "privateEndpoints::acrPrivateDnsZoneVirtualNetworkLink",
      targetId: "privateEndpoints::acrPrivateDnsZone",
    },
    {
      sourceId: "privateEndpoints::acrPrivateDnsZoneVirtualNetworkLink",
      targetId: "privateEndpoints::vnet",
    },
    {
      sourceId: "privateEndpoints::aiServicesPrivateDnsZoneGroup",
      targetId: "privateEndpoints::aiServicesPrivateEndpoint",
    },
    {
      sourceId: "privateEndpoints::aiServicesPrivateDnsZoneGroup",
      targetId: "privateEndpoints::cognitiveServicesPrivateDnsZone",
    },
    {
      sourceId: "privateEndpoints::aiServicesPrivateDnsZoneGroup",
      targetId: "privateEndpoints::openAiPrivateDnsZone",
    },
    {
      sourceId: "privateEndpoints::blobPrivateDnsZoneVirtualNetworkLink",
      targetId: "privateEndpoints::blobPrivateDnsZone",
    },
    {
      sourceId: "privateEndpoints::blobPrivateDnsZoneVirtualNetworkLink",
      targetId: "privateEndpoints::vnet",
    },
    {
      sourceId: "privateEndpoints::blobStorageAccountPrivateDnsZoneGroupName",
      targetId: "privateEndpoints::blobPrivateDnsZone",
    },
    {
      sourceId: "privateEndpoints::blobStorageAccountPrivateDnsZoneGroupName",
      targetId: "privateEndpoints::blobStorageAccountPrivateEndpoint",
    },
    {
      sourceId: "privateEndpoints::cognitiveServicesPrivateDnsZoneVirtualNetworkLink",
      targetId: "privateEndpoints::cognitiveServicesPrivateDnsZone",
    },
    {
      sourceId: "privateEndpoints::cognitiveServicesPrivateDnsZoneVirtualNetworkLink",
      targetId: "privateEndpoints::vnet",
    },
    {
      sourceId: "privateEndpoints::filePrivateDnsZoneVirtualNetworkLink",
      targetId: "privateEndpoints::filePrivateDnsZone",
    },
    {
      sourceId: "privateEndpoints::filePrivateDnsZoneVirtualNetworkLink",
      targetId: "privateEndpoints::vnet",
    },
    {
      sourceId: "privateEndpoints::fileStorageAccountPrivateDnsZoneGroupName",
      targetId: "privateEndpoints::filePrivateDnsZone",
    },
    {
      sourceId: "privateEndpoints::fileStorageAccountPrivateDnsZoneGroupName",
      targetId: "privateEndpoints::fileStorageAccountPrivateEndpoint",
    },
    {
      sourceId: "privateEndpoints::hubWorkspacePrivateDnsZoneGroup",
      targetId: "privateEndpoints::hubWorkspacePrivateEndpoint",
    },
    {
      sourceId: "privateEndpoints::hubWorkspacePrivateDnsZoneGroup",
      targetId: "privateEndpoints::mlApiPrivateDnsZone",
    },
    {
      sourceId: "privateEndpoints::hubWorkspacePrivateDnsZoneGroup",
      targetId: "privateEndpoints::mlApiPrivateDnsZoneVirtualNetworkLink",
    },
    {
      sourceId: "privateEndpoints::hubWorkspacePrivateDnsZoneGroup",
      targetId: "privateEndpoints::mlNotebooksPrivateDnsZone",
    },
    {
      sourceId: "privateEndpoints::hubWorkspacePrivateDnsZoneGroup",
      targetId: "privateEndpoints::mlNotebooksPrivateDnsZoneVirtualNetworkLink",
    },
    {
      sourceId: "privateEndpoints::keyVaultPrivateDnsZoneGroupName",
      targetId: "privateEndpoints::keyVaultPrivateDnsZone",
    },
    {
      sourceId: "privateEndpoints::keyVaultPrivateDnsZoneGroupName",
      targetId: "privateEndpoints::keyVaultPrivateEndpoint",
    },
    {
      sourceId: "privateEndpoints::keyVaultPrivateDnsZoneVirtualNetworkLink",
      targetId: "privateEndpoints::keyVaultPrivateDnsZone",
    },
    {
      sourceId: "privateEndpoints::keyVaultPrivateDnsZoneVirtualNetworkLink",
      targetId: "privateEndpoints::vnet",
    },
    {
      sourceId: "privateEndpoints::mlApiPrivateDnsZoneVirtualNetworkLink",
      targetId: "privateEndpoints::mlApiPrivateDnsZone",
    },
    {
      sourceId: "privateEndpoints::mlApiPrivateDnsZoneVirtualNetworkLink",
      targetId: "privateEndpoints::vnet",
    },
    {
      sourceId: "privateEndpoints::mlNotebooksPrivateDnsZoneVirtualNetworkLink",
      targetId: "privateEndpoints::mlNotebooksPrivateDnsZone",
    },
    {
      sourceId: "privateEndpoints::mlNotebooksPrivateDnsZoneVirtualNetworkLink",
      targetId: "privateEndpoints::vnet",
    },
    {
      sourceId: "privateEndpoints::openAiPrivateDnsZoneVirtualNetworkLink",
      targetId: "privateEndpoints::openAiPrivateDnsZone",
    },
    {
      sourceId: "privateEndpoints::openAiPrivateDnsZoneVirtualNetworkLink",
      targetId: "privateEndpoints::vnet",
    },
    {
      sourceId: "privateEndpoints",
      targetId: "aiServices",
    },
    {
      sourceId: "privateEndpoints",
      targetId: "containerRegistry",
    },
    {
      sourceId: "privateEndpoints",
      targetId: "hub",
    },
    {
      sourceId: "privateEndpoints",
      targetId: "keyVault",
    },
    {
      sourceId: "privateEndpoints",
      targetId: "network",
    },
    {
      sourceId: "privateEndpoints",
      targetId: "storageAccount",
    },
    {
      sourceId: "project::azureMLDataScientistManagedIdentityRoleAssignment",
      targetId: "project::azureMLDataScientistRole",
    },
    {
      sourceId: "project::azureMLDataScientistManagedIdentityRoleAssignment",
      targetId: "project::project",
    },
    {
      sourceId: "project::azureMLDataScientistUserRoleAssignment",
      targetId: "project::azureMLDataScientistRole",
    },
    {
      sourceId: "project::azureMLDataScientistUserRoleAssignment",
      targetId: "project::project",
    },
    {
      sourceId: "project::diagnosticSettings",
      targetId: "project::project",
    },
    {
      sourceId: "project",
      targetId: "aiServices",
    },
    {
      sourceId: "project",
      targetId: "hub",
    },
    {
      sourceId: "project",
      targetId: "workspace",
    },
    {
      sourceId: "storageAccount::blobService",
      targetId: "storageAccount::storageAccount",
    },
    {
      sourceId: "storageAccount::blobServiceDiagnosticSettings",
      targetId: "storageAccount::blobService",
    },
    {
      sourceId: "storageAccount::containers",
      targetId: "storageAccount::blobService",
    },
    {
      sourceId: "storageAccount::storageAccountContributorUserRoleAssignment",
      targetId: "storageAccount::storageAccount",
    },
    {
      sourceId: "storageAccount::storageAccountContributorUserRoleAssignment",
      targetId: "storageAccount::storageAccountContributorRoleDefinition",
    },
    {
      sourceId: "storageAccount::storageBlobDataContributorManagedIdentityRoleAssignment",
      targetId: "storageAccount::storageAccount",
    },
    {
      sourceId: "storageAccount::storageBlobDataContributorManagedIdentityRoleAssignment",
      targetId: "storageAccount::storageBlobDataContributorRoleDefinition",
    },
    {
      sourceId: "storageAccount::storageBlobDataContributorUserRoleAssignment",
      targetId: "storageAccount::storageAccount",
    },
    {
      sourceId: "storageAccount::storageBlobDataContributorUserRoleAssignment",
      targetId: "storageAccount::storageBlobDataContributorRoleDefinition",
    },
    {
      sourceId: "storageAccount::storageFileDataPrivilegedContributorUserRoleAssignment",
      targetId: "storageAccount::storageAccount",
    },
    {
      sourceId: "storageAccount::storageFileDataPrivilegedContributorUserRoleAssignment",
      targetId: "storageAccount::storageFileDataPrivilegedContributorRoleDefinition",
    },
    {
      sourceId: "storageAccount::storageTableDataContributorUserRoleAssignment",
      targetId: "storageAccount::storageAccount",
    },
    {
      sourceId: "storageAccount::storageTableDataContributorUserRoleAssignment",
      targetId: "storageAccount::storageTableDataContributorRoleDefinition",
    },
    {
      sourceId: "storageAccount",
      targetId: "aiServices",
    },
    {
      sourceId: "storageAccount",
      targetId: "workspace",
    },
    {
      sourceId: "virtualMachine::amaExtension",
      targetId: "virtualMachine::dependencyExtension",
    },
    {
      sourceId: "virtualMachine::amaExtension",
      targetId: "virtualMachine::virtualMachine",
    },
    {
      sourceId: "virtualMachine::dcrEventLogs",
      targetId: "virtualMachine::entraExtension",
    },
    {
      sourceId: "virtualMachine::dcrEventLogsAssociation",
      targetId: "virtualMachine::dcrEventLogs",
    },
    {
      sourceId: "virtualMachine::dcrEventLogsAssociation",
      targetId: "virtualMachine::virtualMachine",
    },
    {
      sourceId: "virtualMachine::dcrPerfLaw",
      targetId: "virtualMachine::entraExtension",
    },
    {
      sourceId: "virtualMachine::dcrPerfLawAssociation",
      targetId: "virtualMachine::dcrPerfLaw",
    },
    {
      sourceId: "virtualMachine::dcrPerfLawAssociation",
      targetId: "virtualMachine::virtualMachine",
    },
    {
      sourceId: "virtualMachine::dependencyExtension",
      targetId: "virtualMachine::virtualMachine",
    },
    {
      sourceId: "virtualMachine::entraExtension",
      targetId: "virtualMachine::amaExtension",
    },
    {
      sourceId: "virtualMachine::entraExtension",
      targetId: "virtualMachine::virtualMachine",
    },
    {
      sourceId: "virtualMachine::virtualMachine",
      targetId: "virtualMachine::storageAccount",
    },
    {
      sourceId: "virtualMachine::virtualMachine",
      targetId: "virtualMachine::virtualMachineNic",
    },
    {
      sourceId: "virtualMachine::virtualMachineAdministratorLoginUserRoleAssignment",
      targetId: "virtualMachine::virtualMachine",
    },
    {
      sourceId: "virtualMachine::virtualMachineAdministratorLoginUserRoleAssignment",
      targetId: "virtualMachine::virtualMachineAdministratorLoginRoleDefinition",
    },
    {
      sourceId: "virtualMachine",
      targetId: "network",
    },
    {
      sourceId: "virtualMachine",
      targetId: "storageAccount",
    },
    {
      sourceId: "virtualMachine",
      targetId: "workspace",
    },
  ],
  errorCount: 0,
};

export const App: FC = () => {
  const [elements, setElements] = useState<ElementDefinition[]>([]);
  const [graph, setGraph] = useState<DeploymentGraph | null>(DEMO_GRAPH);
  const [theme, setTheme] = useState<DefaultTheme>(darkTheme);

  const handleMessageEvent = (e: MessageEvent<Message>) => {
    const message = e.data;
    if (message.kind === "DEPLOYMENT_GRAPH") {
      vscode.setState(message.documentPath);
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
    vscode.postMessage(READY_MESSAGE);
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
      <StatusBar errorCount={graph?.errorCount ?? 0} hasNodes={elements.length > 0} />
    </ThemeProvider>
  );
};
