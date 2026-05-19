"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Binary,
  FileCode2,
  Hash,
  ArrowLeftRight,
  Clock,
  Ruler,
  Github,
  Home,
  Link as LinkIcon,
  GitCompare,
  Braces,
  Shuffle,
  Regex,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/base64", label: "Base64", icon: FileCode2 },
  { href: "/binario", label: "Binário", icon: Binary },
  { href: "/hash", label: "Hash", icon: Hash },
  { href: "/converter", label: "JSON/XML/YAML", icon: ArrowLeftRight },
  { href: "/url", label: "URL", icon: LinkIcon },
  { href: "/formatador", label: "Formatador", icon: Braces },
  { href: "/regex", label: "Regex", icon: Regex },
  { href: "/gerador", label: "Gerador", icon: Shuffle },
  { href: "/diff", label: "Diff", icon: GitCompare },
  { href: "/unidades", label: "Unidades", icon: Ruler },
  { href: "/tempo", label: "Tempo", icon: Clock },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        <Link href="/" className="flex items-center gap-2 mr-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <FileCode2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">EncodeHub</span>
        </Link>

        <nav className="flex items-center gap-1 flex-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <a
          href="https://github.com/Miguelito001/EncodeHub2.0"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <Github className="h-5 w-5" />
          <span className="sr-only">GitHub</span>
        </a>
      </div>
    </header>
  );
}
