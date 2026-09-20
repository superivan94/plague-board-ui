'use client';

import { Chip } from '@heroui/react';
import { Children, useState, type ReactNode } from 'react';

export interface CountedChipsProps {
  /**
   * Le pastiglie, **già rese** da chi lo monta: `ThematicBadge`, il `Chip` di HeroUI, o quello che
   * l'applicazione usa per i suoi tag.
   *
   * ⚠️ Sono figli e non un elenco di stringhe apposta. Un tag ha un colore che dipende
   * dall'applicazione — di là è una tabella `tagColors` — e passarlo qui vorrebbe dire o una
   * funzione che disegna (che da una pagina server non attraversa il confine) o inventare uno
   * schema di dati per una cosa che JSX dice già. Qui si conta e si nasconde, non si disegna.
   */
  children: ReactNode;
  /** Quante se ne vedono da chiuso. Tre, come la scheda di RattInventario da cui arriva. */
  visible?: number;
  /**
   * Come si chiama il comando che apre. Il conto lo aggiunge il componente, fra parentesi, perché
   * il nome accessibile deve **contenere** il testo che si vede.
   */
  moreLabel?: string;
  /** Classi aggiuntive sulla riga. */
  className?: string;
}

/**
 * **I chip che si contano**: ne mostra pochi, e il resto sta dietro un `+N` che li apre.
 *
 * Di là il `+3` c'è già, ma è uno `<span>`: dice quanti ne mancano e non permette di vederli, che
 * è il modo più frustrante di dare quell'informazione. Qui è un comando, e l'unica cosa che questo
 * componente aggiunge alle pastiglie è **contarle e nasconderne un po'**.
 *
 * ⚠️ **Quello che non si vede non è nella pagina**, non è nascosto con una classe: altrimenti lo
 * troverebbero lo stesso la ricerca del browser, la selezione e chi copia — la stessa scelta
 * dell'interruttore di `GlitchText`, e per la stessa ragione.
 *
 * ⚠️ **Non è il `Disclosure` di HeroUI, e non per gusto**: quello vuole un `Heading` col suo
 * `Trigger` e apre un **pannello** a parte, `role="group"` legato all'intestazione. Qui non c'è
 * nessun titolo da dare a una riga di tag, e soprattutto le pastiglie nascoste devono continuare
 * la **stessa riga** che va a capo, non comparire in un blocco sotto.
 *
 * ⚠️ **Il nome del comando non cambia quando si apre.** Resta «Mostra tutti (+2)» e a dire lo
 * stato è `aria-expanded`: è il modo in cui si annuncia una cosa che si apre e si chiude, e un
 * comando che cambia nome a metà è un comando che chi legge deve ritrovare. Il conto entra nel
 * nome perché chi comanda il browser a voce legge `+2` e lo pronuncia: se il nome non contenesse
 * quel testo, quel comando non si potrebbe dire.
 *
 * ⚠️ **Il comando è un `<button>` vero, passato con `render`.** Il `Chip` di HeroUI rende uno
 * `<span>`, e uno `<span>` con un `onClick` è un comando che la tastiera non trova: `render` è
 * l'unico modo in HeroUI 3 di cambiargli elemento, ed è anche il motivo per cui questo modulo
 * dichiara `'use client'` — una funzione non attraversa il confine di una pagina server.
 *
 * @example
 * ```tsx
 * <CountedChips visible={3}>
 *   {tags.map((tag) => (
 *     <ThematicBadge key={tag} color={COLORE[tag]}>{tag}</ThematicBadge>
 *   ))}
 * </CountedChips>
 * ```
 */
export function CountedChips({
  children,
  visible = 3,
  moreLabel = 'Mostra tutti',
  className = '',
}: CountedChipsProps) {
  const [aperto, setAperto] = useState(false);

  // `Children.toArray` appiattisce i frammenti e scarta i buchi — `null`, `false`, i rami di un
  // `&&` che non è scattato — quindi il conto è quello delle pastiglie vere, non dei posti.
  const voci = Children.toArray(children);
  const nascoste = Math.max(0, voci.length - visible);

  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      {aperto ? voci : voci.slice(0, visible)}

      {nascoste > 0 ? (
        <Chip<'button'>
          render={(props) => <button type="button" {...props} />}
          className="cursor-pointer rounded-full border border-current/40 focus-visible:focus-ring"
          aria-expanded={aperto}
          aria-label={`${moreLabel} (+${nascoste})`}
          onClick={() => setAperto((era) => !era)}
        >
          <Chip.Label>{aperto ? '−' : `+${nascoste}`}</Chip.Label>
        </Chip>
      ) : null}
    </div>
  );
}
