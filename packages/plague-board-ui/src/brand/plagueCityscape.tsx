import type { CSSProperties } from 'react';

/** Una finestra accesa: dove sta sul palazzo, quanto è grande, e col suo tempo di sfarfallio. */
interface Finestra {
  /** L'altezza sul palazzo, in percentuale. */
  readonly top: string;
  /** Il lato da cui si conta e quanto: uno dei due, mai tutti e due. */
  readonly left?: string;
  readonly right?: string;
  readonly w: number;
  readonly h: number;
  /**
   * Ogni quanto cala la tensione su **questa** finestra, e da che punto del ciclo parte.
   *
   * ⚠️ Sono numeri diversi per ognuna, e non è vezzo: sette finestre con lo stesso ciclo calano
   * insieme, e insieme non sono sette luci — sono un temporale.
   */
  readonly durata: string;
  readonly ritardo: string;
}

interface Palazzo {
  readonly left?: string;
  readonly right?: string;
  /** La larghezza in pixel: un palazzo è largo quanto è largo, non in proporzione allo schermo. */
  readonly w: number;
  /** L'altezza in percentuale della fascia, così lo skyline si adatta a qualunque riquadro. */
  readonly h: string;
  readonly finestre: readonly Finestra[];
}

/** Quanto del fondale occupa la fascia della città, in percentuale. */
export const BANDA_CITTA = 28;

/**
 * I quattro palazzi di `ludoratti.it`, con le loro sette finestre.
 *
 * ⚠️ **Le altezze sono percentuali, di là erano pixel.** Sul sito la fascia è un quarto della
 * finestra e il palazzo più alto misura 192 px: dentro un riquadro da 26rem quel palazzo uscirebbe
 * dalla fascia e finirebbe in mezzo al contenuto. In percentuale lo skyline è lo stesso a
 * qualunque misura, che è la condizione perché un fondale possa stare anche dentro una scheda.
 */
export const CITTA: readonly Palazzo[] = [
  {
    left: '10%',
    w: 48,
    h: '36%',
    finestre: [
      { top: '16%', left: '16px', w: 4, h: 4, durata: '4.2s', ritardo: '0.5s' },
      { top: '42%', left: '24px', w: 4, h: 4, durata: '6.1s', ritardo: '1.2s' },
    ],
  },
  {
    left: '25%',
    w: 80,
    h: '71%',
    finestre: [
      { top: '16%', right: '16px', w: 4, h: 4, durata: '5.3s', ritardo: '0.2s' },
      { top: '50%', left: '12px', w: 4, h: 8, durata: '7.4s', ritardo: '2s' },
      { top: '66%', left: '40px', w: 4, h: 4, durata: '4.8s', ritardo: '0.8s' },
    ],
  },
  {
    right: '15%',
    w: 64,
    h: '47%',
    finestre: [{ top: '38%', left: '20px', w: 8, h: 4, durata: '6.7s', ritardo: '1.5s' }],
  },
  {
    right: '30%',
    w: 32,
    h: '24%',
    finestre: [{ top: '38%', right: '12px', w: 4, h: 4, durata: '5.9s', ritardo: '2.5s' }],
  },
];

/** Quante finestre ha la città in tutto. */
export const FINESTRE_TOTALI = CITTA.reduce((somma, palazzo) => somma + palazzo.finestre.length, 0);

/**
 * Dove sta il tetto di ogni palazzo, in percentuale dell'altezza del fondale, e su che x.
 *
 * Serve a chi deve far comparire qualcosa **sopra** i palazzi senza riscriverne le misure: si
 * sposta un palazzo e ci si sposta anche quello che gli esce dal tetto.
 */
export const TETTI = CITTA.map((palazzo) => ({
  x: palazzo.left ? Number.parseFloat(palazzo.left) : 100 - Number.parseFloat(palazzo.right ?? '0'),
  y: 100 - (BANDA_CITTA * Number.parseFloat(palazzo.h)) / 100,
}));

/**
 * **Lo skyline distopico**, in fondo al fondale: quattro sagome scure che salgono dal bordo, con
 * le finestre accese che ogni tanto perdono la tensione.
 *
 * È la scena di `ludoratti.it`, dove dice in un colpo solo dove siamo — una città, di notte, e
 * qualcuno è ancora sveglio. Non è un'icona e non si annuncia: è il posto.
 *
 * ⚠️ **Non dipende dal livello dell'atmosfera**, per scelta dell'utente il 2026-09-20: il livello
 * dice quanto gas c'è in giro, e la corrente di una città non c'entra. Le finestre sono sempre
 * tutte e sette, e ognuna sfarfalla per conto suo.
 */
export function PlagueCityscape() {
  return (
    <div
      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950 to-transparent"
      style={{ height: `${BANDA_CITTA}%` }}
    >
      {CITTA.map((palazzo) => (
        <div
          key={`${palazzo.left ?? ''}${palazzo.right ?? ''}`}
          className="pb-city-block absolute bottom-0 bg-gray-900/80"
          style={{ left: palazzo.left, right: palazzo.right, width: palazzo.w, height: palazzo.h }}
        >
          {palazzo.finestre.map((finestra) => (
            <span
              key={`${finestra.top}${finestra.left ?? finestra.right}`}
              className="pb-city-window absolute bg-brand/50"
              style={
                {
                  top: finestra.top,
                  left: finestra.left,
                  right: finestra.right,
                  width: finestra.w,
                  height: finestra.h,
                  '--pb-window-duration': finestra.durata,
                  '--pb-window-delay': finestra.ritardo,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
