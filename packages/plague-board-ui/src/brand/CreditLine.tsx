import { CreditCard, type CreditAuthor } from './CreditCard';

/** Di quanto sfalsa il cenno di un autore rispetto al precedente. Vedi il commento nel corpo. */
const HINT_STAGGER_MS = 2000;

export interface CreditLineProps {
  /** Chi ha fatto l'applicazione. Il primo è quello che resta quando lo spazio manca. */
  authors: readonly CreditAuthor[];
  /** Le parole davanti ai nomi, con spazio. */
  label?: string;
  /** Le parole davanti ai nomi, senza spazio. */
  shortLabel?: string;
  /** Classi aggiuntive sulla riga. */
  className?: string;
}

/**
 * **La firma: «Creato da» e chi l'ha fatta.**
 *
 * ⚠️ **Si accorcia da sé, e lo fa con le container query.** Sotto le 32rem di **contenitore** —
 * non di finestra — le parole diventano «By:» e resta il primo autore soltanto. Il contenitore è
 * il pezzo che la contiene, quindi la stessa firma si comporta bene in un piede a tutta larghezza
 * e dentro una colonna stretta, senza che nessuno le dica dove si trova. ⚠️ Perché funzioni,
 * qualcuno sopra deve dichiarare `@container`: {@link PlagueFootBar} lo fa; chi monta i pezzi a
 * mano se ne deve ricordare, e senza quella dichiarazione la firma resta semplicemente lunga —
 * che è il modo giusto di sbagliare.
 *
 * ⚠️ **Il primo autore è quello che sopravvive.** Non è un caso da decidere ogni volta: in una
 * firma «umano e AI» il primo è la persona, ed è quella che un piede deve nominare quando ha
 * spazio per un nome solo.
 */
export function CreditLine({
  authors,
  label = 'Creato da',
  shortLabel = 'By:',
  className = '',
}: CreditLineProps) {
  return (
    <span className={`flex items-center gap-2 text-xs text-muted ${className}`}>
      {/* Due nodi e non uno con due classi: il testo cambia, non solo la sua misura. */}
      <span className="hidden @lg:inline">{label}</span>
      <span className="@lg:hidden">{shortLabel}</span>

      {authors.map((author, posto) => (
        <span key={author.name} className={posto === 0 ? 'flex' : 'hidden @lg:flex'}>
          {/* ⚠️ **I cenni non partono insieme**, e il ritardo lo distribuisce la riga invece di
              chiederlo a chi la usa. Due schede affiancate che saltellano allo stesso istante non
              sembrano due cose vive: sembrano una cosa sola che pulsa. Due secondi bastano a
              rompere la simmetria su un ciclo da sei. */}
          <CreditCard {...author} hintDelayMs={posto * HINT_STAGGER_MS} />
        </span>
      ))}
    </span>
  );
}
