"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Clock, RefreshCw } from "lucide-react";

export default function TimestampPage() {
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [inputTimestamp, setInputTimestamp] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [convertedDate, setConvertedDate] = useState<Date | null>(null);
  const [convertedTimestamp, setConvertedTimestamp] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timestampToDate = () => {
    if (!inputTimestamp) return;
    const ts = parseInt(inputTimestamp);
    if (isNaN(ts)) return;
    
    // Detecta se é ms ou s
    const date = ts > 9999999999 ? new Date(ts) : new Date(ts * 1000);
    setConvertedDate(date);
  };

  const dateToTimestamp = () => {
    if (!inputDate) return;
    const date = new Date(inputDate);
    if (isNaN(date.getTime())) return;
    setConvertedTimestamp(Math.floor(date.getTime() / 1000));
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (date: Date) => {
    return {
      local: date.toLocaleString("pt-BR", { dateStyle: "full", timeStyle: "long" }),
      iso: date.toISOString(),
      utc: date.toUTCString(),
      relative: getRelativeTime(date),
    };
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const absDiff = Math.abs(diff);
    const isPast = diff < 0;

    const seconds = Math.floor(absDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    let result = "";
    if (years > 0) result = `${years} ano${years > 1 ? "s" : ""}`;
    else if (months > 0) result = `${months} ${months > 1 ? "meses" : "mês"}`;
    else if (days > 0) result = `${days} dia${days > 1 ? "s" : ""}`;
    else if (hours > 0) result = `${hours} hora${hours > 1 ? "s" : ""}`;
    else if (minutes > 0) result = `${minutes} minuto${minutes > 1 ? "s" : ""}`;
    else result = `${seconds} segundo${seconds > 1 ? "s" : ""}`;

    return isPast ? `${result} atrás` : `em ${result}`;
  };

  const commonTimestamps = [
    { label: "Agora", value: () => Math.floor(Date.now() / 1000) },
    { label: "Início do dia", value: () => Math.floor(new Date().setHours(0, 0, 0, 0) / 1000) },
    { label: "Fim do dia", value: () => Math.floor(new Date().setHours(23, 59, 59, 999) / 1000) },
    { label: "Início do mês", value: () => Math.floor(new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() / 1000) },
    { label: "Início do ano", value: () => Math.floor(new Date(new Date().getFullYear(), 0, 1).getTime() / 1000) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-screen-xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Unix Timestamp</h1>
          <p className="text-muted-foreground">
            Converta entre Unix timestamp e datas legíveis
          </p>
        </div>

        {/* Current Time */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary animate-pulse" />
              Tempo Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Unix Timestamp (segundos)</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-secondary px-4 py-3 rounded-lg font-mono text-xl">
                    {currentTimestamp}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(currentTimestamp.toString(), "current")}
                  >
                    {copied === "current" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Unix Timestamp (milissegundos)</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-secondary px-4 py-3 rounded-lg font-mono text-xl">
                    {currentTimestamp * 1000}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard((currentTimestamp * 1000).toString(), "currentMs")}
                  >
                    {copied === "currentMs" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Timestamp to Date */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timestamp para Data</CardTitle>
              <CardDescription>Converta um Unix timestamp para data legível</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: 1716123456"
                  value={inputTimestamp}
                  onChange={(e) => setInputTimestamp(e.target.value)}
                  className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button onClick={timestampToDate}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Converter
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {commonTimestamps.map((ts) => (
                  <Button
                    key={ts.label}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const value = ts.value();
                      setInputTimestamp(value.toString());
                      setConvertedDate(new Date(value * 1000));
                    }}
                  >
                    {ts.label}
                  </Button>
                ))}
              </div>

              {convertedDate && (
                <div className="space-y-2 pt-4 border-t border-border">
                  {Object.entries(formatDate(convertedDate)).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground capitalize">{key}:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-secondary px-2 py-1 rounded text-sm font-mono">{value}</code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(value, `date-${key}`)}
                        >
                          {copied === `date-${key}` ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Date to Timestamp */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data para Timestamp</CardTitle>
              <CardDescription>Converta uma data para Unix timestamp</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button onClick={dateToTimestamp}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Converter
                </Button>
              </div>

              {convertedTimestamp && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Segundos:</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-secondary px-3 py-2 rounded-lg font-mono text-lg">
                        {convertedTimestamp}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(convertedTimestamp.toString(), "ts-s")}
                      >
                        {copied === "ts-s" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Milissegundos:</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-secondary px-3 py-2 rounded-lg font-mono text-lg">
                        {convertedTimestamp * 1000}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard((convertedTimestamp * 1000).toString(), "ts-ms")}
                      >
                        {copied === "ts-ms" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
