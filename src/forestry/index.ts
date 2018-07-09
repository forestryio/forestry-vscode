import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as yaml from "yamljs";
import { EventEmitter } from "events";

export namespace Forestry {
  export enum SiteEvents {
    error = "error"
  }

  /**
   * Represents the Site as understood by Forestry.
   */
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

    private loadForestrySettings() {
      try {
        this.settings = Settings.load(this.absForestryPath);
      } catch (e) {
        // TODO: Distinguish bewteen missing & invalid
        this.emit(
          SiteEvents.error,
          ".forestry/settings.yml not found or invalid"
        );
      }
    }
  }

  /**
   * The `.forestry/settings.yml` datastructure.
   */
  export interface Settings {
    sections: Section[];
  }

  /**
   * The data strucfture for Sections defined in the `.forestry/settings.yml`
   */
  export interface Section {
    path: string;
    label: string;
    create: "all" | "documents" | "none";
    templates?: string[];
  }

  /**
   * Provides helper methods for interacting with the `.forestry/settings.yml`
   */
  export class Settings {
    static DEFAULT: Settings = {
      sections: []
    };
    static load(forestryPath: string) {
      const settingsPath = path.join(forestryPath, "settings.yml");
      const settingsFile = fs.readFileSync(settingsPath);
      return { ...Settings.DEFAULT, ...yaml.parse(settingsFile.toString()) };
    }
  }
}
