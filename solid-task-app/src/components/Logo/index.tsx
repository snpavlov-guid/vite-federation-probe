import solidLogo from '../../assets/solid.svg'
import viteLogo from '/vite.svg'

function Logo() {

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h2>Vite + Solid</h2>
    </>
  )
}

export default Logo


