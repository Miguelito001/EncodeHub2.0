"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareButton } from "@/components/share-button";
import { useUrlState } from "@/hooks/use-url-state";
import { Copy, Check, Clock4, RefreshCw } from "lucide-react";

const MONTHS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

function parseTimestamp(raw: string): Date | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) return null;
  const num = Number(trimmed);
  if (!Number.isFinite(num)) return null;
  // Heurística: 13+ dígitos = milissegundos, senão segundos
  const ms = trimmed.length >= 13 ? num : num * 1000;
  const date = new Date(ms);
  if (isNaN(date.getTime())) return null;
  return date;
}

function relativeTime(date: Date): string {
  const diff = date.getTime() - Date.now();
  const abs = Math.abs(diff);
  const sec = Math.round(abs / 1000);
  const min = Math.round(sec / 60);
  const hour = Math.round(min / 60);
  const day = Math.round(hour / 24);
  const suffix = diff < 0 ? "atrás" : "no futuro";
  if (sec < 60) return `${sec} segundo(s) ${suffix}`;
  if (min < 60) return `${min} minuto(s) ${suffix}`;
  if (hour < 24) return `${hour} hora(s) ${suffix}`;
  if (day < 365) return `${day} dia(s) ${suffix}`;
  return `${Math.round(day / 365)} ano(s) ${suffix}`;
}

export default function TimestampPage() {
  const [value, setValue] = useUrlState("t", "");
  const [now, setNow] = useState<number>(0);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const date = useMemo(() => parseTimestamp(value), [value]);

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const results = date
    ? [
        { key: "iso", label: "ISO 8601 (UTC)", value: date.toISOString() },
        { key: "local", label: "Data local", value: date.toLocaleString("pt-BR") },
        {
          key: "utc",
          label: "UTC legível",
          value: `${date.getUTCDate().toString().padStart(2, "0")} ${
            MONTHS[date.getUTCMonth()]
          } ${date.getUTCFullYear()}, ${date
            .getUTCHours()
            .toString()
            .padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}:${date
            .getUTCSeconds()
            .toString()
            .padStart(2, "0")} UTC`,
        },
        { key: "sec", label: "Segundos", value: Math.floor(date.getTime() / 1000).toString() },
        { key: "ms", label: "Milissegundos", value: date.getTime().toString() },
        { key: "rel", label: "Tempo relativo", value: relativeTime(date) },
      ]
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-screen-xl mx-auto">
          <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Clock4 className="h-5 w-5 text-amber-400" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Unix Timestamp Converter</h1>
              </div>
              <p className="text-muted-foreground">
                Converta timestamps Unix (segundos ou milissegundos) em datas legíveis.
              </p>
            </div>
            <ShareButton />
          </div>

          {/* Relógio atual */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Timestamp atual</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Segundos</p>
                <p className="font-mono text-xl text-foreground tabular-nums">
                  {now ? Math.floor(now / 1000) : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Milissegundos</p>
                <p className="font-mono text-xl text-foreground tabular-nums">{now || "—"}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => setValue(Math.floor(Date.now() / 1000).toString())}
              >
                <RefreshCw className="h-4 w-4" />
                Usar agora
              </Button>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Timestamp para converter</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="text"
                inputMode="numeric"
                placeholder="ex: 1700000000 ou 1700000000000"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              {value && !date && (
                <p className="mt-2 text-sm text-destructive">
                  Timestamp inválido. Use apenas dígitos.
                </p>
              )}
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
                  <Button variant="ghost" size="icon" onClick={() => copy(r.value, r.key)} title="Copiar">
                    {copied === r.key ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-secondary/40 border border-border p-8 text-center text-muted-foreground">
              Digite um timestamp acima para ver as conversões.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
