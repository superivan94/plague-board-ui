import { IconBase } from './IconBase.js';
import type { IconProps } from './types.js';

/**
 * Il guscio della tazza — parete e fondo spessi 1,6 — e il manico ad anello sul fianco destro.
 * Il buco lo fa il secondo sottopath con `evenodd`: è ciò che rende la tazza **vuota**, e quindi
 * riempibile di qualcosa che si vede.
 */
const MUG_PATH =
  'M3 8H17V14A7 7 0 0 1 3 14V8M4.6 9.6V14A5.4 5.4 0 0 0 15.4 14V9.6H4.6M17 9.4C19.8 9.4 21.5 10.9 21.5 13.2C21.5 15.5 19.8 17.2 17 17.2V15.6C18.8 15.6 19.9 14.6 19.9 13.2C19.9 11.8 18.8 11 17 11V9.4Z';

/**
 * La pozione: pelo libero ondulato a metà tazza, e due bolle che salgono dal fondo — buchi nel
 * liquido, per la stessa regola del guscio.
 */
const BREW_PATH =
  'M4.7 12.1C6.4 11 8.3 13 10 12.1C11.7 11.2 13.6 13.2 15.3 12.1V14A5.3 5.3 0 0 1 4.7 14V12.1M7.6 14.3A0.95 0.95 0 0 0 7.6 16.2A0.95 0.95 0 0 0 7.6 14.3M11.4 16A0.75 0.75 0 0 0 11.4 17.5A0.75 0.75 0 0 0 11.4 16Z';

/**
 * Le tre bolle che scappano dalla tazza: il segno che dentro qualcosa ribolle.
 *
 * ⚠️ Sono **tre tracciati e non uno**, perché ognuna deve poter salire per conto suo: unite in un
 * `d` solo si muoverebbero in blocco, e tre bolle che partono insieme sono un lampeggio. Le classi
 * servono ad `animations.css`, che le anima **solo** dentro un `.pb-potion-live`.
 */
const BUBBLE_PATHS = [
  'M6.95 5.2A1.25 1.25 0 1 0 9.45 5.2A1.25 1.25 0 1 0 6.95 5.2Z',
  'M10.95 3.2A0.95 0.95 0 1 0 12.85 3.2A0.95 0.95 0 1 0 10.95 3.2Z',
  'M13.15 6A0.75 0.75 0 1 0 14.65 6A0.75 0.75 0 1 0 13.15 6Z',
] as const;

const BUBBLE_CLASSES = ['pb-potion-bubble', 'pb-potion-bubble pb-potion-bubble-b', 'pb-potion-bubble pb-potion-bubble-c'] as const;

/**
 * **La tazza di pozione.** Il segno delle donazioni dei Ludoratti: una tazza col manico, piena a
 * metà di peste che ribolle e con tre bolle che le scappano dal bordo.
 *
 * ⚠️ **La sagoma esterna è quella di una tazza di caffè, e non è una mancanza di fantasia: è la
 * parte che deve essere riconosciuta.** Un segno che sostituisce il testo quando lo spazio manca
 * deve dire «sostieni» **prima** di dire «peste» — e nel software le tre convenzioni che lo dicono
 * sono la tazza (ko-fi, BuyMeACoffee), il cuore (GitHub Sponsors) e la moneta. Dentro quella
 * sagoma nota ci va la nostra roba: il liquido, le bolle. È lo stesso mestiere del testo
 * «Offrimi una pozione», che è il calco di «offrimi un caffè». L'ampolla della peste, che stava
 * qui prima, è un bel segno che però da sola non dice a che serve il comando — segnalato
 * dall'utente il 2026-09-20.
 *
 * ⚠️ **Non è {@link PoisonIcon}, e non la sostituisce.** L'ampolla resta il veleno: un accento
 * su un'azione dentro l'applicazione. Questa è un **invito**, e vive nel piede.
 *
 * ⚠️ **Da sola sta ferma.** Le bolle salgono soltanto dentro un antenato con la classe
 * `pb-potion-live` — che {@link SupportButton} mette da sé — perché un segno che si anima ovunque
 * lo si metta è invadente, e questa icona è pubblica. Le regole stanno in `animations.css`, che
 * chi installa importa insieme al tema.
 */
export function PotionMugIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={MUG_PATH} fillRule="evenodd" />
      <path d={BREW_PATH} fillRule="evenodd" />
      {BUBBLE_PATHS.map((d, posto) => (
        <path key={d} d={d} className={BUBBLE_CLASSES[posto]} />
      ))}
    </IconBase>
  );
}
