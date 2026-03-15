import styles from './MatchViewItem.module.css';

interface MatchViewItemProps {
  kickoffLabel: string;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  homeTeamLogoUrl?: string | null;
  awayTeamLogoUrl?: string | null;
  className?: string;
}

interface TeamLogoProps {
  logoUrl?: string | null;
  teamName: string;
}

const TeamLogo: React.FC<TeamLogoProps> = ({ logoUrl, teamName }) => {
  const firstLetter = teamName.trim().charAt(0).toUpperCase() || '?';

  if (!logoUrl) {
    return (
      <span className={styles.logoFallback} aria-hidden>
        {firstLetter}
      </span>
    );
  }

  return <img src={logoUrl} alt="" className={styles.teamLogo} loading="lazy" />;
};

export const MatchViewItem: React.FC<MatchViewItemProps> = ({
  kickoffLabel,
  homeTeamName,
  awayTeamName,
  homeScore,
  awayScore,
  homeTeamLogoUrl,
  awayTeamLogoUrl,
  className = '',
}) => {
  return (
    <article className={`${styles.matchViewItem} ${className}`.trim()}>
      <time className={styles.kickoff}>{kickoffLabel}</time>

      <div className={styles.centerBlock}>
        <div className={styles.teamBlock}>
          <span className={styles.teamName}>{homeTeamName}</span>
          <TeamLogo logoUrl={homeTeamLogoUrl} teamName={homeTeamName} />
        </div>

        <div className={styles.scoreBlock} aria-label={`Счет ${homeScore}:${awayScore}`}>
          <span className={styles.scoreCell}>{homeScore}</span>
          <span className={styles.scoreCell}>{awayScore}</span>
        </div>

        <div className={styles.teamBlock}>
          <TeamLogo logoUrl={awayTeamLogoUrl} teamName={awayTeamName} />
          <span className={styles.teamName}>{awayTeamName}</span>
        </div>
      </div>
    </article>
  );
};
