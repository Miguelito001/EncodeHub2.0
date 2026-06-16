"use client";

import { Search } from "lucide-react";

export function CommandHint() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
      className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
    >
      <Search className="h-4 w-4" />
      <span>Buscar ferramentas...</span>
      <kbd className="inline-flex h-5 items-center gap-0.5 rounded border border-border bg-secondary px-1.5 text-[10px] font-medium">
        ⌘K
      </kbd>
    </button>
  );
}
