import React, { useState } from "react";
import { Table, Column, Relationship, RelationshipType, COLUMN_TYPES, ColumnType } from "@/types/erd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Trash2,
  Table as TableIcon,
  Columns,
  Link,
  Database,
  ChevronRight,
  X,
} from "lucide-react";

interface SidebarProps {
  tables: Table[];
  relationships: Relationship[];
  selectedTableId: string | null;
  onAddTable: (name: string) => void;
  onRemoveTable: (id: string) => void;
  onSelectTable: (id: string | null) => void;
  onUpdateTableName: (id: string, name: string) => void;
  onAddColumn: (tableId: string) => void;
  onRemoveColumn: (tableId: string, columnId: string) => void;
  onUpdateColumn: (tableId: string, columnId: string, updates: Partial<Column>) => void;
  onAddRelationship: (
    type: RelationshipType,
    fromTableId: string,
    fromColumnId: string,
    toTableId: string,
    toColumnId: string
  ) => void;
  onRemoveRelationship: (id: string) => void;
  onLoadSample: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  tables,
  relationships,
  selectedTableId,
  onAddTable,
  onRemoveTable,
  onSelectTable,
  onUpdateTableName,
  onAddColumn,
  onRemoveColumn,
  onUpdateColumn,
  onAddRelationship,
  onRemoveRelationship,
  onLoadSample,
}) => {
  const [newTableName, setNewTableName] = useState("");
  const [showRelForm, setShowRelForm] = useState(false);
  const [relForm, setRelForm] = useState({
    type: "one-to-many" as RelationshipType,
    fromTableId: "",
    fromColumnId: "",
    toTableId: "",
    toColumnId: "",
  });

  const selectedTable = tables.find((t) => t.id === selectedTableId);

  const handleAddTable = () => {
    if (!newTableName.trim()) return;
    onAddTable(newTableName.trim().toLowerCase().replace(/\s+/g, "_"));
    setNewTableName("");
  };

  const handleAddRelationship = () => {
    if (
      relForm.fromTableId &&
      relForm.fromColumnId &&
      relForm.toTableId &&
      relForm.toColumnId
    ) {
      onAddRelationship(
        relForm.type,
        relForm.fromTableId,
        relForm.fromColumnId,
        relForm.toTableId,
        relForm.toColumnId
      );
      setShowRelForm(false);
      setRelForm({
        type: "one-to-many",
        fromTableId: "",
        fromColumnId: "",
        toTableId: "",
        toColumnId: "",
      });
    }
  };

  const fromTableCols = tables.find((t) => t.id === relForm.fromTableId)?.columns || [];
  const toTableCols = tables.find((t) => t.id === relForm.toTableId)?.columns || [];

  return (
    <div className="flex h-full w-80 flex-col border-r border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Database className="h-5 w-5 text-primary" />
        <h1 className="font-mono text-sm font-bold text-foreground">ER Diagram</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Add Table */}
        <div className="border-b border-border p-4">
          <p className="mb-2 font-mono text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Add Table
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="table_name"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTable()}
              className="font-mono text-xs bg-muted border-border"
            />
            <Button size="sm" onClick={handleAddTable} className="shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tables List */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tables ({tables.length})
            </p>
            <Button variant="ghost" size="sm" onClick={onLoadSample} className="text-xs h-6 px-2 text-muted-foreground hover:text-foreground">
              Load Sample
            </Button>
          </div>
          <div className="space-y-1">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer transition-colors ${
                  selectedTableId === table.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-foreground"
                }`}
                onClick={() => onSelectTable(table.id)}
              >
                <TableIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="font-mono text-xs flex-1 truncate">{table.name}</span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {table.columns.length} cols
                </span>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              </div>
            ))}
            {tables.length === 0 && (
              <p className="text-xs text-muted-foreground py-2 text-center">
                No tables yet
              </p>
            )}
          </div>
        </div>

        {/* Selected Table Detail */}
        {selectedTable && (
          <div className="border-b border-border p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Columns className="h-3.5 w-3.5 text-primary" />
                <Input
                  value={selectedTable.name}
                  onChange={(e) => onUpdateTableName(selectedTable.id, e.target.value)}
                  className="font-mono text-xs h-7 bg-muted border-border w-32"
                />
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onAddColumn(selectedTable.id)}
                  className="h-7 w-7 p-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    onRemoveTable(selectedTable.id);
                  }}
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {selectedTable.columns.map((col) => (
                <div
                  key={col.id}
                  className="rounded-md border border-border bg-muted/50 p-2 space-y-2"
                >
                  <div className="flex gap-2">
                    <Input
                      value={col.name}
                      onChange={(e) =>
                        onUpdateColumn(selectedTable.id, col.id, { name: e.target.value })
                      }
                      className="font-mono text-xs h-7 bg-background border-border flex-1"
                    />
                    <Select
                      value={col.type}
                      onValueChange={(v) =>
                        onUpdateColumn(selectedTable.id, col.id, { type: v as ColumnType })
                      }
                    >
                      <SelectTrigger className="font-mono text-xs h-7 w-28 bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COLUMN_TYPES.map((t) => (
                          <SelectItem key={t} value={t} className="font-mono text-xs">
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveColumn(selectedTable.id, col.id)}
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Checkbox
                        checked={col.isPrimaryKey}
                        onCheckedChange={(v) =>
                          onUpdateColumn(selectedTable.id, col.id, { isPrimaryKey: !!v })
                        }
                        className="h-3 w-3"
                      />
                      PK
                    </label>
                    <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Checkbox
                        checked={col.isForeignKey}
                        onCheckedChange={(v) =>
                          onUpdateColumn(selectedTable.id, col.id, { isForeignKey: !!v })
                        }
                        className="h-3 w-3"
                      />
                      FK
                    </label>
                    <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Checkbox
                        checked={!col.isNullable}
                        onCheckedChange={(v) =>
                          onUpdateColumn(selectedTable.id, col.id, { isNullable: !v })
                        }
                        className="h-3 w-3"
                      />
                      NOT NULL
                    </label>
                    <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Checkbox
                        checked={col.isUnique}
                        onCheckedChange={(v) =>
                          onUpdateColumn(selectedTable.id, col.id, { isUnique: !!v })
                        }
                        className="h-3 w-3"
                      />
                      UQ
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Relationships */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Relationships ({relationships.length})
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowRelForm(!showRelForm)}
              className="h-6 w-6 p-0"
              disabled={tables.length < 2}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          {showRelForm && (
            <div className="rounded-md border border-border bg-muted/50 p-3 mb-3 space-y-2 animate-fade-in">
              <Select
                value={relForm.type}
                onValueChange={(v) => setRelForm((f) => ({ ...f, type: v as RelationshipType }))}
              >
                <SelectTrigger className="font-mono text-xs h-7 bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-to-one" className="font-mono text-xs">1:1</SelectItem>
                  <SelectItem value="one-to-many" className="font-mono text-xs">1:N</SelectItem>
                  <SelectItem value="many-to-many" className="font-mono text-xs">N:N</SelectItem>
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-2">
                <Select value={relForm.fromTableId} onValueChange={(v) => setRelForm((f) => ({ ...f, fromTableId: v, fromColumnId: "" }))}>
                  <SelectTrigger className="font-mono text-xs h-7 bg-background border-border">
                    <SelectValue placeholder="From table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((t) => (
                      <SelectItem key={t.id} value={t.id} className="font-mono text-xs">{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={relForm.fromColumnId} onValueChange={(v) => setRelForm((f) => ({ ...f, fromColumnId: v }))}>
                  <SelectTrigger className="font-mono text-xs h-7 bg-background border-border">
                    <SelectValue placeholder="Column" />
                  </SelectTrigger>
                  <SelectContent>
                    {fromTableCols.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="font-mono text-xs">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <Link className="h-3 w-3 text-muted-foreground rotate-90" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Select value={relForm.toTableId} onValueChange={(v) => setRelForm((f) => ({ ...f, toTableId: v, toColumnId: "" }))}>
                  <SelectTrigger className="font-mono text-xs h-7 bg-background border-border">
                    <SelectValue placeholder="To table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((t) => (
                      <SelectItem key={t.id} value={t.id} className="font-mono text-xs">{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={relForm.toColumnId} onValueChange={(v) => setRelForm((f) => ({ ...f, toColumnId: v }))}>
                  <SelectTrigger className="font-mono text-xs h-7 bg-background border-border">
                    <SelectValue placeholder="Column" />
                  </SelectTrigger>
                  <SelectContent>
                    {toTableCols.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="font-mono text-xs">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button size="sm" onClick={handleAddRelationship} className="w-full h-7 text-xs">
                Add Relationship
              </Button>
            </div>
          )}

          <div className="space-y-1">
            {relationships.map((rel) => {
              const from = tables.find((t) => t.id === rel.fromTableId);
              const to = tables.find((t) => t.id === rel.toTableId);
              const fromCol = from?.columns.find((c) => c.id === rel.fromColumnId);
              const toCol = to?.columns.find((c) => c.id === rel.toColumnId);
              return (
                <div
                  key={rel.id}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted transition-colors group"
                >
                  <Link className="h-3 w-3 text-primary shrink-0" />
                  <span className="font-mono text-[10px] text-foreground flex-1 truncate">
                    {from?.name}.{fromCol?.name}{" "}
                    <span className="text-primary">
                      {rel.type === "one-to-one" ? "1:1" : rel.type === "one-to-many" ? "1:N" : "N:N"}
                    </span>{" "}
                    {to?.name}.{toCol?.name}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveRelationship(rel.id)}
                    className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
