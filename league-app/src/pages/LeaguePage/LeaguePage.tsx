import { Pane, SplitPane } from 'react-split-pane';
import 'react-split-pane/styles.css';
import { LeagueTournamentList } from '../../features/LeagueData/components/LeagueTournamentList';
import styles from './styles.module.css';

// Интерфейс для пропсов компонента
interface ILeaguePageProps {
  className?: string; // Дополнительные классы стилей
}

export const LeaguePage: React.FC<ILeaguePageProps> = ({
  className = '',
}) => {
  return (
    <div className={`${styles.leaguePage} ${className}`.trim()}>
      <SplitPane direction="horizontal" className={styles.leaguePageSplit}>
        <Pane minSize="200px" defaultSize="25%" maxSize="85%" className={styles.leaguePagePane}>
          <section className={`${styles.leaguePagePanel} ${styles.leaguePagePanelLeft}`}>
            <h2 className={styles.leaguePagePanelTitle}>РПЛ - турниры</h2>
            <div className={styles.leaguePageLeftPanelContent}>
              <LeagueTournamentList />
            </div>
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
