"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

type Base = "dec" | "hex" | "oct" | "bin";

const bases: { key: Base; label: string; radix: number; prefix: string; pattern: RegExp }[] = [
  { key: "dec", label: "Decimal", radix: 10, prefix: "", pattern: /^[0-9]*$/ },
  { key: "hex", label: "Hexadecimal", radix: 16, prefix: "0x", pattern: /^[0-9a-fA-F]*$/ },
  { key: "oct", label: "Octal", radix: 8, prefix: "0o", pattern: /^[0-7]*$/ },
  { key: "bin", label: "Binário", radix: 2, prefix: "0b", pattern: /^[01]*$/ },
];

export default function BasesPage() {
  const [values, setValues] = useState<Record<Base, string>>({
    dec: "",
    hex: "",
    oct: "",
    bin: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<Base | null>(null);

  function handleChange(base: Base, raw: string) {
    const conf = bases.find((b) => b.key === base)!;
    const clean = raw.trim().replace(/^0x|^0o|^0b/i, "");

    if (clean === "") {
      setValues({ dec: "", hex: "", oct: "", bin: "" });
      setError(null);
      return;
    }

    if (!conf.pattern.test(clean)) {
      setError(`Caractere inválido para ${conf.label}`);
      setValues((v) => ({ ...v, [base]: raw }));
      return;
    }

    const num = parseInt(clean, conf.radix);
    if (Number.isNaN(num) || !Number.isSafeInteger(num)) {
      setError("Número fora do intervalo seguro");
      setValues((v) => ({ ...v, [base]: raw }));
      return;
    }

    setError(null);
    setValues({
      dec: num.toString(10),
      hex: num.toString(16).toUpperCase(),
      oct: num.toString(8),
      bin: num.toString(2),
    });
  }

  async function copy(base: Base) {
    await navigator.clipboard.writeText(values[base]);
    setCopied(base);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-screen-md mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Hash className="h-5 w-5 text-indigo-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Bases Numéricas</h1>
            </div>
            <p className="text-muted-foreground">
              Digite um número em qualquer base e veja a conversão instantânea para as demais.
            </p>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Conversão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {bases.map((b) => (
                <div key={b.key}>
                  <label className="text-sm text-muted-foreground mb-1.5 block">
                    {b.label}{" "}
                    {b.prefix && (
                      <span className="text-xs text-muted-foreground/60">({b.prefix})</span>
                    )}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      value={values[b.key]}
                      onChange={(e) => handleChange(b.key, e.target.value)}
                      placeholder={`Valor em ${b.label.toLowerCase()}`}
                      className="flex-1 h-10 rounded-md border border-border bg-background px-3 font-mono text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copy(b.key)}
                      disabled={!values[b.key]}
                      title="Copiar"
                    >
                      {copied === b.key ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}

              {error && (
                <p className={cn("text-sm text-red-400")}>{error}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
