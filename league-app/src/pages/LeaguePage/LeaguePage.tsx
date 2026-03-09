import { useEffect } from 'react';
import { Pane, SplitPane } from 'react-split-pane';
import 'react-split-pane/styles.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchRplTournaments,
  selectLeagueDataError,
  selectLeagueDataStatus,
  selectRplTournaments,
} from '../../features/LeagueData';
import styles from './styles.module.css';

// Интерфейс для пропсов компонента
interface ILeaguePageProps {
  className?: string; // Дополнительные классы стилей
}

export const LeaguePage: React.FC<ILeaguePageProps> = ({
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectLeagueDataStatus);
  const error = useAppSelector(selectLeagueDataError);
  const tournamentsData = useAppSelector(selectRplTournaments);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchRplTournaments());
    }
  }, [dispatch, status]);

  return (
    <div className={`${styles.leaguePage} ${className}`.trim()}>
      <SplitPane direction="horizontal" className={styles.leaguePageSplit}>
        <Pane minSize="200px" defaultSize="25%" maxSize="85%" className={styles.leaguePagePane}>
          <section className={`${styles.leaguePagePanel} ${styles.leaguePagePanelLeft}`}>
            Левая панель
            {status === 'loading' && <p>Загрузка данных турнира...</p>}
            {status === 'failed' && <p>Ошибка загрузки: {error ?? 'unknown'}</p>}
            {status === 'succeeded' && (
              <pre>{JSON.stringify(tournamentsData, null, 2)}</pre>
            )}
          </section>
        </Pane>
        <Pane className={styles.leaguePagePane}>
          <section className={`${styles.leaguePagePanel} ${styles.leaguePagePanelRight}`}>
            <div>Правая панель</div>
          </section>
        </Pane>
      </SplitPane>
    </div>
  );
};
