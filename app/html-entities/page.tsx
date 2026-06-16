"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareButton } from "@/components/share-button";
import { useUrlState } from "@/hooks/use-url-state";
import { Copy, Check, Code2, ArrowDownUp } from "lucide-react";

function encodeEntities(text: string, mode: "named" | "numeric") {
  const named: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  if (mode === "named") {
    return text.replace(/[&<>"']/g, (c) => named[c]);
  }
  // numeric: encode all non-ASCII + the reserved ones
  return text.replace(/[&<>"']/g, (c) => named[c]).replace(/[\u00A0-\u9999]/g, (c) => `&#${c.charCodeAt(0)};`);
}

function decodeEntities(text: string) {
  if (typeof document === "undefined") return text;
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}

export default function HtmlEntitiesPage() {
  const [input, setInput] = useUrlState("q", "");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"named" | "numeric">("named");
  const [copied, setCopied] = useState(false);

  const handleEncode = () => setOutput(encodeEntities(input, mode));
  const handleDecode = () => setOutput(decodeEntities(input));

  const swap = () => {
    setInput(output);
    setOutput(input);
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
                  <Code2 className="h-5 w-5 text-rose-400" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Entidades HTML</h1>
              </div>
              <p className="text-muted-foreground">
                Converta caracteres especiais em entidades HTML e vice-versa. Ideal para exibir código em blogs.
              </p>
            </div>
            <ShareButton />
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Button onClick={handleEncode}>Codificar</Button>
            <Button variant="outline" onClick={handleDecode}>
              Decodificar
            </Button>
            <Button variant="ghost" onClick={swap}>
              <ArrowDownUp className="h-4 w-4 mr-1.5" /> Inverter
            </Button>
            <div className="flex items-center gap-1 ml-auto rounded-md border border-border p-0.5">
              <button
                onClick={() => setMode("named")}
                className={`px-3 py-1 text-sm rounded ${mode === "named" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}
              >
                Nomeadas (&amp;lt;)
              </button>
              <button
                onClick={() => setMode("numeric")}
                className={`px-3 py-1 text-sm rounded ${mode === "numeric" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}
              >
                Numéricas (&amp;#60;)
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Entrada</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="<div>Olá & bem-vindo</div>"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[260px] font-mono text-sm"
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
                  className="min-h-[260px] font-mono text-sm bg-secondary/40"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
