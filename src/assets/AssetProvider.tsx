import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type AssetKind = 'image' | 'mask' | 'audio';
type AssetRequest = () => Promise<string | undefined>;
export type AssetLookup = (source: string | undefined, kind: AssetKind, file?: string) => AssetRequest | undefined;
const AssetContext = createContext<{ baseUrl?: string; lookup?: AssetLookup }>({});

/** baseUrl is the directory containing assets/doors, rather than the asset directory itself. */
export function AssetProvider({ baseUrl, lookup, children }: { baseUrl?: string; lookup?: AssetLookup; children: ReactNode }) {
  return <AssetContext.Provider value={{ baseUrl, lookup }}>{children}</AssetContext.Provider>;
}

export function resolveAssetUrl(source: string, baseUrl?: string) {
  if (!baseUrl || !source.startsWith('/assets/doors/')) return source;
  return new URL(source.slice(1), new URL(baseUrl, typeof document === 'undefined' ? undefined : document.baseURI)).href;
}

export function useAssetUrl() {
  const { baseUrl } = useContext(AssetContext);
  return useCallback((source: string) => resolveAssetUrl(source, baseUrl), [baseUrl]);
}

export function usePreferredAsset(source: string | undefined, kind: AssetKind, file?: string) {
  const resolve = useAssetUrl();
  const { lookup } = useContext(AssetContext);
  const request = useMemo(() => lookup?.(source, kind, file), [source, lookup, kind, file]);
  const [result, setResult] = useState<{ request: AssetRequest; url?: string }>();
  useEffect(() => {
    if (!request) return;
    let active = true;
    void request().then(url => {
      if (active) setResult({ request, url });
    }, () => {
      if (active) setResult({ request });
    });
    return () => { active = false; };
  }, [request]);
  const fallback = source ? resolve(source) : undefined;
  const resolved = result?.request === request ? result : undefined;
  const pending = Boolean(request && !resolved);
  const url = pending && kind !== 'audio' ? undefined : resolved?.url ?? fallback;
  return useMemo(() => ({ url, fallback }), [url, fallback]);
}
