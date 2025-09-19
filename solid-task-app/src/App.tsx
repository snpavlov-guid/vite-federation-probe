import Logo from './components/Logo'
import Counter from './components/Counter'
import styles from './app.module.css';
import './App.css'

function App() {

  return (
    <div class={styles['app-root']}>
      <Logo />
      <Counter />
    </div>
  )
}

export default App
