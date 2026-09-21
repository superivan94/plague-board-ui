import { TechLabel } from './TechLabel.js';

export interface VersionTagProps {
  /** La versione **senza** la `v`: quella la mette il componente. */
  version: string;
  /** Classi aggiuntive. */
  className?: string;
}

/**
 * **La versione dell'applicazione**, con la `v` davanti e le cifre a larghezza fissa.
 *
 * ⚠️ **`tabular-nums` non è un vezzo**: in un piede appiccicato la versione sta ferma in un punto,
 * e con le cifre proporzionali passare da `v4.0.9` a `v4.0.10` sposta di qualche pixel tutto
 * quello che le sta accanto. Un numero che cambia non deve muovere la riga.
 *
 * ⚠️ **La `v` la mette il componente**, così chi lo usa può passargli direttamente quello che
 * legge dal `package.json` senza incollarci davanti una lettera — ed è anche il motivo per cui è
 * un componente invece di due parole scritte a mano in ogni piede.
 */
export function VersionTag({ version, className = '' }: VersionTagProps) {
  return <TechLabel className={`tabular-nums text-muted ${className}`}>v{version}</TechLabel>;
}
