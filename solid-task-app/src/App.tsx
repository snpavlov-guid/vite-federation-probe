import Logo from './components/Logo'
import TaskEditor from './components/TaskEditor'
import styles from './app.module.css'

function App() {

  return (
    <div class={styles['app-root']}>
      <Logo />
      <TaskEditor />
    </div>
  )
}

export default App
