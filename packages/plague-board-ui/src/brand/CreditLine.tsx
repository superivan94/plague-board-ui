import { CreditCard, type CreditAuthor } from './CreditCard.js';

/** Di quanto sfalsa il cenno di un autore rispetto al precedente. Vedi il commento nel corpo. */
const HINT_STAGGER_MS = 2000;

export interface CreditLineProps {
  /** Chi ha fatto l'applicazione. Il primo è quello che resta quando lo spazio manca. */
  authors: readonly CreditAuthor[];
  /** Le parole davanti ai nomi, con spazio. */
  label?: string;
  /** Le parole davanti ai nomi, senza spazio. */
  shortLabel?: string;
  /**
   * Sempre nella forma corta, qualunque sia il contenitore: {@link shortLabel} e il primo autore.
   *
   * Per una colonna che si sa già stretta, o per una firma che deve dire poco anche su uno schermo
   * largo. Senza, la forma la decide il contenitore; con questa, il `@container` sopra non serve.
   */
  isCompact?: boolean;
  /** Classi aggiuntive sulla riga. */
  className?: string;
}

/**
 * Le classi delle due forme, scritte per esteso.
 *
 * ⚠️ Una tabella e non una funzione che le compone, per la ragione di `plagueBarSizes.ts`:
 * Tailwind le classi le cerca nel testo dei file, e `'@max-lg:' + 'hidden'` darebbe la stringa
 * giusta e nessuna regola.
 */
const FORMS = {
  auto: { label: '@max-lg:hidden', shortLabel: 'hidden @max-lg:inline', others: 'flex @max-lg:hidden' },
  compact: { label: 'hidden', shortLabel: 'inline', others: 'hidden' },
} as const;

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
 * ⚠️ **Resta lunga perché la forma lunga è la base, e la corta sta dietro `@max-lg:`.** Una
 * container query senza contenitore non si applica, e vale la classe di base. Con le classi al
 * rovescio — `hidden @lg:inline`, com'erano — dimenticare il contenitore dava «By:» e un autore
 * solo anche su una pagina larga: il secondo spariva senza avviso. Misurato il 2026-09-22 nella
 * storia di questo componente, che mostra apposta la variante senza contenitore.
 *
 * ⚠️ **Il primo autore è quello che sopravvive.** Non è un caso da decidere ogni volta: in una
 * firma «umano e AI» il primo è la persona, ed è quella che un piede deve nominare quando ha
 * spazio per un nome solo.
 *
 * Chi la vuole corta a prescindere dallo spazio passa `isCompact`: le stesse due forme, scelte
 * dalla prop invece che dal contenitore.
 */
export function CreditLine({
  authors,
  label = 'Creato da',
  shortLabel = 'By:',
  isCompact = false,
  className = '',
}: CreditLineProps) {
  const form = FORMS[isCompact ? 'compact' : 'auto'];

  return (
    <span className={`flex items-center gap-2 text-xs text-muted ${className}`}>
      {/* Due nodi e non uno con due classi: il testo cambia, non solo la sua misura. */}
      <span className={form.label}>{label}</span>
      <span className={form.shortLabel}>{shortLabel}</span>

      {authors.map((author, posto) => (
        <span key={author.name} className={posto === 0 ? 'flex' : form.others}>
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
