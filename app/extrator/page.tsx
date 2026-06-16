"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareButton } from "@/components/share-button";
import { useUrlState } from "@/hooks/use-url-state";
import { Copy, Check, ScanText } from "lucide-react";

const extractors: {
  key: string;
  label: string;
  regex: RegExp;
}[] = [
  { key: "email", label: "E-mails", regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
  { key: "url", label: "URLs", regex: /https?:\/\/[^\s<>"')]+/g },
  { key: "ip", label: "Endereços IP", regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g },
  {
    key: "cpf",
    label: "CPFs",
    regex: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g,
  },
  {
    key: "phone",
    label: "Telefones (BR)",
    regex: /(?:\(?\d{2}\)?\s?)?(?:9\s?)?\d{4}[-\s]?\d{4}/g,
  },
  {
    key: "date",
    label: "Datas",
    regex: /\b\d{1,4}[/\-.]\d{1,2}[/\-.]\d{1,4}\b/g,
  },
  { key: "hashtag", label: "Hashtags", regex: /#[\w\u00C0-\u017F]+/g },
  { key: "number", label: "Números", regex: /\b\d+(?:[.,]\d+)?\b/g },
];

export default function ExtractorPage() {
  const [input, setInput] = useUrlState("text", "");
  const [dedup, setDedup] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const results = useMemo(() => {
    if (!input.trim()) return [];
    return extractors
      .map((ex) => {
        const matches = input.match(ex.regex) ?? [];
        const list = dedup ? Array.from(new Set(matches)) : matches;
        return { key: ex.key, label: ex.label, items: list };
      })
      .filter((r) => r.items.length > 0);
  }, [input, dedup]);

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
          <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <ScanText className="h-5 w-5 text-cyan-400" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Extrator de Dados</h1>
              </div>
              <p className="text-muted-foreground">
                Cole qualquer texto e extraia e-mails, URLs, IPs, CPFs, telefones, datas e mais.
              </p>
            </div>
            <ShareButton />
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <CardTitle className="text-lg">Texto de entrada</CardTitle>
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={dedup}
                  onChange={(e) => setDedup(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                Remover duplicatas
              </label>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Cole aqui o texto que contém os dados a extrair..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[160px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          {results.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {results.map((r) => (
                <Card key={r.key}>
                  <CardHeader className="pb-3 flex-row items-center justify-between">
                    <CardTitle className="text-base">
                      {r.label}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        ({r.items.length})
                      </span>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copy(r.items.join("\n"), r.key)}
                      title="Copiar todos"
                    >
                      {copied === r.key ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-48 overflow-y-auto rounded-md bg-secondary/40 border border-border p-3 space-y-1">
                      {r.items.map((item, i) => (
                        <p key={i} className="font-mono text-sm text-foreground break-all">
                          {item}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-secondary/40 border border-border p-8 text-center text-muted-foreground">
              {input.trim()
                ? "Nenhum dado reconhecido encontrado no texto."
                : "Cole um texto acima para extrair os dados."}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
