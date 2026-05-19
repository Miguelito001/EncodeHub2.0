"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCompare, Trash2 } from "lucide-react";

type DiffPart =
  | { type: "equal"; value: string }
  | { type: "added"; value: string }
  | { type: "removed"; value: string };

function computeLineDiff(a: string, b: string): DiffPart[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const result: DiffPart[] = [];

  const m = linesA.length;
  const n = linesB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (linesA[i] === linesB[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  let i = 0, j = 0;
  while (i < m || j < n) {
    if (i < m && j < n && linesA[i] === linesB[j]) {
      result.push({ type: "equal", value: linesA[i] });
      i++;
      j++;
    } else if (j < n && (i >= m || dp[i + 1][j] >= dp[i][j + 1])) {
      result.push({ type: "added", value: linesB[j] });
      j++;
    } else {
      result.push({ type: "removed", value: linesA[i] });
      i++;
    }
  }

  return result;
}

export default function DiffPage() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [showDiff, setShowDiff] = useState(false);

  const diff = useMemo(() => {
    if (!showDiff) return [];
    return computeLineDiff(textA, textB);
  }, [textA, textB, showDiff]);

  const stats = useMemo(() => {
    const added = diff.filter((d) => d.type === "added").length;
    const removed = diff.filter((d) => d.type === "removed").length;
    const equal = diff.filter((d) => d.type === "equal").length;
    return { added, removed, equal };
  }, [diff]);

  const clearAll = () => {
    setTextA("");
    setTextB("");
    setShowDiff(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-screen-xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <GitCompare className="h-5 w-5 text-violet-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Diff de Texto</h1>
            </div>
            <p className="text-muted-foreground">
              Compare dois textos e veja as diferenças linha a linha
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive inline-block" />
                  Texto Original
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Cole o texto original aqui..."
                  value={textA}
                  onChange={(e) => { setTextA(e.target.value); setShowDiff(false); }}
                  className="min-h-[260px] font-mono text-sm"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                  Texto Modificado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Cole o texto modificado aqui..."
                  value={textB}
                  onChange={(e) => { setTextB(e.target.value); setShowDiff(false); }}
                  className="min-h-[260px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              onClick={() => setShowDiff(true)}
              className="gap-2"
              disabled={!textA.trim() && !textB.trim()}
            >
              <GitCompare className="h-4 w-4" />
              Comparar
            </Button>
            <Button variant="outline" onClick={clearAll} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Limpar tudo
            </Button>
          </div>

          {showDiff && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <CardTitle className="text-lg">Resultado</CardTitle>
                  <div className="flex gap-4 text-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-primary/30 border border-primary/50 inline-block" />
                      <span className="text-primary">{stats.added} adicionadas</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-destructive/30 border border-destructive/50 inline-block" />
                      <span className="text-destructive">{stats.removed} removidas</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-secondary border border-border inline-block" />
                      <span className="text-muted-foreground">{stats.equal} iguais</span>
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-auto max-h-[500px]">
                  {diff.length === 0 ? (
                    <p className="p-4 text-muted-foreground text-sm">Os textos são idênticos.</p>
                  ) : (
                    <table className="w-full text-sm font-mono">
                      <tbody>
                        {diff.map((part, idx) => (
                          <tr
                            key={idx}
                            className={
                              part.type === "added"
                                ? "bg-primary/10"
                                : part.type === "removed"
                                ? "bg-destructive/10"
                                : ""
                            }
                          >
                            <td className="w-8 px-3 py-0.5 text-muted-foreground text-xs select-none border-r border-border text-right">
                              {part.type === "added" ? "+" : part.type === "removed" ? "-" : " "}
                            </td>
                            <td
                              className={`px-4 py-0.5 whitespace-pre-wrap break-all ${
                                part.type === "added"
                                  ? "text-primary"
                                  : part.type === "removed"
                                  ? "text-destructive"
                                  : "text-foreground"
                              }`}
                            >
                              {part.value || " "}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
