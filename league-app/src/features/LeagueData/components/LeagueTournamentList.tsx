import { useCallback, useEffect, useRef, useState } from 'react';
import type { ColDef, GridApi, ICellRendererParams, RowHeightParams } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  fetchRplTournamentsPage,
  selectLeagueDataError,
  selectLeagueDataStatus,
} from '../index';
import type { LeagueTournament } from '../index';
import styles from './LeagueTournamentList.module.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const PAGE_SIZE = 50;
const BASE_ROW_HEIGHT = 32;
const getExpandedRowHeight = (stagesCount: number): number => Math.max(56, 30 + stagesCount * 22);

export const LeagueTournamentList: React.FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectLeagueDataStatus);
  const error = useAppSelector(selectLeagueDataError);
  const gridApiRef = useRef<GridApi<LeagueTournament> | null>(null);
  const [expandedTournamentIds, setExpandedTournamentIds] = useState<Set<number>>(new Set());
  const [rows, setRows] = useState<LeagueTournament[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const toggleTournamentExpand = useCallback((tournamentId: number) => {
    setExpandedTournamentIds((prev) => {
      const next = new Set(prev);
      if (next.has(tournamentId)) {
        next.delete(tournamentId);
      } else {
        next.add(tournamentId);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const api = gridApiRef.current;
    if (!api) {
      return;
    }
    api.refreshCells({ force: true });
    api.redrawRows();
    api.resetRowHeights();
    api.onRowHeightChanged();
  }, [expandedTournamentIds]);

  useEffect(() => {
    const skip = (page - 1) * PAGE_SIZE;
    void (async () => {
      try {
        const response = await dispatch(fetchRplTournamentsPage({ skip, size: PAGE_SIZE })).unwrap();
        setRows(response.items);
        setTotal(response.total);
        setExpandedTournamentIds(new Set());
      } catch {
        setRows([]);
        setTotal(0);
      }
    })();
  }, [dispatch, page]);

  const columnDefs: ColDef<LeagueTournament>[] = [
    {
      colId: 'seasonColumn',
      headerName: 'Сезон',
      flex: 1,
      minWidth: 140,
      sortable: false,
      filter: false,
      cellClass: styles.seasonCellHost,
      cellRenderer: (params: ICellRendererParams<LeagueTournament>) => {
        const row = params.data;
        if (!row) {
          return null;
        }
        const isExpanded = expandedTournamentIds.has(row.id);

        return (
          <div className={styles.seasonCellLayout}>
            <button
              type="button"
              className={styles.chevronButton}
              aria-label={isExpanded ? 'Свернуть стадии турнира' : 'Раскрыть стадии турнира'}
              onClick={(event) => {
                event.stopPropagation();
                toggleTournamentExpand(row.id);
              }}
            >
              <span
                className={`${styles.chevronIcon} ${isExpanded ? styles.chevronIconExpanded : ''}`.trim()}
              >
                ›
              </span>
            </button>
            <div className={styles.seasonContent}>
              <button
                type="button"
                className={styles.seasonLabelButton}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleTournamentExpand(row.id);
                }}
              >
                {row.seasonLabel}
              </button>
              {isExpanded && (
                <div className={styles.stageList}>
                  {row.stages.map((stage) => (
                    <a
                      key={stage.id}
                      href="#"
                      className={styles.stageListItem}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        alert(
                          [
                            `leagueId: ${row.leagueId}`,
                            `tournamentId: ${row.id}`,
                            `stageId: ${stage.id}`,
                            `stageType: ${String(stage.stageType ?? 'null')}`,
                          ].join('\n'),
                        );
                      }}
                    >
                      • {stage.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
  ];

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isPrevDisabled = page <= 1 || status === 'loading';
  const isNextDisabled = page >= totalPages || status === 'loading';

  const getRowHeight = (params: RowHeightParams<LeagueTournament>): number => {
    const row = params.data;
    if (!row) {
      return BASE_ROW_HEIGHT;
    }
    return expandedTournamentIds.has(row.id)
      ? getExpandedRowHeight(row.stages.length)
      : BASE_ROW_HEIGHT;
  };

  return (
    <div className={styles.listRoot}>
      {status === 'failed' && <p className={styles.errorText}>Ошибка загрузки: {error ?? 'unknown'}</p>}
      <div className={`ag-theme-alpine ${styles.gridShell}`}>
        <AgGridReact<LeagueTournament>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={(params) => String(params.data.id)}
          getRowHeight={getRowHeight}
          suppressCellFocus
          onGridReady={(params) => {
            gridApiRef.current = params.api;
          }}
        />
      </div>
      <div className={styles.paginationBar}>
        <button
          type="button"
          className={styles.paginationButton}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={isPrevDisabled}
        >
          Назад
        </button>
        <span className={styles.paginationInfo}>
          Страница {page} из {totalPages}
        </span>
        <button
          type="button"
          className={styles.paginationButton}
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={isNextDisabled}
        >
          Вперед
        </button>
      </div>
    </div>
  );
};
