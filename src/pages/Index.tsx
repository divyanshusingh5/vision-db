import React from "react";
import Sidebar from "@/components/erd/Sidebar";
import ERCanvas from "@/components/erd/ERCanvas";
import { useERDiagram } from "@/hooks/useERDiagram";

const Index = () => {
  const erd = useERDiagram();

  return (
    <div className="flex h-screen w-screen overflow-hidden">
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
  );
};

export default Index;
