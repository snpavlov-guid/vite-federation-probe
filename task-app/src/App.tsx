import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import TaskListEditor from './components/TaskEditor'
import { store } from './app/store';
import { Provider } from 'react-redux';

function App() {

  return (

      <div id="app-root">

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

        <div id="app-task">
          <Provider store={store}>
            <div className="card">
              <TaskListEditor/>
            </div>
          </Provider>
        </div>

      </div>

  )
}

export default App
