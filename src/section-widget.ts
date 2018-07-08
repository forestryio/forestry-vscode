import { Forestry } from "./forestry";
import * as vscode from "vscode";

export class SectionWidget implements vscode.Disposable {
  private sectionStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  private disposableSectionStatusUpdate: vscode.Disposable;

  constructor(private site: Forestry.Site) {
    this.updateSectionStatus(vscode.window.activeTextEditor);
    this.disposableSectionStatusUpdate = vscode.window.onDidChangeActiveTextEditor(
      this.updateSectionStatus
    );
  }
  updateSectionStatus = (editor?: vscode.TextEditor) => {
    if (editor) {
      const section = this.site.sectionForUri(editor.document.uri);
      if (section) {
        this.sectionStatusBarItem.text = `Forestry.io Section: ${
          section.label
        }`;
        this.sectionStatusBarItem.show();
      } else {
        this.sectionStatusBarItem.hide();
      }
    }
  };

  dispose() {
    this.disposableSectionStatusUpdate.dispose();
    this.sectionStatusBarItem.dispose();
  }
}
