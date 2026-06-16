"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareButton } from "@/components/share-button";
import { useUrlState } from "@/hooks/use-url-state";
import { Type, Eye, EyeOff } from "lucide-react";

function analyze(text: string) {
  const chars = [...text].length;
  const charsNoSpaces = [...text.replace(/\s/g, "")].length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text === "" ? 0 : text.split(/\r\n|\r|\n/).length;
  const bytes = new TextEncoder().encode(text).length;
  const sentences = text.trim() ? (text.match(/[.!?]+(\s|$)/g) || []).length || 1 : 0;
  const paragraphs = text.trim()
    ? text.split(/\n\s*\n/).filter((p) => p.trim()).length
    : 0;

  // Line ending detection
  const crlf = (text.match(/\r\n/g) || []).length;
  const lfOnly = (text.match(/(?<!\r)\n/g) || []).length;
  let lineEnding = "Nenhuma";
  if (crlf && lfOnly) lineEnding = "Misto (CRLF + LF)";
  else if (crlf) lineEnding = "CRLF (Windows)";
  else if (lfOnly) lineEnding = "LF (Unix)";

  // Invisible / suspicious characters
  const trailingSpaces = (text.match(/[ \t]+$/gm) || []).length;
  const zeroWidth = (text.match(/[\u200B-\u200D\uFEFF]/g) || []).length;
  const nbsp = (text.match(/\u00A0/g) || []).length;

  return {
    chars,
    charsNoSpaces,
    words,
    lines,
    bytes,
    sentences,
    paragraphs,
    lineEnding,
    trailingSpaces,
    zeroWidth,
    nbsp,
  };
}

function revealInvisibles(text: string) {
  return text
    .replace(/\u00A0/g, "[NBSP]")
    .replace(/[\u200B]/g, "[ZWSP]")
    .replace(/[\u200C]/g, "[ZWNJ]")
    .replace(/[\u200D]/g, "[ZWJ]")
    .replace(/[\uFEFF]/g, "[BOM]")
    .replace(/\t/g, "[TAB]\t")
    .replace(/ /g, "·")
    .replace(/\n/g, "¶\n");
}

export default function TextAnalyzerPage() {
  const [text, setText] = useUrlState("q", "");
  const [showInvisible, setShowInvisible] = useState(false);
  const stats = useMemo(() => analyze(text), [text]);

  const mainStats = [
    { label: "Caracteres", value: stats.chars },
    { label: "Sem espaços", value: stats.charsNoSpaces },
    { label: "Palavras", value: stats.words },
    { label: "Linhas", value: stats.lines },
    { label: "Bytes (UTF-8)", value: stats.bytes },
    { label: "Frases", value: stats.sentences },
    { label: "Parágrafos", value: stats.paragraphs },
  ];

  const warnings = [
    { label: "Espaços no fim de linha", value: stats.trailingSpaces },
    { label: "Caracteres zero-width", value: stats.zeroWidth },
    { label: "Espaços não separáveis (NBSP)", value: stats.nbsp },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-screen-xl mx-auto">
          <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Type className="h-5 w-5 text-fuchsia-400" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Analisador de Texto</h1>
              </div>
              <p className="text-muted-foreground">
                Conte caracteres, palavras, bytes e detecte caracteres invisíveis que causam bugs.
              </p>
            </div>
            <ShareButton />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader className="pb-3 flex-row items-center justify-between">
                  <CardTitle className="text-lg">Texto</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowInvisible((v) => !v)}
                  >
                    {showInvisible ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1.5" /> Ocultar invisíveis
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1.5" /> Mostrar invisíveis
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Cole ou digite seu texto aqui..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[260px] font-mono text-sm"
                  />
                </CardContent>
              </Card>

              {showInvisible && text && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Caracteres revelados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap break-words rounded-md bg-secondary/40 border border-border p-4 font-mono text-sm text-foreground">
                      {revealInvisibles(text)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Estatísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mainStats.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0"
                    >
                      <span className="text-sm text-muted-foreground">{s.label}</span>
                      <span className="font-mono font-medium text-foreground">
                        {s.value.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm text-muted-foreground">Quebra de linha</span>
                    <span className="font-mono text-sm text-foreground">
                      {stats.lineEnding}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Alertas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {warnings.map((w) => (
                    <div
                      key={w.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-muted-foreground">{w.label}</span>
                      <span
                        className={
                          w.value > 0
                            ? "font-mono font-medium text-amber-400"
                            : "font-mono text-muted-foreground"
                        }
                      >
                        {w.value}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
