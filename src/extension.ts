"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { SectionWidget } from "./section-widget";
import { Site } from "./forestry/site";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "forestry" is now active!');
  const rootPath = vscode.workspace.rootPath || "";
  const forestryExtConfig = vscode.workspace.getConfiguration("forestry");

  const site = new Site(rootPath, forestryExtConfig["pathToSettings"]);

  const sectionWidget = new SectionWidget(site);

  context.subscriptions.push(site);
  context.subscriptions.push(sectionWidget);
}

// this method is called when your extension is deactivated
export function deactivate() {}
