import { MatchViewItem } from '../MatchViewItem';
import styles from './MatchPairItem.module.css';

interface PairMatchData {
  kickoffLabel: string;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  homeTeamLogoUrl?: string | null;
  awayTeamLogoUrl?: string | null;
}

interface MatchPairItemProps {
  firstMatch: PairMatchData;
  secondMatch: PairMatchData;
  aggregateLabel?: string;
  className?: string;
}

const getAggregateLabel = (firstMatch: PairMatchData, secondMatch: PairMatchData): string => {
  const leftTeamName = secondMatch.homeTeamName;
  const rightTeamName = secondMatch.awayTeamName;
  const leftTeamScore = firstMatch.awayScore + secondMatch.homeScore;
  const rightTeamScore = firstMatch.homeScore + secondMatch.awayScore;

  return `${leftTeamName} ${leftTeamScore} - ${rightTeamScore} ${rightTeamName}`;
};

export const MatchPairItem: React.FC<MatchPairItemProps> = ({
  firstMatch,
  secondMatch,
  aggregateLabel,
  className = '',
}) => {
  const normalizedAggregateLabel = aggregateLabel ?? getAggregateLabel(firstMatch, secondMatch);

  return (
    <article className={`${styles.matchPairItem} ${className}`.trim()}>
      <MatchViewItem {...firstMatch} className={styles.matchRow} />
      <MatchViewItem {...secondMatch} className={`${styles.matchRow} ${styles.matchRowWithDivider}`} />
      <div className={styles.aggregateRow}>
        <div className={styles.aggregateCenter}>
          <p className={styles.aggregateResult}>{normalizedAggregateLabel}</p>
        </div>
      </div>
    </article>
  );
};
