"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";

/**
 * Botão que copia a URL atual (com o estado da ferramenta nos query params)
 * para a área de transferência, permitindo compartilhar um link direto.
 */
export function ShareButton({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponível — ignora silenciosamente
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={share}
      className={className}
      title="Copiar link compartilhável desta ferramenta"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-primary" />
          Link copiado!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Compartilhar
        </>
      )}
    </Button>
  );
}
