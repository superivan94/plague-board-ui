'use client';

import { createPortal } from 'react-dom';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ComponentType,
  type ReactNode,
  type Ref,
} from 'react';

import { useReducedMotion } from '../hooks/useReducedMotion';
import { BiohazardIcon } from '../icons/BiohazardIcon';
import { MoleculeIcon } from '../icons/MoleculeIcon';
import { PoisonIcon } from '../icons/PoisonIcon';
import { SkullIcon } from '../icons/SkullIcon';
import { VirusIcon } from '../icons/VirusIcon';
import type { IconProps } from '../icons/types';
import type { RandomRange } from '../randomRange';

/** Che cosa si può chiedere a uno scoppio già montato, tenendone il riferimento. */
export interface ParticleBurstHandle {
  /** Sprigiona adesso. Con «meno movimento» non fa niente. */
  burst: () => void;
}

export interface ParticleBurstProps {
  /** Quello attorno a cui scoppia: un pulsante, una scheda, un numero. */
  children: ReactNode;
  /**
   * I segni che volano. Sono **componenti** e non nodi già resi, perché ognuno va creato con la
   * sua misura e il suo colore: la libreria ne pesca uno a caso per ogni particella.
   */
  icons?: readonly ComponentType<IconProps>[];
  /** Quante ne partono a ogni scoppio. */
  count?: number;
  /** Quanto lontano arrivano, in pixel dal centro. */
  spreadPx?: RandomRange;
  /** Quanto dura il volo, in millisecondi. */
  lifeMs?: RandomRange;
  /** Il lato del segno, in pixel. */
  sizePx?: RandomRange;
  /** Classi aggiuntive sul contenitore. */
  className?: string;
  /** Il riferimento con cui far scoppiare: vedi {@link ParticleBurstHandle}. */
  ref?: Ref<ParticleBurstHandle>;
}

/** I cinque della peste: sono quelli che l'utente ha chiesto, e sono già tutti nella libreria. */
const SEGNI_DELLA_PESTE: readonly ComponentType<IconProps>[] = [
  PoisonIcon,
  SkullIcon,
  MoleculeIcon,
  BiohazardIcon,
  VirusIcon,
];

interface Particella {
  readonly key: number;
  readonly Icon: ComponentType<IconProps>;
  readonly size: number;
  readonly style: CSSProperties;
}

const fra = ([min, max]: RandomRange) => min + Math.random() * (max - min);

/**
 * Una particella: un angolo a caso sull'intero giro, una distanza, una rotazione e una vita.
 *
 * ⚠️ **L'angolo si pesca in tutto il cerchio, non a ventaglio.** Uno scoppio che parte da un
 * comando deve sembrare venire da lì, e un ventaglio verso l'alto sembra invece una cosa che
 * *sale* — che è un altro gesto, quello delle notifiche.
 */
const pesca = (
  key: number,
  props: Required<Pick<ParticleBurstProps, 'icons' | 'spreadPx' | 'lifeMs' | 'sizePx'>>,
  partenza: { readonly x: number; readonly y: number },
) => {
  const angolo = Math.random() * Math.PI * 2;
  const distanza = fra(props.spreadPx);
  const vitaMs = fra(props.lifeMs);

  const particella: Particella = {
    key,
    Icon: props.icons[Math.floor(Math.random() * props.icons.length)],
    size: Math.round(fra(props.sizePx)),
    style: {
      // Coordinate della **finestra**: le particelle stanno in un portale sul `body`, e il punto
      // da cui partono si misura al momento dello scoppio.
      left: `${partenza.x.toFixed(1)}px`,
      top: `${partenza.y.toFixed(1)}px`,
      // ⚠️ Le tre variabili che i fotogrammi leggono. Vanno scritte **tutte e tre**: un
      // `@keyframes` con una variabile mancante non è invalido, ripiega sul valore di riserva e
      // la particella resta ferma al centro senza che niente lo segnali.
      ['--pb-dx' as string]: `${(Math.cos(angolo) * distanza).toFixed(1)}px`,
      ['--pb-dy' as string]: `${(Math.sin(angolo) * distanza).toFixed(1)}px`,
      ['--pb-spin' as string]: `${(Math.random() * 720 - 360).toFixed(0)}deg`,
      animationDuration: `${(vitaMs / 1000).toFixed(2)}s`,
    },
  };

  return { particella, vitaMs };
};

