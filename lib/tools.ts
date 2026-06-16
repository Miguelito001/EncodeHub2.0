import type { LucideIcon } from "lucide-react";
import {
  FileCode2,
  Binary,
  Hash,
  ArrowLeftRight,
  Ruler,
  Clock,
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
  Network,
  Type,
  Code2,
  Hash as HashIcon,
  Scaling,
  ServerCog,
} from "lucide-react";

export type ToolCategory =
  | "Conversão"
  | "Dev"
  | "Criptografia"
  | "Rede"
  | "Frontend"
  | "Texto"
  | "Utilitário";

export interface Tool {
  href: string;
  title: string;
  /** Short label used in the navigation bar */
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  category: ToolCategory;
  /** Extra search terms for the command palette */
  keywords?: string[];
}

export const tools: Tool[] = [
  {
    href: "/base64",
    title: "Base64",
    label: "Base64",
    description: "Codifique e decodifique texto em Base64 de forma rápida e segura",
    icon: FileCode2,
    color: "text-emerald-400",
    category: "Conversão",
    keywords: ["encode", "decode", "b64"],
  },
  {
    href: "/binario",
    title: "Binário",
    label: "Binário",
    description: "Converta texto para binário e binário para texto facilmente",
    icon: Binary,
    color: "text-blue-400",
    category: "Conversão",
    keywords: ["binary", "bits"],
  },
  {
    href: "/bases",
    title: "Bases Numéricas",
    label: "Bases",
    description: "Converta entre decimal, hexadecimal, octal e binário ao mesmo tempo",
    icon: HashIcon,
    color: "text-indigo-400",
    category: "Conversão",
    keywords: ["hex", "octal", "decimal", "radix", "número"],
  },
  {
    href: "/hash",
    title: "Hash Generator",
    label: "Hash",
    description: "Gere hashes criptográficos SHA-1, SHA-256, SHA-512 e MD5",
    icon: Hash,
    color: "text-purple-400",
    category: "Criptografia",
    keywords: ["sha", "md5", "checksum"],
  },
  {
    href: "/jwt",
    title: "JWT Decoder",
    label: "JWT",
    description: "Decodifique tokens JWT e veja header, payload e validade",
    icon: KeyRound,
    color: "text-red-400",
    category: "Criptografia",
    keywords: ["token", "auth", "bearer"],
  },
  {
    href: "/converter",
    title: "JSON / XML / YAML",
    label: "JSON/XML/YAML",
    description: "Converta dados entre JSON, XML e YAML instantaneamente",
    icon: ArrowLeftRight,
    color: "text-orange-400",
    category: "Conversão",
    keywords: ["yaml", "xml", "json"],
  },
  {
    href: "/csv",
    title: "JSON ⇄ CSV",
    label: "CSV",
    description: "Converta entre arrays de objetos JSON e planilhas CSV nos dois sentidos",
    icon: Database,
    color: "text-lime-400",
    category: "Conversão",
    keywords: ["excel", "planilha", "tabela"],
  },
  {
    href: "/url",
    title: "URL Encode / Decode",
    label: "URL",
    description: "Codifique e decodifique strings para uso seguro em URLs",
    icon: LinkIcon,
    color: "text-yellow-400",
    category: "Conversão",
    keywords: ["uri", "percent", "escape"],
  },
  {
    href: "/html-entities",
    title: "Entidades HTML",
    label: "HTML Entities",
    description: "Converta caracteres especiais em entidades HTML e vice-versa",
    icon: Code2,
    color: "text-rose-400",
    category: "Frontend",
    keywords: ["escape", "&lt;", "entity", "special chars"],
  },
  {
    href: "/formatador",
    title: "Formatador de Código",
    label: "Formatador",
    description: "Formate ou minifique JSON, CSS e HTML com um clique",
    icon: Braces,
    color: "text-orange-400",
    category: "Dev",
    keywords: ["beautify", "minify", "prettify"],
  },
  {
    href: "/sql",
    title: "Formatador de SQL",
    label: "SQL",
    description: "Embeleze queries SQL com indentação e palavras-chave padronizadas",
    icon: Database,
    color: "text-sky-400",
    category: "Dev",
    keywords: ["query", "beautify", "mysql", "postgres"],
  },
  {
    href: "/regex",
    title: "Regex Tester",
    label: "Regex",
    description: "Teste expressões regulares com destaque de correspondências em tempo real",
    icon: Regex,
    color: "text-cyan-400",
    category: "Dev",
    keywords: ["regular expression", "pattern", "match"],
  },
  {
    href: "/curl",
    title: "cURL para Código",
    label: "cURL",
    description: "Converta comandos cURL em fetch, Axios ou Python Requests",
    icon: TerminalSquare,
    color: "text-green-400",
    category: "Dev",
    keywords: ["http", "request", "fetch", "axios"],
  },
  {
    href: "/cron",
    title: "Tradutor de Cron",
    label: "Cron",
    description: "Entenda e gere expressões Cron explicadas em português",
    icon: CalendarClock,
    color: "text-emerald-400",
    category: "Dev",
    keywords: ["schedule", "crontab", "agendamento"],
  },
  {
    href: "/case",
    title: "Conversor de Case",
    label: "Case",
    description: "Converta entre camelCase, snake_case, kebab-case e mais",
    icon: CaseSensitive,
    color: "text-teal-400",
    category: "Texto",
    keywords: ["camel", "snake", "kebab", "pascal"],
  },
  {
    href: "/text-analyzer",
    title: "Analisador de Texto",
    label: "Analisar",
    description: "Conte caracteres, palavras, linhas, bytes e revele caracteres invisíveis",
    icon: Type,
    color: "text-fuchsia-400",
    category: "Texto",
    keywords: ["count", "words", "bytes", "whitespace", "invisible"],
  },
  {
    href: "/chmod",
    title: "Calculadora chmod",
    label: "chmod",
    description: "Calcule permissões de arquivos Linux em octal e simbólico",
    icon: ShieldCheck,
    color: "text-amber-400",
    category: "Rede",
    keywords: ["linux", "permissions", "octal", "unix"],
  },
  {
    href: "/cidr",
    title: "Calculadora CIDR",
    label: "CIDR",
    description: "Calcule range de IPs, máscara e hosts a partir de notação CIDR",
    icon: Network,
    color: "text-blue-400",
    category: "Rede",
    keywords: ["subnet", "ip", "netmask", "vpc", "ipv4"],
  },
  {
    href: "/http-status",
    title: "HTTP Status Codes",
    label: "HTTP Status",
    description: "Referência rápida e pesquisável de códigos de status HTTP",
    icon: ServerCog,
    color: "text-orange-400",
    category: "Rede",
    keywords: ["404", "500", "cheatsheet", "codes"],
  },
  {
    href: "/px-rem",
    title: "PX ⇄ REM / EM",
    label: "PX/REM",
    description: "Converta px para rem/em com base no font-size definido",
    icon: Scaling,
    color: "text-pink-400",
    category: "Frontend",
    keywords: ["css", "responsive", "font", "spacing"],
  },
  {
    href: "/gerador",
    title: "Gerador",
    label: "Gerador",
    description: "Gere UUIDs, senhas seguras e cores aleatórias instantaneamente",
    icon: Shuffle,
    color: "text-pink-400",
    category: "Dev",
    keywords: ["uuid", "password", "random", "senha"],
  },
  {
    href: "/diff",
    title: "Diff de Texto",
    label: "Diff",
    description: "Compare dois textos e veja as diferenças linha a linha",
    icon: GitCompare,
    color: "text-violet-400",
    category: "Texto",
    keywords: ["compare", "comparar", "git"],
  },
  {
    href: "/unidades",
    title: "Unidades de Medida",
    label: "Unidades",
    description: "Converta entre diferentes unidades de medida e moedas",
    icon: Ruler,
    color: "text-pink-400",
    category: "Conversão",
    keywords: ["units", "metric", "peso", "distância"],
  },
  {
    href: "/tempo",
    title: "Calculadora de Tempo",
    label: "Tempo",
    description: "Calcule horas de trabalho, datas e carga horária",
    icon: Clock,
    color: "text-cyan-400",
    category: "Utilitário",
    keywords: ["time", "hours", "data", "duração"],
  },
];

export const categoryOrder: ToolCategory[] = [
  "Conversão",
  "Texto",
  "Dev",
  "Frontend",
  "Rede",
  "Criptografia",
  "Utilitário",
];

export function getToolsByCategory() {
  const map = new Map<ToolCategory, Tool[]>();
  for (const category of categoryOrder) {
    map.set(category, []);
  }
  for (const tool of tools) {
    map.get(tool.category)?.push(tool);
  }
  return Array.from(map.entries()).filter(([, list]) => list.length > 0);
}
