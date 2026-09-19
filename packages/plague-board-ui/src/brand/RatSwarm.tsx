'use client';

import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';

import { useReducedMotion } from '../hooks/useReducedMotion';
import { RAT_LIVERIES, type RatLivery } from './Rat';
import { RatRun, type RatRunProps } from './RatRun';

/** Gli estremi fra cui si pesca, compresi. Scriverli uguali vuol dire «sempre questo». */
export type RatSwarmRange = readonly [number, number];

/** Che cosa si può chiedere a uno sciame già montato, tenendone il riferimento. */
export interface RatSwarmHandle {
  /**
   * Fa entrare un ratto adesso, senza aspettare il turno — il clic sul titolo che in
   * RattInventario ne fa uscire uno. Il tetto di `maxAlive` vale anche qui, e con meno movimento
   * non fa niente.
   */
  spawn: () => void;
}

export interface RatSwarmProps {
  /**
   * Ogni quanto entra un ratto, in millisecondi: l'attesa si ripesca **a ogni giro** fra i due
   * estremi, così il passaggio non diventa un metronomo. Vale anche per il primo.
   *
   * Il valore predefinito è quello di tre dei quattro posti di RattInventario; la prop c'è perché
   * la stessa pagina può volerne una frequenza diversa in punti diversi.
   */
  everyMs?: RatSwarmRange;
  /** Quanto dura una traversata, in millisecondi: 4–6 secondi, come i ratti di RattInventario. */
  crossingMs?: RatSwarmRange;
  /**
   * La fascia in cui passano, in percentuale dell'altezza del contenitore. Si stringe quando il
   * contenitore è basso, o i ratti in fondo escono per metà dal bordo.
   */
  band?: RatSwarmRange;
  /**
   * Quanti ratti al massimo insieme. **Senza, non c'è tetto**: con le attese predefinite ne
   * passano meno di uno alla volta, e chi vuole una scena affollata non deve chiedere il permesso.
   *
   * È una scelta di regia — «al massimo quattro», «uno per volta» — non una rete di sicurezza: che
   * i ratti non si accumulino in una scheda dimenticata lo garantisce il fatto che con la pagina
   * nascosta non ne nasce nessuno.
   */
  maxAlive?: number;
  /** L'altezza del ratto in pixel, uguale per tutti. */
  size?: number;
  /** Il riferimento con cui far uscire un ratto a comando: vedi {@link RatSwarmHandle}. */
  ref?: Ref<RatSwarmHandle>;
}

/** Un ratto pescato: la chiave che ne fa un nodo nuovo, e le prop con cui attraversa. */
interface Passaggio {
  readonly key: number;
  readonly ratto: Pick<RatRunProps, 'livery' | 'hasSkull' | 'hasCollar' | 'hasVial' | 'from' | 'top' | 'duration'>;
}

const LIVREE = Object.keys(RAT_LIVERIES) as RatLivery[];

const fra = ([min, max]: RatSwarmRange) => min + Math.random() * (max - min);
const testaOCroce = () => Math.random() < 0.5;

const pesca = (key: number, crossingMs: RatSwarmRange, band: RatSwarmRange): Passaggio => ({
  key,
  ratto: {
    livery: LIVREE[Math.floor(Math.random() * LIVREE.length)],
    hasSkull: testaOCroce(),
    hasCollar: testaOCroce(),
    hasVial: testaOCroce(),
    from: testaOCroce() ? 'left' : 'right',
    top: `${fra(band).toFixed(1)}%`,
    duration: fra(crossingMs) / 1000,
  },
});