/**
 * **Lo scoppio di segni.** Avvolge qualunque cosa e, quando glielo si chiede, sprigiona dal suo
 * centro una manciata di icone che volano via girando e svaniscono.
 *
 * È il premio di un gesto che vale la pena festeggiare: il comando delle donazioni lo usa, ma la
 * stessa cosa serve a un livello superato, a un salvataggio riuscito, a un ratto catturato. Per
 * questo è un componente a sé e non una parte di quel pulsante — e per questo le icone sono una
 * prop: {@link SEGNI_DELLA_PESTE} è quello che la peste ha in casa, non quello che ogni festa
 * deve usare.
 *
 * ⚠️ **Il grilletto è un `ref`, come nello sciame.** Chi avvolge sa **quando** festeggiare — un
 * clic, una risposta del server, la fine di una partita — e lo scoppio non ha modo di indovinarlo
 * ascoltando i clic dei figli: un pulsante dentro potrebbe essere «annulla».
 *
 * ⚠️ **Le particelle non vivono qui dentro: stanno in un portale sul `body`.** Un antenato che
 * nasconde il traboccamento le taglierebbe a metà volo, e non è un caso raro: la riga di una
 * barra **deve** tagliare, o non scorrerebbe di lato. Misurato il 2026-09-20 nel piede del
 * playground, prima del portale se ne vedeva sì e no un terzo. Il prezzo è una lettura del layout
 * per scoppio — `getBoundingClientRect` sul contenitore — che a un gesto si può pagare, e delle
 * coordinate in `fixed`: se la pagina scorre durante il volo, le particelle restano dov'erano
 * sullo schermo. Per un secondo, è quello che ci si aspetta da uno scoppio.
 *
 * ⚠️ **Con `prefers-reduced-motion` non parte niente.** Senza animazione le particelle
 * comparirebbero **ferme e tutte insieme** attorno al comando, e resterebbero lì il loro secondo:
 * non è meno movimento, è un pasticcio immobile. La regola è la stessa dello sciame e
 * dell'emettitore, e chi deve spiegarlo a chi guarda legge la preferenza con
 * {@link useReducedMotion}.
 */
export function ParticleBurst({
  children,
  icons = SEGNI_DELLA_PESTE,
  count = 14,
  spreadPx = [40, 120],
  lifeMs = [700, 1200],
  sizePx = [12, 24],
  className = '',
  ref,
}: ParticleBurstProps) {
  const menoMovimento = useReducedMotion();
  const [particelle, setParticelle] = useState<readonly Particella[]>([]);
  const contenitore = useRef<HTMLSpanElement>(null);
  const prossimaChiave = useRef(0);
  const scadenze = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  // Stessa trappola di sempre: `icons`, `spreadPx` e gli altri sono array, e un array scritto in
  // linea è nuovo a ogni render del genitore. Qui si leggono al momento dello scoppio.
  const disegno = useRef({ icons, count, spreadPx, lifeMs, sizePx, menoMovimento });
  useEffect(() => {
    disegno.current = { icons, count, spreadPx, lifeMs, sizePx, menoMovimento };
  });

  const burst = useCallback(() => {
    const corrente = disegno.current;
    if (corrente.menoMovimento || corrente.icons.length === 0 || !contenitore.current) return;

    // Il centro si misura **adesso**, non a ogni render: è un gesto, e a un gesto una lettura del
    // layout si può pagare. Le coordinate sono quelle della finestra, come le vuole `fixed`.
    const riquadro = contenitore.current.getBoundingClientRect();
    const partenza = { x: riquadro.left + riquadro.width / 2, y: riquadro.top + riquadro.height / 2 };

    const nate: Particella[] = [];
    for (let quante = 0; quante < corrente.count; quante += 1) {
      const chiave = prossimaChiave.current;
      prossimaChiave.current += 1;

      const { particella, vitaMs } = pesca(chiave, corrente, partenza);
      nate.push(particella);

      scadenze.current.set(
        chiave,
        setTimeout(() => {
          scadenze.current.delete(chiave);
          setParticelle((vive) => vive.filter((viva) => viva.key !== chiave));
        }, vitaMs),
      );
    }

    // Un aggiornamento solo per tutto lo scoppio: quattordici `setState` di fila sarebbero
    // quattordici render, e il primo fotogramma è proprio quello che deve arrivare in tempo.
    setParticelle((vive) => [...vive, ...nate]);
  }, []);

  useImperativeHandle(ref, () => ({ burst }), [burst]);

  useEffect(() => {
    const attese = scadenze.current;

    return () => {
      attese.forEach(clearTimeout);
    };
  }, []);

  return (
    <span ref={contenitore} className={`inline-flex ${className}`}>
      {children}

      {/* ⚠️ **Le particelle vanno in un portale sul `body`, non qui dentro.** Qualunque antenato
          che nasconde il traboccamento le taglierebbe, e nel piede dei Ludoratti quell'antenato
          esiste per forza: la riga che scorre di lato **deve** tagliare, o non scorrerebbe.
          Misurato il 2026-09-20 prima del portale, dentro la riga se ne vedeva un terzo. */}
      {particelle.length > 0 &&
        createPortal(
          <span aria-hidden className="pointer-events-none">
            {particelle.map(({ key, Icon, size, style }) => (
              <span key={key} className="pb-particle" style={style}>
                <Icon size={size} />
              </span>
            ))}
          </span>,
          document.body,
        )}
    </span>
  );
}
