import React, { useState, useEffect } from "react";
import { GlossaryTerm, SQLPattern, Priority, DEFAULT_CATEGORIES, DEFAULT_DATASETS } from "@/types/glossary";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Code2 } from "lucide-react";

interface TermDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTerm?: GlossaryTerm | null;
  onSave: (term: Omit<GlossaryTerm, "id" | "createdAt" | "updatedAt">) => void;
  onUpdate: (id: string, updates: Partial<GlossaryTerm>) => void;
}

const PRIORITIES: Priority[] = ["P0", "P1", "P2", "P3"];

const TermDialog: React.FC<TermDialogProps> = ({ open, onOpenChange, editingTerm, onSave, onUpdate }) => {
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState<Priority>("P2");
  const [dataset, setDataset] = useState("All Datasets");
  const [synonymInput, setSynonymInput] = useState("");
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [sqlPatterns, setSqlPatterns] = useState<Omit<SQLPattern, "id">[]>([]);
  const [newPatternName, setNewPatternName] = useState("");
  const [newPatternSql, setNewPatternSql] = useState("");
  const [newPatternDesc, setNewPatternDesc] = useState("");

  useEffect(() => {
    if (editingTerm) {
      setTerm(editingTerm.term);
      setDefinition(editingTerm.definition);
      setCategory(editingTerm.category);
      setPriority(editingTerm.priority);
      setDataset(editingTerm.dataset || "All Datasets");
      setSynonyms([...editingTerm.synonyms]);
      setSqlPatterns(editingTerm.sqlPatterns.map(({ id, ...rest }) => rest));
    } else {
      resetForm();
    }
  }, [editingTerm, open]);

  const resetForm = () => {
    setTerm("");
    setDefinition("");
    setCategory("General");
    setPriority("P2");
    setDataset("All Datasets");
    setSynonyms([]);
    setSqlPatterns([]);
    setSynonymInput("");
    setNewPatternName("");
    setNewPatternSql("");
    setNewPatternDesc("");
  };

  const addSynonym = () => {
    const s = synonymInput.trim();
    if (s && !synonyms.includes(s)) {
      setSynonyms((prev) => [...prev, s]);
      setSynonymInput("");
    }
  };

  const removeSynonym = (syn: string) => setSynonyms((prev) => prev.filter((s) => s !== syn));

  const addPattern = () => {
    if (newPatternName.trim() && newPatternSql.trim()) {
      setSqlPatterns((prev) => [...prev, { name: newPatternName.trim(), sql: newPatternSql.trim(), description: newPatternDesc.trim() || undefined }]);
      setNewPatternName("");
      setNewPatternSql("");
      setNewPatternDesc("");
    }
  };

  const removePattern = (idx: number) => setSqlPatterns((prev) => prev.filter((_, i) => i !== idx));

  const handleSave = () => {
    if (!term.trim() || !definition.trim()) return;
    const data = { term: term.trim(), definition: definition.trim(), category, priority, dataset, synonyms, sqlPatterns: sqlPatterns.map((p) => ({ ...p, id: crypto.randomUUID() })) };
    if (editingTerm) {
      onUpdate(editingTerm.id, data);
    } else {
      onSave(data);
    }
    onOpenChange(false);
    resetForm();
  };

  const isEditing = !!editingTerm;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Metric/KPI" : "Add Metric/KPI"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the term definition, SQL patterns, and metadata." : "Define a new business metric or KPI with its SQL implementation."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Term & Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Term / Metric Name</Label>
              <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="e.g. Revenue" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEFAULT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority & Dataset */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Dataset</Label>
              <Select value={dataset} onValueChange={setDataset}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEFAULT_DATASETS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Definition */}
          <div className="space-y-1.5">
            <Label className="text-xs">Definition</Label>
            <Textarea value={definition} onChange={(e) => setDefinition(e.target.value)} placeholder="Business definition of this term..." rows={3} />
          </div>

          {/* Synonyms */}
          <div className="space-y-1.5">
            <Label className="text-xs">Synonyms</Label>
            <div className="flex gap-2">
              <Input
                value={synonymInput}
                onChange={(e) => setSynonymInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSynonym())}
                placeholder="Add synonym..."
                className="flex-1"
              />
              <Button type="button" variant="secondary" size="sm" onClick={addSynonym}>Add</Button>
            </div>
            {synonyms.length > 0 && (
              <div className="flex gap-1.5 flex-wrap mt-1">
                {synonyms.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1 pr-1">
                    {s}
                    <button onClick={() => removeSynonym(s)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* SQL Patterns */}
          <div className="space-y-2">
            <Label className="text-xs flex items-center gap-1.5"><Code2 className="h-3.5 w-3.5" /> SQL Patterns</Label>
            {sqlPatterns.map((p, idx) => (
              <div key={idx} className="rounded border border-border bg-muted/30 p-2.5 relative">
                <button onClick={() => removePattern(idx)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive">
                  <X className="h-3.5 w-3.5" />
                </button>
                <p className="text-xs font-medium text-foreground">{p.name}</p>
                {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                <pre className="text-xs font-mono text-primary/80 mt-1 bg-background/50 rounded p-1.5 whitespace-pre-wrap">{p.sql}</pre>
              </div>
            ))}
            <div className="rounded border border-dashed border-border p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input value={newPatternName} onChange={(e) => setNewPatternName(e.target.value)} placeholder="Pattern name" className="text-xs" />
                <Input value={newPatternDesc} onChange={(e) => setNewPatternDesc(e.target.value)} placeholder="Description (optional)" className="text-xs" />
              </div>
              <Textarea value={newPatternSql} onChange={(e) => setNewPatternSql(e.target.value)} placeholder="SELECT ..." className="font-mono text-xs min-h-[60px]" rows={2} />
              <Button type="button" variant="outline" size="sm" onClick={addPattern} className="gap-1">
                <Plus className="h-3 w-3" /> Add Pattern
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!term.trim() || !definition.trim()}>
            {isEditing ? "Save Changes" : "Add Metric/KPI"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermDialog;
