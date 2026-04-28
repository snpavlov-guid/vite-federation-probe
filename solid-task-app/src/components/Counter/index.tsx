import { createSignal } from 'solid-js'
import styles from './Counter.module.css'

function Counter() {
  const [count, setCount] = createSignal(0)

  return (
    <div>
      <div class={styles.card}>
        <button type="button" onClick={() => setCount((count) => count + 1)}>
          count is {count()}
        </button>
        <p class={styles.text}>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  )
}

export default Counter
