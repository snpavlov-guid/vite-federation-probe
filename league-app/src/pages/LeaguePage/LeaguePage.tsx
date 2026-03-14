import { useState } from 'react';
import { Pane, SplitPane } from 'react-split-pane';
import 'react-split-pane/styles.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchStandings,
  selectLeagueStandingsError,
  selectLeagueStandingsGroups,
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
  const standingsGroups = useAppSelector(selectLeagueStandingsGroups);
  const standingsStatus = useAppSelector(selectLeagueStandingsStatus);
  const standingsError = useAppSelector(selectLeagueStandingsError);
  const [selectedStageTitle, setSelectedStageTitle] = useState<string | null>(null);
  const displayedStandingsGroups =
    standingsGroups.length > 0 ? standingsGroups : [{ group: null, items: [] }];

  return (
    <div className={`${styles.leaguePage} ${className}`.trim()}>
      <SplitPane direction="horizontal" className={styles.leaguePageSplit}>
        <Pane minSize="200px" defaultSize="25%" maxSize="85%" className={styles.leaguePagePane}>
          <section className={`${styles.leaguePagePanel} ${styles.leaguePagePanelLeft}`}>
            <AppTechLogo />
            <h2 className={styles.leaguePagePanelTitle}>РПЛ - турниры</h2>
            <div className={styles.leaguePageLeftPanelContent}>
              <LeagueTournamentList
                onStageSelect={({
                  leagueId,
                  tournamentId,
                  stageId,
                  tournamentSeason,
                  stageName,
                  groups,
                  prevStageId,
                  prevPlays,
                }) => {
                  setSelectedStageTitle(`${tournamentSeason}. ${stageName}`);
                  void dispatch(
                    fetchStandings({
                      leagueId,
                      stageId,
                      tournamentId,
                      groups,
                      prevStageId,
                      prevPlays,
                    }),
                  );
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
                  {displayedStandingsGroups.map((groupBlock, index) => (
                    <section
                      key={groupBlock.group ?? `overall-${index}`}
                      className={styles.leaguePageStandingsGroupSection}
                    >
                      {groupBlock.group && (
                        <h3 className={styles.leaguePageStandingsGroupTitle}>Группа {groupBlock.group}</h3>
                      )}
                      <LeagueStandingsTable
                        rows={groupBlock.items}
                        status={standingsStatus}
                        error={standingsError}
                      />
                    </section>
                  ))}
                </div>
              </>
            )}
          </section>
        </Pane>
      </SplitPane>
    </div>
  );
};
