"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareButton } from "@/components/share-button";
import { useUrlState } from "@/hooks/use-url-state";
import { ArrowRight, ArrowLeft, Copy, Trash2, Check, Link } from "lucide-react";

export default function UrlPage() {
  const [input, setInput] = useUrlState("q", "");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const encode = () => {
    setError("");
    try {
      setOutput(encodeURIComponent(input));
    } catch {
      setError("Erro ao codificar a URL.");
    }
  };

  const decode = () => {
    setError("");
    try {
      setOutput(decodeURIComponent(input));
    } catch {
      setError("Erro ao decodificar — verifique se o texto é uma URL válida.");
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const swapInputOutput = () => {
    setInput(output);
    setOutput("");
    setError("");
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
                  <Link className="h-5 w-5 text-yellow-400" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">URL Encode / Decode</h1>
              </div>
              <p className="text-muted-foreground">
                Codifique e decodifique strings para uso seguro em URLs
              </p>
            </div>
            <ShareButton />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Entrada</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Cole aqui a URL ou texto para codificar/decodificar..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Saída</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyToClipboard}
                      disabled={!output}
                      title="Copiar resultado"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearAll}
                      title="Limpar tudo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="O resultado aparecerá aqui..."
                  value={error || output}
                  readOnly
                  className={`min-h-[300px] font-mono text-sm ${error ? "text-destructive" : ""}`}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Button onClick={encode} className="gap-2" disabled={!input.trim()}>
              Codificar (Encode)
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button onClick={decode} variant="outline" className="gap-2" disabled={!input.trim()}>
              <ArrowLeft className="h-4 w-4" />
              Decodificar (Decode)
            </Button>
            {output && (
              <Button onClick={swapInputOutput} variant="ghost" className="gap-2 text-muted-foreground">
                Usar saída como entrada
              </Button>
            )}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Quando usar?",
                text: "Use encode ao montar URLs com parâmetros que contenham espaços, caracteres especiais ou acentos.",
              },
              {
                title: "Exemplo encode",
                text: 'Entrada: "olá mundo!" → Saída: "ol%C3%A1%20mundo%21"',
              },
              {
                title: "Exemplo decode",
                text: 'Entrada: "ol%C3%A1%20mundo%21" → Saída: "olá mundo!"',
              },
            ].map((tip) => (
              <div key={tip.title} className="rounded-lg bg-secondary/40 border border-border p-4">
                <p className="text-sm font-semibold text-foreground mb-1">{tip.title}</p>
                <p className="text-sm text-muted-foreground font-mono">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
