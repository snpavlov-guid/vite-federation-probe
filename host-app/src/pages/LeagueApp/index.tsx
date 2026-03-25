import styles from './styles.module.css'
import React from 'react';
import { ComponentLoader } from '../../features/ComponentLoader';
import { useNavigate } from 'react-router-dom';
import { lazy } from 'react';
const LeagueApp = lazy(() => import('league_app/LeagueApp'));

interface ILeagueAppPageProps {
    className?: string;
}

export const LeagueAppPage: React.FC<ILeagueAppPageProps> = ({
    className = ''
}) => {
    const navigate = useNavigate();

    const resetMethod = function(details: unknown) {
      console.info('Перезагрузка компонента LeagueApp:', details);
      navigate(0);
    }

    return (
    <div className={`${styles['league-app']} ${className}`}>
        <div className={styles['league-app-fill']}>
          <ComponentLoader resetMethod={resetMethod} className={styles['component-loader-fill']}>
            <LeagueApp />
          </ComponentLoader>
        </div>
    </div>
  );
};
