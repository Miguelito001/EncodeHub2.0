"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { ServerCog, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusCode {
  code: number;
  name: string;
  description: string;
}

const statusCodes: StatusCode[] = [
  { code: 100, name: "Continue", description: "O servidor recebeu os cabeçalhos e o cliente deve prosseguir com a requisição." },
  { code: 101, name: "Switching Protocols", description: "O servidor está trocando de protocolo conforme solicitado pelo cliente." },
  { code: 200, name: "OK", description: "A requisição foi bem-sucedida." },
  { code: 201, name: "Created", description: "A requisição foi bem-sucedida e um novo recurso foi criado." },
  { code: 202, name: "Accepted", description: "A requisição foi aceita para processamento, mas ainda não foi concluída." },
  { code: 204, name: "No Content", description: "Requisição bem-sucedida, sem conteúdo para retornar." },
  { code: 206, name: "Partial Content", description: "O servidor está entregando apenas parte do recurso (range)." },
  { code: 301, name: "Moved Permanently", description: "O recurso foi movido permanentemente para uma nova URL." },
  { code: 302, name: "Found", description: "O recurso reside temporariamente em uma URL diferente." },
  { code: 304, name: "Not Modified", description: "O recurso não foi modificado desde a última requisição (cache)." },
  { code: 307, name: "Temporary Redirect", description: "Redirecionamento temporário mantendo o método HTTP." },
  { code: 308, name: "Permanent Redirect", description: "Redirecionamento permanente mantendo o método HTTP." },
  { code: 400, name: "Bad Request", description: "O servidor não entendeu a requisição devido a sintaxe inválida." },
  { code: 401, name: "Unauthorized", description: "Autenticação é necessária e falhou ou não foi fornecida." },
  { code: 403, name: "Forbidden", description: "O cliente não tem permissão de acesso ao conteúdo." },
  { code: 404, name: "Not Found", description: "O servidor não conseguiu encontrar o recurso solicitado." },
  { code: 405, name: "Method Not Allowed", description: "O método HTTP usado não é permitido para este recurso." },
  { code: 408, name: "Request Timeout", description: "O servidor encerrou a conexão por inatividade." },
  { code: 409, name: "Conflict", description: "Conflito com o estado atual do recurso." },
  { code: 410, name: "Gone", description: "O recurso solicitado não está mais disponível." },
  { code: 418, name: "I'm a teapot", description: "O servidor se recusa a preparar café porque é um bule de chá." },
  { code: 422, name: "Unprocessable Entity", description: "A requisição está bem formada mas contém erros semânticos." },
  { code: 429, name: "Too Many Requests", description: "O usuário enviou muitas requisições em um intervalo (rate limit)." },
  { code: 500, name: "Internal Server Error", description: "O servidor encontrou uma condição inesperada." },
  { code: 501, name: "Not Implemented", description: "O servidor não suporta a funcionalidade requisitada." },
  { code: 502, name: "Bad Gateway", description: "O servidor, atuando como gateway, recebeu uma resposta inválida." },
  { code: 503, name: "Service Unavailable", description: "O servidor não está pronto (manutenção ou sobrecarga)." },
  { code: 504, name: "Gateway Timeout", description: "O gateway não recebeu resposta a tempo do servidor upstream." },
];

const groups = [
  { range: "1xx", label: "Informativo", color: "text-sky-400", border: "border-sky-400/30", bg: "bg-sky-400/10" },
  { range: "2xx", label: "Sucesso", color: "text-emerald-400", border: "border-emerald-400/30", bg: "bg-emerald-400/10" },
  { range: "3xx", label: "Redirecionamento", color: "text-amber-400", border: "border-amber-400/30", bg: "bg-amber-400/10" },
  { range: "4xx", label: "Erro do Cliente", color: "text-orange-400", border: "border-orange-400/30", bg: "bg-orange-400/10" },
  { range: "5xx", label: "Erro do Servidor", color: "text-red-400", border: "border-red-400/30", bg: "bg-red-400/10" },
];

function groupOf(code: number) {
  return groups[Math.floor(code / 100) - 1];
}

export default function HttpStatusPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return statusCodes.filter((s) => {
      const matchesQuery =
        !q ||
        String(s.code).includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q);
      const matchesFilter =
        !filter || Math.floor(s.code / 100) === Number(filter[0]);
      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-screen-xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <ServerCog className="h-5 w-5 text-orange-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">HTTP Status Codes</h1>
            </div>
            <p className="text-muted-foreground">
              Referência rápida e pesquisável de códigos de status HTTP.
            </p>
          </div>

          <div className="flex items-center gap-2 mb-4 rounded-md border border-border bg-card px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por código ou nome (ex: 404, timeout)..."
              className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter(null)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md border transition-colors",
                !filter
                  ? "bg-secondary text-foreground border-border"
                  : "text-muted-foreground border-border hover:bg-secondary/50"
              )}
            >
              Todos
            </button>
            {groups.map((g) => (
              <button
                key={g.range}
                onClick={() => setFilter(filter === g.range ? null : g.range)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md border transition-colors",
                  filter === g.range
                    ? `${g.bg} ${g.color} ${g.border}`
                    : "text-muted-foreground border-border hover:bg-secondary/50"
                )}
              >
                {g.range} · {g.label}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => {
              const g = groupOf(s.code);
              return (
                <Card key={s.code} className={cn("border", g.border)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("font-mono text-xl font-bold", g.color)}>
                        {s.code}
                      </span>
                      <span className="font-medium text-foreground">{s.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-lg bg-secondary/40 border border-border p-8 text-center text-muted-foreground">
              Nenhum código encontrado.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
