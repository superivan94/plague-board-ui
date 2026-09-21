'use client';

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

import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { BiohazardIcon } from '../icons/BiohazardIcon.js';
import { MoleculeIcon } from '../icons/MoleculeIcon.js';
import { PoisonIcon } from '../icons/PoisonIcon.js';
import { SkullIcon } from '../icons/SkullIcon.js';
import { VirusIcon } from '../icons/VirusIcon.js';
import type { IconProps } from '../icons/types.js';
import type { RandomRange } from '../randomRange.js';
import { EffectLayer } from './effectLayer.js';

/** Che cosa si può chiedere a uno scoppio già montato, tenendone il riferimento. */
export interface ParticleBurstHandle {
  /**
   * Sprigiona adesso, e **dice quanto dura**: i millisecondi da aspettare perché l'ultima
   * particella sia sparita. Restituisce `0` quando non è partito niente — fontana già in corso,
   * oppure «meno movimento» — e quello zero è la risposta giusta a chi deve decidere se aspettare.
   *
   * ⚠️ **Serve perché il tempo lo sa solo lei.** Chi avvolge vorrebbe far succedere qualcosa a
   * scoppio finito — cambiare pagina, per esempio — e quel numero dipende da quante particelle
   * sono, da quanto ritardano l'una sull'altra e da quanto vola la più lenta. Ricopiarlo fuori
   * vorrebbe dire tenerlo in pari a mano per sempre.
   *
   * ⚠️ **Non fa niente se la fontana sta ancora zampillando**, o con «meno movimento». Due getti
   * sovrapposti non si leggono come due: si leggono come un pasticcio.
   */
  burst: () => number;
}

