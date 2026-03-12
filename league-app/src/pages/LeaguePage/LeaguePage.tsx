import { useState } from 'react';
import { Pane, SplitPane } from 'react-split-pane';
import 'react-split-pane/styles.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchStandings,
  selectLeagueStandingsError,
  selectLeagueStandingsItems,
  selectLeagueStandingsStatus,
} from '../../features/LeagueData';
import { LeagueStandingsTable } from '../../features/LeagueData/components/LeagueStandingsTable';
import { LeagueTournamentList } from '../../features/LeagueData/components/LeagueTournamentList';
import { AppTechLogo } from '../../widgets/AppTechLogo/AppTechLogo';
import styles from './styles.module.css';

// Интерфейс для пропсов компонента
interface ILeaguePageProps {
  className?: string; // Дополнительные классы стилей
}

export const LeaguePage: React.FC<ILeaguePageProps> = ({
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const standingsItems = useAppSelector(selectLeagueStandingsItems);
  const standingsStatus = useAppSelector(selectLeagueStandingsStatus);
  const standingsError = useAppSelector(selectLeagueStandingsError);
  const [selectedStageTitle, setSelectedStageTitle] = useState<string | null>(null);

  return (
    <div className={`${styles.leaguePage} ${className}`.trim()}>
      <SplitPane direction="horizontal" className={styles.leaguePageSplit}>
        <Pane minSize="200px" defaultSize="25%" maxSize="85%" className={styles.leaguePagePane}>
          <section className={`${styles.leaguePagePanel} ${styles.leaguePagePanelLeft}`}>
            <AppTechLogo />
            <h2 className={styles.leaguePagePanelTitle}>РПЛ - турниры</h2>
            <div className={styles.leaguePageLeftPanelContent}>
              <LeagueTournamentList
                onStageSelect={({ leagueId, tournamentId, stageId, tournamentSeason, stageName }) => {
                  setSelectedStageTitle(`${tournamentSeason}. ${stageName}`);
                  void dispatch(fetchStandings({ leagueId, stageId, tournamentId }));
                }}
              />
            </div>
          </section>
        </Pane>
        <Pane className={styles.leaguePagePane}>
          <section className={`${styles.leaguePagePanel} ${styles.leaguePagePanelRight}`}>
            {selectedStageTitle && (
              <>
                <h2 className={`${styles.leaguePagePanelTitle} ${styles.leaguePagePanelTitleAligned}`}>
                  {selectedStageTitle}
                </h2>
                <div className={styles.leaguePageRightPanelContent}>
                  <LeagueStandingsTable
                    rows={standingsItems}
                    status={standingsStatus}
                    error={standingsError}
                  />
                </div>
              </>
            )}
          </section>
        </Pane>
      </SplitPane>
    </div>
  );
};
