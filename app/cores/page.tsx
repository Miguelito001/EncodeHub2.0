"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Palette, RefreshCw } from "lucide-react";

type ColorFormat = "hex" | "rgb" | "hsl" | "hsv" | "cmyk";

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

export default function ColorsPage() {
  const [input, setInput] = useState("");
  const [colors, setColors] = useState<ColorValues | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [pickerColor, setPickerColor] = useState("#3b82f6");

  const parseColor = (value: string): ColorValues | null => {
    value = value.trim();

    // HEX
    const hexMatch = value.match(/^#?([a-f0-9]{6}|[a-f0-9]{3})$/i);
    if (hexMatch) {
      let hex = hexMatch[1];
      if (hex.length === 3) {
        hex = hex.split("").map((c) => c + c).join("");
      }
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return rgbToAll(r, g, b);
    }

    // RGB
    const rgbMatch = value.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      if (r <= 255 && g <= 255 && b <= 255) {
        return rgbToAll(r, g, b);
      }
    }

    // HSL
    const hslMatch = value.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/i);
    if (hslMatch) {
      const h = parseInt(hslMatch[1]);
      const s = parseInt(hslMatch[2]);
      const l = parseInt(hslMatch[3]);
      const rgb = hslToRgb(h, s, l);
      return rgbToAll(rgb.r, rgb.g, rgb.b);
    }

    return null;
  };

  const rgbToAll = (r: number, g: number, b: number): ColorValues => {
    return {
      hex: rgbToHex(r, g, b),
      rgb: { r, g, b },
      hsl: rgbToHsl(r, g, b),
      hsv: rgbToHsv(r, g, b),
      cmyk: rgbToCmyk(r, g, b),
    };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase();
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const rgbToHsv = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0;
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;

    if (max !== min) {
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const k = 1 - Math.max(r, g, b);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    return {
      c: Math.round(((1 - r - k) / (1 - k)) * 100),
      m: Math.round(((1 - g - k) / (1 - k)) * 100),
      y: Math.round(((1 - b - k) / (1 - k)) * 100),
      k: Math.round(k * 100),
    };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  };

  const convert = () => {
    setError("");
    const result = parseColor(input);
    if (result) {
      setColors(result);
    } else {
      setError("Formato de cor inválido. Use HEX, RGB ou HSL.");
      setColors(null);
    }
  };

  const handlePickerChange = (value: string) => {
    setPickerColor(value);
    setInput(value);
    setColors(parseColor(value));
    setError("");
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const colorFormats = colors
    ? [
        { label: "HEX", value: colors.hex, key: "hex" },
        { label: "RGB", value: `rgb(${colors.rgb.r}, ${colors.rgb.g}, ${colors.rgb.b})`, key: "rgb" },
        { label: "HSL", value: `hsl(${colors.hsl.h}, ${colors.hsl.s}%, ${colors.hsl.l}%)`, key: "hsl" },
        { label: "HSV", value: `hsv(${colors.hsv.h}, ${colors.hsv.s}%, ${colors.hsv.v}%)`, key: "hsv" },
        { label: "CMYK", value: `cmyk(${colors.cmyk.c}%, ${colors.cmyk.m}%, ${colors.cmyk.y}%, ${colors.cmyk.k}%)`, key: "cmyk" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-screen-xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Conversor de Cores</h1>
          <p className="text-muted-foreground">
            Converta entre HEX, RGB, HSL, HSV e CMYK
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Entrada
              </CardTitle>
              <CardDescription>Digite uma cor ou use o seletor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Color Picker */}
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={pickerColor}
                  onChange={(e) => handlePickerChange(e.target.value)}
                  className="w-16 h-16 rounded-lg cursor-pointer border-2 border-border"
                />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Clique para selecionar</p>
                  <code className="text-lg font-mono">{pickerColor.toUpperCase()}</code>
                </div>
              </div>

              <div className="relative">
                <p className="text-sm text-muted-foreground mb-2">Ou digite manualmente:</p>
                <Textarea
                  placeholder="#3B82F6 ou rgb(59, 130, 246) ou hsl(217, 91%, 60%)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="font-mono"
                />
              </div>

              <Button onClick={convert} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Converter
              </Button>

              {error && (
                <p className="text-destructive text-sm">{error}</p>
              )}

              {/* Example Colors */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Exemplos</p>
                <div className="flex flex-wrap gap-2">
                  {["#EF4444", "#22C55E", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899"].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-lg border-2 border-border hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => handlePickerChange(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Output */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conversões</CardTitle>
              <CardDescription>Todos os formatos de cor</CardDescription>
            </CardHeader>
            <CardContent>
              {colors ? (
                <div className="space-y-4">
                  {/* Preview */}
                  <div
                    className="w-full h-24 rounded-lg border-2 border-border"
                    style={{ backgroundColor: colors.hex }}
                  />

                  {/* Formats */}
                  <div className="space-y-3">
                    {colorFormats.map((format) => (
                      <div
                        key={format.key}
                        className="flex items-center justify-between bg-secondary p-3 rounded-lg"
                      >
                        <div>
                          <span className="text-xs text-muted-foreground">{format.label}</span>
                          <p className="font-mono">{format.value}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(format.value, format.key)}
                        >
                          {copied === format.key ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* CSS Variables */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-medium mb-2">CSS Variable</p>
                    <div className="flex items-center justify-between bg-secondary p-3 rounded-lg">
                      <code className="text-sm font-mono">
                        --color: {colors.hex};
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(`--color: ${colors.hex};`, "css")}
                      >
                        {copied === "css" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
                  <div className="text-center">
                    <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Selecione ou digite uma cor</p>
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
