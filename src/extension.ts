"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "yamljs";

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
  site = new Forestry.Site(vscode.workspace.rootPath || "");
  if (vscode.window.activeTextEditor) {
    updateSectionStatus(vscode.window.activeTextEditor);
  }

  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor) {
      updateSectionStatus(editor);
    }
  });
}

function updateSectionStatus(editor: vscode.TextEditor) {
  const section = site.sectionForUri(editor.document.uri);
  if (section) {
    sectionStatusBarItem.text = `Forestry.io Section: ${section.label}`;
    sectionStatusBarItem.show();
  } else {
    sectionStatusBarItem.hide();
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}

namespace Forestry {
  interface Section {
    path: string;
    label: string;
    create: "all" | "documents" | "none";
    templates?: string[];
  }
  export class Site {
    sections: Section[] = [];

    constructor(private rootPath: string) {
      this._loadForestrySettings();
    }

    sectionForUri(uri: vscode.Uri) {
      const relPath = uri.path.replace(this.rootPath + "/", "");
      const section = this.sections.find(section =>
        relPath.startsWith(section.path)
      );
      if (section) {
        return section;
      }
    }

    private _loadForestrySettings() {
      const settingsPath = path.join(
        this.rootPath,
        "src",
        ".forestry",
        "settings.yml"
      );
      const settingsFile = fs.readFileSync(settingsPath);
      if (settingsFile) {
        const settings = yaml.parse(settingsFile.toString());
        this.sections = settings.sections || [];
      }
    }
  }
}
