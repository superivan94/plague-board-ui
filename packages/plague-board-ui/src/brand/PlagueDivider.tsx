import { Separator } from '@heroui/react';
import type { ReactNode } from 'react';

import { VirusIcon } from '../icons/VirusIcon.js';

export interface PlagueDividerProps {
  /** La parola in mezzo: «oppure», «Alternative Access». Una parola, non una frase. */
  children: ReactNode;
  /**
   * Il segno che le sta ai due lati. Senza, il virione a 16.
   *
   * ⚠️ **`null` vuol dire nessun segno**, ed è la riga di Rattoteca: lì fra il pulsante di Google
   * e il modulo c'è solo «oppure». Il valore predefinito scatta quando la prop non c'è, non quando
   * è vuota.
   */
  icon?: ReactNode;
  /** Classi aggiuntive sulla riga: il colore della parola si mette qui. */
  className?: string;
}

/**
 * **La riga che divide due modi di entrare**: un filo, il segno, la parola, il segno, un filo.
 *
 * È il separatore della schermata di accesso, e arriva da due posti che facevano la stessa cosa in
 * modi diversi: in RattInventario è «Alternative Access» fra due virioni verdi, in Rattoteca è
 * «oppure» fra due righe grigie. Uno dei due è questo componente col segno predefinito, l'altro è
 * questo componente con `icon={null}`.
 *
 * ⚠️ **I fili sono due `Separator` di HeroUI, e sono due davvero.** Il suo separatore rende un
 * `<hr>` e **non accetta contenuto** — verificato nel sorgente di `react-aria-components`, che gli
 * passa i soli `separatorProps` e nessun figlio — quindi la riga con la parola in mezzo non si può
 * fare con uno solo. Il prezzo è che un lettore di schermo annuncia due volte «separatore», e il
 * guadagno è che il ruolo ce l'hanno entrambi i tratti: chi non li vede sa lo stesso che lì il
 * contenuto cambia specie.
 *
 * ⚠️ **Il suo CSS avrebbe anche `separator__container`, `separator__line` e `separator__content`
 * — cioè esattamente questa riga — ma non le emette nessun componente**: un `grep` su tutto il
 * `dist` di HeroUI le trova solo nel foglio di stile. Sono classi morte, come lo erano
 * `animate-glitch` e `animate-reveal` qui, e appoggiarcisi vorrebbe dire dipendere da qualcosa che
 * la prossima versione può togliere senza che niente diventi rosso.
 *
 * ⚠️ **Il filo è `brand-ink/50`, cioè lo stesso verde del bordo di {@link PlaguePanel}, e non il
 * `--separator` di HeroUI.** Quel token è tarato sulle superfici chiare del suo tema e qui non
 * regge: misurato il 2026-09-20 in tema scuro, fa **1,26** sulla pagina e **1,10** dentro il
 * pannello — cioè una riga che non c'è, e un componente che si riduce a una parola con due vuoti
 * ai lati. Il verde al 50% fa **3,83** sul pannello e **3,85** sulla pagina, ed è lo stesso
 * spessore di colore del bordo che gli sta attorno: una sola famiglia di fili per tutta la
 * superficie della peste, invece di due grigi che non si somigliano.
 *
 * @example
 * ```tsx
 * <PlagueDivider>Alternative Access</PlagueDivider>
 * <PlagueDivider icon={null}>oppure</PlagueDivider>
 * ```
 */
export function PlagueDivider({
  children,
  icon = <VirusIcon size={16} />,
  className = '',
}: PlagueDividerProps) {
  return (
    <div className={`flex items-center gap-3 text-muted ${className}`}>
      {/* ⚠️ Le due classi sovrascrivono tre dichiarazioni di `.separator` — `shrink-0`, `w-full`
          e `bg-separator` — e vincono perché le utility di Tailwind stanno in `@layer utilities`
          e i componenti di HeroUI in `@layer components`: non dipende dall'ordine degli import.
          Misurato in pagina: `flex-grow: 1`, `flex-basis: 0%`, e i due fili larghi uguali. */}
      <Separator className="flex-1 bg-brand-ink/50" />
      <span className="flex shrink-0 items-center gap-2 text-xs">
        {icon}
        {children}
        {icon}
      </span>
      <Separator className="flex-1 bg-brand-ink/50" />
    </div>
  );
}
