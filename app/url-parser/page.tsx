"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareButton } from "@/components/share-button";
import { useUrlState } from "@/hooks/use-url-state";
import { Copy, Check, Link2 } from "lucide-react";

interface ParsedUrl {
  protocol: string;
  host: string;
  port: string;
  pathname: string;
  hash: string;
  params: { key: string; value: string }[];
  error?: never;
}

function parse(input: string): ParsedUrl | { error: string } | null {
  const s = input.trim();
  if (!s) return null;
  try {
    const u = new URL(s);
    const params: { key: string; value: string }[] = [];
    u.searchParams.forEach((value, key) => params.push({ key, value }));
    return {
      protocol: u.protocol.replace(":", ""),
      host: u.hostname,
      port: u.port,
      pathname: u.pathname,
      hash: u.hash.replace("#", ""),
      params,
    };
  } catch {
    return { error: "URL inválida. Inclua o protocolo, ex: https://exemplo.com" };
  }
}

export default function UrlParserPage() {
  const [value, setValue] = useUrlState(
    "u",
    "https://exemplo.com/busca?q=teclado&categoria=eletronicos&pagina=2#resultados"
  );
  const [copied, setCopied] = useState<string | null>(null);

  const parsed = useMemo(() => parse(value), [value]);

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const parts =
    parsed && !("error" in parsed)
      ? [
          { key: "protocol", label: "Protocolo", value: parsed.protocol },
          { key: "host", label: "Host", value: parsed.host },
          { key: "port", label: "Porta", value: parsed.port || "(padrão)" },
          { key: "path", label: "Caminho", value: parsed.pathname || "/" },
          { key: "hash", label: "Fragmento (#)", value: parsed.hash || "(nenhum)" },
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
                  <Link2 className="h-5 w-5 text-yellow-400" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Parser de URL</h1>
              </div>
              <p className="text-muted-foreground">
                Quebre uma URL em suas partes e veja todos os parâmetros de query decodificados.
              </p>
            </div>
            <ShareButton />
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">URL</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="text"
                placeholder="https://exemplo.com/caminho?chave=valor"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              {parsed && "error" in parsed && (
                <p className="mt-2 text-sm text-destructive">{parsed.error}</p>
              )}
            </CardContent>
          </Card>

          {parts.length > 0 && (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                {parts.map((p) => (
                  <div
                    key={p.key}
                    className="flex items-center justify-between gap-3 rounded-lg bg-secondary/40 border border-border p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground mb-1">{p.label}</p>
                      <p className="font-mono text-sm text-foreground truncate">{p.value}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => copy(p.value, p.key)} title="Copiar">
                      {copied === p.key ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    Parâmetros de Query
                    {parsed && !("error" in parsed) && (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        ({parsed.params.length})
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {parsed && !("error" in parsed) && parsed.params.length > 0 ? (
                    <div className="overflow-hidden rounded-lg border border-border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-secondary/60 text-left">
                            <th className="px-4 py-2 font-medium text-muted-foreground">Chave</th>
                            <th className="px-4 py-2 font-medium text-muted-foreground">Valor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parsed.params.map((p, i) => (
                            <tr key={i} className="border-t border-border">
                              <td className="px-4 py-2 font-mono text-foreground">{p.key}</td>
                              <td className="px-4 py-2 font-mono text-foreground break-all">
                                {p.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum parâmetro de query.</p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
