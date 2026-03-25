import { useEffect, useState } from 'react'
import './App.css'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { LeaguePage } from './pages/LeaguePage'
import { initAuth } from './features/Auth'

function App() {
  const [authReady, setAuthReady] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void initAuth()
      .then(() => {
        if (!cancelled) setAuthReady(true)
      })
      .catch((error: unknown) => {
        console.error('Auth bootstrap failed:', error)
        if (!cancelled) {
          setAuthError(
            error instanceof Error ? error.message : 'Failed to initialize authentication.',
          )
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (authError) {
    return (
      <div className="league-mfe-root" style={{ padding: '1rem' }}>
        Ошибка авторизации: {authError}
      </div>
    )
  }

  if (!authReady) {
    return (
      <div className="league-mfe-root" style={{ padding: '1rem' }}>
        Вход…
      </div>
    )
  }

  return (
    <div className="league-mfe-root">
      <Provider store={store}>
        <LeaguePage />
      </Provider>
    </div>
  )
}

export default App
