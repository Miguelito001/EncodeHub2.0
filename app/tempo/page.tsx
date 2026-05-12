"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calculator, Clock } from "lucide-react";

export default function TempoPage() {
  // Calculadora de data final
  const [startDate, setStartDate] = useState("");
  const [hoursToAdd, setHoursToAdd] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("8");
  const [endDateResult, setEndDateResult] = useState<string | null>(null);

  // Calculadora de carga horária
  const [entryTime, setEntryTime] = useState("");
  const [exitTime, setExitTime] = useState("");
  const [lunchDuration, setLunchDuration] = useState("60");
  const [workloadResult, setWorkloadResult] = useState<string | null>(null);

  const calculateEndDate = () => {
    if (!startDate || !hoursToAdd || !hoursPerDay) {
      setEndDateResult("Preencha todos os campos");
      return;
    }

    const hours = parseFloat(hoursToAdd);
    const hpd = parseFloat(hoursPerDay);
    const daysNeeded = Math.ceil(hours / hpd);

    const start = new Date(startDate);
    let workDays = 0;
    const current = new Date(start);

    while (workDays < daysNeeded) {
      current.setDate(current.getDate() + 1);
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workDays++;
      }
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    setEndDateResult(
      `Data de conclusão: ${current.toLocaleDateString("pt-BR", options)} (${daysNeeded} dias úteis)`
    );
  };

  const calculateWorkload = () => {
    if (!entryTime || !exitTime) {
      setWorkloadResult("Preencha os horários de entrada e saída");
      return;
    }

    const [entryH, entryM] = entryTime.split(":").map(Number);
    const [exitH, exitM] = exitTime.split(":").map(Number);
    const lunch = parseInt(lunchDuration) || 0;

    const entryMinutes = entryH * 60 + entryM;
    const exitMinutes = exitH * 60 + exitM;

    let totalMinutes = exitMinutes - entryMinutes - lunch;

    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    setWorkloadResult(
      `Carga horária: ${hours}h ${minutes.toString().padStart(2, "0")}min (${(totalMinutes / 60).toFixed(2)} horas)`
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Calculadoras de Tempo
            </h1>
            <p className="text-muted-foreground">
              Calcule datas de conclusão e carga horária de trabalho
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Calculadora de Data Final */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calculator className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Data de Conclusão</CardTitle>
                    <CardDescription>
                      Calcule quando um projeto será concluído
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Data de início
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-card text-foreground"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Total de horas do projeto
                  </label>
                  <input
                    type="number"
                    value={hoursToAdd}
                    onChange={(e) => setHoursToAdd(e.target.value)}
                    placeholder="Ex: 120"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-card text-foreground font-mono"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Horas trabalhadas por dia
                  </label>
                  <input
                    type="number"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(e.target.value)}
                    placeholder="Ex: 8"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-card text-foreground font-mono"
                  />
                </div>

                <Button onClick={calculateEndDate} className="w-full">
                  Calcular Data
                </Button>

                {endDateResult && (
                  <div className="p-4 rounded-lg bg-secondary text-foreground text-center">
                    {endDateResult}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Calculadora de Carga Horária */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Carga Horária</CardTitle>
                    <CardDescription>
                      Calcule as horas trabalhadas no dia
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Horário de entrada
                  </label>
                  <input
                    type="time"
                    value={entryTime}
                    onChange={(e) => setEntryTime(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-card text-foreground"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Horário de saída
                  </label>
                  <input
                    type="time"
                    value={exitTime}
                    onChange={(e) => setExitTime(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-card text-foreground"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Duração do almoço (minutos)
                  </label>
                  <input
                    type="number"
                    value={lunchDuration}
                    onChange={(e) => setLunchDuration(e.target.value)}
                    placeholder="Ex: 60"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-card text-foreground font-mono"
                  />
                </div>

                <Button onClick={calculateWorkload} className="w-full">
                  Calcular Horas
                </Button>

                {workloadResult && (
                  <div className="p-4 rounded-lg bg-secondary text-foreground text-center">
                    {workloadResult}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
