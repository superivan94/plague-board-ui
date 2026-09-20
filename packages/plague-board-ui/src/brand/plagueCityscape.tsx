/** Una finestra accesa: dove sta sul palazzo, quanto è grande, e quando pulsa. */
interface Finestra {
  /** L'altezza sul palazzo, in percentuale. */
  readonly top: string;
  /** Il lato da cui si conta e quanto: uno dei due, mai tutti e due. */
  readonly left?: string;
  readonly right?: string;
  readonly w: number;
  readonly h: number;
  readonly delay: string;
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

/**
 * I quattro palazzi di `ludoratti.it`, con le loro sette finestre.
 *
 * ⚠️ **Le altezze sono percentuali, di là erano pixel.** Sul sito la fascia è un quarto della
 * finestra e il palazzo più alto misura 192 px: dentro un riquadro da 26rem quel palazzo uscirebbe
 * dalla fascia e finirebbe in mezzo al contenuto. In percentuale lo skyline è lo stesso a
 * qualunque misura, che è la condizione perché un fondale possa stare anche dentro una scheda.
 *
 * ⚠️ **Le finestre sono in ordine di accensione**: il livello ne accende le prime N, prese
 * scorrendo i palazzi in quest'ordine. A `off` la città resta, spenta — è il posto, non il tempo
 * che ci fa.
 */
export const CITTA: readonly Palazzo[] = [
  {
    left: '10%',
    w: 48,
    h: '36%',
    finestre: [
      { top: '16%', left: '16px', w: 4, h: 4, delay: '0.5s' },
      { top: '42%', left: '24px', w: 4, h: 4, delay: '1.2s' },
    ],
  },
  {
    left: '25%',
    w: 80,
    h: '71%',
    finestre: [
      { top: '16%', right: '16px', w: 4, h: 4, delay: '0.2s' },
      { top: '50%', left: '12px', w: 4, h: 8, delay: '2s' },
      { top: '66%', left: '40px', w: 4, h: 4, delay: '0.8s' },
    ],
  },
  {
    right: '15%',
    w: 64,
    h: '47%',
    finestre: [{ top: '38%', left: '20px', w: 8, h: 4, delay: '1.5s' }],
  },
  {
    right: '30%',
    w: 32,
    h: '24%',
    finestre: [{ top: '38%', right: '12px', w: 4, h: 4, delay: '2.5s' }],
  },
];

/** Quante finestre ha la città in tutto: il tetto oltre cui un livello non può accendere. */
export const FINESTRE_TOTALI = CITTA.reduce((somma, palazzo) => somma + palazzo.finestre.length, 0);

/**
 * **Lo skyline distopico**, in fondo al fondale: quattro sagome scure che salgono dal bordo, con
 * qualche finestra accesa che pulsa.
 *
 * È la scena di `ludoratti.it`, dove dice in un colpo solo dove siamo — una città, di notte, e
 * qualcuno è ancora sveglio. Non è un'icona e non si annuncia: è il posto.
 *
 * ⚠️ **Resta anche a livello spento, ma al buio.** Il livello dell'atmosfera governa ciò che si
 * muove, e una città non si muove: sono le sue finestre a farlo. A `off` sono zero, e restano le
 * sagome.
 */
export function PlagueCityscape({ windows }: { windows: number }) {
  // Quante finestre stanno **prima** di ogni palazzo: serve a sapere dove si ferma l'accensione
  // senza tenere un contatore che cambia dentro la mappatura.
  const primaDiMe = CITTA.map((_, i) =>
    CITTA.slice(0, i).reduce((somma, palazzo) => somma + palazzo.finestre.length, 0),
  );

  return (
    <div className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-gray-950 to-transparent">
      {CITTA.map((palazzo, i) => {
        const mie = palazzo.finestre.slice(0, Math.max(0, windows - primaDiMe[i]));

        return (
          <div
            key={`${palazzo.left ?? ''}${palazzo.right ?? ''}`}
            className="pb-city-block absolute bottom-0 bg-gray-900/80"
            style={{ left: palazzo.left, right: palazzo.right, width: palazzo.w, height: palazzo.h }}
          >
            {mie.map((finestra) => (
              <span
                key={`${finestra.top}${finestra.left ?? finestra.right}`}
                className="absolute animate-pulse bg-brand/50"
                style={{
                  top: finestra.top,
                  left: finestra.left,
                  right: finestra.right,
                  width: finestra.w,
                  height: finestra.h,
                  animationDelay: finestra.delay,
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
