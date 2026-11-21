import type { AssetKind, AssetLookup } from '../assets/AssetProvider';
import type { WikiAssetMap, WikiOptions } from './types';

const doorsSites = ['doorsgame.wiki', 'zh.doorsgame.wiki'];
const bundledPrefix = '/assets/doors/';
const defaults: WikiAssetMap = {
  'icons/backpack.png': 'Backpack icon.svg',
  'icons/journal.svg': 'Journal icon.svg',
  'icons/inventory-slot.svg': 'Inventory Slot icon.svg',
  'icons/close.png': 'UI Close Button.png',
  'icons/items.svg': 'Items icon.svg',
  'icons/achievements.svg': 'Achievements icon.svg',
  'icons/settings.svg': 'Settings icon.svg',
  'icons/gallery.svg': 'Gallery icon.svg',
  'icons/player.svg': 'Player icon.svg',
  'icons/search.svg': 'Magnifier icon.svg',
  'items/revive.png': 'Revive icon.png',
  'items/knobs.png': 'Knobs icon.png',
  'items/candy.png': 'Candy icon.png',
  'items/flashlight.png': 'Flashlight icon v2.png',
  'items/lighter.png': 'Icon lighter2.png',
  'items/vitamins.png': 'Vitamins icon.png',
  'items/lockpick.png': 'Lockpick icon v2.png',
  'items/skeleton-key.png': 'Skeleton Key icon v1.png',
  'items/candle.png': 'Candle icon.png',
  'items/compass.png': 'Compass icon.png',
  'items/crucifix.png': 'Crucifix icon.png',
  'items/gold.png': 'Gold icon.png',
  'achievements/welcome.png': 'Welcome Badge.png',
  'achievements/out-of-my-way.png': 'Out Of My Way Badge.png',
  'achievements/rock-bottom.png': 'Rock Bottom Badge.png',
  'audio/hover.mp3': 'SoundHover.mp3',
  'audio/leave.mp3': 'SoundLeave.mp3',
  'audio/click.mp3': 'Click 1.5.mp3',
};

export function wikiFile(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') throw new Error('素材需要 Wiki 文件名');
  const name = value.trim().replace(/^(?:File|Image|文件|檔案|档案|圖像|图像):\s*/i, '').replace(/[_ ]+/g, ' ').trim();
  if (!name || name.length > 240 || /[:/\\|<>\[\]{}#?\p{Cc}]/u.test(name)) {
    throw new Error('素材需要 Wiki 文件名，例如 File:Settings icon.svg');
  }
  return name;
}

export function wikiAssetMap(value: unknown): WikiAssetMap | undefined {
  if (value === undefined) return undefined;
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('素材配置需要 JSON 对象');
  const entries = Object.entries(value);
  if (entries.length > 50) throw new Error('素材配置最多接受 50 项');
  return Object.freeze(Object.fromEntries(entries.map(([key, value]) => {
    if (!/^(?:icons|items|achievements)\/[a-z0-9-]+\.(?:png|svg)$|^audio\/(?:hover|leave|click)\.mp3$/.test(key)) {
      throw new Error('无效的素材键：' + key);
    }
    return [key, wikiFile(value)!];
  })));
}

type FileInfo = { url: string; mime: string };
type TitleMapping = { from: string; to: string };
type FileResponse = {
  query?: {
    normalized?: TitleMapping[];
    redirects?: TitleMapping[];
    pages?: { title: string; ns: number; imageinfo?: FileInfo[] }[];
  };
};

function verifiedUrl(value: string, endpoint: URL) {
  try {
    const url = new URL(value, endpoint);
    if (url.username || url.password) return undefined;
    if (url.protocol === 'https:' || (url.protocol === 'http:' && endpoint.protocol === 'http:')) return url.href;
  } catch { /* An unusable file URL falls through to the next source. */ }
}

async function queryFiles(endpoint: URL, titles: string[]) {
  const url = new URL(endpoint);
  url.search = new URLSearchParams({ action: 'query', prop: 'imageinfo', iiprop: 'url|mime',
    format: 'json', formatversion: '2', redirects: '1', titles: titles.join('|') }).toString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const response = await fetch(url, { signal: controller.signal, redirect: 'error' });
    if (!response.ok) throw new Error('Wiki file lookup failed');
    const { query }: FileResponse = await response.json();
    if (!query?.pages) throw new Error('Invalid Wiki file response');
    const aliases = new Map([...(query.normalized ?? []), ...(query.redirects ?? [])].map(({ from, to }) => [from, to]));
    const files = new Map(query.pages.filter(page => page.ns === 6).map(page => [page.title, page.imageinfo?.[0]]));
    return titles.map(title => {
      const seen = new Set<string>();
      while (aliases.has(title) && !seen.has(title)) {
        seen.add(title);
        title = aliases.get(title)!;
      }
      const info = files.get(title);
      const fileUrl = info?.url && verifiedUrl(info.url, endpoint);
      return fileUrl && info ? { url: fileUrl, mime: info.mime } : undefined;
    });
  } finally {
    clearTimeout(timeout);
  }
}

