import { createSignal } from 'solid-js'

function Counter() {
  const [count, setCount] = createSignal(0)

  return (
    <div>
       <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count()}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
     </div>
  )
}

export default Counter
