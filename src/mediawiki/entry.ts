import './fonts.css';
import '../styles/tokens.css';
import './mediawiki.css';
import { configure, startAutoMount } from './runtime';
export * from './api';

const script = document.currentScript as HTMLScriptElement | null;
const baseUrl = script?.src ? new URL('.', script.src).href : undefined;
configure({ baseUrl, ...window.DUIConfig });
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startAutoMount, { once: true });
else startAutoMount();
