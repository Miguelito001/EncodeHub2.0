import Link from "next/link";
import { Header } from "@/components/header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  FileCode2,
  Binary,
  Hash,
  ArrowLeftRight,
  Ruler,
  Clock,
  Zap,
  Shield,
  Globe,
  Link as LinkIcon,
  GitCompare,
  Braces,
  Shuffle,
  Regex,
  KeyRound,
  CalendarClock,
  Database,
  TerminalSquare,
  ShieldCheck,
  CaseSensitive,
} from "lucide-react";

const tools = [
  {
    href: "/base64",
    title: "Base64",
    description: "Codifique e decodifique texto em Base64 de forma rápida e segura",
    icon: FileCode2,
    color: "text-emerald-400",
    category: "Conversão",
  },
  {
    href: "/binario",
    title: "Binário",
    description: "Converta texto para binário e binário para texto facilmente",
    icon: Binary,
    color: "text-blue-400",
    category: "Conversão",
  },
  {
    href: "/hash",
    title: "Hash Generator",
    description: "Gere hashes criptográficos SHA-1, SHA-256, SHA-512 e MD5",
    icon: Hash,
    color: "text-purple-400",
    category: "Criptografia",
  },
  {
    href: "/jwt",
    title: "JWT Decoder",
    description: "Decodifique tokens JWT e veja header, payload e validade",
    icon: KeyRound,
    color: "text-red-400",
    category: "Criptografia",
  },
  {
    href: "/converter",
    title: "JSON / XML / YAML",
    description: "Converta dados entre JSON, XML e YAML instantaneamente",
    icon: ArrowLeftRight,
    color: "text-orange-400",
    category: "Conversão",
  },
  {
    href: "/url",
    title: "URL Encode / Decode",
    description: "Codifique e decodifique strings para uso seguro em URLs",
    icon: LinkIcon,
    color: "text-yellow-400",
    category: "Conversão",
  },
  {
    href: "/formatador",
    title: "Formatador de Código",
    description: "Formate ou minifique JSON, CSS e HTML com um clique",
    icon: Braces,
    color: "text-orange-400",
    category: "Dev",
  },
  {
    href: "/sql",
    title: "Formatador de SQL",
    description: "Embeleze queries SQL com indentação e palavras-chave padronizadas",
    icon: Database,
    color: "text-sky-400",
    category: "Dev",
  },
  {
    href: "/regex",
    title: "Regex Tester",
    description: "Teste expressões regulares com destaque de correspondências em tempo real",
    icon: Regex,
    color: "text-cyan-400",
    category: "Dev",
  },
  {
    href: "/curl",
    title: "cURL para Código",
    description: "Converta comandos cURL em fetch, Axios ou Python Requests",
    icon: TerminalSquare,
    color: "text-green-400",
    category: "Dev",
  },
  {
    href: "/cron",
    title: "Tradutor de Cron",
    description: "Entenda e gere expressões Cron explicadas em português",
    icon: CalendarClock,
    color: "text-emerald-400",
    category: "Dev",
  },
  {
    href: "/case",
    title: "Conversor de Case",
    description: "Converta entre camelCase, snake_case, kebab-case e mais",
    icon: CaseSensitive,
    color: "text-teal-400",
    category: "Dev",
  },
  {
    href: "/chmod",
    title: "Calculadora chmod",
    description: "Calcule permissões de arquivos Linux em octal e simbólico",
    icon: ShieldCheck,
    color: "text-amber-400",
    category: "Dev",
  },
  {
    href: "/gerador",
    title: "Gerador",
    description: "Gere UUIDs, senhas seguras e cores aleatórias instantaneamente",
    icon: Shuffle,
    color: "text-pink-400",
    category: "Dev",
  },
  {
    href: "/diff",
    title: "Diff de Texto",
    description: "Compare dois textos e veja as diferenças linha a linha",
    icon: GitCompare,
    color: "text-violet-400",
    category: "Dev",
  },
  {
    href: "/unidades",
    title: "Unidades de Medida",
    description: "Converta entre diferentes unidades de medida e moedas",
    icon: Ruler,
    color: "text-pink-400",
    category: "Conversão",
  },
  {
    href: "/tempo",
    title: "Calculadora de Tempo",
    description: "Calcule horas de trabalho, datas e carga horária",
    icon: Clock,
    color: "text-cyan-400",
    category: "Utilitário",
  },
];

const features = [
  {
    icon: Zap,
    title: "Rápido",
    description: "Processamento instantâneo no navegador",
  },
  {
    icon: Shield,
    title: "Seguro",
    description: "Seus dados nunca saem do seu dispositivo",
  },
  {
    icon: Globe,
    title: "Online",
    description: "Acesse de qualquer lugar, sem instalação",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container max-w-screen-xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-6 border border-primary/20">
              <Zap className="h-4 w-4" />
              <span>{tools.length} ferramentas para desenvolvedores</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              EncodeHub
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-pretty">
              Caixa de ferramentas online para desenvolvedores. Converta, formate, teste e gere dados sem sair do navegador — rápido, seguro e sem instalação.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-8 mb-16">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-12 px-4 bg-secondary/30">
          <div className="container max-w-screen-xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-foreground">
                Ferramentas Disponíveis
              </h2>
              <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border">
                {tools.length} ferramentas
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <Link key={tool.href} href={tool.href}>
                  <Card className="h-full transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors flex-shrink-0">
                          <tool.icon className={`h-5 w-5 ${tool.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <CardTitle className="text-base">{tool.title}</CardTitle>
                            <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                              {tool.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-sm">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-border">
          <div className="container max-w-screen-xl mx-auto text-center text-sm text-muted-foreground">
            <p>
              Feito com dedicação para a comunidade de desenvolvedores.{" "}
              <a
                href="https://github.com/Miguelito001/EncodeHub2.0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Ver no GitHub
              </a>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
