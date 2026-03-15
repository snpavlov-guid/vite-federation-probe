import { MatchPairItem } from '../MatchPairItem';
import { MatchViewItem } from '../MatchViewItem';
import styles from './MatchPairList.module.css';

type RawRecord = Record<string, unknown>;

interface MatchPairListMatch {
  id: number;
  date: string;
  hScore: number;
  gScore: number;
  hTeamId: number;
  gTeamId: number;
  hTeamName?: string;
  gTeamName?: string;
}

interface MatchPairListTeam {
  id: number;
  name: string;
  logoUrl?: string | null;
}

interface MatchPairListProps {
  matches: MatchPairListMatch[];
  teams?: MatchPairListTeam[] | null;
  className?: string;
}

type RenderItem =
  | {
      type: 'pair';
      key: string;
      sortTime: number;
      firstMatch: MatchPairListMatch;
      secondMatch: MatchPairListMatch;
    }
  | {
      type: 'single';
      key: string;
      sortTime: number;
      match: MatchPairListMatch;
    };

const getPairKey = (hTeamId: number, gTeamId: number): string => {
  const [leftTeamId, rightTeamId] = [hTeamId, gTeamId].sort((a, b) => a - b);
  return `${leftTeamId}:${rightTeamId}`;
};

const getTimeValue = (date: string): number => {
  const value = new Date(date).getTime();
  return Number.isNaN(value) ? Number.MAX_SAFE_INTEGER : value;
};

const formatKickoffLabel = (date: string): string => {
  const kickoffDate = new Date(date);
  if (Number.isNaN(kickoffDate.getTime())) {
    return date;
  }

  const dateLabel = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(kickoffDate);

  const timeLabel = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(kickoffDate);

  return `${dateLabel}, ${timeLabel}`;
};

const getRenderItems = (matches: MatchPairListMatch[]): RenderItem[] => {
  const groupedMatches = new Map<string, MatchPairListMatch[]>();

  for (const match of matches) {
    const key = getPairKey(match.hTeamId, match.gTeamId);
    const currentGroup = groupedMatches.get(key) ?? [];
    currentGroup.push(match);
    groupedMatches.set(key, currentGroup);
  }

  const renderItems: RenderItem[] = [];

  for (const [key, groupMatches] of groupedMatches) {
    const sortedGroupMatches = [...groupMatches].sort((a, b) => getTimeValue(a.date) - getTimeValue(b.date));

    for (let index = 0; index < sortedGroupMatches.length; index += 2) {
      const firstMatch = sortedGroupMatches[index];
      const secondMatch = sortedGroupMatches[index + 1];

      if (secondMatch) {
        renderItems.push({
          type: 'pair',
          key: `${key}-${firstMatch.id}-${secondMatch.id}`,
          sortTime: Math.min(getTimeValue(firstMatch.date), getTimeValue(secondMatch.date)),
          firstMatch,
          secondMatch,
        });
      } else {
        renderItems.push({
          type: 'single',
          key: `${key}-${firstMatch.id}`,
          sortTime: getTimeValue(firstMatch.date),
          match: firstMatch,
        });
      }
    }
  }

  return renderItems.sort((a, b) => a.sortTime - b.sortTime);
};

const getRawValue = (source: RawRecord, keys: string[]): unknown => {
  for (const key of keys) {
    if (key in source) {
      return source[key];
    }
  }
  return undefined;
};

const getNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  if (value && typeof value === 'object') {
    const nestedValue = value as RawRecord;
    const fromNested =
      getNumber(nestedValue.id) ??
      getNumber(nestedValue.teamId) ??
      getNumber(nestedValue.value);

    if (fromNested !== null) {
      return fromNested;
    }
  }

  return null;
};

const getString = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return null;
};

const normalizeTeam = (team: unknown): MatchPairListTeam | null => {
  if (!team || typeof team !== 'object') {
    return null;
  }

  const rawTeam = team as RawRecord;
  const id = getNumber(getRawValue(rawTeam, ['id', 'teamId', 'teamid']));
  if (id === null) {
    return null;
  }

  const name =
    getString(getRawValue(rawTeam, ['name', 'teamName', 'teamname', 'shortName', 'shortname'])) ??
    `Команда ${id}`;
  const logoUrl = getString(getRawValue(rawTeam, ['logoUrl', 'logo', 'teamLogo', 'teamLogoUrl']));

  return {
    id,
    name,
    logoUrl,
  };
};

