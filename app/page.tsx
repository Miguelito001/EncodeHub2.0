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
} from "lucide-react";

const tools = [
  {
    href: "/base64",
    title: "Base64",
    description: "Codifique e decodifique texto em Base64 de forma rápida e segura",
    icon: FileCode2,
    color: "text-emerald-400",
  },
  {
    href: "/binario",
    title: "Binário",
    description: "Converta texto para binário e binário para texto facilmente",
    icon: Binary,
    color: "text-blue-400",
  },
  {
    href: "/hash",
    title: "Hash Generator",
    description: "Gere hashes criptográficos SHA-1, SHA-256, SHA-512 e MD5",
    icon: Hash,
    color: "text-purple-400",
  },
  {
    href: "/converter",
    title: "JSON / XML / YAML",
    description: "Converta dados entre JSON, XML e YAML instantaneamente",
    icon: ArrowLeftRight,
    color: "text-orange-400",
  },
  {
    href: "/unidades",
    title: "Unidades de Medida",
    description: "Converta entre diferentes unidades de medida e moedas",
    icon: Ruler,
    color: "text-pink-400",
  },
  {
    href: "/tempo",
    title: "Calculadora de Tempo",
    description: "Calcule horas de trabalho, datas e carga horária",
    icon: Clock,
    color: "text-cyan-400",
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-6">
              <Zap className="h-4 w-4" />
              <span>Ferramentas para Desenvolvedores</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              EncodeHub
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-pretty">
              Ferramenta online completa para conversão, formatação e
              manipulação de dados. Projetada para desenvolvedores que
              precisam de eficiência no dia a dia.
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
            <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">
              Ferramentas Disponíveis
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <Link key={tool.href} href={tool.href}>
                  <Card className="h-full transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
                          <tool.icon className={`h-5 w-5 ${tool.color}`} />
                        </div>
                        <CardTitle className="text-lg">{tool.title}</CardTitle>
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
