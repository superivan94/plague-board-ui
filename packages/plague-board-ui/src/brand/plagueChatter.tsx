'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { useReducedMotion } from '../hooks/useReducedMotion.js';
import type { RandomRange } from '../randomRange.js';
import { scegli } from './hoverEmitterPick.js';
import { TETTI } from './plagueCityscape.js';
import { TOXIC_LEVEL_SETTINGS } from './toxicLevel.js';
import { useToxicLevel } from './ToxicLevelProvider.js';

/** Un verso in scena: la chiave che ne fa un nodo nuovo, e dove e per quanto si vede. */
interface Verso {
  readonly key: number;
  readonly testo: string;
  readonly left: number;
  readonly top: number;
  /** Di quanto il fumetto arretra rispetto al punto: è ciò che lo tiene dentro il riquadro. */
  readonly ancoraggio: string;
  readonly vitaMs: number;
}

const fra = ([min, max]: RandomRange) => min + Math.random() * (max - min);

/**
 * Da che parte il fumetto si appoggia al punto in cui nasce.
 *
 * ⚠️ **Centrarlo sempre lo fa uscire dal riquadro**, e non di poco: un fumetto largo 180 px sopra
 * un palazzo al 10% di un fondale da 736 comincerebbe a −45 px, cioè mozzato. Contro il bordo
 * sinistro appoggia lo spigolo sinistro, contro il destro il destro, in mezzo si centra. Sta sulla
 * proprietà `translate` e non dentro la `transform`, perché la `transform` la scrive l'animazione.
 */
const ancoraggioPer = (x: number) => (x < 25 ? '0 0' : x > 75 ? '-100% 0' : '-50% 0');

export interface PlagueChatterProps {
  /** Che cosa dice la città. Vuoto la zittisce. */
  phrases: readonly string[];
}

/**
 * **I versi che escono dalla città**: un fumetto per volta che compare sopra un palazzo, dice la
 * sua e svanisce.
 *
 * È lo stesso easter egg di {@link HoverEmitter} con {@link comicBubbles}, ma **non si sfiora**:
 * qui non c'è niente da sfiorare, perché la città è un fondale. Esce da sé, e quanto spesso lo
 * dice il livello di {@link ToxicLevelProvider} — più gas in giro, più ratti che chiacchierano.
 *
 * ⚠️ **Nasce sopra i tetti, e i tetti non sono scritti qui**: le posizioni si ricavano da `TETTI`,
 * che le calcola dai palazzi. Spostare un palazzo sposta anche quello che gli esce dal tetto,
 * invece di lasciare un fumetto sospeso sul niente.
 *
 * ⚠️ **Vive dentro il fondale, non in un portale.** {@link HoverEmitter} manda i suoi fumetti in
 * un piano sopra tutto perché devono uscire dal riquadro che li genera; questi no — sbordando
 * passerebbero sopra il contenuto, che è il difetto che il fondale esiste per non avere.
 *
 * ⚠️ **Con `prefers-reduced-motion` non ne esce nessuno**, come per le bolle e per lo sciame: un
 * fumetto senza la sua animazione comparirebbe di colpo, resterebbe piantato tre secondi e
 * sparirebbe altrettanto bruscamente — cioè più movimento, non meno.
 */
export function PlagueChatter({ phrases }: PlagueChatterProps) {
  const { level } = useToxicLevel();
  const menoMovimento = useReducedMotion();
  const [versi, setVersi] = useState<readonly Verso[]>([]);
  const prossimaChiave = useRef(0);
  const ultimoTesto = useRef(-1);
  // Un timer per fumetto: le vite sono uguali, ma le nascite no, e scadono nell'ordine in cui
  // sono nati solo finché nessuno cambia livello a metà.
  const scadenze = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const taratura = TOXIC_LEVEL_SETTINGS[level];
  const { maxChatter } = taratura;
  const [attesaMin, attesaMax] = taratura.chatterEveryMs;

  // Le frasi e il tetto si leggono da un riferimento: un array scritto in linea dal genitore è
  // nuovo a ogni suo render, e un effetto che ne dipendesse rimetterebbe l'attesa a zero.
  const disegno = useRef({ phrases, maxChatter });
  useEffect(() => {
    disegno.current = { phrases, maxChatter };
  });

  useEffect(() => {
    if (menoMovimento || maxChatter === 0 || attesaMax === 0) return;

    let attesa: ReturnType<typeof setTimeout>;
    const prossimo = () => {
      attesa = setTimeout(() => {
        const corrente = disegno.current;

        // Il turno in secondo piano si salta, come per lo sciame e per le bolle: lì le animazioni
        // sono sospese, quindi nessun fumetto scadrebbe e al ritorno sarebbero tutti addosso.
        if (!document.hidden && corrente.phrases.length > 0) {
          const indice = scegli(corrente.phrases, ultimoTesto.current);
          ultimoTesto.current = indice;

          const tetto = TETTI[Math.floor(Math.random() * TETTI.length)];
          const chiave = prossimaChiave.current;
          prossimaChiave.current += 1;

          // ⚠️ Lo scarto è sul tetto, non sull'intera larghezza: «sparsi principalmente nelle zone
          // degli edifici» vuol dire che il fumetto deve sembrare uscire da un palazzo.
          const x = Math.min(97, Math.max(3, tetto.x + (Math.random() - 0.5) * 12));

          const verso: Verso = {
            key: chiave,
            testo: corrente.phrases[indice],
            left: x,
            top: tetto.y - 4 - Math.random() * 6,
            ancoraggio: ancoraggioPer(x),
            vitaMs: 3200,
          };

          // ⚠️ La scadenza si arma **fuori** dall'aggiornamento e prima di lui, per due motivi.
          // Perché React può chiamare quella funzione due volte, e lì dentro armerebbe due timer;
          // e perché un effetto che guardasse l'elenco dei vivi rifarebbe **tutti** i timer a ogni
          // nascita, allungando la vita a chi è già in scena. Se il tetto rifiuta il fumetto, il
          // timer scatta e non trova niente da togliere: costa un giro a vuoto e niente altro.
          scadenze.current.set(
            verso.key,
            setTimeout(() => {
              scadenze.current.delete(verso.key);
              setVersi((vivi) => vivi.filter((altro) => altro.key !== verso.key));
            }, verso.vitaMs),
          );

          setVersi((vivi) => (vivi.length >= corrente.maxChatter ? vivi : [...vivi, verso]));
        }

        prossimo();
      }, fra([attesaMin, attesaMax]));
    };

    prossimo();
    return () => clearTimeout(attesa);
  }, [attesaMin, attesaMax, maxChatter, menoMovimento]);

  // La mappa si copia adesso: in una pulizia, `scadenze.current` sarebbe letto allo smontaggio.
  useEffect(() => {
    const attese = scadenze.current;

    return () => attese.forEach(clearTimeout);
  }, []);

  return (
    <>
      {versi.map((verso) => (
        <span
          key={verso.key}
          className="pb-city-chatter"
          style={
            {
              left: `${verso.left.toFixed(1)}%`,
              top: `${verso.top.toFixed(1)}%`,
              translate: verso.ancoraggio,
              '--pb-chatter-duration': `${verso.vitaMs}ms`,
            } as CSSProperties
          }
        >
          {verso.testo}
        </span>
      ))}
    </>
  );
}
