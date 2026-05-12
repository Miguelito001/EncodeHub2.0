"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Copy, Trash2, Check } from "lucide-react";

export default function BinarioPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const textToBinary = () => {
    try {
      const binary = input
        .split("")
        .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
        .join(" ");
      setOutput(binary);
    } catch {
      setOutput("Erro ao converter para binário");
    }
  };

  const binaryToText = () => {
    try {
      const text = input
        .split(" ")
        .map((bin) => String.fromCharCode(parseInt(bin, 2)))
        .join("");
      setOutput(text);
    } catch {
      setOutput("Erro ao converter de binário - verifique o formato");
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Conversor Binário
            </h1>
            <p className="text-muted-foreground">
              Converta texto para binário e binário para texto
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Entrada</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Digite o texto ou binário aqui..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[300px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Saída</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyToClipboard}
                      disabled={!output}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={clearAll}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="O resultado aparecerá aqui..."
                  value={output}
                  readOnly
                  className="min-h-[300px]"
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Button onClick={textToBinary} className="gap-2">
              Texto para Binário
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button onClick={binaryToText} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Binário para Texto
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
