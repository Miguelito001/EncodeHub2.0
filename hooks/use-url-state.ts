"use client";

import { useState, useCallback, useEffect } from "react";

/**
 * Hook que sincroniza um valor de string com um parâmetro de query da URL.
 * Permite deep linking: o estado da ferramenta fica salvo na URL e pode ser compartilhado.
 *
 * - Lê o valor inicial da URL (se existir), senão usa defaultValue.
 * - Atualiza a URL via replaceState (sem adicionar entradas no histórico nem recarregar).
 * - Responde ao botão voltar/avançar do navegador (popstate).
 */
export function useUrlState(
  key: string,
  defaultValue: string
): [string, (value: string) => void] {
  const [value, setValue] = useState<string>(() => {
    if (typeof window === "undefined") return defaultValue;
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get(key);
    return fromUrl !== null ? safeDecode(fromUrl) : defaultValue;
  });

  // Garante hidratação correta: relê da URL no mount do cliente.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get(key);
    if (fromUrl !== null) {
      setValue(safeDecode(fromUrl));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincroniza com botão voltar/avançar.
  useEffect(() => {
    function onPop() {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get(key);
      setValue(fromUrl !== null ? safeDecode(fromUrl) : defaultValue);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [key, defaultValue]);

  const update = useCallback(
    (next: string) => {
      setValue(next);
      const params = new URLSearchParams(window.location.search);
      if (next === "" || next === defaultValue) {
        params.delete(key);
      } else {
        params.set(key, next);
      }
      const query = params.toString();
      const newUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
      window.history.replaceState(null, "", newUrl);
    },
    [key, defaultValue]
  );

  return [value, update];
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
