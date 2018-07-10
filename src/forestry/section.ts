/**
 * The data strucfture for Sections defined in the `.forestry/settings.yml`
 */
export interface Section {
  path: string;
  label: string;
  create: "all" | "documents" | "none";
  templates?: string[];
}
