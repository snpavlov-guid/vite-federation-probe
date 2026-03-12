import { useMemo } from 'react';
import type { ColDef, RowClickedEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import type { StandingItem } from '../index';
import styles from './LeagueStandingsTable.module.css';

ModuleRegistry.registerModules([AllCommunityModule]);

interface LeagueStandingsTableProps {
  rows: StandingItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const LeagueStandingsTable: React.FC<LeagueStandingsTableProps> = ({
  rows,
  status,
  error,
}) => {
  const columnDefs = useMemo<ColDef<StandingItem>[]>(
    () => [
      { field: 'place', headerName: '#', width: 68, sortable: true },
      {
        field: 'teamName',
        headerName: 'Команда',
        minWidth: 210,
        flex: 1,
        sortable: true,
        cellRenderer: (params: { data: StandingItem | undefined }) => {
          const row = params.data;
          if (!row) {
            return '';
          }

          return (
            <div className={styles.teamCell}>
              {row.teamLogo?.trim() ? (
                <img
                  src={row.teamLogo}
                  alt="Team logo"
                  className={styles.teamLogo}
                />
              ) : (
                <span className={styles.teamLogoPlaceholder}>—</span>
              )}
              <span>{row.teamName}</span>
            </div>
          );
        },
      },
      { field: 'matches', headerName: 'И', width: 72, sortable: true },
      { field: 'wins', headerName: 'В', width: 72, sortable: true },
      { field: 'draw', headerName: 'Н', width: 72, sortable: true },
      { field: 'lost', headerName: 'П', width: 72, sortable: true },
      { field: 'points', headerName: 'О', width: 76, sortable: true },
      {
        colId: 'scoredMissed',
        headerName: 'М',
        width: 94,
        sortable: true,
        valueGetter: (params) => `${params.data?.scored ?? 0}-${params.data?.missed ?? 0}`,
      },
      { field: 'diff', headerName: '+/-', width: 82, sortable: true },
    ],
    [],
  );

  const handleRowClick = (event: RowClickedEvent<StandingItem>) => {
    if (event.node.isSelected()) {
      event.node.setSelected(false);
      return;
    }

    event.api.deselectAll();
    event.node.setSelected(true);
  };

  return (
    <div className={styles.root}>
      {status === 'failed' && <p className={styles.errorText}>Ошибка загрузки таблицы: {error ?? 'unknown'}</p>}
      <div className={`ag-theme-alpine ${styles.gridShell}`}>
        <AgGridReact<StandingItem>
          rowData={rows}
          columnDefs={columnDefs}
          rowModelType="clientSide"
          rowSelection="single"
          animateRows
          suppressCellFocus
          suppressRowClickSelection
          suppressMovableColumns
          onRowClicked={handleRowClick}
          overlayNoRowsTemplate={status === 'loading' ? 'Загрузка...' : 'Нет данных'}
        />
      </div>
    </div>
  );
};
