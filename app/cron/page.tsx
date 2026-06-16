"use client";

import { useState, useMemo } from "react";
import cronstrue from "cronstrue";
import "cronstrue/locales/pt_BR";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, CalendarClock, AlertTriangle } from "lucide-react";

const examples = [
  { expr: "* * * * *", label: "A cada minuto" },
  { expr: "*/5 * * * *", label: "A cada 5 minutos" },
  { expr: "0 * * * *", label: "A cada hora" },
  { expr: "0 0 * * *", label: "Todo dia à meia-noite" },
  { expr: "0 22 * * 1-5", label: "Dias úteis às 22h" },
  { expr: "0 9 1 * *", label: "Dia 1 de cada mês às 9h" },
  { expr: "0 0 * * 0", label: "Todo domingo" },
  { expr: "30 3 * * 6", label: "Sábado às 3h30" },
];

const fields = [
  { name: "Minuto", range: "0-59" },
  { name: "Hora", range: "0-23" },
  { name: "Dia do mês", range: "1-31" },
  { name: "Mês", range: "1-12" },
  { name: "Dia da semana", range: "0-6" },
];

export default function CronPage() {
  const [expr, setExpr] = useState("0 22 * * 1-5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!expr.trim()) return { text: "", error: "" };
    try {
      const text = cronstrue.toString(expr.trim(), { locale: "pt_BR", use24HourTimeFormat: true });
      return { text, error: "" };
    } catch (e) {
      return { text: "", error: e instanceof Error ? e.message : "Expressão inválida" };
    }
  }, [expr]);

  const parts = expr.trim().split(/\s+/);

  const copy = async () => {
    await navigator.clipboard.writeText(expr.trim());
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
                <CalendarClock className="h-5 w-5 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Tradutor de Cron</h1>
            </div>
            <p className="text-muted-foreground">
              Digite uma expressão Cron e veja a explicação em português — sem precisar decorar a sintaxe.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Expressão Cron</CardTitle>
                <Button variant="ghost" size="icon" onClick={copy} title="Copiar">
                  {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <input
                value={expr}
                onChange={(e) => setExpr(e.target.value)}
                placeholder="0 22 * * 1-5"
                className="w-full rounded-md border border-border bg-secondary/40 px-4 py-3 font-mono text-xl text-center text-foreground tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="mt-4 grid grid-cols-5 gap-2">
                {fields.map((f, i) => (
                  <div key={f.name} className="rounded-md bg-secondary/40 border border-border p-2 text-center">
                    <p className="font-mono text-lg text-primary">{parts[i] ?? "—"}</p>
                    <p className="text-xs font-medium text-foreground mt-1">{f.name}</p>
                    <p className="text-[10px] text-muted-foreground">{f.range}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                {result.error ? (
                  <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    {result.error}
                  </div>
                ) : (
                  <div className="rounded-md border border-primary/40 bg-primary/10 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Tradução</p>
                    <p className="text-lg font-medium text-foreground">{result.text}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Exemplos comuns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {examples.map((ex) => (
                  <button
                    key={ex.expr}
                    onClick={() => setExpr(ex.expr)}
                    className="flex items-center justify-between rounded-md bg-secondary/40 border border-border p-3 text-left hover:border-primary/50 transition-colors"
                  >
                    <span className="font-mono text-sm text-primary">{ex.expr}</span>
                    <span className="text-sm text-muted-foreground">{ex.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
