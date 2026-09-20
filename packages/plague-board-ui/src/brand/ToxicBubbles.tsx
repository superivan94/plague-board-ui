'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';

import { useReducedMotion } from '../hooks/useReducedMotion';
import type { RandomRange } from '../randomRange';
import { TOXIC_LEVEL_SETTINGS, type ToxicLevelSettings } from './toxicLevel';
import { useToxicLevel } from './ToxicLevelProvider';

/** Una bolla in volo: la chiave che ne fa un nodo nuovo, e i numeri che la disegnano. */
interface Bolla {
  readonly key: number;
  /** Dove nasce, in percentuale della larghezza. È il centro della bolla, non il suo bordo. */
  readonly left: number;
  readonly size: number;
  readonly riseMs: number;
  readonly swayPx: number;
  readonly swayMs: number;
}

const fra = ([min, max]: RandomRange) => min + Math.random() * (max - min);

const pesca = (key: number, taratura: ToxicLevelSettings): Bolla => {
  const size = fra(taratura.bubbleSize);

  return {
    key,
    left: Math.random() * 100,
    size,
    riseMs: fra(taratura.bubbleRiseMs),
    // ⚠️ L'ondeggiamento è una **frazione del diametro**, non un numero di pixel: di là erano
    // 15–40 px per bolle da 20 a 90, quindi le piccole sbandavano di due volte la loro larghezza
    // e le grandi si limitavano a tremare.
    swayPx: size * (0.2 + Math.random() * 0.35),
    swayMs: 2000 + Math.random() * 3000,
  };
};

/**
 * **Le bolle di gas che salgono dal fondo.** Quante, quanto grandi e ogni quanto lo dice il
 * livello di {@link ToxicLevelProvider}; dove nascono e quanto ondeggiano, il caso.
 *
 * Va dentro un genitore `relative` con `overflow-hidden` — di solito {@link PlagueBackground}, che
 * le monta già da sé — e non disegna nessun contenitore suo: la salita è lunga quanto quel
 * genitore è alto, qualunque sia la sua altezza.
 *
 * ⚠️ **Stanno dietro**, non davanti. In RattInventario il loro riquadro è `fixed inset-0 z-10` e il
 * pannello di accesso è `relative` senza `z-index`: misurato il 2026-09-20 sul sito vivo, le bolle
 * passano **sopra** il testo e per un secondo non si legge più. Un fondale che copre il contenuto
 * non è un fondale.
 *
 * ⚠️ **Con `prefers-reduced-motion` non ne nasce nessuna**, come per lo sciame di ratti: qui una
 * bolla è solo un movimento, e senza movimento non resta niente da guardare. Non è un guasto, è la
 * preferenza che viene rispettata.
 *
 * ⚠️ **Con la pagina in secondo piano non ne nasce nessuna.** Lì il browser sospende le animazioni:
 * `animationend` non arriva, nessuna bolla se ne va, e al ritorno si troverebbe il tetto pieno di
 * bolle ferme al punto di partenza.
 */
export function ToxicBubbles() {
  const { level } = useToxicLevel();
  const menoMovimento = useReducedMotion();
  const [bolle, setBolle] = useState<readonly Bolla[]>([]);
  const prossimaChiave = useRef(0);

  const taratura = TOXIC_LEVEL_SETTINGS[level];
  const { maxBubbles } = taratura;
  const [attesaMin, attesaMax] = taratura.bubbleEveryMs;

  // Ciò che serve al momento di pescare sta in un riferimento: `bubbleSize` e gli altri sono
  // array, e un array è un oggetto nuovo a ogni render di chi lo scrive.
  const disegno = useRef(taratura);
  useEffect(() => {
    disegno.current = taratura;
  });

  // ⚠️ Cambiare livello **non** spazza via le bolle già in volo: sparirebbero a mezz'aria, e chi
  // ha appena abbassato il livello vedrebbe un guasto invece di una scena che si dirada. Smettono
  // di nascerne, e quelle che ci sono finiscono la loro salita.
  useEffect(() => {
    if (menoMovimento || maxBubbles === 0) return;

    // `setTimeout` ricorsivo e non `setInterval`: l'intervallo di un `setInterval` si valuta una
    // volta sola, quindi l'attesa non si ripescherebbe più.
    let attesa: ReturnType<typeof setTimeout>;
    const prossima = () => {
      attesa = setTimeout(() => {
        if (!document.hidden) {
          const bolla = pesca(prossimaChiave.current, disegno.current);
          prossimaChiave.current += 1;
          setBolle((vive) => (vive.length >= disegno.current.maxBubbles ? vive : [...vive, bolla]));
        }
        prossima();
      }, fra([attesaMin, attesaMax]));
    };

    prossima();
    return () => clearTimeout(attesa);
  }, [attesaMin, attesaMax, maxBubbles, menoMovimento]);

  const rimuovi = useCallback((key: number) => {
    setBolle((vive) => vive.filter((bolla) => bolla.key !== key));
  }, []);

  return (
    <>
      {bolle.map((bolla) => (
        <span
          key={bolla.key}
          className="pb-toxic-bubble"
          style={{ left: `${bolla.left.toFixed(2)}%`, '--pb-toxic-rise-duration': `${Math.round(bolla.riseMs)}ms` } as CSSProperties}
          // ⚠️ Il filtro sul nome non è prudenza: l'ondeggiamento è un'animazione **infinita su un
          // figlio**, e il suo evento passa di qui salendo. Senza filtro, la prima bolla se ne
          // andrebbe al primo respiro laterale — e solo quando l'ondeggiamento finisse, cioè mai.
          // Ma il gonfiarsi, che finisce, la toglierebbe a metà schermo.
          onAnimationEnd={(evento) => {
            if (evento.animationName === 'pb-toxic-rise') rimuovi(bolla.key);
          }}
        >
          <span
            className="pb-toxic-bubble-skin"
            style={
              {
                '--pb-toxic-size': `${Math.round(bolla.size)}px`,
                '--pb-toxic-sway': `${bolla.swayPx.toFixed(1)}px`,
                '--pb-toxic-sway-duration': `${Math.round(bolla.swayMs)}ms`,
                '--pb-toxic-rise-duration': `${Math.round(bolla.riseMs)}ms`,
              } as CSSProperties
            }
          />
        </span>
      ))}
    </>
  );
}
