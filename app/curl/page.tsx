"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Trash2, Check, TerminalSquare, AlertTriangle } from "lucide-react";

type ParsedCurl = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
};

function parseCurl(input: string): ParsedCurl | null {
  const text = input
    .replace(/\\\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!/^curl\s/i.test(text)) return null;

  // Tokenize respecting single and double quotes
  const tokens: string[] = [];
  const regex = /'([^']*)'|"((?:[^"\\]|\\.)*)"|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    tokens.push(m[1] ?? m[2]?.replace(/\\"/g, '"') ?? m[3]);
  }

  let url = "";
  let method = "";
  const headers: Record<string, string> = {};
  let body: string | null = null;

  for (let i = 1; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "-X" || t === "--request") {
      method = (tokens[++i] || "").toUpperCase();
    } else if (t === "-H" || t === "--header") {
      const h = tokens[++i] || "";
      const idx = h.indexOf(":");
      if (idx > -1) headers[h.slice(0, idx).trim()] = h.slice(idx + 1).trim();
    } else if (t === "-d" || t === "--data" || t === "--data-raw" || t === "--data-binary") {
      body = tokens[++i] || "";
    } else if (t === "-u" || t === "--user") {
      const cred = tokens[++i] || "";
      headers["Authorization"] = "Basic " + btoa(cred);
    } else if (!t.startsWith("-") && !url) {
      url = t;
    }
  }

  if (!method) method = body ? "POST" : "GET";
  if (!url) return null;
  return { url, method, headers, body };
}

function toFetch(p: ParsedCurl): string {
  const opts: string[] = [`  method: "${p.method}"`];
  if (Object.keys(p.headers).length) {
    opts.push(`  headers: ${JSON.stringify(p.headers, null, 2).split("\n").join("\n  ")}`);
  }
  if (p.body) opts.push(`  body: ${JSON.stringify(p.body)}`);
  return `fetch("${p.url}", {\n${opts.join(",\n")}\n})\n  .then((res) => res.json())\n  .then(console.log);`;
}

function toAxios(p: ParsedCurl): string {
  const cfg: string[] = [`  method: "${p.method.toLowerCase()}"`, `  url: "${p.url}"`];
  if (Object.keys(p.headers).length) {
    cfg.push(`  headers: ${JSON.stringify(p.headers, null, 2).split("\n").join("\n  ")}`);
  }
  if (p.body) cfg.push(`  data: ${JSON.stringify(p.body)}`);
  return `import axios from "axios";\n\naxios({\n${cfg.join(",\n")}\n}).then((res) => console.log(res.data));`;
}

function toPython(p: ParsedCurl): string {
  const lines = ["import requests", ""];
  if (Object.keys(p.headers).length) {
    lines.push("headers = {");
    for (const [k, v] of Object.entries(p.headers)) lines.push(`    "${k}": "${v}",`);
    lines.push("}");
  }
  if (p.body) lines.push(`data = ${JSON.stringify(p.body)}`);
  const args = [`"${p.url}"`];
  if (Object.keys(p.headers).length) args.push("headers=headers");
  if (p.body) args.push("data=data");
  lines.push("");
  lines.push(`response = requests.${p.method.toLowerCase()}(${args.join(", ")})`);
  lines.push("print(response.json())");
  return lines.join("\n");
}

const langs = [
  { key: "fetch", label: "JS (fetch)", fn: toFetch },
  { key: "axios", label: "Axios", fn: toAxios },
  { key: "python", label: "Python", fn: toPython },
] as const;

export default function CurlPage() {
  const [input, setInput] = useState("");
  const [lang, setLang] = useState<(typeof langs)[number]["key"]>("fetch");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: "" };
    const parsed = parseCurl(input);
    if (!parsed) return { output: "", error: "Comando cURL inválido. Cole um comando começando com 'curl'." };
    const fn = langs.find((l) => l.key === lang)!.fn;
    return { output: fn(parsed), error: "" };
  }, [input, lang]);

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
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <TerminalSquare className="h-5 w-5 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">cURL para Código</h1>
            </div>
            <p className="text-muted-foreground">
              Cole um comando cURL da aba Network e gere o código equivalente em fetch, Axios ou Python.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Comando cURL</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setInput("")} title="Limpar">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={`curl -X POST https://api.exemplo.com/users \\\n  -H "Content-Type: application/json" \\\n  -d '{"nome":"Maria"}'`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[320px] font-mono text-sm"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-1">
                    {langs.map((l) => (
                      <button
                        key={l.key}
                        onClick={() => setLang(l.key)}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                          lang === l.key
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                  <Button variant="ghost" size="icon" onClick={copy} disabled={!output} title="Copiar">
                    {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="O código gerado aparecerá aqui..."
                  value={error || output}
                  readOnly
                  className={`min-h-[320px] font-mono text-sm ${error ? "text-destructive" : ""}`}
                />
                {error && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
