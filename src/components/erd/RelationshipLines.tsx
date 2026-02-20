import React from "react";
import { Table, Relationship } from "@/types/erd";

interface RelationshipLinesProps {
  relationships: Relationship[];
  tables: Table[];
}

const TABLE_WIDTH = 220;
const HEADER_HEIGHT = 36;
const ROW_HEIGHT = 28;

function getColumnY(table: Table, columnId: string): number {
  const idx = table.columns.findIndex((c) => c.id === columnId);
  return table.position.y + HEADER_HEIGHT + idx * ROW_HEIGHT + ROW_HEIGHT / 2;
}

function getConnectionPoints(
  fromTable: Table,
  fromColumnId: string,
  toTable: Table,
  toColumnId: string
) {
  const fromY = getColumnY(fromTable, fromColumnId);
  const toY = getColumnY(toTable, toColumnId);

  const fromCenterX = fromTable.position.x + TABLE_WIDTH / 2;
  const toCenterX = toTable.position.x + TABLE_WIDTH / 2;

  let fromX: number, toX: number;

  if (fromCenterX < toCenterX) {
    fromX = fromTable.position.x + TABLE_WIDTH;
    toX = toTable.position.x;
  } else {
    fromX = fromTable.position.x;
    toX = toTable.position.x + TABLE_WIDTH;
  }

  return { fromX, fromY, toX, toY };
}

function renderMarker(type: Relationship["type"], isFrom: boolean) {
  if (isFrom) {
    return (
      <circle r="4" fill="hsl(var(--relationship-line))" />
    );
  }
  if (type === "one-to-one") {
    return <circle r="4" fill="hsl(var(--relationship-line))" />;
  }
  // many side - crow's foot
  return null;
}

const RelationshipLines: React.FC<RelationshipLinesProps> = ({
  relationships,
  tables,
}) => {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
      <defs>
        <marker
          id="arrow-one"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="5"
          orient="auto"
        >
          <line x1="9" y1="1" x2="9" y2="9" stroke="hsl(var(--relationship-line))" strokeWidth="2" />
        </marker>
        <marker
          id="arrow-many"
          markerWidth="14"
          markerHeight="14"
          refX="1"
          refY="7"
          orient="auto"
        >
          <path
            d="M1,7 L13,1 M1,7 L13,7 M1,7 L13,13"
            stroke="hsl(var(--relationship-line))"
            strokeWidth="1.5"
            fill="none"
          />
        </marker>
        <marker
          id="dot"
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="4"
          orient="auto"
        >
          <circle cx="4" cy="4" r="3" fill="hsl(var(--relationship-line))" />
        </marker>
      </defs>

      {relationships.map((rel) => {
        const fromTable = tables.find((t) => t.id === rel.fromTableId);
        const toTable = tables.find((t) => t.id === rel.toTableId);
        if (!fromTable || !toTable) return null;

        const { fromX, fromY, toX, toY } = getConnectionPoints(
          fromTable,
          rel.fromColumnId,
          toTable,
          rel.toColumnId
        );

        const midX = (fromX + toX) / 2;
        const path = `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;

        const endMarker =
          rel.type === "one-to-many" || rel.type === "many-to-many"
            ? "url(#arrow-many)"
            : "url(#arrow-one)";

        return (
          <g key={rel.id}>
            <path
              d={path}
              fill="none"
              stroke="hsl(var(--relationship-line))"
              strokeWidth="2"
              strokeDasharray={rel.type === "many-to-many" ? "6 3" : "none"}
              markerStart="url(#dot)"
              markerEnd={endMarker}
              opacity={0.7}
            />
            {/* Label */}
            <text
              x={midX}
              y={Math.min(fromY, toY) - 8}
              textAnchor="middle"
              className="fill-muted-foreground font-mono text-[9px]"
            >
              {rel.type === "one-to-one"
                ? "1:1"
                : rel.type === "one-to-many"
                ? "1:N"
                : "N:N"}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default RelationshipLines;
