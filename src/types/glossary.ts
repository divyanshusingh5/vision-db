export interface SQLPattern {
  id: string;
  name: string;
  sql: string;
  description?: string;
}

export type Priority = "P0" | "P1" | "P2" | "P3";

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
  synonyms: string[];
  sqlPatterns: SQLPattern[];
  priority: Priority;
  dataset?: string;
  createdAt: string;
  updatedAt: string;
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  P0: "Critical",
  P1: "High",
  P2: "Medium",
  P3: "Low",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  P0: "destructive",
  P1: "default",
  P2: "secondary",
  P3: "outline",
};

export const DEFAULT_CATEGORIES = [
  "Revenue",
  "Customer",
  "Product",
  "Operations",
  "Finance",
  "Marketing",
  "HR",
  "General",
];

export const DEFAULT_DATASETS = [
  "All Datasets",
  "Sales DB",
  "Marketing DB",
  "Finance DB",
  "HR DB",
  "Product Analytics",
];
