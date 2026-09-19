'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';

import { useReducedMotion } from '../hooks/useReducedMotion';
import type { RandomRange } from '../randomRange';
import type { HoverEffect } from './hoverEffects';

export interface HoverEmitterProps {
  /** Quello che si sfiora: una scheda, un nome, un'icona. L'emettitore non disegna niente di suo. */
  children: ReactNode;
  /**
   * La taratura: {@link comicBubbles}, {@link binaryRain}, o la propria. Si può scrivere in linea
   * — è un oggetto di soli numeri e stringhe, quindi passa anche da una pagina server — e cambiarla
   * mentre l'emettitore sputa vale dal giro dopo.
   */
  effect: HoverEffect;
  /**
   * Quanto dura la raffica dopo un tocco, in millisecondi.
   *
   * ⚠️ **Serve perché su un telefono non esiste «sopra».** Il dito non si posa e resta: tocca e
   * se ne va, e un emettitore appeso all'ingresso e all'uscita del puntatore darebbe un solo
   * elemento e poi il silenzio. Al tocco parte invece una raffica che si spegne da sé, e che
   * togliere il dito non interrompe.
   */
  tapMs?: number;
  /** Classi aggiuntive sul contenitore. */
  className?: string;
}

/** Un elemento in volo: la chiave che ne fa un nodo nuovo, e tutto ciò che serve a dipingerlo. */
interface Effimero {
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
 */
const scegli = (contents: readonly string[], ultimo: number) => {
  if (contents.length < 2 || ultimo < 0) return Math.floor(Math.random() * contents.length);

  const scelto = Math.floor(Math.random() * (contents.length - 1));

  return scelto >= ultimo ? scelto + 1 : scelto;
};

const pesca = (
  key: number,
  effect: HoverEffect,
  ultimo: number,
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
        left: `${fra(effect.left).toFixed(1)}%`,
        top: `${altezza(effect.top, effect.lanes, key).toFixed(1)}%`,
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

/**
 * **L'easter egg che si accende quando qualcuno ti sfiora**: finché il puntatore è sopra, sputa
 * elementi effimeri che nascono a caso attorno a quello che avvolge e se ne vanno da soli.
 *
 * È il meccanismo di `FooterAuthorCard` in RattInventario, dove le due schede in fondo alla pagina
 * ne hanno una copia a testa con un `if` sul **nome dell'autore** dentro: i fumetti dello
 * sviluppatore e la pioggia binaria dell'AI. Qui il meccanismo è uno e la differenza è una prop —
 * {@link comicBubbles} e {@link binaryRain} sono le due tarature di là, numero per numero.
 *
 * ⚠️ **Si aggancia ai pointer event, e su un telefono fa una cosa diversa.** Di là l'easter egg
 * sta su `onMouseEnter`/`onMouseLeave`, quindi **su un telefono non esiste**. Col mouse vale la
 * regola di sempre — entra, sputa; esce, smette — mentre col dito, che non può restare sopra,
 * il tocco fa partire una raffica di {@link HoverEmitterProps.tapMs} millisecondi che si spegne da
 * sé: togliere il dito non la interrompe.
 *
 * ⚠️ **Chi è nato arriva in fondo.** All'uscita del puntatore smette di generarne, ma quelli in
 * volo finiscono la loro animazione: con la pioggia binaria sono una ventina, e spegnerli insieme
 * sarebbe uno scatto che si vede. Nessuno di loro riparte: ogni elemento vive una volta sola e poi
 * sparisce, e a toglierlo è un **timer** e non `animationend` — che è il contrario di `RatRun`,
 * per un motivo preciso. Un ratto tolto in anticipo sparisce a metà schermo e si nota; un fumetto
 * alla fine di `pb-bubble-pop` è già trasparente, e l'istante esatto non lo vede nessuno. In
 * cambio, un timer arriva **anche quando l'animazione non c'è** — una taratura con una classe che
 * non anima niente non lascia in giro elementi per sempre — e non costringe l'emettitore a sapere
 * come si chiama l'animazione di una classe che gli arriva da fuori.
 *
 * ⚠️ **Due elementi di fila non si somigliano.** L'altezza gira per corsie — `lanes` nella
 * taratura — invece di pescarsi libera, così con tante corsie quanti ne vivono insieme non se ne
 * sovrappongono mai due; e il testo si pesca **fra gli altri**, mai quello appena uscito. Sono le
 * due cose che fanno sembrare corto un mazzo di frasi anche quando non lo è, e si vedono solo
 * restando col puntatore fermo per una decina di secondi.
 *
 * ⚠️ **Da fermo fa un cenno, ed è l'altra metà della portabilità.** Un easter egg che si scopre
 * solo passandoci sopra non si scopre affatto: chi guarda non ha motivo di provare. Il contenuto
 * avvolto porta quindi `pb-hover-hint` — un saltello di tre pixel ogni sei secondi — che si spegne
 * mentre l'emettitore sputa, perché lì il cenno l'ha già fatto il suo mestiere.
 *
 * ⚠️ **Con `prefers-reduced-motion` non esce niente, e non è un guasto.** Sotto quella preferenza
 * `animations.css` spegne le animazioni degli effimeri: un fumetto comparirebbe **fermo e di
 * colpo**, resterebbe piantato il suo paio di secondi e sparirebbe altrettanto bruscamente — cioè
 * più movimento di prima, non meno. Un easter egg è decorazione pura, e chi ha chiesto meno
 * movimento ottiene una pagina che sta ferma, cenno compreso. Se una pagina deve spiegarlo a chi
 * guarda, la preferenza si legge con {@link useReducedMotion}: è la differenza fra «la libreria
 * obbedisce» e «la libreria è rotta».
 *
 * ⚠️ **Quello che vola sborda, quindi niente `overflow-hidden` intorno.** I fumetti nascono
 * **sopra** il riquadro — `top` va da −70% a −10% — e le cifre gli escono ai lati: un antenato che
 * taglia li fa sparire a metà. Il contenitore che l'emettitore disegna è `relative` e non taglia
 * niente; il resto della colonna è di chi lo mette.
 */
export function HoverEmitter({ children, effect, tapMs = 3000, className = '' }: HoverEmitterProps) {
  const menoMovimento = useReducedMotion();
  const [effimeri, setEffimeri] = useState<readonly Effimero[]>([]);
  const [attivo, setAttivo] = useState(false);
  // La chiave fa due mestieri: rende nuovo ogni nodo, ed è il **turno** con cui si scelgono le
  // corsie. Cresce di uno alla volta e non torna mai indietro, che è quello che serve a entrambi.
  const prossimaChiave = useRef(0);
  const ultimoTesto = useRef(-1);

  // ⚠️ La taratura si legge da un riferimento e non dalle dipendenze di un effetto: `effect` è un
  // oggetto, e un oggetto scritto in linea è **nuovo a ogni render del genitore**. È la stessa
  // trappola degli array di `RatSwarm`, e qui morderebbe più forte, perché ogni ridisegno
  // rimetterebbe a zero la cadenza proprio mentre il puntatore è sopra.
  const disegno = useRef({ effect, menoMovimento });
  useEffect(() => {
    disegno.current = { effect, menoMovimento };
  });

  const cadenza = useRef<ReturnType<typeof setInterval>>(undefined);
  const raffica = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Un timer per elemento, perché le vite si pescano e non scadono in ordine di nascita.
  const scadenze = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const sputa = useCallback(() => {
    const corrente = disegno.current;
    if (corrente.menoMovimento || corrente.effect.contents.length === 0) return;

    const chiave = prossimaChiave.current;
    prossimaChiave.current += 1;

    const { effimero, vitaMs, indice } = pesca(chiave, corrente.effect, ultimoTesto.current);
    ultimoTesto.current = indice;
    setEffimeri((vivi) => [...vivi, effimero]);

    scadenze.current.set(
      chiave,
      setTimeout(() => {
        scadenze.current.delete(chiave);
        setEffimeri((vivi) => vivi.filter((vivo) => vivo.key !== chiave));
      }, vitaMs),
    );
  }, []);

  const smetti = useCallback(() => {
    clearInterval(cadenza.current);
    clearTimeout(raffica.current);
    cadenza.current = undefined;
    raffica.current = undefined;
    setAttivo(false);
  }, []);

  const comincia = useCallback(
    (durataMs?: number) => {
      if (disegno.current.menoMovimento) return;

      clearInterval(cadenza.current);
      clearTimeout(raffica.current);
      setAttivo(true);

      // Uno subito: un easter egg che si fa aspettare un secondo e mezzo non l'ha visto nessuno.
      sputa();
      // ⚠️ `setInterval` e non un `setTimeout` ricorsivo, al contrario dello sciame: lì l'attesa
      // si ripesca a ogni giro e un intervallo la valuterebbe una volta sola, qui è un numero
      // fisso e il ciclo è quello che serve.
      cadenza.current = setInterval(sputa, disegno.current.effect.everyMs);

      if (durataMs !== undefined) raffica.current = setTimeout(smetti, durataMs);
    },
    [smetti, sputa],
  );

  useEffect(() => {
    // La mappa si copia adesso: in una pulizia, `scadenze.current` sarebbe letto allo smontaggio.
    const attese = scadenze.current;

    return () => {
      clearInterval(cadenza.current);
      clearTimeout(raffica.current);
      attese.forEach(clearTimeout);
    };
  }, []);

  const entra = (evento: PointerEvent<HTMLSpanElement>) => {
    // Col dito l'ingresso **è** il tocco: il browser manda `pointerenter` prima di `pointerdown`.
    comincia(evento.pointerType === 'touch' ? tapMs : undefined);
  };

  const esce = (evento: PointerEvent<HTMLSpanElement>) => {
    // ⚠️ Il dito che si alza non spegne la raffica: a spegnerla è il suo timer. Senza questa riga
    // il tocco darebbe un elemento solo, che è il difetto che si stava correggendo.
    if (evento.pointerType !== 'touch') smetti();
  };

  return (
    <span
      className={`relative inline-flex ${className}`}
      onPointerEnter={entra}
      onPointerLeave={esce}
      onPointerCancel={esce}
    >
      {/* Il cenno sta su un involucro suo e non sul contenitore: sul contenitore trascinerebbe con
          sé anche gli effimeri, che sono posizionati rispetto a lui. */}
      <span className={attivo ? 'inline-flex' : 'pb-hover-hint inline-flex'}>{children}</span>

      <span aria-hidden className="pointer-events-none absolute inset-0">
        {effimeri.map((effimero) => (
          <span key={effimero.key} className={effimero.className} style={effimero.style}>
            {effimero.content}
          </span>
        ))}
      </span>
    </span>
  );
}
