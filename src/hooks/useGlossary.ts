import { useState, useCallback, useMemo } from "react";
import { GlossaryTerm, SQLPattern } from "@/types/glossary";

const generateId = () => crypto.randomUUID();

const SAMPLE_TERMS: GlossaryTerm[] = [
  {
    id: generateId(),
    term: "Revenue",
    definition: "Total income generated from business operations before any deductions for expenses.",
    category: "Revenue",
    synonyms: ["Income", "Sales", "Turnover"],
    sqlPatterns: [
      { id: generateId(), name: "Gross Revenue", sql: "SELECT SUM(amount) AS gross_revenue FROM orders WHERE status = 'completed'", description: "Total revenue before deductions" },
      { id: generateId(), name: "Net Revenue", sql: "SELECT SUM(amount - discount - refund) AS net_revenue FROM orders WHERE status = 'completed'", description: "Revenue after discounts and refunds" },
    ],
    priority: "P0",
    dataset: "Sales DB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    term: "Customer Lifetime Value",
    definition: "The total revenue a business can expect from a single customer account throughout their relationship.",
    category: "Customer",
    synonyms: ["CLV", "CLTV", "LTV"],
    sqlPatterns: [
      { id: generateId(), name: "Simple CLV", sql: "SELECT customer_id, SUM(amount) AS lifetime_value FROM orders GROUP BY customer_id", description: "Sum of all orders per customer" },
    ],
    priority: "P1",
    dataset: "Sales DB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    term: "Churn Rate",
    definition: "The percentage of customers who stop using a product or service during a given time period.",
    category: "Customer",
    synonyms: ["Attrition Rate", "Customer Loss Rate"],
    sqlPatterns: [
      { id: generateId(), name: "Monthly Churn", sql: "SELECT (lost_customers::float / total_customers_start) * 100 AS churn_rate FROM monthly_metrics", description: "Monthly customer churn percentage" },
    ],
    priority: "P1",
    dataset: "Product Analytics",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    term: "Gross Margin",
    definition: "The difference between revenue and cost of goods sold, expressed as a percentage of revenue.",
    category: "Finance",
    synonyms: ["Gross Profit Margin", "GM"],
    sqlPatterns: [
      { id: generateId(), name: "Gross Margin %", sql: "SELECT ((revenue - cogs) / revenue) * 100 AS gross_margin FROM financial_summary", description: "Gross margin as a percentage" },
    ],
    priority: "P0",
    dataset: "Finance DB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    term: "Conversion Rate",
    definition: "The percentage of users who take a desired action out of the total number of visitors.",
    category: "Marketing",
    synonyms: ["CVR", "Conversion Ratio"],
    sqlPatterns: [
      { id: generateId(), name: "Overall CVR", sql: "SELECT (conversions::float / visits) * 100 AS conversion_rate FROM campaign_metrics", description: "Overall conversion rate" },
    ],
    priority: "P2",
    dataset: "Marketing DB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function useGlossary() {
  const [terms, setTerms] = useState<GlossaryTerm[]>(SAMPLE_TERMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDataset, setSelectedDataset] = useState<string>("All Datasets");

  const categories = useMemo(() => {
    const cats = new Set(terms.map((t) => t.category));
    return ["All", ...Array.from(cats).sort()];
  }, [terms]);

  const filteredTerms = useMemo(() => {
    return terms.filter((term) => {
      const matchesSearch =
        !searchQuery ||
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.synonyms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || term.category === selectedCategory;
      const matchesDataset = selectedDataset === "All Datasets" || term.dataset === selectedDataset;
      return matchesSearch && matchesCategory && matchesDataset;
    });
  }, [terms, searchQuery, selectedCategory, selectedDataset]);

  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    filteredTerms.forEach((term) => {
      if (!groups[term.category]) groups[term.category] = [];
      groups[term.category].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const addTerm = useCallback((term: Omit<GlossaryTerm, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    setTerms((prev) => [...prev, { ...term, id: generateId(), createdAt: now, updatedAt: now }]);
  }, []);

  const updateTerm = useCallback((id: string, updates: Partial<Omit<GlossaryTerm, "id" | "createdAt">>) => {
    setTerms((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
  }, []);

  const deleteTerm = useCallback((id: string) => {
    setTerms((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addSqlPattern = useCallback((termId: string, pattern: Omit<SQLPattern, "id">) => {
    setTerms((prev) =>
      prev.map((t) =>
        t.id === termId
          ? { ...t, sqlPatterns: [...t.sqlPatterns, { ...pattern, id: generateId() }], updatedAt: new Date().toISOString() }
          : t
      )
    );
  }, []);

  const removeSqlPattern = useCallback((termId: string, patternId: string) => {
    setTerms((prev) =>
      prev.map((t) =>
        t.id === termId
          ? { ...t, sqlPatterns: t.sqlPatterns.filter((p) => p.id !== patternId), updatedAt: new Date().toISOString() }
          : t
      )
    );
  }, []);

  return {
    terms,
    filteredTerms,
    groupedTerms,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedDataset,
    setSelectedDataset,
    addTerm,
    updateTerm,
    deleteTerm,
    addSqlPattern,
    removeSqlPattern,
  };
}
