'use client';

import type { CSSProperties, ReactNode } from 'react';

import { BiohazardIcon } from '../icons/BiohazardIcon';
import { PoisonIcon } from '../icons/PoisonIcon';
import { SkullIcon } from '../icons/SkullIcon';
import { VirusIcon } from '../icons/VirusIcon';
import type { IconProps } from '../icons/types';
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

/** Le tre gocce che colano dal bordo di sopra, in ordine di comparsa. */
const GOCCE = [
  { left: '28%', durata: '7s', ritardo: '0s' },
  { left: '55%', durata: '8s', ritardo: '1.6s' },
  { left: '74%', durata: '9s', ritardo: '3.2s' },
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
  /** Classi aggiuntive sul contenitore — la forma, il rientro, l'altezza minima. */
  className?: string;
  /** Classi aggiuntive sul riquadro che tiene il contenuto, se serve disporlo. */
  contentClassName?: string;
}

/**
 * **L'atmosfera della peste**: velo verde, icone che galleggiano, gocce che colano e bolle di gas
 * che salgono. Quanto ce n'è lo dice il livello di {@link ToxicLevelProvider}, che
 * {@link ToxicLevelSwitch} può cambiare da qualunque punto della pagina.
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
export function PlagueBackground({ children, className = '', contentClassName = '' }: PlagueBackgroundProps) {
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

        {GOCCE.slice(0, taratura.drips).map(({ left, durata, ritardo }) => (
          <span
            key={left}
            // ⚠️ La goccia è una **colonna alta quanto il fondale**, con il capo disegnato in cima:
            // `pb-drip` cade di `--pb-drip-distance`, e una percentuale in `translateY` conta
            // l'altezza dell'elemento. Data alla colonna, `100%` è esattamente l'altezza del
            // riquadro — dentro una scheda come su una pagina intera — e il `100vh` predefinito
            // della variabile non serve più. Il perno in alto fa allungare la goccia mentre cade,
            // invece di spostarla.
            className="absolute top-0 h-full w-1.5 origin-top animate-drip"
            style={
              {
                left,
                animationDuration: durata,
                animationDelay: ritardo,
                '--pb-drip-distance': '100%',
              } as CSSProperties
            }
          >
            <span className="block h-5 w-full rounded-b-full bg-brand/70" />
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
      </div>

      <div className={`relative ${contentClassName}`}>{children}</div>
    </div>
  );
}
