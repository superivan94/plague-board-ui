'use client';

import type { CSSProperties, ReactNode } from 'react';

import { BiohazardIcon } from '../icons/BiohazardIcon';
import { DripIcon } from '../icons/DripIcon';
import { PoisonIcon } from '../icons/PoisonIcon';
import { SkullIcon } from '../icons/SkullIcon';
import { VirusIcon } from '../icons/VirusIcon';
import type { IconProps } from '../icons/types';
import { RAT_PHRASES } from '../data/phrases';
import { PlagueChatter } from './plagueChatter';
import { PlagueCityscape } from './plagueCityscape';
import { ToxicBubbles } from './ToxicBubbles';
import { TOXIC_LEVEL_SETTINGS } from './toxicLevel';
import { useToxicLevel } from './ToxicLevelProvider';

/** Un'icona ferma in un punto del fondale, che sale e scende. */
interface Galleggiante {
  readonly Icon: (props: IconProps) => ReactNode;
  readonly size: number;
  readonly top: string;
  readonly left: string;
  readonly delay: string;
}

/**
 * Le sei icone del fondale, in ordine di comparsa: il livello ne prende le prime N.
 *
 * ⚠️ **Le posizioni sono dichiarate, non pescate.** Un `Math.random()` qui rompe l'idratazione —
 * il server sceglie un punto e il client un altro, React butta l'HTML e ridisegna la pagina. Sei
 * posizioni scritte a mano sono anche più affidabili di sei a caso: si può garantire che nessuna
 * cada sopra un'altra, e che la colonna centrale — dove di solito sta il contenuto — resti sgombra.
 *
 * ⚠️ **Il verde è `plague-400` con l'alfa dentro**, non il lime del marchio: la regola della
 * direzione dice «la malattia — `plague-400`: icone, fondali, stati». Il lime resta alle gocce e a
 * quello che sta sopra il fondale.
 */
const GALLEGGIANTI: readonly Galleggiante[] = [
  { Icon: PoisonIcon, size: 34, top: '12%', left: '7%', delay: '0s' },
  { Icon: SkullIcon, size: 28, top: '20%', left: '85%', delay: '1.4s' },
  { Icon: BiohazardIcon, size: 36, top: '70%', left: '13%', delay: '2.6s' },
  { Icon: VirusIcon, size: 30, top: '62%', left: '88%', delay: '0.8s' },
  { Icon: PoisonIcon, size: 24, top: '42%', left: '30%', delay: '3.4s' },
  { Icon: SkullIcon, size: 26, top: '34%', left: '70%', delay: '2s' },
];

/**
 * Le tre gocce che colano dal bordo di sopra, in ordine di comparsa.
 *
 * ⚠️ **Le x coprono tutta la larghezza.** Su `ludoratti.it` le tre cadono al 40, 55 e 60 per cento
 * perché escono da sotto l'intestazione, che è larga la metà della pagina; qui devono bagnare un
 * fondale intero, e stipate in mezzo sembravano una perdita sola.
 *
 * ⚠️ **E sono meno stirate.** Le tre di là — 8×32, 12×48, 8×24 — stanno fra il triplo e il
 * quadruplo della loro larghezza, mentre il disegno ne è alto due volte e mezzo: `DripIcon` si
 * lascia stirare, e stirata di un altro 60% smette di essere una goccia e diventa una lama.
 * Qui la più grande scende da 12×48 a 10×26.
 */
const GOCCE = [
  { left: '12%', w: 8, h: 22, durata: '8s', ritardo: '0.2s' },
  { left: '47%', w: 10, h: 26, durata: '7s', ritardo: '1.5s' },
  { left: '83%', w: 7, h: 18, durata: '9s', ritardo: '3s' },
];

/**
 * Le tre chiazze di luce del fondale, in un'unica immagine.
 *
 * ⚠️ Stanno in uno `style` e non in classi `bg-[radial-gradient(…)]`: un gradiente arbitrario di
 * Tailwind con virgole e `rgb(… / …)` dentro è una riga che non si rilegge, e qui i gradienti sono
 * tre. Il colore resta comunque quello del tema — `plague-500`, `toxic`, `brand` — scritto per
 * esteso perché un'immagine di fondo non legge le variabili delle utility.
 */
const CHIAZZE: CSSProperties = {
  backgroundImage: [
    'radial-gradient(circle at 20% 50%, rgb(34 197 94 / 0.13), transparent 60%)',
    'radial-gradient(circle at 80% 20%, rgb(0 255 0 / 0.07), transparent 55%)',
    'radial-gradient(circle at 45% 88%, rgb(163 230 53 / 0.05), transparent 55%)',
  ].join(', '),
};

export interface PlagueBackgroundProps {
  /** Quello che sta **sopra** il fondale: la pagina, un pannello, una scheda. */
  children?: ReactNode;
  /**
   * Che cosa dice la città. Il valore predefinito sono le frasi del ratto — è la voce di casa —
   * e un elenco vuoto la zittisce senza togliere niente altro.
   */
  phrases?: readonly string[];
  /** Classi aggiuntive sul contenitore — la forma, il rientro, l'altezza minima. */
  className?: string;
  /** Classi aggiuntive sul riquadro che tiene il contenuto, se serve disporlo. */
  contentClassName?: string;
}

