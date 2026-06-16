"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, CaseSensitive } from "lucide-react";

function splitWords(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.toLowerCase());
}

const cases = [
  {
    key: "camel",
    label: "camelCase",
    fn: (w: string[]) =>
      w.map((x, i) => (i === 0 ? x : x.charAt(0).toUpperCase() + x.slice(1))).join(""),
  },
  {
    key: "pascal",
    label: "PascalCase",
    fn: (w: string[]) => w.map((x) => x.charAt(0).toUpperCase() + x.slice(1)).join(""),
  },
  {
    key: "snake",
    label: "snake_case",
    fn: (w: string[]) => w.join("_"),
  },
  {
    key: "kebab",
    label: "kebab-case",
    fn: (w: string[]) => w.join("-"),
  },
  {
    key: "constant",
    label: "CONSTANT_CASE",
    fn: (w: string[]) => w.map((x) => x.toUpperCase()).join("_"),
  },
  {
    key: "dot",
    label: "dot.case",
    fn: (w: string[]) => w.join("."),
  },
  {
    key: "title",
    label: "Title Case",
    fn: (w: string[]) => w.map((x) => x.charAt(0).toUpperCase() + x.slice(1)).join(" "),
  },
  {
    key: "sentence",
    label: "Sentence case",
    fn: (w: string[]) => {
      const s = w.join(" ");
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
  },
  {
    key: "lower",
    label: "lowercase",
    fn: (w: string[]) => w.join(" "),
  },
  {
    key: "upper",
    label: "UPPERCASE",
    fn: (w: string[]) => w.map((x) => x.toUpperCase()).join(" "),
  },
];

export default function CaseConverterPage() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const results = useMemo(() => {
    const words = splitWords(input);
    if (!words.length) return [];
    return cases.map((c) => ({ key: c.key, label: c.label, value: c.fn(words) }));
  }, [input]);

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-screen-xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <CaseSensitive className="h-5 w-5 text-teal-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Conversor de Case</h1>
            </div>
            <p className="text-muted-foreground">
              Digite um texto ou nome de variável e converta instantaneamente entre todos os formatos.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Texto de entrada</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="ex: minha variavel longa, minha_variavel_longa, MinhaVariavelLonga..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[100px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          {results.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {results.map((r) => (
                <div
                  key={r.key}
                  className="flex items-center justify-between gap-3 rounded-lg bg-secondary/40 border border-border p-4 hover:border-primary/40 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground mb-1">{r.label}</p>
                    <p className="font-mono text-sm text-foreground truncate">{r.value}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copy(r.value, r.key)}
                    title="Copiar"
                  >
                    {copied === r.key ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-secondary/40 border border-border p-8 text-center text-muted-foreground">
              Digite algo acima para ver as conversões.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