const normalizeMatch = (match: unknown): MatchPairListMatch | null => {
  if (!match || typeof match !== 'object') {
    return null;
  }

  const rawMatch = match as RawRecord;
  const id = getNumber(getRawValue(rawMatch, ['id', 'matchId', 'matchid']));
  const hTeamId = getNumber(getRawValue(rawMatch, ['hTeamId', 'hteamId', 'homeTeamId', 'hteamid', 'hTeam']));
  const gTeamId = getNumber(getRawValue(rawMatch, ['gTeamId', 'gteamId', 'awayTeamId', 'gteamid', 'gTeam']));

  if (id === null || hTeamId === null || gTeamId === null) {
    return null;
  }

  const date = getString(getRawValue(rawMatch, ['date', 'matchDate', 'matchdate'])) ?? '';
  const hScore = getNumber(getRawValue(rawMatch, ['hScore', 'hscore', 'homeScore', 'homescore'])) ?? 0;
  const gScore = getNumber(getRawValue(rawMatch, ['gScore', 'gscore', 'awayScore', 'awayscore'])) ?? 0;
  const hTeamName = getString(getRawValue(rawMatch, ['hTeamName', 'hteamName', 'homeTeamName', 'hteamname']));
  const gTeamName = getString(getRawValue(rawMatch, ['gTeamName', 'gteamName', 'awayTeamName', 'gteamname']));

  return {
    id,
    date,
    hScore,
    gScore,
    hTeamId,
    gTeamId,
    hTeamName: hTeamName ?? undefined,
    gTeamName: gTeamName ?? undefined,
  };
};

export const MatchPairList: React.FC<MatchPairListProps> = ({
  matches,
  teams,
  className = '',
}) => {
  const normalizedTeams = (teams ?? [])
    .map((team) => normalizeTeam(team))
    .filter((team): team is MatchPairListTeam => team !== null);
  const teamMap = new Map(normalizedTeams.map((team) => [team.id, team]));
  const normalizedMatches = matches
    .map((match) => normalizeMatch(match))
    .filter((match): match is MatchPairListMatch => match !== null);
  const renderItems = getRenderItems(normalizedMatches);

  if (renderItems.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.matchPairList} ${className}`.trim()}>
      {renderItems.map((item) => {
        if (item.type === 'pair') {
          return (
            <MatchPairItem
              key={item.key}
              className={styles.listItem}
              firstMatch={{
                kickoffLabel: formatKickoffLabel(item.firstMatch.date),
                homeTeamName:
                  teamMap.get(item.firstMatch.hTeamId)?.name ??
                  item.firstMatch.hTeamName ??
                  `Команда ${item.firstMatch.hTeamId}`,
                awayTeamName:
                  teamMap.get(item.firstMatch.gTeamId)?.name ??
                  item.firstMatch.gTeamName ??
                  `Команда ${item.firstMatch.gTeamId}`,
                homeScore: item.firstMatch.hScore,
                awayScore: item.firstMatch.gScore,
                homeTeamLogoUrl: teamMap.get(item.firstMatch.hTeamId)?.logoUrl ?? null,
                awayTeamLogoUrl: teamMap.get(item.firstMatch.gTeamId)?.logoUrl ?? null,
              }}
              secondMatch={{
                kickoffLabel: formatKickoffLabel(item.secondMatch.date),
                homeTeamName:
                  teamMap.get(item.secondMatch.hTeamId)?.name ??
                  item.secondMatch.hTeamName ??
                  `Команда ${item.secondMatch.hTeamId}`,
                awayTeamName:
                  teamMap.get(item.secondMatch.gTeamId)?.name ??
                  item.secondMatch.gTeamName ??
                  `Команда ${item.secondMatch.gTeamId}`,
                homeScore: item.secondMatch.hScore,
                awayScore: item.secondMatch.gScore,
                homeTeamLogoUrl: teamMap.get(item.secondMatch.hTeamId)?.logoUrl ?? null,
                awayTeamLogoUrl: teamMap.get(item.secondMatch.gTeamId)?.logoUrl ?? null,
              }}
            />
          );
        }

        return (
          <MatchViewItem
            key={item.key}
            className={styles.listItem}
            kickoffLabel={formatKickoffLabel(item.match.date)}
            homeTeamName={
              teamMap.get(item.match.hTeamId)?.name ?? item.match.hTeamName ?? `Команда ${item.match.hTeamId}`
            }
            awayTeamName={
              teamMap.get(item.match.gTeamId)?.name ?? item.match.gTeamName ?? `Команда ${item.match.gTeamId}`
            }
            homeScore={item.match.hScore}
            awayScore={item.match.gScore}
            homeTeamLogoUrl={teamMap.get(item.match.hTeamId)?.logoUrl ?? null}
            awayTeamLogoUrl={teamMap.get(item.match.gTeamId)?.logoUrl ?? null}
          />
        );
      })}
    </section>
  );
};
