//import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { LeaguePage } from './pages/LeaguePage'

function App() {
  //const [count, setCount] = useState(0)

  return (
    <div id="app-root">
      {/* 
        Лишние блоки шаблонного лейаута отключены, оставлен только рендер LeaguePage.
        <div id="app-info">
          <div>
            <a href="https://vite.dev" target="_blank">
               <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h2>Vite + React</h2>
        </div>
        <div id="app-league">
          <div className="card">
            <LeaguePage/>
          </div>
        </div>
      */}
      <LeaguePage />
    </div>
  )
}

export default App
