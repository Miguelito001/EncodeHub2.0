"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Format = "json" | "xml" | "yaml";

export default function ConverterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [inputFormat, setInputFormat] = useState<Format>("json");
  const [outputFormat, setOutputFormat] = useState<Format>("yaml");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const formats: { value: Format; label: string }[] = [
    { value: "json", label: "JSON" },
    { value: "xml", label: "XML" },
    { value: "yaml", label: "YAML" },
  ];

  const parseJSON = (str: string) => JSON.parse(str);

  const parseYAML = (str: string) => {
    const lines = str.split("\n");
    const result: Record<string, unknown> = {};
    let currentKey = "";

    for (const line of lines) {
      if (line.trim() === "" || line.startsWith("#")) continue;

      const match = line.match(/^(\s*)([^:]+):\s*(.*)$/);
      if (match) {
        const [, , key, value] = match;
        currentKey = key.trim();
        if (value.trim()) {
          let parsedValue: unknown = value.trim();
          if (parsedValue === "true") parsedValue = true;
          else if (parsedValue === "false") parsedValue = false;
          else if (!isNaN(Number(parsedValue))) parsedValue = Number(parsedValue);
          else if (typeof parsedValue === "string" && (parsedValue.startsWith('"') || parsedValue.startsWith("'"))) {
            parsedValue = parsedValue.slice(1, -1);
          }
          result[currentKey] = parsedValue;
        }
      }
    }
    return result;
  };

  const parseXML = (str: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(str, "text/xml");

    const parseNode = (node: Element): unknown => {
      const obj: Record<string, unknown> = {};

      if (node.children.length === 0) {
        return node.textContent?.trim() || "";
      }

      for (const child of Array.from(node.children)) {
        const key = child.tagName;
        const value = parseNode(child);

        if (obj[key]) {
          if (!Array.isArray(obj[key])) {
            obj[key] = [obj[key]];
          }
          (obj[key] as unknown[]).push(value);
        } else {
          obj[key] = value;
        }
      }

      return obj;
    };

    return parseNode(xmlDoc.documentElement);
  };

  const toJSON = (obj: unknown) => JSON.stringify(obj, null, 2);

  const toYAML = (obj: unknown, indent = 0): string => {
    const spaces = "  ".repeat(indent);

    if (Array.isArray(obj)) {
      return obj.map((item) => `${spaces}- ${toYAML(item, indent + 1).trim()}`).join("\n");
    }

    if (typeof obj === "object" && obj !== null) {
      return Object.entries(obj)
        .map(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            return `${spaces}${key}:\n${toYAML(value, indent + 1)}`;
          }
          return `${spaces}${key}: ${value}`;
        })
        .join("\n");
    }

    return String(obj);
  };

  const toXML = (obj: unknown, rootName = "root", indent = 0): string => {
    const spaces = "  ".repeat(indent);

    if (Array.isArray(obj)) {
      return obj.map((item) => toXML(item, "item", indent)).join("\n");
    }

    if (typeof obj === "object" && obj !== null) {
      const inner = Object.entries(obj)
        .map(([key, value]) => toXML(value, key, indent + 1))
        .join("\n");
      return `${spaces}<${rootName}>\n${inner}\n${spaces}</${rootName}>`;
    }

    return `${spaces}<${rootName}>${obj}</${rootName}>`;
  };

  const convert = () => {
    setError("");
    try {
      let data: unknown;

      switch (inputFormat) {
        case "json":
          data = parseJSON(input);
          break;
        case "yaml":
          data = parseYAML(input);
          break;
        case "xml":
          data = parseXML(input);
          break;
      }

      let result: string;

      switch (outputFormat) {
        case "json":
          result = toJSON(data);
          break;
        case "yaml":
          result = toYAML(data);
          break;
        case "xml":
          result = toXML(data);
          break;
      }

      setOutput(result);
    } catch (e) {
      setError(`Erro ao converter: ${e instanceof Error ? e.message : "formato inválido"}`);
      setOutput("");
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Conversor de Dados
            </h1>
            <p className="text-muted-foreground">
              Converta entre JSON, XML e YAML
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Entrada</CardTitle>
                  <div className="flex gap-1">
                    {formats.map((format) => (
                      <Button
                        key={format.value}
                        variant={inputFormat === format.value ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setInputFormat(format.value)}
                        className={cn(
                          "text-xs",
                          inputFormat === format.value && "bg-primary"
                        )}
                      >
                        {format.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={`Cole seu ${inputFormat.toUpperCase()} aqui...`}
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
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {formats.map((format) => (
                        <Button
                          key={format.value}
                          variant={outputFormat === format.value ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setOutputFormat(format.value)}
                          className={cn(
                            "text-xs",
                            outputFormat === format.value && "bg-primary"
                          )}
                        >
                          {format.label}
                        </Button>
                      ))}
                    </div>
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
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="O resultado aparecerá aqui..."
                  value={error || output}
                  readOnly
                  className={cn("min-h-[300px]", error && "text-destructive")}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mt-6">
            <Button onClick={convert} className="gap-2">
              Converter
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
