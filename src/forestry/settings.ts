import * as yaml from "yamljs";
import * as path from "path";
import * as fs from "fs";
import { Section } from "./section";

/**
 * The `.forestry/settings.yml` datastructure.
 */
export interface Settings {
  sections: Section[];
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
