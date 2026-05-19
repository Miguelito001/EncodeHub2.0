"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, KeyRound, AlertCircle } from "lucide-react";

interface JWTPayload {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

export default function JWTPage() {
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<JWTPayload | null>(null);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const decodeJWT = () => {
    setError("");
    setDecoded(null);

    if (!input.trim()) {
      setError("Cole um token JWT para decodificar");
      return;
    }

    try {
      const parts = input.trim().split(".");
      if (parts.length !== 3) {
        setError("Token JWT inválido. Deve ter 3 partes separadas por ponto.");
        return;
      }

      const decodeBase64 = (str: string) => {
        const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        const padding = base64.length % 4;
        const padded = padding ? base64 + "=".repeat(4 - padding) : base64;
        return JSON.parse(atob(padded));
      };

      const header = decodeBase64(parts[0]);
      const payload = decodeBase64(parts[1]);

      setDecoded({
        header,
        payload,
        signature: parts[2],
      });
    } catch {
      setError("Erro ao decodificar o token. Verifique se é um JWT válido.");
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString("pt-BR", {
      dateStyle: "full",
      timeStyle: "long",
    });
  };

  const isExpired = (exp: number) => {
    return Date.now() > exp * 1000;
  };

  const exampleJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.4S5J5";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-screen-xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">JWT Decoder</h1>
          <p className="text-muted-foreground">
            Decodifique e inspecione tokens JWT (JSON Web Token)
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-amber-400" />
                Token JWT
              </CardTitle>
              <CardDescription>Cole seu token JWT aqui</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={decodeJWT} className="flex-1">
                  Decodificar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setInput(exampleJWT);
                  }}
                >
                  Exemplo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setInput("");
                    setDecoded(null);
                    setError("");
                  }}
                >
                  Limpar
                </Button>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Output */}
          <div className="space-y-4">
            {decoded && (
              <>
                {/* Header */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-red-400">Header</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2), "header")}
                      >
                        {copiedField === "header" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-secondary p-3 rounded-lg text-sm font-mono overflow-x-auto">
                      {JSON.stringify(decoded.header, null, 2)}
                    </pre>
                  </CardContent>
                </Card>

                {/* Payload */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-purple-400">Payload</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2), "payload")}
                      >
                        {copiedField === "payload" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <pre className="bg-secondary p-3 rounded-lg text-sm font-mono overflow-x-auto">
                      {JSON.stringify(decoded.payload, null, 2)}
                    </pre>
                    
                    {/* Claims Info */}
                    <div className="space-y-2 text-sm">
                      {decoded.payload.iat && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>Emitido em (iat):</span>
                          <span>{formatDate(decoded.payload.iat as number)}</span>
                        </div>
                      )}
                      {decoded.payload.exp && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Expira em (exp):</span>
                          <span className={isExpired(decoded.payload.exp as number) ? "text-destructive" : "text-green-400"}>
                            {formatDate(decoded.payload.exp as number)}
                            {isExpired(decoded.payload.exp as number) && " (EXPIRADO)"}
                          </span>
                        </div>
                      )}
                      {decoded.payload.nbf && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>Válido a partir de (nbf):</span>
                          <span>{formatDate(decoded.payload.nbf as number)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Signature */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-cyan-400">Signature</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(decoded.signature, "signature")}
                      >
                        {copiedField === "signature" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-secondary p-3 rounded-lg text-sm font-mono overflow-x-auto break-all">
                      {decoded.signature}
                    </pre>
                    <p className="text-xs text-muted-foreground mt-2">
                      A assinatura não pode ser verificada sem a chave secreta
                    </p>
                  </CardContent>
                </Card>
              </>
            )}

            {!decoded && !error && (
              <Card className="h-full flex items-center justify-center min-h-[300px]">
                <CardContent className="text-center text-muted-foreground">
                  <KeyRound className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Cole um token JWT e clique em Decodificar</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
