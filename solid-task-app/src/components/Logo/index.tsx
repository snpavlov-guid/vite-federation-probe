import solidLogo from '../../assets/solid.svg'
import viteLogo from '/vite.svg'
import styles from './Logo.module.css'
import { logoImgInlineStyle } from './logoImgStyle'

function Logo() {
  return (
    <>
      <div style={{ display: 'flex', 'flex-wrap': 'wrap', 'align-items': 'center', 'justify-content': 'center', gap: '0.5rem' }}>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} class="srf-logo-vite" style={logoImgInlineStyle} alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank" rel="noreferrer">
          <img src={solidLogo} class="srf-logo-solid" style={logoImgInlineStyle} alt="Solid logo" />
        </a>
      </div>
      <h2 class={styles.title}>Vite + Solid</h2>
    </>
  )
}

export default Logo
