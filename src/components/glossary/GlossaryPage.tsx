import React, { useState } from "react";
import { useGlossary } from "@/hooks/useGlossary";
import { GlossaryTerm, DEFAULT_DATASETS } from "@/types/glossary";
import GlossaryTermCard from "@/components/glossary/GlossaryTermCard";
import TermDialog from "@/components/glossary/TermDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, BookOpen, Database } from "lucide-react";

const GlossaryPage: React.FC = () => {
  const glossary = useGlossary();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<GlossaryTerm | null>(null);

  const handleEdit = (term: GlossaryTerm) => {
    setEditingTerm(term);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingTerm(null);
    setDialogOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Business Glossary</h1>
              <p className="text-xs text-muted-foreground">
                {glossary.filteredTerms.length} of {glossary.terms.length} terms
              </p>
            </div>
          </div>
          <Button onClick={handleAdd} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> Add Metric/KPI
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={glossary.searchQuery}
              onChange={(e) => glossary.setSearchQuery(e.target.value)}
              placeholder="Search terms, definitions, synonyms..."
              className="pl-9 text-sm"
            />
          </div>
          <Select value={glossary.selectedDataset} onValueChange={glossary.setSelectedDataset}>
            <SelectTrigger className="w-[160px] text-sm">
              <Database className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_DATASETS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category chips */}
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {glossary.categories.map((cat) => (
            <Badge
              key={cat}
              variant={glossary.selectedCategory === cat ? "default" : "outline"}
              className="cursor-pointer text-xs transition-colors"
              onClick={() => glossary.setSelectedCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {Object.keys(glossary.groupedTerms).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <BookOpen className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">No terms found</p>
            <Button variant="link" size="sm" onClick={handleAdd} className="mt-1">
              Add your first metric
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(glossary.groupedTerms)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([category, terms]) => (
                <div key={category}>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    {category}
                    <span className="ml-2 text-muted-foreground/50">({terms.length})</span>
                  </h2>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {terms.map((term) => (
                      <GlossaryTermCard key={term.id} term={term} onEdit={handleEdit} onDelete={glossary.deleteTerm} />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <TermDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingTerm={editingTerm}
        onSave={glossary.addTerm}
        onUpdate={glossary.updateTerm}
      />
    </div>
  );
};

export default GlossaryPage;
