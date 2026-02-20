import React, { useState } from "react";
import { GlossaryTerm, PRIORITY_LABELS } from "@/types/glossary";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronDown, Code2, Pencil, Trash2, Database } from "lucide-react";

interface GlossaryTermCardProps {
  term: GlossaryTerm;
  onEdit: (term: GlossaryTerm) => void;
  onDelete: (id: string) => void;
}

const priorityBadgeClass: Record<string, string> = {
  P0: "bg-destructive/20 text-destructive border-destructive/30",
  P1: "bg-primary/20 text-primary border-primary/30",
  P2: "bg-muted text-muted-foreground border-border",
  P3: "bg-secondary text-secondary-foreground border-border",
};

const GlossaryTermCard: React.FC<GlossaryTermCardProps> = ({ term, onEdit, onDelete }) => {
  const [sqlOpen, setSqlOpen] = useState(false);

  return (
    <Card className="animate-fade-in border-border/60 hover:border-primary/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-foreground font-mono">{term.term}</h3>
              <Badge variant="outline" className={priorityBadgeClass[term.priority]}>
                {term.priority} · {PRIORITY_LABELS[term.priority]}
              </Badge>
              {term.dataset && term.dataset !== "All Datasets" && (
                <Badge variant="outline" className="text-muted-foreground border-border gap-1">
                  <Database className="h-3 w-3" />
                  {term.dataset}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{term.definition}</p>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => onEdit(term)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete "{term.term}"?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove this term and all its SQL patterns. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => onDelete(term.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {term.synonyms.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-1">
            <span className="text-xs text-muted-foreground">aka:</span>
            {term.synonyms.map((syn) => (
              <Badge key={syn} variant="secondary" className="text-xs py-0 px-1.5 font-mono">
                {syn}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      {term.sqlPatterns.length > 0 && (
        <CardContent className="pt-0">
          <Collapsible open={sqlOpen} onOpenChange={setSqlOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between text-muted-foreground hover:text-foreground px-2 h-8">
                <span className="flex items-center gap-1.5 text-xs">
                  <Code2 className="h-3.5 w-3.5" />
                  {term.sqlPatterns.length} SQL Pattern{term.sqlPatterns.length !== 1 ? "s" : ""}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${sqlOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              {term.sqlPatterns.map((pattern) => (
                <div key={pattern.id} className="rounded-md border border-border bg-muted/50 p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-foreground">{pattern.name}</span>
                    {pattern.description && (
                      <span className="text-xs text-muted-foreground">{pattern.description}</span>
                    )}
                  </div>
                  <pre className="text-xs font-mono text-primary/80 whitespace-pre-wrap bg-background/50 rounded p-2 overflow-x-auto">
                    {pattern.sql}
                  </pre>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      )}
    </Card>
  );
};

export default GlossaryTermCard;
