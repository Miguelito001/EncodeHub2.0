"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, ShieldCheck } from "lucide-react";

type Perm = { read: boolean; write: boolean; execute: boolean };
type Role = "owner" | "group" | "public";

const roles: { key: Role; label: string }[] = [
  { key: "owner", label: "Dono" },
  { key: "group", label: "Grupo" },
  { key: "public", label: "Público" },
];

const permLabels: { key: keyof Perm; label: string; short: string }[] = [
  { key: "read", label: "Leitura", short: "r" },
  { key: "write", label: "Escrita", short: "w" },
  { key: "execute", label: "Execução", short: "x" },
];

function permToDigit(p: Perm): number {
  return (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
}

function permToSymbol(p: Perm): string {
  return `${p.read ? "r" : "-"}${p.write ? "w" : "-"}${p.execute ? "x" : "-"}`;
}

const presets = [
  { octal: "644", label: "Arquivo padrão" },
  { octal: "755", label: "Executável / pasta" },
  { octal: "600", label: "Privado (só dono)" },
  { octal: "777", label: "Acesso total" },
  { octal: "640", label: "Leitura grupo" },
  { octal: "700", label: "Só dono total" },
];

export default function ChmodPage() {
  const [perms, setPerms] = useState<Record<Role, Perm>>({
    owner: { read: true, write: true, execute: false },
    group: { read: true, write: false, execute: false },
    public: { read: true, write: false, execute: false },
  });
  const [copied, setCopied] = useState<string | null>(null);

  const octal = useMemo(
    () => roles.map((r) => permToDigit(perms[r.key])).join(""),
    [perms]
  );
  const symbolic = useMemo(
    () => "-" + roles.map((r) => permToSymbol(perms[r.key])).join(""),
    [perms]
  );

  const toggle = (role: Role, perm: keyof Perm) => {
    setPerms((prev) => ({
      ...prev,
      [role]: { ...prev[role], [perm]: !prev[role][perm] },
    }));
  };

  const applyOctal = (oct: string) => {
    const next = {} as Record<Role, Perm>;
    roles.forEach((r, i) => {
      const d = parseInt(oct[i], 10);
      next[r.key] = {
        read: (d & 4) !== 0,
        write: (d & 2) !== 0,
        execute: (d & 1) !== 0,
      };
    });
    setPerms(next);
  };

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
                <ShieldCheck className="h-5 w-5 text-amber-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Calculadora chmod</h1>
            </div>
            <p className="text-muted-foreground">
              Marque as permissões e veja a notação octal e simbólica para usar no Linux.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Permissões</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-center">
                    <thead>
                      <tr className="text-sm text-muted-foreground">
                        <th className="text-left py-2 font-medium">Permissão</th>
                        {roles.map((r) => (
                          <th key={r.key} className="py-2 font-medium">{r.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {permLabels.map((pl) => (
                        <tr key={pl.key} className="border-t border-border">
                          <td className="text-left py-3 text-sm text-foreground">
                            {pl.label} <span className="font-mono text-muted-foreground">({pl.short})</span>
                          </td>
                          {roles.map((r) => (
                            <td key={r.key} className="py-3">
                              <input
                                type="checkbox"
                                checked={perms[r.key][pl.key]}
                                onChange={() => toggle(r.key, pl.key)}
                                className="h-5 w-5 cursor-pointer accent-primary"
                                aria-label={`${pl.label} para ${r.label}`}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-2">Presets rápidos:</p>
                  <div className="flex flex-wrap gap-2">
                    {presets.map((p) => (
                      <button
                        key={p.octal}
                        onClick={() => applyOctal(p.octal)}
                        className="rounded-md bg-secondary/40 border border-border px-3 py-1.5 text-sm hover:border-primary/50 transition-colors"
                      >
                        <span className="font-mono text-primary">{p.octal}</span>{" "}
                        <span className="text-muted-foreground">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">Octal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-4xl text-primary">{octal}</span>
                    <Button variant="ghost" size="icon" onClick={() => copy(octal, "octal")} title="Copiar">
                      {copied === "octal" ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">Simbólico</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl text-foreground">{symbolic}</span>
                    <Button variant="ghost" size="icon" onClick={() => copy(symbolic, "sym")} title="Copiar">
                      {copied === "sym" ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">Comando</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm text-foreground break-all">chmod {octal} arquivo</span>
                    <Button variant="ghost" size="icon" onClick={() => copy(`chmod ${octal} arquivo`, "cmd")} title="Copiar">
                      {copied === "cmd" ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
