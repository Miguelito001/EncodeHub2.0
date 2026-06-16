"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Trash2, Check, KeyRound, AlertTriangle, Clock } from "lucide-react";

function base64UrlDecode(str: string): string {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = output.length % 4;
  if (pad) output += "=".repeat(4 - pad);
  return decodeURIComponent(
    atob(output)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

type DecodedSection = { raw: string; json: Record<string, unknown> } | null;

export default function JwtPage() {
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const decoded = useMemo(() => {
    if (!token.trim()) return { header: null, payload: null, error: "" };
    const parts = token.trim().split(".");
    if (parts.length < 2) {
      return { header: null, payload: null, error: "Token inválido — esperado formato xxxxx.yyyyy.zzzzz" };
    }
    try {
      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      return {
        header: { raw: JSON.stringify(header, null, 2), json: header } as DecodedSection,
        payload: { raw: JSON.stringify(payload, null, 2), json: payload } as DecodedSection,
        error: "",
      };
    } catch {
      return { header: null, payload: null, error: "Não foi possível decodificar o token. Verifique se ele é válido." };
    }
  }, [token]);

  const expiryInfo = useMemo(() => {
    const payload = decoded.payload?.json as Record<string, number> | undefined;
    if (!payload?.exp) return null;
    const expMs = payload.exp * 1000;
    const now = Date.now();
    const diffMs = expMs - now;
    const expDate = new Date(expMs).toLocaleString("pt-BR");
    if (diffMs <= 0) {
      return { expired: true, text: `Expirado em ${expDate}` };
    }
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    const days = Math.floor(hours / 24);
    const human =
      days > 0
        ? `${days}d ${hours % 24}h`
        : hours > 0
          ? `${hours}h ${minutes}min`
          : `${minutes}min`;
    return { expired: false, text: `Expira em ${human} (${expDate})` };
  }, [decoded.payload]);

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
                <KeyRound className="h-5 w-5 text-red-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">JWT Decoder</h1>
            </div>
            <p className="text-muted-foreground">
              Decodifique e inspecione tokens JWT — header, payload e validade. Tudo offline no seu navegador.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Token JWT</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setToken("")} title="Limpar">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Cole aqui seu token (eyJhbGc...)"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="min-h-[200px] font-mono text-sm break-all"
                />
                {decoded.error && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    {decoded.error}
                  </div>
                )}
                {expiryInfo && (
                  <div
                    className={`mt-3 flex items-center gap-2 rounded-md border p-3 text-sm ${
                      expiryInfo.expired
                        ? "border-destructive/40 bg-destructive/10 text-destructive"
                        : "border-primary/40 bg-primary/10 text-primary"
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                    {expiryInfo.text}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-red-400">Header</CardTitle>
                    {decoded.header && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copy(decoded.header!.raw, "header")}
                        title="Copiar header"
                      >
                        {copied === "header" ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="min-h-[80px] rounded-md bg-secondary/40 border border-border p-3 font-mono text-sm overflow-auto text-foreground">
                    {decoded.header?.raw || "—"}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-violet-400">Payload</CardTitle>
                    {decoded.payload && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copy(decoded.payload!.raw, "payload")}
                        title="Copiar payload"
                      >
                        {copied === "payload" ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="min-h-[120px] rounded-md bg-secondary/40 border border-border p-3 font-mono text-sm overflow-auto text-foreground">
                    {decoded.payload?.raw || "—"}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8 rounded-lg bg-secondary/40 border border-border p-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Nota:</strong> esta ferramenta apenas decodifica o token (Base64URL).
              Ela não verifica a assinatura criptográfica — nunca confie em um token sem validar a assinatura no servidor.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
