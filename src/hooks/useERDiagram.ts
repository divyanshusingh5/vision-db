import { useState, useCallback } from "react";
import { Table, Column, Relationship, RelationshipType, ColumnType } from "@/types/erd";

const generateId = () => Math.random().toString(36).substr(2, 9);

const createDefaultColumn = (): Column => ({
  id: generateId(),
  name: "id",
  type: "SERIAL",
  isPrimaryKey: true,
  isForeignKey: false,
  isNullable: false,
  isUnique: true,
});

export function useERDiagram() {
  const [tables, setTables] = useState<Table[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  const addTable = useCallback((name: string) => {
    const newTable: Table = {
      id: generateId(),
      name,
      columns: [createDefaultColumn()],
      position: {
        x: 100 + Math.random() * 400,
        y: 100 + Math.random() * 300,
      },
    };
    setTables((prev) => [...prev, newTable]);
    return newTable.id;
  }, []);

  const removeTable = useCallback((tableId: string) => {
    setTables((prev) => prev.filter((t) => t.id !== tableId));
    setRelationships((prev) =>
      prev.filter((r) => r.fromTableId !== tableId && r.toTableId !== tableId)
    );
    setSelectedTableId((prev) => (prev === tableId ? null : prev));
  }, []);

  const updateTableName = useCallback((tableId: string, name: string) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, name } : t))
    );
  }, []);

  const updateTablePosition = useCallback((tableId: string, position: { x: number; y: number }) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, position } : t))
    );
  }, []);

  const addColumn = useCallback((tableId: string) => {
    const newCol: Column = {
      id: generateId(),
      name: "column",
      type: "VARCHAR",
      isPrimaryKey: false,
      isForeignKey: false,
      isNullable: true,
      isUnique: false,
    };
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId ? { ...t, columns: [...t.columns, newCol] } : t
      )
    );
  }, []);

  const removeColumn = useCallback((tableId: string, columnId: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? { ...t, columns: t.columns.filter((c) => c.id !== columnId) }
          : t
      )
    );
    setRelationships((prev) =>
      prev.filter(
        (r) =>
          !(r.fromTableId === tableId && r.fromColumnId === columnId) &&
          !(r.toTableId === tableId && r.toColumnId === columnId)
      )
    );
  }, []);

  const updateColumn = useCallback(
    (tableId: string, columnId: string, updates: Partial<Column>) => {
      setTables((prev) =>
        prev.map((t) =>
          t.id === tableId
            ? {
                ...t,
                columns: t.columns.map((c) =>
                  c.id === columnId ? { ...c, ...updates } : c
                ),
              }
            : t
        )
      );
    },
    []
  );

  const addRelationship = useCallback(
    (
      type: RelationshipType,
      fromTableId: string,
      fromColumnId: string,
      toTableId: string,
      toColumnId: string
    ) => {
      const rel: Relationship = {
        id: generateId(),
        type,
        fromTableId,
        fromColumnId,
        toTableId,
        toColumnId,
      };
      setRelationships((prev) => [...prev, rel]);
    },
    []
  );

  const removeRelationship = useCallback((relId: string) => {
    setRelationships((prev) => prev.filter((r) => r.id !== relId));
  }, []);

  const loadSampleData = useCallback(() => {
    const usersTable: Table = {
      id: "users",
      name: "users",
      columns: [
        { id: "u1", name: "id", type: "SERIAL", isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: "u2", name: "username", type: "VARCHAR", isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: true },
        { id: "u3", name: "email", type: "VARCHAR", isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: true },
        { id: "u4", name: "created_at", type: "TIMESTAMPTZ", isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
      ],
      position: { x: 80, y: 80 },
    };

    const postsTable: Table = {
      id: "posts",
      name: "posts",
      columns: [
        { id: "p1", name: "id", type: "SERIAL", isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: "p2", name: "title", type: "VARCHAR", isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: "p3", name: "body", type: "TEXT", isPrimaryKey: false, isForeignKey: false, isNullable: true, isUnique: false },
        { id: "p4", name: "user_id", type: "INT", isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false },
        { id: "p5", name: "published", type: "BOOLEAN", isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false, defaultValue: "false" },
      ],
      position: { x: 450, y: 80 },
    };

    const commentsTable: Table = {
      id: "comments",
      name: "comments",
      columns: [
        { id: "c1", name: "id", type: "SERIAL", isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: "c2", name: "content", type: "TEXT", isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: "c3", name: "post_id", type: "INT", isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false },
        { id: "c4", name: "user_id", type: "INT", isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false },
        { id: "c5", name: "created_at", type: "TIMESTAMPTZ", isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
      ],
      position: { x: 450, y: 380 },
    };

    const tagsTable: Table = {
      id: "tags",
      name: "tags",
      columns: [
        { id: "t1", name: "id", type: "SERIAL", isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: "t2", name: "name", type: "VARCHAR", isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: true },
      ],
      position: { x: 80, y: 380 },
    };

    setTables([usersTable, postsTable, commentsTable, tagsTable]);
    setRelationships([
      { id: "r1", type: "one-to-many", fromTableId: "users", fromColumnId: "u1", toTableId: "posts", toColumnId: "p4" },
      { id: "r2", type: "one-to-many", fromTableId: "posts", fromColumnId: "p1", toTableId: "comments", toColumnId: "c3" },
      { id: "r3", type: "one-to-many", fromTableId: "users", fromColumnId: "u1", toTableId: "comments", toColumnId: "c4" },
    ]);
  }, []);

  return {
    tables,
    relationships,
    selectedTableId,
    setSelectedTableId,
    addTable,
    removeTable,
    updateTableName,
    updateTablePosition,
    addColumn,
    removeColumn,
    updateColumn,
    addRelationship,
    removeRelationship,
    loadSampleData,
  };
}
