"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Type, RefreshCw } from "lucide-react";

const loremWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
  "explicabo", "nemo", "ipsam", "quia", "voluptas", "aspernatur", "aut", "odit",
  "fugit", "consequuntur", "magni", "dolores", "eos", "ratione", "sequi", "nesciunt"
];

type GenerateType = "paragraphs" | "sentences" | "words";

export default function LoremPage() {
  const [output, setOutput] = useState("");
  const [count, setCount] = useState(3);
  const [type, setType] = useState<GenerateType>("paragraphs");
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [copied, setCopied] = useState(false);

  const getRandomWord = () => loremWords[Math.floor(Math.random() * loremWords.length)];

  const generateWords = (num: number, forceStart = false): string => {
    const words: string[] = [];
    for (let i = 0; i < num; i++) {
      if (i === 0 && forceStart) {
        words.push("Lorem");
      } else if (i === 1 && forceStart) {
        words.push("ipsum");
      } else {
        words.push(getRandomWord());
      }
    }
    return words.join(" ");
  };

  const generateSentence = (forceStart = false): string => {
    const wordCount = Math.floor(Math.random() * 10) + 8;
    let sentence = generateWords(wordCount, forceStart);
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    return sentence + ".";
  };

  const generateParagraph = (forceStart = false): string => {
    const sentenceCount = Math.floor(Math.random() * 4) + 4;
    const sentences: string[] = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence(i === 0 && forceStart));
    }
    return sentences.join(" ");
  };

  const generate = () => {
    let result = "";

    switch (type) {
      case "paragraphs":
        const paragraphs: string[] = [];
        for (let i = 0; i < count; i++) {
          paragraphs.push(generateParagraph(i === 0 && startWithLorem));
        }
        result = paragraphs.join("\n\n");
        break;

      case "sentences":
        const sentences: string[] = [];
        for (let i = 0; i < count; i++) {
          sentences.push(generateSentence(i === 0 && startWithLorem));
        }
        result = sentences.join(" ");
        break;

      case "words":
        result = generateWords(count, startWithLorem);
        if (startWithLorem) {
          result = result.charAt(0).toUpperCase() + result.slice(1);
        }
        break;
    }

    setOutput(result);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = output.split(/\s+/).filter(Boolean).length;
  const charCount = output.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-screen-xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Lorem Ipsum</h1>
          <p className="text-muted-foreground">
            Gere texto placeholder para seus projetos de design e desenvolvimento
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Type className="h-5 w-5 text-primary" />
                Configurações
              </CardTitle>
              <CardDescription>Personalize a geração de texto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "paragraphs", label: "Parágrafos" },
                    { value: "sentences", label: "Frases" },
                    { value: "words", label: "Palavras" },
                  ].map((opt) => (
                    <Button
                      key={opt.value}
                      variant={type === opt.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setType(opt.value as GenerateType)}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Count */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Quantidade: {count}
                </label>
                <input
                  type="range"
                  min={1}
                  max={type === "words" ? 500 : type === "sentences" ? 50 : 20}
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>{type === "words" ? 500 : type === "sentences" ? 50 : 20}</span>
                </div>
              </div>

              {/* Start with Lorem */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="startLorem"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="accent-primary"
                />
                <label htmlFor="startLorem" className="text-sm">
                  Começar com &quot;Lorem ipsum...&quot;
                </label>
              </div>

              {/* Generate Button */}
              <Button onClick={generate} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Gerar Texto
              </Button>

              {/* Quick Options */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Atalhos</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "1 parágrafo", t: "paragraphs", c: 1 },
                    { label: "3 parágrafos", t: "paragraphs", c: 3 },
                    { label: "5 frases", t: "sentences", c: 5 },
                    { label: "50 palavras", t: "words", c: 50 },
                  ].map((opt) => (
                    <Button
                      key={opt.label}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setType(opt.t as GenerateType);
                        setCount(opt.c);
                      }}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Texto Gerado</CardTitle>
                {output && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {wordCount} palavras | {charCount} caracteres
                    </span>
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {output ? (
                <div className="bg-secondary p-4 rounded-lg min-h-[300px] whitespace-pre-wrap leading-relaxed">
                  {output}
                </div>
              ) : (
                <div className="bg-secondary p-4 rounded-lg min-h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Configure as opções e clique em Gerar Texto</p>
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
