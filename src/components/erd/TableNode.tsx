import React, { useRef, useState, useCallback } from "react";
import { Table } from "@/types/erd";
import { Key, Hash, Link, GripVertical } from "lucide-react";

interface TableNodeProps {
  table: Table;
  isSelected: boolean;
  onSelect: () => void;
  onPositionChange: (pos: { x: number; y: number }) => void;
}

const TableNode: React.FC<TableNodeProps> = ({
  table,
  isSelected,
  onSelect,
  onPositionChange,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".no-drag")) return;
      e.preventDefault();
      setDragging(true);
      const rect = nodeRef.current!.getBoundingClientRect();
      const parent = nodeRef.current!.parentElement!.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left + parent.left,
        y: e.clientY - rect.top + parent.top,
      };

      const handleMouseMove = (e: MouseEvent) => {
        const parent = nodeRef.current!.parentElement!.getBoundingClientRect();
        onPositionChange({
          x: e.clientX - dragOffset.current.x - parent.left + nodeRef.current!.parentElement!.scrollLeft,
          y: e.clientY - dragOffset.current.y - parent.top + nodeRef.current!.parentElement!.scrollTop,
        });
      };

      const handleMouseUp = () => {
        setDragging(false);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [onPositionChange]
  );

  return (
    <div
      ref={nodeRef}
      className={`absolute select-none rounded-lg border shadow-lg transition-shadow min-w-[220px] animate-scale-in ${
        isSelected
          ? "border-primary shadow-primary/20 ring-1 ring-primary/30"
          : "border-border shadow-black/30"
      } ${dragging ? "cursor-grabbing z-50" : "cursor-grab z-10"}`}
      style={{ left: table.position.x, top: table.position.y }}
      onMouseDown={(e) => {
        onSelect();
        handleMouseDown(e);
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 rounded-t-lg bg-table-header px-3 py-2">
        <GripVertical className="h-3.5 w-3.5 text-table-header-foreground/60" />
        <span className="font-mono text-sm font-semibold text-table-header-foreground">
          {table.name}
        </span>
      </div>

      {/* Columns */}
      <div className="rounded-b-lg bg-card">
        {table.columns.map((col, i) => (
          <div
            key={col.id}
            className={`flex items-center gap-2 px-3 py-1.5 font-mono text-xs ${
              i < table.columns.length - 1 ? "border-b border-border/50" : ""
            } hover:bg-muted/50 transition-colors`}
          >
            <span className="w-4 flex-shrink-0">
              {col.isPrimaryKey ? (
                <Key className="h-3 w-3 text-column-key" />
              ) : col.isForeignKey ? (
                <Link className="h-3 w-3 text-column-fk" />
              ) : col.isUnique ? (
                <Hash className="h-3 w-3 text-muted-foreground" />
              ) : null}
            </span>
            <span className="flex-1 text-foreground">{col.name}</span>
            <span className="text-column-type text-[10px] font-medium uppercase">
              {col.type}
            </span>
            {!col.isNullable && (
              <span className="text-destructive text-[9px] font-bold">NN</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableNode;