/**
 * **L'atmosfera della peste**: la città distopica in fondo, il velo verde, le icone che
 * galleggiano, le gocce che colano e le bolle di gas che salgono da dietro i palazzi. Quanto ce
 * n'è lo dice il livello di {@link ToxicLevelProvider}, che {@link ToxicLevelSwitch} può cambiare
 * da qualunque punto della pagina.
 *
 * La scena è quella di `ludoratti.it` — è la pagina della corporazione, quindi è lei a dire come
 * si veste un fondale dei Ludoratti; da RattInventario vengono le bolle e il velo. ⚠️ **La città
 * resta a ogni livello, anche a `off`, e le sue finestre sfarfallano sempre**: il livello dice
 * quanto gas c'è in giro, e la corrente di una città non c'entra. Quello che il livello governa
 * sono i **versi** che ne escono, cioè i ratti che ci abitano.
 *
 * **Avvolge il contenuto invece di stargli sotto**, ed è una scelta: così non c'è niente da
 * ricordarsi. In RattInventario il fondale è un fratello del pannello e le bolle stanno in un
 * riquadro `fixed z-10` — misurato il 2026-09-20 sul sito vivo, passano **sopra** il testo e per
 * un secondo non si legge. Qui gli strati e il contenuto sono due figli dello stesso riquadro, in
 * quest'ordine: chi scrive la pagina non può sbagliare l'impilamento perché non lo tocca.
 *
 * **Sta dentro il riquadro che lo ospita**, non sulla finestra: `absolute inset-0`, non `fixed`.
 * Una pagina intera si ottiene dandogli `min-h-dvh`; una scheda, mettendocelo dentro. Il `fixed`
 * avrebbe il difetto di agganciarsi al primo antenato con una `transform`, e non si potrebbe
 * contenere in nessun riquadro.
 *
 * ⚠️ **Resta scuro nei due temi, quindi porta `dark` addosso.** È la stessa regola delle lastre
 * della barra: senza quella classe, i token di HeroUI e i nostri `*-ink` dentro il contenuto
 * leggerebbero il tema della **pagina** e scriverebbero scuro su scuro.
 *
 * @example
 * ```tsx
 * <ToxicLevelProvider>
 *   <PlagueBackground className="min-h-dvh p-8">
 *     <LoginPanel />
 *   </PlagueBackground>
 * </ToxicLevelProvider>
 * ```
 */
export function PlagueBackground({
  children,
  phrases = RAT_PHRASES,
  className = '',
  contentClassName = '',
}: PlagueBackgroundProps) {
  const { level } = useToxicLevel();
  const taratura = TOXIC_LEVEL_SETTINGS[level];

  return (
    <div className={`dark relative overflow-hidden bg-gray-950 ${className}`}>
      {/* ⚠️ L'`aria-hidden` sta su questo strato e non sul contenitore: su un antenato del
          contenuto nasconderebbe la pagina intera, che è l'opposto di «decorativo». */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Il velo sfuma invece di scattare: cambiare livello è un gesto, e uno stacco secco
            sembrerebbe un lampo di pagina sbagliata. */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${taratura.hazeClass}`} style={CHIAZZE} />

        {GOCCE.slice(0, taratura.drips).map(({ left, w, h, durata, ritardo }) => (
          <span
            key={left}
            // ⚠️ La goccia è una **colonna alta quanto il fondale**, con la goccia disegnata in
            // cima: `pb-drip` cade di `--pb-drip-distance`, e una percentuale in `translateY`
            // conta l'altezza dell'elemento. Data alla colonna, `100%` è esattamente l'altezza del
            // riquadro — dentro una scheda come su una pagina intera — e il `100vh` predefinito
            // della variabile non serve più. Il perno in alto fa allungare la goccia mentre cade,
            // invece di spostarla.
            className="absolute top-0 h-full origin-top animate-drip"
            style={
              {
                left,
                width: w,
                animationDuration: durata,
                animationDelay: ritardo,
                '--pb-drip-distance': '100%',
              } as CSSProperties
            }
          >
            <DripIcon size={w} height={h} className="block text-brand/70" />
          </span>
        ))}

        {GALLEGGIANTI.slice(0, taratura.floaters).map(({ Icon, size, top, left, delay }, i) => (
          <span
            key={`${top}-${left}-${i}`}
            className="absolute animate-float"
            style={{ top, left, animationDelay: delay, animationDuration: '7s' }}
          >
            <Icon size={size} color="#4ade8038" />
          </span>
        ))}

        <ToxicBubbles />

        {/* ⚠️ La città è **davanti** a tutto il resto: le bolle salgono da dietro i palazzi, che è
            il modo in cui un gas esce da una città e non da un riquadro. */}
        <PlagueCityscape />

        {/* I versi vengono **dopo** la città, perché escono dai tetti e devono passarci sopra. */}
        <PlagueChatter phrases={phrases} />
      </div>

      <div className={`relative ${contentClassName}`}>{children}</div>
    </div>
  );
}
