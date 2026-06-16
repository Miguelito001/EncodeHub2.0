import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CommandPalette } from "@/components/command-palette";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EncodeHub - Ferramentas para Desenvolvedores",
  description:
    "EncodeHub é uma ferramenta online completa para conversão, formatação e manipulação de dados. Converta Base64, Binário, JSON, XML, YAML, gere hashes e muito mais.",
  keywords: [
    "conversor",
    "base64",
    "binário",
    "json",
    "xml",
    "yaml",
    "hash",
    "desenvolvedor",
  ],
};

export const viewport: Viewport = {
  themeColor: "#009578",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="bg-background">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen`}
      >
        {children}
        <CommandPalette />
      </body>
    </html>
  );
}
