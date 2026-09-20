import type { RandomRange } from '../randomRange';

/**
 * Quanta atmosfera. Sono i quattro valori di RattInventario, con lo stesso ordine e gli stessi
 * nomi: `off` non è «rotto», è la pagina ferma.
 */
export type ToxicLevel = 'off' | 'low' | 'medium' | 'high';

/**
 * I quattro livelli dal meno al più. È l'ordine in cui il selettore li mette in fila, ed è anche
 * l'unico posto dove quell'ordine è scritto: un `Record` in TypeScript non promette niente su
 * come si scorre.
 */
export const TOXIC_LEVELS: readonly ToxicLevel[] = ['off', 'low', 'medium', 'high'];

/**
 * Come si chiamano i quattro livelli a schermo.
 *
 * ⚠️ **È un dato, non un testo dentro un componente**: `ToxicLevelSwitch` lo usa come valore
 * predefinito e accetta di riceverne un altro, perché un'applicazione in un'altra lingua — o con
 * un'altra voce — non deve riscrivere il selettore per cambiare quattro parole. Stessa regola del
 * lessico dei Ludoratti.
 */
export const TOXIC_LEVEL_LABELS: Record<ToxicLevel, string> = {
  off: 'spento',
  low: 'basso',
  medium: 'medio',
  high: 'alto',
};

/** Quanto di ogni strato mettere in scena a un dato livello. */
export interface ToxicLevelSettings {
  /**
   * L'opacità del velo verde, come classe intera.
   *
   * ⚠️ **Scritta per esteso e non composta**: Tailwind le classi le cerca nel testo dei file, e
   * `` `opacity-${n}` `` darebbe la stringa giusta e nessuna regola. È la stessa ragione per cui
   * `plagueBarSizes.ts` ha due tabelle invece di una funzione.
   */
  readonly hazeClass: string;
  /** Quante icone galleggiano, prese in testa alla lista dichiarata dal fondale. */
  readonly floaters: number;
  /** Quante gocce colano dal bordo di sopra. */
  readonly drips: number;
  /** Ogni quanto nasce una bolla, in millisecondi. L'attesa si ripesca a ogni giro. */
  readonly bubbleEveryMs: RandomRange;
  /** Quante bolle al massimo insieme. Zero vuol dire che le bolle non partono affatto. */
  readonly maxBubbles: number;
  /** Il diametro di una bolla, in pixel. */
  readonly bubbleSize: RandomRange;
  /** Quanto ci mette una bolla ad attraversare il riquadro, in millisecondi. */
  readonly bubbleRiseMs: RandomRange;
}

/**
 * La scala dell'atmosfera, livello per livello.
 *
 * I numeri delle bolle vengono da `ToxicBubbles` di RattInventario — una ogni 8/4/1 secondi, al
 * massimo 4/8/16, da 20–40 a 45–90 px — perché quella progressione è tarata e funziona. Il resto è
 * nuovo: di là il livello comandava **solo** le bolle e l'opacità di una delle quattro sfumature,
 * mentre le sei icone che galleggiano restavano identiche a qualunque livello. Qui il livello
 * comanda tutto quello che si muove, che è ciò che il suo nome promette.
 *
 * ⚠️ **`off` spegne davvero.** Niente velo, niente icone, niente gocce, niente bolle: resta il
 * fondo e basta. Di là `off` lasciava il velo al 20% e cambiava il testo in «INTRUDER DETECTED»,
 * cioè faceva una battuta invece di obbedire — e quel testo era della pagina, non del comando.
 */
export const TOXIC_LEVEL_SETTINGS: Record<ToxicLevel, ToxicLevelSettings> = {
  off: {
    hazeClass: 'opacity-0',
    floaters: 0,
    drips: 0,
    bubbleEveryMs: [0, 0],
    maxBubbles: 0,
    bubbleSize: [0, 0],
    bubbleRiseMs: [0, 0],
  },
  low: {
    hazeClass: 'opacity-30',
    floaters: 2,
    drips: 1,
    bubbleEveryMs: [6000, 10000],
    maxBubbles: 4,
    bubbleSize: [20, 40],
    bubbleRiseMs: [6000, 9000],
  },
  medium: {
    hazeClass: 'opacity-60',
    floaters: 4,
    drips: 2,
    bubbleEveryMs: [3000, 5000],
    maxBubbles: 8,
    bubbleSize: [25, 50],
    bubbleRiseMs: [5000, 8000],
  },
  high: {
    hazeClass: 'opacity-100',
    floaters: 6,
    drips: 3,
    bubbleEveryMs: [800, 1600],
    maxBubbles: 16,
    bubbleSize: [45, 90],
    bubbleRiseMs: [4000, 7000],
  },
};