/**
 * **I ratti che attraversano la pagina ogni tanto**: quanti, ogni quanto, con che livrea e con che
 * cosa addosso.
 *
 * È il ciclo che in RattInventario sta scritto **quattro volte** — `useRunningRats`,
 * `AuthenticatedHome`, `AnonymousLanding`, `PublicCatalogView` — e ogni copia con numeri suoi, da
 * «uno ogni 1–3 secondi» a «uno ogni 5–15». Qui il ciclo è uno e i numeri sono prop, perché la
 * stessa applicazione può volere un passaggio fitto su una schermata e raro su un'altra.
 *
 * Va dentro un genitore `relative` con `overflow-hidden` — una fascia a tutta larghezza, o un
 * riquadro `fixed inset-0` per tutta la finestra — e non disegna nessun contenitore suo: il posto
 * lo sceglie chi lo mette. Il caso — quale ratto, da che lato, a che altezza, quanto ci mette —
 * è tutto qui dentro; {@link RatRun} riceve prop esplicite e non sa niente di casualità.
 *
 * ⚠️ **Con `prefers-reduced-motion` non genera niente, e non è un guasto.** La traversata in quel
 * caso dura un millisecondo — così `onDone` arriva subito e nessun ratto resta piantato a metà
 * schermo — quindi generarne vorrebbe dire tenere acceso un timer per dipingere guizzi che nessuno
 * vede. Uno sciame è decorazione pura, e chi ha chiesto meno movimento ottiene una pagina ferma.
 * Se una pagina deve spiegarlo a chi guarda, la preferenza si legge con {@link useReducedMotion}:
 * è la differenza fra «la libreria obbedisce» e «la libreria è rotta».
 *
 * ⚠️ **Con la pagina in secondo piano non ne nasce nessuno.** Lì il browser sospende le
 * animazioni: `animationend` non arriva, nessun ratto esce, e i timer intanto continuano a
 * scorrere. Generare vorrebbe dire impilare ratti fermi che nessuno vede e nessuno toglie, e
 * ritrovarseli tutti addosso al ritorno. Chi stava già attraversando resta dov'è e riparte da lì.
 *
 * ⚠️ **Chi ha finito se ne va, e chi resta sono nodi nuovi.** La fine la dice `animationend`
 * dentro `RatRun`, non un timer; ogni passaggio ha una chiave che non si riusa, perché un
 * contenitore riusato non farebbe ripartire la traversata.
 */
export function RatSwarm({
  everyMs = [5000, 15000],
  crossingMs = [4000, 6000],
  band = [15, 85],
  maxAlive = Number.POSITIVE_INFINITY,
  size = 48,
  ref,
}: RatSwarmProps) {
  const menoMovimento = useReducedMotion();
  const [passaggi, setPassaggi] = useState<readonly Passaggio[]>([]);
  const prossimaChiave = useRef(0);

  // ⚠️ Ciò che serve al momento di pescare sta in un riferimento, non fra le dipendenze di un
  // effetto: `everyMs`, `crossingMs` e `band` sono array, e un array scritto in linea è **nuovo a
  // ogni render del genitore**. Un effetto che ne dipendesse rimetterebbe l'attesa a zero a ogni
  // ridisegno, e sotto un genitore vivace non uscirebbe mai un ratto.
  const disegno = useRef({ crossingMs, band, maxAlive, menoMovimento });
  useEffect(() => {
    disegno.current = { crossingMs, band, maxAlive, menoMovimento };
  });

  const spawn = useCallback(() => {
    const corrente = disegno.current;
    if (corrente.menoMovimento) return;

    // La chiave si prende **fuori** dall'aggiornamento: quella funzione React può chiamarla due
    // volte, e deve poter essere ripetuta senza conseguenze.
    const passaggio = pesca(prossimaChiave.current, corrente.crossingMs, corrente.band);
    prossimaChiave.current += 1;
    setPassaggi((vivi) => (vivi.length >= corrente.maxAlive ? vivi : [...vivi, passaggio]));
  }, []);

  useImperativeHandle(ref, () => ({ spawn }), [spawn]);

  const [attesaMin, attesaMax] = everyMs;
  useEffect(() => {
    if (menoMovimento) return;

    // ⚠️ `setTimeout` ricorsivo e non `setInterval`: l'intervallo di un `setInterval` si valuta
    // **una volta sola**, quindi un `Math.random()` dentro fisserebbe la stessa attesa per tutta
    // la vita del componente invece di ripescarla. È il difetto che l'originale si era già
    // trovato e corretto una volta, in `useRunningRats`.
    let attesa: ReturnType<typeof setTimeout>;
    const prossimo = () => {
      attesa = setTimeout(() => {
        // ⚠️ Il turno in secondo piano si **salta**, non si rimanda: un ratto nato lì non
        // attraversa (le animazioni sono sospese), non esce, e nessuno lo toglie. Il giro
        // successivo si programma comunque, così al ritorno il passaggio riprende da sé.
        if (!document.hidden) spawn();
        prossimo();
      }, fra([attesaMin, attesaMax]));
    };

    prossimo();
    return () => clearTimeout(attesa);
  }, [attesaMin, attesaMax, menoMovimento, spawn]);

  const rimuovi = useCallback((key: number) => {
    setPassaggi((vivi) => vivi.filter((passaggio) => passaggio.key !== key));
  }, []);

  return (
    <>
      {passaggi.map((passaggio) => (
        <RatRun key={passaggio.key} {...passaggio.ratto} size={size} onDone={() => rimuovi(passaggio.key)} />
      ))}
    </>
  );
}
