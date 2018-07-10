import * as vscode from "vscode";
import * as path from "path";
import { EventEmitter } from "events";
import { Settings } from "./settings";
import { Section } from "./section";

export class Site extends EventEmitter {
  error: string | null = null;

  settings: Settings = {
    sections: []
  };

  constructor(
    private rootPath: string,
    private forestryPath: string = ".forestry"
  ) {
    super();
    this.loadForestrySettings();
  }

  /**
   * The absolute path to the .forestry diretory.
   */
  get absForestryPath(): string {
    return path.join(this.rootPath, this.forestryPath);
  }

  /**
   * Given an vscode Uri, determine if the file is in a Forestry Section and return.
   */
  sectionForUri(uri: vscode.Uri): Section | null {
    const relPath = uri.path.replace(this.rootPath + "/", "");
    const section = this.settings.sections.find(section =>
      relPath.startsWith(section.path)
    );

    if (section) {
      return section;
    }

    return null;
  }

  dispose() {
    // TODO: Dispose of site properly.
  }

  private loadForestrySettings() {
    try {
      this.settings = Settings.load(this.absForestryPath);
    } catch (e) {
      vscode.window.showErrorMessage("Failed to load Forestry.io Settings");
    }
  }
}
