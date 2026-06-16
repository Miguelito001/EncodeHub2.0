"use client";

import { useMemo } from "react";
import { Header } from "@/components/header";
import { ShareButton } from "@/components/share-button";
import { useUrlState } from "@/hooks/use-url-state";
import { FileText } from "lucide-react";

const DEFAULT_MD = `# Olá, Markdown!

Escreva no painel da **esquerda** e veja o resultado à *direita*.

## Recursos suportados

- Listas com marcadores
- **Negrito** e *itálico*
- \`código inline\`
- [Links](https://vercel.com)

> Citações também funcionam.

\`\`\`
bloco de código
multilinha
\`\`\`

1. Item numerado
2. Outro item
`;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(s: string): string {
  let out = escapeHtml(s);
  // código inline
  out = out.replace(/`([^`]+)`/g, '<code class="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm">$1</code>');
  // negrito
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // itálico
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  // links
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2">$1</a>'
  );
  return out;
}

function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  const html: string[] = [];
  let inCode = false;
  let codeBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

  for (const line of lines) {
    // blocos de código
    if (line.trim().startsWith("```")) {
      if (inCode) {
        html.push(
          `<pre class="overflow-x-auto rounded-lg bg-secondary p-4 my-3"><code class="font-mono text-sm">${escapeHtml(
            codeBuffer.join("\n")
          )}</code></pre>`
        );
        codeBuffer = [];
        inCode = false;
      } else {
        closeList();
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBuffer.push(line);
      continue;
    }

    // títulos
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      const sizes = ["text-3xl", "text-2xl", "text-xl", "text-lg", "text-base", "text-sm"];
      html.push(
        `<h${level} class="${sizes[level - 1]} font-bold text-foreground mt-4 mb-2">${inline(
          heading[2]
        )}</h${level}>`
      );
      continue;
    }

    // citação
    if (line.startsWith(">")) {
      closeList();
      html.push(
        `<blockquote class="border-l-4 border-primary/50 pl-4 my-3 text-muted-foreground italic">${inline(
          line.replace(/^>\s?/, "")
        )}</blockquote>`
      );
      continue;
    }

    // lista não ordenada
    if (/^[-*]\s+/.test(line)) {
      if (listType !== "ul") {
        closeList();
        html.push('<ul class="list-disc pl-6 my-2 space-y-1">');
        listType = "ul";
      }
      html.push(`<li>${inline(line.replace(/^[-*]\s+/, ""))}</li>`);
      continue;
    }

    // lista ordenada
    if (/^\d+\.\s+/.test(line)) {
      if (listType !== "ol") {
        closeList();
        html.push('<ol class="list-decimal pl-6 my-2 space-y-1">');
        listType = "ol";
      }
      html.push(`<li>${inline(line.replace(/^\d+\.\s+/, ""))}</li>`);
      continue;
    }

    // linha vazia
    if (!line.trim()) {
      closeList();
      continue;
    }

    // parágrafo
    closeList();
    html.push(`<p class="my-2 leading-relaxed text-foreground">${inline(line)}</p>`);
  }

  closeList();
  if (inCode && codeBuffer.length) {
    html.push(
      `<pre class="overflow-x-auto rounded-lg bg-secondary p-4 my-3"><code class="font-mono text-sm">${escapeHtml(
        codeBuffer.join("\n")
      )}</code></pre>`
    );
  }
  return html.join("\n");
}

export default function MarkdownPage() {
  const [md, setMd] = useUrlState("md", DEFAULT_MD);
  const rendered = useMemo(() => renderMarkdown(md), [md]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-screen-2xl mx-auto">
          <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <FileText className="h-5 w-5 text-sky-400" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Markdown Editor</h1>
              </div>
              <p className="text-muted-foreground">
                Escreva Markdown e veja a pré-visualização renderizada em tempo real.
              </p>
            </div>
            <ShareButton />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Editor</p>
              <textarea
                value={md}
                onChange={(e) => setMd(e.target.value)}
                spellCheck={false}
                className="min-h-[500px] flex-1 resize-none rounded-lg border border-border bg-background p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="flex flex-col">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Pré-visualização</p>
              <div
                className="min-h-[500px] flex-1 overflow-auto rounded-lg border border-border bg-card p-6"
                dangerouslySetInnerHTML={{ __html: rendered }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
