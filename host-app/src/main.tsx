import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import './index.css'
import App from './App.tsx'
import { getAllEnvForLog } from './app/env'

console.log(
  'host-app env (runtime + Vite, masked for log):',
  JSON.stringify(getAllEnvForLog(), null, 2),
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
