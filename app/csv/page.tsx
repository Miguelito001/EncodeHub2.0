"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, FileJson, Download } from "lucide-react";

interface CSVOptions {
  delimiter: string;
  includeHeaders: boolean;
}

export default function CSVPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [csvInput, setCsvInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [csvOutput, setCsvOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [delimiter, setDelimiter] = useState(",");
  const [includeHeaders, setIncludeHeaders] = useState(true);

  const jsonToCsv = () => {
    setError("");
    setCsvOutput("");

    try {
      const data = JSON.parse(jsonInput);
      if (!Array.isArray(data)) {
        setError("JSON deve ser um array de objetos");
        return;
      }

      if (data.length === 0) {
        setError("Array JSON está vazio");
        return;
      }

      const headers = Object.keys(data[0]);
      const rows: string[] = [];

      if (includeHeaders) {
        rows.push(headers.join(delimiter));
      }

      data.forEach((item) => {
        const values = headers.map((header) => {
          const value = item[header];
          if (value === null || value === undefined) return "";
          const str = String(value);
          // Escape quotes and wrap in quotes if contains delimiter or quotes
          if (str.includes(delimiter) || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        });
        rows.push(values.join(delimiter));
      });

      setCsvOutput(rows.join("\n"));
    } catch {
      setError("JSON inválido");
    }
  };

  const csvToJson = () => {
    setError("");
    setJsonOutput("");

    try {
      const lines = csvInput.trim().split("\n");
      if (lines.length < 2) {
        setError("CSV deve ter pelo menos cabeçalho e uma linha de dados");
        return;
      }

      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = "";
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (inQuotes) {
            if (char === '"') {
              if (line[i + 1] === '"') {
                current += '"';
                i++;
              } else {
                inQuotes = false;
              }
            } else {
              current += char;
            }
          } else {
            if (char === '"') {
              inQuotes = true;
            } else if (char === delimiter) {
              result.push(current);
              current = "";
            } else {
              current += char;
            }
          }
        }
        result.push(current);
        return result;
      };

      const headers = parseCSVLine(lines[0]);
      const data = lines.slice(1).map((line) => {
        const values = parseCSVLine(line);
        const obj: Record<string, string> = {};
        headers.forEach((header, index) => {
          obj[header.trim()] = values[index]?.trim() || "";
        });
        return obj;
      });

      setJsonOutput(JSON.stringify(data, null, 2));
    } catch {
      setError("Erro ao processar CSV");
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exampleJson = `[
  { "nome": "João", "idade": 25, "cidade": "São Paulo" },
  { "nome": "Maria", "idade": 30, "cidade": "Rio de Janeiro" },
  { "nome": "Pedro", "idade": 28, "cidade": "Belo Horizonte" }
]`;

  const exampleCsv = `nome,idade,cidade
João,25,São Paulo
Maria,30,Rio de Janeiro
Pedro,28,Belo Horizonte`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-screen-xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">JSON / CSV</h1>
          <p className="text-muted-foreground">
            Converta entre JSON e CSV facilmente
          </p>
        </div>

        {/* Options */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Delimitador:</label>
                <select
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                  className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm"
                >
                  <option value=",">Vírgula (,)</option>
                  <option value=";">Ponto e vírgula (;)</option>
                  <option value="\t">Tab</option>
                  <option value="|">Pipe (|)</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="headers"
                  checked={includeHeaders}
                  onChange={(e) => setIncludeHeaders(e.target.checked)}
                  className="accent-primary"
                />
                <label htmlFor="headers" className="text-sm">Incluir cabeçalhos</label>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* JSON to CSV */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileJson className="h-5 w-5 text-amber-400" />
                JSON para CSV
              </CardTitle>
              <CardDescription>Cole um array JSON</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder='[{ "nome": "João", "idade": 25 }, ...]'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="min-h-[150px] font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={jsonToCsv} className="flex-1">Converter para CSV</Button>
                <Button variant="outline" onClick={() => setJsonInput(exampleJson)}>Exemplo</Button>
              </div>

              {csvOutput && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Resultado CSV</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(csvOutput, "csv")}
                      >
                        {copied === "csv" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFile(csvOutput, "dados.csv", "text/csv")}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <pre className="bg-secondary p-3 rounded-lg text-sm font-mono overflow-x-auto max-h-[200px]">
                    {csvOutput}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CSV to JSON */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileJson className="h-5 w-5 text-green-400" />
                CSV para JSON
              </CardTitle>
              <CardDescription>Cole dados CSV com cabeçalho</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="nome,idade,cidade&#10;João,25,São Paulo&#10;..."
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                className="min-h-[150px] font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={csvToJson} className="flex-1">Converter para JSON</Button>
                <Button variant="outline" onClick={() => setCsvInput(exampleCsv)}>Exemplo</Button>
              </div>

              {jsonOutput && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Resultado JSON</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(jsonOutput, "json")}
                      >
                        {copied === "json" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFile(jsonOutput, "dados.json", "application/json")}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <pre className="bg-secondary p-3 rounded-lg text-sm font-mono overflow-x-auto max-h-[200px]">
                    {jsonOutput}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
