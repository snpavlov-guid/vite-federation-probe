import reactLogo from '../../assets/react.svg';
import viteLogo from '/vite.svg';
import styles from './AppTechLogo.module.css';

export function AppTechLogo() {
  return (
    <div className={styles.appTechLogo}>
      <a
        href="https://vite.dev"
        target="_blank"
        rel="noreferrer"
        className={styles.logoLink}
        aria-label="Vite"
      >
        <img src={viteLogo} className={styles.logo} alt="Vite logo" />
      </a>
      <a
        href="https://react.dev"
        target="_blank"
        rel="noreferrer"
        className={styles.logoLink}
        aria-label="React"
      >
        <img src={reactLogo} className={`${styles.logo} ${styles.logoReact}`} alt="React logo" />
      </a>
      <span className={styles.title}>Vite + React</span>
    </div>
  );
}
