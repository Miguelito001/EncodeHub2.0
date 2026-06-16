"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareButton } from "@/components/share-button";
import { useUrlState } from "@/hooks/use-url-state";
import { Copy, Check, Database, ArrowLeftRight } from "lucide-react";

function jsonToCsv(json: string, delimiter: string): string {
  const data = JSON.parse(json);
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return "";

  const headerSet = new Set<string>();
  for (const row of arr as Record<string, unknown>[]) {
    Object.keys(row).forEach((k) => headerSet.add(k));
  }
  const headers = Array.from(headerSet);

  const escape = (val: unknown) => {
    if (val === null || val === undefined) return "";
    const s = typeof val === "object" ? JSON.stringify(val) : String(val);
    if (s.includes(delimiter) || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const lines = [headers.join(delimiter)];
  for (const row of arr) {
    lines.push(headers.map((h) => escape((row as Record<string, unknown>)[h])).join(delimiter));
  }
  return lines.join("\n");
}

function parseCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      result.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

function csvToJson(csv: string, delimiter: string): string {
  const lines = csv.trim().split(/\r\n|\r|\n/);
  if (lines.length < 1) return "[]";
  const headers = parseCsvLine(lines[0], delimiter);
  const rows = lines.slice(1).map((line) => {
    const cells = parseCsvLine(line, delimiter);
    const obj: Record<string, unknown> = {};
    headers.forEach((h, i) => {
      const raw = cells[i] ?? "";
      if (raw === "") obj[h] = "";
      else if (!isNaN(Number(raw)) && raw.trim() !== "") obj[h] = Number(raw);
      else if (raw === "true" || raw === "false") obj[h] = raw === "true";
      else obj[h] = raw;
    });
    return obj;
  });
  return JSON.stringify(rows, null, 2);
}

export default function CsvPage() {
  const [input, setInput] = useUrlState("q", "");
  const [output, setOutput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toCsv = () => {
    try {
      setOutput(jsonToCsv(input, delimiter));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON inválido");
    }
  };

  const toJson = () => {
    try {
      setOutput(csvToJson(input, delimiter));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "CSV inválido");
    }
  };

  const swap = () => {
    setInput(output);
    setOutput(input);
    setError(null);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-screen-xl mx-auto">
          <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Database className="h-5 w-5 text-lime-400" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">JSON ⇄ CSV</h1>
              </div>
              <p className="text-muted-foreground">
                Converta arrays de objetos JSON para CSV (Excel) e vice-versa.
              </p>
            </div>
            <ShareButton />
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Button onClick={toCsv}>JSON → CSV</Button>
            <Button variant="outline" onClick={toJson}>
              CSV → JSON
            </Button>
            <Button variant="ghost" onClick={swap}>
              <ArrowLeftRight className="h-4 w-4 mr-1.5" /> Inverter
            </Button>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-muted-foreground">Delimitador:</span>
              <select
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground outline-none focus:border-primary/50"
              >
                <option value=",">Vírgula ( , )</option>
                <option value=";">Ponto e vírgula ( ; )</option>
                <option value="\t">Tab</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Entrada</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder='[{"nome": "Ana", "idade": 30}, {"nome": "Bruno", "idade": 25}]'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 flex-row items-center justify-between">
                <CardTitle className="text-lg">Saída</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copy}
                  disabled={!output}
                  title="Copiar"
                >
                  {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  readOnly
                  value={output}
                  placeholder="Resultado..."
                  className="min-h-[300px] font-mono text-sm bg-secondary/40"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
