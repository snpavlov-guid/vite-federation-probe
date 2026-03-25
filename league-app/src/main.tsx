import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { getAllEnv } from './app/env'

console.log('Vite env (merged with window.app.env):', JSON.stringify(getAllEnv(), null, 2))

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
