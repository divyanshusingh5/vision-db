import React from "react";
import { Table, Relationship } from "@/types/erd";
import TableNode from "./TableNode";
import RelationshipLines from "./RelationshipLines";

interface ERCanvasProps {
  tables: Table[];
  relationships: Relationship[];
  selectedTableId: string | null;
  onSelectTable: (id: string) => void;
  onUpdatePosition: (tableId: string, pos: { x: number; y: number }) => void;
}

const ERCanvas: React.FC<ERCanvasProps> = ({
  tables,
  relationships,
  selectedTableId,
  onSelectTable,
  onUpdatePosition,
}) => {
  return (
    <div
      className="relative flex-1 overflow-auto canvas-grid"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          // deselect handled by parent if needed
        }
      }}
    >
      <div className="relative min-h-full min-w-full" style={{ width: 2000, height: 1500 }}>
        <RelationshipLines relationships={relationships} tables={tables} />
        {tables.map((table) => (
          <TableNode
            key={table.id}
            table={table}
            isSelected={selectedTableId === table.id}
            onSelect={() => onSelectTable(table.id)}
            onPositionChange={(pos) => onUpdatePosition(table.id, pos)}
          />
        ))}

        {tables.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <p className="font-mono text-sm text-muted-foreground">
                No tables yet
              </p>
              <p className="font-mono text-xs text-muted-foreground/60">
                Add a table from the sidebar or load sample data
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ERCanvas;
