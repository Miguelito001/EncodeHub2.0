"use client";

import { useState } from "react";
import { format } from "sql-formatter";
import { Header } from "@/components/header";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Trash2, Check, Database, Wand2, AlertTriangle } from "lucide-react";

const dialects = [
  { value: "sql", label: "SQL Padrão" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "sqlite", label: "SQLite" },
  { value: "mariadb", label: "MariaDB" },
  { value: "bigquery", label: "BigQuery" },
] as const;

export default function SqlPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [dialect, setDialect] = useState<(typeof dialects)[number]["value"]>("sql");
  const [keywordCase, setKeywordCase] = useState<"upper" | "lower" | "preserve">("upper");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formatSql = () => {
    setError("");
    try {
      const result = format(input, {
        language: dialect,
        keywordCase,
        tabWidth: 2,
      });
      setOutput(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao formatar SQL");
      setOutput("");
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-screen-xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Database className="h-5 w-5 text-sky-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Formatador de SQL</h1>
            </div>
            <p className="text-muted-foreground">
              Cole queries SQL desorganizadas e embeleze-as com indentação e palavras-chave padronizadas.
            </p>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Dialeto:</label>
              <select
                value={dialect}
                onChange={(e) => setDialect(e.target.value as typeof dialect)}
                className="rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {dialects.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Palavras-chave:</label>
              <select
                value={keywordCase}
                onChange={(e) => setKeywordCase(e.target.value as typeof keywordCase)}
                className="rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="upper">MAIÚSCULAS</option>
                <option value="lower">minúsculas</option>
                <option value="preserve">Preservar</option>
              </select>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Entrada</CardTitle>
                  <Button variant="ghost" size="icon" onClick={clearAll} title="Limpar">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="SELECT * FROM users WHERE active=1 ORDER BY created_at DESC;"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[320px] font-mono text-sm"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Resultado</CardTitle>
                  <Button variant="ghost" size="icon" onClick={copy} disabled={!output} title="Copiar">
                    {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="A query formatada aparecerá aqui..."
                  value={error || output}
                  readOnly
                  className={`min-h-[320px] font-mono text-sm ${error ? "text-destructive" : ""}`}
                />
              </CardContent>
            </Card>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="flex justify-center mt-6">
            <Button onClick={formatSql} className="gap-2" disabled={!input.trim()}>
              <Wand2 className="h-4 w-4" />
              Formatar SQL
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
