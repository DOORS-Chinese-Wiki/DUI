import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AssetProvider } from './components';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AssetProvider baseUrl={import.meta.env.BASE_URL}><App /></AssetProvider>
  </StrictMode>,
);
