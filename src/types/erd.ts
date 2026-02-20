export type ColumnType =
  | "INT" | "BIGINT" | "SERIAL" | "BIGSERIAL"
  | "VARCHAR" | "TEXT" | "CHAR"
  | "BOOLEAN"
  | "DATE" | "TIMESTAMP" | "TIMESTAMPTZ"
  | "FLOAT" | "DOUBLE" | "DECIMAL" | "NUMERIC"
  | "UUID" | "JSON" | "JSONB"
  | "BYTEA";

export const COLUMN_TYPES: ColumnType[] = [
  "INT", "BIGINT", "SERIAL", "BIGSERIAL",
  "VARCHAR", "TEXT", "CHAR",
  "BOOLEAN",
  "DATE", "TIMESTAMP", "TIMESTAMPTZ",
  "FLOAT", "DOUBLE", "DECIMAL", "NUMERIC",
  "UUID", "JSON", "JSONB",
  "BYTEA",
];

export interface Column {
  id: string;
  name: string;
  type: ColumnType;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isNullable: boolean;
  isUnique: boolean;
  defaultValue?: string;
}

export interface Table {
  id: string;
  name: string;
  columns: Column[];
  position: { x: number; y: number };
  color?: string;
}

export type RelationshipType = "one-to-one" | "one-to-many" | "many-to-many";

export interface Relationship {
  id: string;
  type: RelationshipType;
  fromTableId: string;
  fromColumnId: string;
  toTableId: string;
  toColumnId: string;
}

export interface ERDiagram {
  tables: Table[];
  relationships: Relationship[];
}
