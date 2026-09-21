import { IconBase } from './IconBase.js';
import type { IconProps } from './types.js';

/** Il corpo: un anello **vuoto**, che è ciò che lo separa dal virione pieno di {@link VirusIcon}. */
const COCCUS_BODY = 'M12 7.5a4.5 4.5 0 1 0 0 9a4.5 4.5 0 1 0 0-9Z';

/**
 * I sei pili, e sono la metà del disegno.
 *
 * ⚠️ **Sono curvi, e curvano tutti nello stesso verso**, che è l'unica cosa che separa un batterio
 * da un sole: i raggi di un sole sono dritti e speculari, e sei raggi dritti attorno a un cerchio
 * vuoto **sono** l'icona della luminosità, in qualunque libreria si guardi. Le sei curve nascono
 * ruotando la stessa di 60° alla volta attorno al centro e allungandola di poco a ogni giro, così
 * la rotazione si vede ma la regolarità non stanca.
 */
const COCCUS_PILI =
  'M12 5.8C12 4.2 13.5 3.6 13.4 2.2' +
  'M16.94 9.15C18.21 8.41 19.38 9.33 20.45 8.61' +
  'M17.69 15.29C19.16 16.13 18.92 17.83 20.25 18.48' +
  'M12 17.95C12 19.49 10.56 20.06 10.66 21.41' +
  'M6.09 15.41C4.57 16.29 3.17 15.19 1.89 16.06' +
  'M7.17 9.21C5.92 8.49 6.13 7.05 4.99 6.5';

/** I tre granuli, sparsi a caso dentro il corpo. Due soli, simmetrici, diventano **due occhi**. */
const COCCUS_GRAINS = [
  { cx: 10.2, cy: 11.2, r: 0.85 },
  { cx: 12.6, cy: 10.2, r: 0.7 },
  { cx: 12.9, cy: 13.6, r: 0.85 },
];

/**
 * **Il cocco**: il batterio tondo, coi pili tutt'intorno e tre granuli dentro.
 *
 * È il batterio **senza un verso**: da qualunque parte lo si giri è uguale, quindi è quello che
 * galleggia in un fondale senza sembrare storto — ed è il mestiere che fa su `ludoratti.it`, dove
 * ne stanno due dietro alla pagina a 64 e 80 pixel. Per una riga di testo c'è
 * {@link BacillusIcon}, che un verso ce l'ha e a 24 si legge.
 *
 * I contagi della libreria sono quattro e non si sovrappongono: {@link VirusIcon} è il **virione**,
 * pieno e coi cerchi concentrici; {@link MoleculeIcon} è la **molecola**, un nucleo coi satelliti;
 * {@link BiohazardIcon} è il **pericolo**, cioè un cartello e non una creatura; questi due sono gli
 * organismi **vivi**, e i pili sono la sola cosa che lo dice.
 *
 * ⚠️ **Il disegno di `ludoratti.it` non è arrivato fin qui, ed è la seconda icona a cui succede
 * dopo il biohazard.** Lì il cocco è un cerchio vuoto con sei raggi **dritti**: a 64px dentro un
 * fondale verde passa per un germe, ma tirato fuori e messo a 24 accanto a una parola è l'icona
 * della luminosità. Le curve e i granuli sono quello che è servito per togliere il sole.
 *
 * ⚠️ **Non scende sotto i 32px.** I pili sono lunghi quattro unità su 24 e il tratto ne occupa
 * due: sotto, si saldano al corpo e restano tre bitorzoli e una macchia.
 */
export function CoccusIcon(props: IconProps) {
  return (
    <IconBase {...props} paint="stroke">
      <path d={COCCUS_BODY} />
      <path d={COCCUS_PILI} />
      {COCCUS_GRAINS.map((grain) => (
        // I granuli sono pieni dentro un disegno a tratto, come le orecchie del marchio: il colore
        // arriva da `currentColor`, quindi si tingono insieme a tutto il resto.
        <circle key={grain.cx} {...grain} fill="currentColor" stroke="none" />
      ))}
    </IconBase>
  );
}
