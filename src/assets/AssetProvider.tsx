import { createContext, useCallback, useContext, type ReactNode } from 'react';

const AssetBaseContext = createContext<string | undefined>(undefined);

/** baseUrl is the directory containing assets/doors, rather than the asset directory itself. */
export function AssetProvider({ baseUrl, children }: { baseUrl?: string; children: ReactNode }) {
  return <AssetBaseContext.Provider value={baseUrl}>{children}</AssetBaseContext.Provider>;
}

export function resolveAssetUrl(source: string, baseUrl?: string) {
  if (!baseUrl || !source.startsWith('/assets/doors/')) return source;
  return new URL(source.slice(1), new URL(baseUrl, typeof document === 'undefined' ? undefined : document.baseURI)).href;
}

export function useAssetUrl() {
  const baseUrl = useContext(AssetBaseContext);
  return useCallback((source: string) => resolveAssetUrl(source, baseUrl), [baseUrl]);
}
