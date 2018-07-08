"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Forestry } from "./forestry";

let site: Forestry.Site;
let sectionStatusBarItem = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Left
);
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "forestry" is now active!');

  // TODO: Add to .vscode workspace settings?
  const pathToForestryDir = "src/.forestry";

  site = new Forestry.Site(vscode.workspace.rootPath || "", pathToForestryDir);

  updateSectionStatus(vscode.window.activeTextEditor);

  let disposableSectionStatusUpdate = vscode.window.onDidChangeActiveTextEditor(
    updateSectionStatus
  );

  context.subscriptions.push(disposableSectionStatusUpdate);
}

function updateSectionStatus(editor?: vscode.TextEditor) {
  if (editor) {
    const section = site.sectionForUri(editor.document.uri);
    if (section) {
      sectionStatusBarItem.text = `Forestry.io Section: ${section.label}`;
      sectionStatusBarItem.show();
    } else {
      sectionStatusBarItem.hide();
    }
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
