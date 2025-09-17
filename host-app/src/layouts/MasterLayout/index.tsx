import styles from './styles.module.css'
import type { ReactNode } from 'react';
import { MainMenu } from '../MainMenu'

// Интерфейс для пропсов компонента
interface MasterLayoutProps {
    children : ReactNode,
    className? :string
}

export const MasterLayout: React.FC<MasterLayoutProps> = ({
  children,
  className = ''
 }) => {

    return (
        <div className={`${styles['app-wrapper']} ${className}`}>
            <div className={styles['app-layout']}>
                <header className={styles['app-header']}>
                    <MainMenu></MainMenu>
                </header>
                <section className={styles['app-content']}>
                    {children}
                </section>
            </div>
        </div>

    );
};