export interface ParticleBurstProps {
  /** Quello attorno a cui zampilla: un pulsante, una scheda, un numero. */
  children: ReactNode;
  /**
   * I segni che volano. Sono **componenti** e non nodi già resi, perché ognuno va creato con la
   * sua misura: la libreria ne pesca uno a caso per ogni particella.
   */
  icons?: readonly ComponentType<IconProps>[];
  /** Quante ne partono a ogni getto. */
  count?: number;
  /** Quanto si allargano di lato, in pixel: il valore si pesca e poi si tira a destra o a sinistra. */
  spreadPx?: RandomRange;
  /** Quanto salgono prima di ricadere, in pixel. È l'apice della parabola. */
  risePx?: RandomRange;
  /** Quanto scendono **sotto** il punto di partenza prima di svanire. */
  fallPx?: RandomRange;
  /** Quanto dura il volo di una particella, in millisecondi. */
  lifeMs?: RandomRange;
  /** Il lato del segno, in pixel. */
  sizePx?: RandomRange;
  /**
   * Quanto aspetta una particella rispetto alla precedente, in millisecondi. È quello che fa la
   * **fontana**: senza, partono tutte insieme e si legge come un'esplosione.
   */
  staggerMs?: number;
  /**
   * Le classi dei segni che volano.
   *
   * ⚠️ **Il colore va detto qui e non ereditato**: le particelle vivono in un portale sul `body`,
   * quindi `currentColor` è quello del corpo della pagina e non quello del comando che le ha
   * sprigionate — misurato il 2026-09-20, uscivano del colore del testo invece che verdi.
   */
  particleClassName?: string;
  /** Classi aggiuntive sul contenitore. */
  className?: string;
  /** Il riferimento con cui far zampillare: vedi {@link ParticleBurstHandle}. */
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

type Taratura = Required<
  Pick<ParticleBurstProps, 'icons' | 'spreadPx' | 'risePx' | 'fallPx' | 'lifeMs' | 'sizePx'>
>;

const fra = ([min, max]: RandomRange) => min + Math.random() * (max - min);
const destraOSinistra = () => (Math.random() < 0.5 ? 1 : -1);

/**
 * Una particella: una parabola sua, e un ritardo che la fa partire dopo quella di prima.
 *
 * ⚠️ **Non è un angolo sul giro intero: è un getto verso l'alto.** Una fontana si riconosce
 * perché tutto sale e tutto ricade; le direzioni pescate su 360° danno una girandola, che è un
 * altro gesto — e con l'apice a mezz'aria nemmeno si vedrebbe.
 */
const pesca = (
  key: number,
  taratura: Taratura,
  partenza: { readonly x: number; readonly y: number },
  ritardoMs: number,
) => {
  const vitaMs = fra(taratura.lifeMs);

  const particella: Particella = {
    key,
    Icon: taratura.icons[Math.floor(Math.random() * taratura.icons.length)],
    size: Math.round(fra(taratura.sizePx)),
    style: {
      // Coordinate della **finestra**: le particelle stanno nel portale sopra tutto, e il punto da
      // cui partono si misura al momento del getto.
      left: `${partenza.x.toFixed(1)}px`,
      top: `${partenza.y.toFixed(1)}px`,
      // ⚠️ Le quattro variabili che i fotogrammi leggono. Vanno scritte **tutte**: un `@keyframes`
      // a cui ne manca una non è invalido, ripiega sul valore di riserva, e la particella fa una
      // parabola che non è la sua senza che niente lo segnali.
      ['--pb-dx' as string]: `${(fra(taratura.spreadPx) * destraOSinistra()).toFixed(1)}px`,
      ['--pb-apex' as string]: `${(-fra(taratura.risePx)).toFixed(1)}px`,
      ['--pb-dy' as string]: `${fra(taratura.fallPx).toFixed(1)}px`,
      ['--pb-spin' as string]: `${(Math.random() * 540 - 270).toFixed(0)}deg`,
      animationDuration: `${(vitaMs / 1000).toFixed(2)}s`,
      animationDelay: `${ritardoMs}ms`,
    },
  };

  // Vive quanto il suo ritardo più il suo volo: toglierla prima la farebbe sparire a mezz'aria.
  return { particella, restaMs: ritardoMs + vitaMs };
};

/**
 * **La fontana di segni.** Avvolge qualunque cosa e, quando glielo si chiede, fa zampillare dal suo
 * centro una manciata di icone che salgono, si fermano un istante in alto e ricadono svanendo.
 *
 * È il premio di un gesto che vale la pena festeggiare: il comando delle donazioni lo usa, ma la
 * stessa cosa serve a un livello superato, a un salvataggio riuscito, a un ratto catturato. Per
 * questo è un componente a sé e non una parte di quel pulsante — e per questo le icone sono una
 * prop: {@link SEGNI_DELLA_PESTE} è quello che la peste ha in casa, non quello che ogni festa
 * deve usare.
 *
 * ⚠️ **Il grilletto è un `ref`, come nello sciame.** Chi avvolge sa **quando** festeggiare — un
 * clic, una risposta del server, la fine di una partita — e la fontana non ha modo di indovinarlo
 * ascoltando i clic dei figli: un pulsante dentro potrebbe essere «annulla».
 *
 * ⚠️ **Un getto alla volta.** Finché l'ultima particella non è svanita, `burst()` non fa niente:
 * due getti sovrapposti non si leggono come due, si leggono come un pasticcio. È anche il motivo
 * per cui premere due volte di fila non raddoppia lo spettacolo.
 *
 * ⚠️ **Le particelle non vivono qui dentro**, ma nel piano di {@link EffectLayer} — un portale sul
 * `body`, sopra le due lastre. Dentro le taglierebbe il primo antenato che nasconde il
 * traboccamento, e nella riga di una barra quell'antenato è obbligatorio.
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
  count = 16,
  spreadPx = [6, 70],
  risePx = [70, 150],
  fallPx = [30, 90],
  lifeMs = [900, 1400],
  sizePx = [12, 22],
  staggerMs = 28,
  particleClassName = 'text-brand-ink',
  className = '',
  ref,
}: ParticleBurstProps) {
  const menoMovimento = useReducedMotion();
  const [particelle, setParticelle] = useState<readonly Particella[]>([]);
  const contenitore = useRef<HTMLSpanElement>(null);
  const prossimaChiave = useRef(0);
  const scadenze = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  // Quante ne sono ancora per aria. È un riferimento e non lo stato perché `burst` lo legge da una
  // chiusura che non si ricrea mai.
  const inVolo = useRef(0);

  // Stessa trappola di sempre: `icons`, `spreadPx` e gli altri sono array, e un array scritto in
  // linea è nuovo a ogni render del genitore. Qui si leggono al momento del getto.
  const disegno = useRef({ icons, count, spreadPx, risePx, fallPx, lifeMs, sizePx, staggerMs, menoMovimento });
  useEffect(() => {
    disegno.current = { icons, count, spreadPx, risePx, fallPx, lifeMs, sizePx, staggerMs, menoMovimento };
  });

  const burst = useCallback(() => {
    const corrente = disegno.current;
    if (corrente.menoMovimento || corrente.icons.length === 0) return 0;
    if (inVolo.current > 0 || !contenitore.current) return 0;

    // Il centro si misura **adesso**, non a ogni render: è un gesto, e a un gesto una lettura del
    // layout si può pagare. Le coordinate sono quelle della finestra, come le vuole `fixed`.
    const riquadro = contenitore.current.getBoundingClientRect();
    const partenza = { x: riquadro.left + riquadro.width / 2, y: riquadro.top + riquadro.height / 2 };

    const nate: Particella[] = [];
    let ultima = 0;
    for (let quante = 0; quante < corrente.count; quante += 1) {
      const chiave = prossimaChiave.current;
      prossimaChiave.current += 1;

      const { particella, restaMs } = pesca(chiave, corrente, partenza, quante * corrente.staggerMs);
      nate.push(particella);
      ultima = Math.max(ultima, restaMs);

      scadenze.current.set(
        chiave,
        setTimeout(() => {
          scadenze.current.delete(chiave);
          inVolo.current -= 1;
          setParticelle((vive) => vive.filter((viva) => viva.key !== chiave));
        }, restaMs),
      );
    }

    inVolo.current = nate.length;
    // Un aggiornamento solo per tutto il getto: sedici `setState` di fila sarebbero sedici render,
    // e il primo fotogramma è proprio quello che deve arrivare in tempo.
    setParticelle((vive) => [...vive, ...nate]);

    // ⚠️ La più lunga, non la somma né l'ultima nata: le vite si pescano, quindi una particella
    // partita prima può sparire dopo una che è partita dopo di lei.
    return Math.round(ultima);
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

      {particelle.length > 0 && (
        <EffectLayer>
          {particelle.map(({ key, Icon, size, style }) => (
            <span key={key} className={`pb-particle ${particleClassName}`} style={style}>
              <Icon size={size} />
            </span>
          ))}
        </EffectLayer>
      )}
    </span>
  );
}
