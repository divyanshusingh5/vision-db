import React, { useState } from "react";
import Sidebar from "@/components/erd/Sidebar";
import ERCanvas from "@/components/erd/ERCanvas";
import GlossaryPage from "@/components/glossary/GlossaryPage";
import { useERDiagram } from "@/hooks/useERDiagram";
import { Database, BookOpen } from "lucide-react";

type View = "erd" | "glossary";

const Index = () => {
  const erd = useERDiagram();
  const [view, setView] = useState<View>("erd");

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Global nav strip */}
      <div className="w-12 shrink-0 bg-card border-r border-border flex flex-col items-center py-3 gap-2">
        <button
          onClick={() => setView("erd")}
          className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${
            view === "erd" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          title="ER Diagram"
        >
          <Database className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={() => setView("glossary")}
          className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${
            view === "glossary" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          title="Business Glossary"
        >
          <BookOpen className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* View content */}
      {view === "erd" ? (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            tables={erd.tables}
            relationships={erd.relationships}
            selectedTableId={erd.selectedTableId}
            onAddTable={erd.addTable}
            onRemoveTable={erd.removeTable}
            onSelectTable={erd.setSelectedTableId}
            onUpdateTableName={erd.updateTableName}
            onAddColumn={erd.addColumn}
            onRemoveColumn={erd.removeColumn}
            onUpdateColumn={erd.updateColumn}
            onAddRelationship={erd.addRelationship}
            onRemoveRelationship={erd.removeRelationship}
            onLoadSample={erd.loadSampleData}
          />
          <ERCanvas
            tables={erd.tables}
            relationships={erd.relationships}
            selectedTableId={erd.selectedTableId}
            onSelectTable={erd.setSelectedTableId}
            onUpdatePosition={erd.updateTablePosition}
          />
        </div>
      ) : (
        <GlossaryPage />
      )}
    </div>
  );
};

export default Index;