function verifyImage(url: string, mask: boolean): Promise<boolean> {
  return new Promise(resolve => {
    const image = new Image();
    const settle = (loaded: boolean) => {
      clearTimeout(timeout);
      image.onload = image.onerror = null;
      resolve(loaded);
    };
    const timeout = setTimeout(() => settle(false), 4000);
    if (mask) image.crossOrigin = 'anonymous'; // Match the CSS mask request's CORS mode.
    image.onload = () => settle(image.naturalWidth > 0);
    image.onerror = () => settle(false);
    image.src = url;
  });
}

function createFileLookup(endpoint: URL) {
  const files = new Map<string, Promise<FileInfo | undefined>>();
  const images = new Map<string, Promise<boolean>>();
  const pending = new Map<string, (file?: FileInfo) => void>();

  function fileInfo(name: string) {
    const title = 'File:' + name;
    let result = files.get(title);
    if (!result) {
      result = new Promise(resolve => {
        if (!pending.size) queueMicrotask(flush);
        pending.set(title, resolve);
      });
      files.set(title, result);
    }
    return result;
  }

  function flush() {
    const queued = [...pending];
    pending.clear();
    for (let i = 0; i < queued.length; i += 30) {
      const batch = queued.slice(i, i + 30);
      void queryFiles(endpoint, batch.map(([title]) => title)).then(results => {
        batch.forEach(([, resolve], index) => resolve(results[index]));
      }, () => {
        batch.forEach(([title, resolve]) => {
          files.delete(title);
          resolve();
        });
      });
    }
  }

  return async (names: string[], kind: AssetKind) => {
    const candidates = await Promise.all(names.map(fileInfo));
    for (const file of candidates) {
      if (kind === 'audio') {
        if (file?.mime?.startsWith('audio/')) return file.url;
      } else if (file?.mime?.startsWith('image/')) {
        const key = kind + ':' + file.url;
        let loaded = images.get(key);
        if (!loaded) {
          loaded = verifyImage(file.url, kind === 'mask');
          images.set(key, loaded);
        }
        if (await loaded) return file.url;
      }
    }
  };
}

let current: { endpoint: string; lookup: ReturnType<typeof createFileLookup> } | undefined;

export function createWikiAssetLookup(options: WikiOptions, overrides?: WikiAssetMap): AssetLookup {
  const isDoors = doorsSites.includes(location.hostname);
  const preferWiki = options.preferWikiAssets ?? isDoors;
  return (source, kind, file) => {
    const key = source?.startsWith(bundledPrefix) ? source.slice(bundledPrefix.length) : '';
    const names = [...new Set([file, overrides?.[key], options.wikiAssets?.[key], preferWiki ? defaults[key] : undefined]
      .filter((name): name is string => Boolean(name)))];
    if (!names.length) return undefined;

    const scriptPath = window.mw?.config?.get('wgScriptPath') ?? (isDoors ? '/w' : undefined);
    if (typeof scriptPath !== 'string') return undefined;
    const endpoint = new URL(scriptPath.replace(/\/$/, '') + '/api.php', location.href);
    if (endpoint.origin === 'null' || endpoint.origin !== location.origin) return undefined;
    return () => {
      if (current?.endpoint !== endpoint.href) current = { endpoint: endpoint.href, lookup: createFileLookup(endpoint) };
      return current.lookup(names, kind);
    };
  };
}
