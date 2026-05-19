"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Image as ImageIcon, Upload, X } from "lucide-react";

export default function ImageBase64Page() {
  const [imageUrl, setImageUrl] = useState("");
  const [base64Output, setBase64Output] = useState("");
  const [base64Input, setBase64Input] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [mimeType, setMimeType] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setFileName(file.name);
    setFileSize(file.size);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64Output(result);
      setImageUrl(result);
    };
    reader.onerror = () => {
      setError("Erro ao ler o arquivo");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Por favor, envie apenas arquivos de imagem");
      return;
    }

    const input = document.getElementById("fileInput") as HTMLInputElement;
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;

    const event = { target: { files: dt.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleFileUpload(event);
  };

  const base64ToImage = () => {
    setError("");
    setPreviewImage("");

    let base64 = base64Input.trim();
    
    // Add data URL prefix if not present
    if (!base64.startsWith("data:")) {
      // Try to detect image type from base64
      if (base64.startsWith("/9j/")) {
        base64 = `data:image/jpeg;base64,${base64}`;
      } else if (base64.startsWith("iVBORw")) {
        base64 = `data:image/png;base64,${base64}`;
      } else if (base64.startsWith("R0lGOD")) {
        base64 = `data:image/gif;base64,${base64}`;
      } else if (base64.startsWith("UklGR")) {
        base64 = `data:image/webp;base64,${base64}`;
      } else {
        base64 = `data:image/png;base64,${base64}`;
      }
    }

    // Validate base64
    try {
      const img = new window.Image();
      img.onload = () => setPreviewImage(base64);
      img.onerror = () => setError("Base64 inválido ou não é uma imagem");
      img.src = base64;
    } catch {
      setError("Erro ao decodificar Base64");
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(base64Output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = () => {
    if (!previewImage) return;
    const a = document.createElement("a");
    a.href = previewImage;
    a.download = "image";
    a.click();
  };

  const clearUpload = () => {
    setImageUrl("");
    setBase64Output("");
    setFileName("");
    setFileSize(0);
    setMimeType("");
    const input = document.getElementById("fileInput") as HTMLInputElement;
    if (input) input.value = "";
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-screen-xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Imagem / Base64</h1>
          <p className="text-muted-foreground">
            Converta imagens para Base64 e vice-versa
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Image to Base64 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-blue-400" />
                Imagem para Base64
              </CardTitle>
              <CardDescription>Faça upload de uma imagem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Area */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Arraste uma imagem ou clique para selecionar
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG, GIF, WebP, SVG
                </p>
              </div>

              {/* Preview */}
              {imageUrl && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Preview</span>
                    <Button variant="ghost" size="icon" onClick={clearUpload}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative bg-secondary rounded-lg p-4 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="max-w-full max-h-[200px] object-contain rounded"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Arquivo: {fileName}</p>
                    <p>Tamanho: {formatBytes(fileSize)}</p>
                    <p>Tipo: {mimeType}</p>
                  </div>
                </div>
              )}

              {/* Base64 Output */}
              {base64Output && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Base64</span>
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    readOnly
                    value={base64Output}
                    className="min-h-[150px] font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tamanho do Base64: {formatBytes(base64Output.length)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Base64 to Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-green-400" />
                Base64 para Imagem
              </CardTitle>
              <CardDescription>Cole uma string Base64</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Cole o Base64 da imagem aqui (com ou sem prefixo data:image/...)"
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                className="min-h-[150px] font-mono text-xs"
              />

              <Button onClick={base64ToImage} className="w-full">
                Converter para Imagem
              </Button>

              {/* Preview */}
              {previewImage && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Resultado</span>
                    <Button variant="outline" size="sm" onClick={downloadImage}>
                      Download
                    </Button>
                  </div>
                  <div className="bg-secondary rounded-lg p-4 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewImage}
                      alt="Converted"
                      className="max-w-full max-h-[300px] object-contain rounded"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
