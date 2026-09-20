import type { CSSProperties } from 'react';

import type { RandomRange } from '../randomRange';
import type { HoverEffect } from './hoverEffects';

/**
 * Il sorteggio di `HoverEmitter`: come si pesca il prossimo elemento da far volare.
 *
 * ⚠️ Sta in un modulo suo perché il componente aveva passato le trecento righe, ed è la parte che
 * si stacca senza costare niente: qui dentro non c'è nessuno stato e nessun React — sono funzioni
 * pure che, dati la taratura e il riquadro che avvolge, dicono dove nasce una cosa e quanto vive.
 */

/** Un elemento in volo: la chiave che ne fa un nodo nuovo, e tutto ciò che serve a dipingerlo. */
export interface Effimero {
  readonly key: number;
  readonly content: string;
  readonly className: string;
  readonly style: CSSProperties;
}

const fra = ([min, max]: RandomRange) => min + Math.random() * (max - min);

/**
 * L'altezza del prossimo elemento. Con le corsie sono **altezze fisse**, equidistanti fra i due
 * estremi e percorse a turno — e il turno è la chiave, che cresce di uno alla volta.
 *
 * ⚠️ **Fisse, non pescate dentro la corsia**, ed è una correzione misurata: un elemento è alto, e
 * un'altezza pescata dentro la propria fetta lo fa sbordare in quella accanto. Con i fumetti —
 * corsie da 20 px, fumetti da 18 — il primo giro di corsie a fascia lasciava ancora **dieci**
 * sovrapposizioni su ventiquattro campionamenti. Quanto stare larghi lo decide la taratura,
 * scegliendo gli estremi di `top`.
 */
const altezza = (top: RandomRange, lanes: number | undefined, giro: number) => {
  if (lanes === undefined || lanes < 2) return fra(top);

  const [min, max] = top;

  return min + ((max - min) / (lanes - 1)) * (giro % lanes);
};

/**
 * Quale testo, **senza ripetere quello di prima**. Si pesca fra gli altri — non si ripesca finché
 * non esce diverso, che con un testo solo è un ciclo che non finisce — ed è la stessa scelta di
 * `useRandomPhrase`, fatta con gli indici perché qui il mazzo si ripesca tre volte al secondo.
 *
 * ⚠️ Esce dal modulo perché al terzo posto che ne ha bisogno — l'emettitore, il gancio delle
 * frasi, e i versi che escono dalla città — una quarta copia sarebbe la cosa che la regola sul
 * copiare vieta.
 */
export const scegli = (contents: readonly string[], ultimo: number) => {
  if (contents.length < 2 || ultimo < 0) return Math.floor(Math.random() * contents.length);

  const scelto = Math.floor(Math.random() * (contents.length - 1));

  return scelto >= ultimo ? scelto + 1 : scelto;
};

export const pesca = (
  key: number,
  effect: HoverEffect,
  ultimo: number,
  riquadro: DOMRect,
): { effimero: Effimero; vitaMs: number; indice: number } => {
  const vitaMs = fra(effect.lifeMs);
  const indice = scegli(effect.contents, ultimo);

  return {
    vitaMs,
    indice,
    effimero: {
      key,
      content: effect.contents[indice],
      className: effect.className,
      style: {
        // ⚠️ **Le percentuali della taratura diventano pixel della finestra qui.** Gli effimeri
        // volano nel piano sopra tutto, non dentro il riquadro che li genera, quindi `left` e
        // `top` non possono più essere relativi a lui: si misura il riquadro al momento e si
        // converte. Le prop restano percentuali perché è così che si ragiona — «un po' sopra»,
        // «a metà» — e perché un numero in pixel non saprebbe adattarsi a ciò che avvolge.
        left: `${(riquadro.left + (fra(effect.left) / 100) * riquadro.width).toFixed(1)}px`,
        top: `${(riquadro.top + (altezza(effect.top, effect.lanes, key) / 100) * riquadro.height).toFixed(1)}px`,
        // ⚠️ La durata dell'animazione si scrive **sempre**, e non è un di più: `.pb-binary-digit`
        // dichiara `animation: pb-float-up linear forwards` senza durata, cioè zero secondi — la
        // cifra salterebbe dritta all'ultimo fotogramma, che è trasparente. Vale anche per il
        // fumetto, dove coincide con i 2,5 s del foglio di stile: scriverla è ciò che tiene in
        // pari quanto l'elemento **vive** e quanto **si vede**.
        animationDuration: `${(vitaMs / 1000).toFixed(2)}s`,
        ...(effect.fontSizeRem ? { fontSize: `${fra(effect.fontSizeRem).toFixed(2)}rem` } : {}),
      },
    },
  };
};
