import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { store } from './app/store'
import { initAuth } from './features/Auth'

const root = createRoot(document.getElementById('root')!)

const renderApp = (): void => {
  root.render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  )
}

const renderAuthError = (): void => {
  root.render(
    <div style={{ padding: '1rem' }}>
      Failed to initialize authentication. Please reload the page.
    </div>,
  )
}

const bootstrap = async (): Promise<void> => {
  try {
    await initAuth()
    renderApp()
  } catch (error) {
    console.error('Auth bootstrap failed:', error)
    renderAuthError()
  }
}

void bootstrap()
