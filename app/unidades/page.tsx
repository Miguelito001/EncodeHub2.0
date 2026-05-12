"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = "length" | "weight" | "temperature" | "area" | "volume";

const categories: { value: Category; label: string }[] = [
  { value: "length", label: "Comprimento" },
  { value: "weight", label: "Peso" },
  { value: "temperature", label: "Temperatura" },
  { value: "area", label: "Área" },
  { value: "volume", label: "Volume" },
];

const units: Record<Category, { value: string; label: string; toBase: (n: number) => number; fromBase: (n: number) => number }[]> = {
  length: [
    { value: "m", label: "Metros (m)", toBase: (n) => n, fromBase: (n) => n },
    { value: "km", label: "Quilômetros (km)", toBase: (n) => n * 1000, fromBase: (n) => n / 1000 },
    { value: "cm", label: "Centímetros (cm)", toBase: (n) => n / 100, fromBase: (n) => n * 100 },
    { value: "mm", label: "Milímetros (mm)", toBase: (n) => n / 1000, fromBase: (n) => n * 1000 },
    { value: "mi", label: "Milhas (mi)", toBase: (n) => n * 1609.344, fromBase: (n) => n / 1609.344 },
    { value: "ft", label: "Pés (ft)", toBase: (n) => n * 0.3048, fromBase: (n) => n / 0.3048 },
    { value: "in", label: "Polegadas (in)", toBase: (n) => n * 0.0254, fromBase: (n) => n / 0.0254 },
  ],
  weight: [
    { value: "kg", label: "Quilogramas (kg)", toBase: (n) => n, fromBase: (n) => n },
    { value: "g", label: "Gramas (g)", toBase: (n) => n / 1000, fromBase: (n) => n * 1000 },
    { value: "mg", label: "Miligramas (mg)", toBase: (n) => n / 1000000, fromBase: (n) => n * 1000000 },
    { value: "lb", label: "Libras (lb)", toBase: (n) => n * 0.453592, fromBase: (n) => n / 0.453592 },
    { value: "oz", label: "Onças (oz)", toBase: (n) => n * 0.0283495, fromBase: (n) => n / 0.0283495 },
    { value: "t", label: "Toneladas (t)", toBase: (n) => n * 1000, fromBase: (n) => n / 1000 },
  ],
  temperature: [
    { value: "c", label: "Celsius (°C)", toBase: (n) => n, fromBase: (n) => n },
    { value: "f", label: "Fahrenheit (°F)", toBase: (n) => (n - 32) * 5 / 9, fromBase: (n) => (n * 9 / 5) + 32 },
    { value: "k", label: "Kelvin (K)", toBase: (n) => n - 273.15, fromBase: (n) => n + 273.15 },
  ],
  area: [
    { value: "m2", label: "Metros² (m²)", toBase: (n) => n, fromBase: (n) => n },
    { value: "km2", label: "Quilômetros² (km²)", toBase: (n) => n * 1000000, fromBase: (n) => n / 1000000 },
    { value: "ha", label: "Hectares (ha)", toBase: (n) => n * 10000, fromBase: (n) => n / 10000 },
    { value: "acre", label: "Acres", toBase: (n) => n * 4046.86, fromBase: (n) => n / 4046.86 },
    { value: "ft2", label: "Pés² (ft²)", toBase: (n) => n * 0.092903, fromBase: (n) => n / 0.092903 },
  ],
  volume: [
    { value: "l", label: "Litros (L)", toBase: (n) => n, fromBase: (n) => n },
    { value: "ml", label: "Mililitros (mL)", toBase: (n) => n / 1000, fromBase: (n) => n * 1000 },
    { value: "m3", label: "Metros³ (m³)", toBase: (n) => n * 1000, fromBase: (n) => n / 1000 },
    { value: "gal", label: "Galões (gal)", toBase: (n) => n * 3.78541, fromBase: (n) => n / 3.78541 },
    { value: "qt", label: "Quartos (qt)", toBase: (n) => n * 0.946353, fromBase: (n) => n / 0.946353 },
  ],
};

export default function UnidadesPage() {
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Digite um valor válido");
      return;
    }

    const fromUnitData = units[category].find((u) => u.value === fromUnit);
    const toUnitData = units[category].find((u) => u.value === toUnit);

    if (!fromUnitData || !toUnitData) return;

    const baseValue = fromUnitData.toBase(value);
    const convertedValue = toUnitData.fromBase(baseValue);

    setResult(convertedValue.toLocaleString("pt-BR", { maximumFractionDigits: 6 }));
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult(null);
  };

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setFromUnit(units[newCategory][0].value);
    setToUnit(units[newCategory][1].value);
    setResult(null);
    setInputValue("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Conversor de Unidades
            </h1>
            <p className="text-muted-foreground">
              Converta entre diferentes unidades de medida
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Selecione a Categoria</CardTitle>
              <div className="flex flex-wrap gap-2 mt-4">
                {categories.map((cat) => (
                  <Button
                    key={cat.value}
                    variant={category === cat.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryChange(cat.value)}
                    className={cn(category === cat.value && "bg-primary")}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    De
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Digite o valor"
                      className="flex-1 h-10 px-3 rounded-lg border border-border bg-card text-foreground font-mono"
                    />
                    <select
                      value={fromUnit}
                      onChange={(e) => setFromUnit(e.target.value)}
                      className="h-10 px-3 rounded-lg border border-border bg-card text-foreground min-w-[150px]"
                    >
                      {units[category].map((unit) => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button variant="ghost" size="icon" onClick={swapUnits}>
                    <ArrowLeftRight className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Para
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 h-10 px-3 rounded-lg border border-border bg-secondary flex items-center font-mono text-foreground">
                      {result || "—"}
                    </div>
                    <select
                      value={toUnit}
                      onChange={(e) => setToUnit(e.target.value)}
                      className="h-10 px-3 rounded-lg border border-border bg-card text-foreground min-w-[150px]"
                    >
                      {units[category].map((unit) => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <Button onClick={convert} className="w-full">
                Converter
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
