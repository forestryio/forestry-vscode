import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as yaml from "yamljs";
import { EventEmitter } from "events";

export namespace Forestry {
  export interface Section {
    path: string;
    label: string;
    create: "all" | "documents" | "none";
    templates?: string[];
  }

  export enum SiteEvents {
    error = "error"
  }

  /**
   * Represents the Site as understood by Forestry.
   */
  export class Site extends EventEmitter {
    error: string | null = null;
    sections: Section[] = [];

    constructor(
      private rootPath: string,
      private forestryPath: string = ".forestry"
    ) {
      super();
      this.loadForestrySettings();
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

    private loadForestrySettings() {
      try {
        const settingsPath = path.join(
          this.rootPath,
          this.forestryPath,
          "settings.yml"
        );
        const settingsFile = fs.readFileSync(settingsPath);
        const settings = yaml.parse(settingsFile.toString());
        this.sections = settings.sections || [];
      } catch (e) {
        // TODO: Distinguish bewteen missing & invalid
        this.emit(
          SiteEvents.error,
          ".forestry/settings.yml not found or invalid"
        );
      }
    }
  }
}
