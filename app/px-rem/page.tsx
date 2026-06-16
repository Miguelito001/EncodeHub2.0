"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scaling } from "lucide-react";

const commonPx = [8, 12, 14, 16, 18, 20, 24, 32, 40, 48, 64];

export default function PxRemPage() {
  const [base, setBase] = useState(16);
  const [px, setPx] = useState("16");
  const [rem, setRem] = useState("1");

  const handlePx = (val: string) => {
    setPx(val);
    const n = parseFloat(val);
    if (!Number.isNaN(n) && base > 0) setRem(String(+(n / base).toFixed(4)));
  };

  const handleRem = (val: string) => {
    setRem(val);
    const n = parseFloat(val);
    if (!Number.isNaN(n)) setPx(String(+(n * base).toFixed(4)));
  };

  const handleBase = (val: string) => {
    const n = parseFloat(val) || 0;
    setBase(n);
    const pxNum = parseFloat(px);
    if (!Number.isNaN(pxNum) && n > 0) setRem(String(+(pxNum / n).toFixed(4)));
  };

  const table = useMemo(
    () =>
      commonPx.map((p) => ({
        px: p,
        rem: base > 0 ? +(p / base).toFixed(4) : 0,
      })),
    [base]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-screen-md mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Scaling className="h-5 w-5 text-pink-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">PX ⇄ REM / EM</h1>
            </div>
            <p className="text-muted-foreground">
              Converta entre pixels e rem/em com base no font-size raiz definido.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Conversor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  Font-size base (root)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={base}
                    onChange={(e) => handleBase(e.target.value)}
                    className="w-full h-10 rounded-md border border-border bg-background px-3 font-mono text-sm text-foreground outline-none focus:border-primary/50"
                  />
                  <span className="text-sm text-muted-foreground">px</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">
                    Pixels
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={px}
                      onChange={(e) => handlePx(e.target.value)}
                      className="w-full h-10 rounded-md border border-border bg-background px-3 font-mono text-sm text-foreground outline-none focus:border-primary/50"
                    />
                    <span className="text-sm text-muted-foreground">px</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">
                    REM / EM
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={rem}
                      onChange={(e) => handleRem(e.target.value)}
                      className="w-full h-10 rounded-md border border-border bg-background px-3 font-mono text-sm text-foreground outline-none focus:border-primary/50"
                    />
                    <span className="text-sm text-muted-foreground">rem</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Tabela de referência</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {table.map((row) => (
                  <div
                    key={row.px}
                    className="flex items-center justify-between rounded-md bg-secondary/40 border border-border px-3 py-2"
                  >
                    <span className="font-mono text-sm text-foreground">{row.px}px</span>
                    <span className="font-mono text-sm text-muted-foreground">
                      {row.rem}rem
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
