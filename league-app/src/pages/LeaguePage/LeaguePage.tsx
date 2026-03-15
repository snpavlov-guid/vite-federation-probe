import { useState } from 'react';
import { Pane, SplitPane } from 'react-split-pane';
import 'react-split-pane/styles.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchTournamentMatches,
  fetchStandings,
  selectLeagueStandingsError,
  selectLeagueStandingsGroups,
  selectLeagueStandingsStatus,
} from '../../features/LeagueData';
import { LeagueStandingsTable } from '../../features/LeagueData/components/LeagueStandingsTable';
import { LeagueTournamentList } from '../../features/LeagueData/components/LeagueTournamentList';
import { AppTechLogo } from '../../widgets/AppTechLogo/AppTechLogo';
import { MatchPairList } from '../../widgets/MatchPairList';
import styles from './styles.module.css';

// Интерфейс для пропсов компонента
interface ILeaguePageProps {
  className?: string; // Дополнительные классы стилей
}

interface TournamentMatchesData {
  teams: Array<{
    id: number;
    name: string;
    logoUrl?: string | null;
  }>;
  matches: Array<{
    id: number;
    date: string;
    hScore: number;
    gScore: number;
    hTeamId: number;
    gTeamId: number;
  }>;
}

interface ExtraPlayGroupBlock {
  group: string | null;
  data: TournamentMatchesData;
}

export const LeaguePage: React.FC<ILeaguePageProps> = ({
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const standingsGroups = useAppSelector(selectLeagueStandingsGroups);
  const standingsStatus = useAppSelector(selectLeagueStandingsStatus);
  const standingsError = useAppSelector(selectLeagueStandingsError);
  const [selectedStageTitle, setSelectedStageTitle] = useState<string | null>(null);
  const [isExtraPlaySelected, setIsExtraPlaySelected] = useState(false);
  const [isExtraPlayLoading, setIsExtraPlayLoading] = useState(false);
  const [extraPlayGroups, setExtraPlayGroups] = useState<ExtraPlayGroupBlock[]>([]);
  const [selectedPayloadError, setSelectedPayloadError] = useState<string | null>(null);
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
                  stageType,
                  tournamentSeason,
                  stageName,
                  groups,
                  prevStageId,
                  prevPlays,
                }) => {
                  const runStageRequest = async (): Promise<void> => {
                    setSelectedPayloadError(null);
                    setIsExtraPlayLoading(false);

                    const normalizedStageType = String(stageType ?? '').trim().toUpperCase();
                    const isExtraPlay = normalizedStageType === 'EXTRAPLAY';
                    setIsExtraPlaySelected(isExtraPlay);
                    const normalizedGroups = (Array.isArray(groups) ? groups : [])
                      .filter((group): group is string => typeof group === 'string' && group.trim().length > 0)
                      .map((group) => group.trim());

                    try {
                      if (isExtraPlay) {
                        setExtraPlayGroups([]);
                        setIsExtraPlayLoading(true);

                        if (normalizedGroups.length > 0) {
                          const groupedResults = await Promise.all(
                            normalizedGroups.map(async (group) => ({
                              group,
                              data: await dispatch(
                                fetchTournamentMatches({
                                  leagueId,
                                  stageId,
                                  tournamentId,
                                  tgroup: group,
                                }),
                              ).unwrap(),
                            })),
                          );
                          setExtraPlayGroups(groupedResults);
                          return;
                        }

                        const singleResult = await dispatch(
                          fetchTournamentMatches({
                            leagueId,
                            stageId,
                            tournamentId,
                          }),
                        ).unwrap();
                        setExtraPlayGroups([{ group: null, data: singleResult }]);
                        return;
                      }

                      setExtraPlayGroups([]);
                      const standingsResult = await dispatch(
                        fetchStandings({
                          leagueId,
                          stageId,
                          tournamentId,
                          groups,
                          prevStageId,
                          prevPlays,
                        }),
                      ).unwrap();
                      if (!standingsResult) {
                        setSelectedPayloadError('No standings data received.');
                      }
                    } catch (error) {
                      const errorMessage =
                        error instanceof Error
                          ? error.message
                          : typeof error === 'string'
                            ? error
                            : 'Unknown error while loading stage data.';
                      setSelectedPayloadError(errorMessage);
                    } finally {
                      if (isExtraPlay) {
                        setIsExtraPlayLoading(false);
                      }
                    }
                  };

                  setSelectedStageTitle(`${tournamentSeason}. ${stageName}`);
                  void runStageRequest();
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
                  {isExtraPlaySelected ? (
                    <>
                      {selectedPayloadError && <p>Ошибка загрузки: {selectedPayloadError}</p>}
                      {!selectedPayloadError && isExtraPlayLoading && <p>Загрузка...</p>}
                      {!selectedPayloadError &&
                        !isExtraPlayLoading &&
                        extraPlayGroups.map((groupBlock, index) => (
                          <section
                            key={groupBlock.group ?? `extra-overall-${index}`}
                            className={styles.leaguePageStandingsGroupSection}
                          >
                            {groupBlock.group && (
                              <h3 className={styles.leaguePageStandingsGroupTitle}>Группа {groupBlock.group}</h3>
                            )}
                            <MatchPairList matches={groupBlock.data.matches} teams={groupBlock.data.teams} />
                          </section>
                        ))}
                    </>
                  ) : (
                    displayedStandingsGroups.map((groupBlock, index) => (
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
                    ))
                  )}
                </div>
              </>
            )}
          </section>
        </Pane>
      </SplitPane>
    </div>
  );
};
