'use client';

import { useRef, type ReactNode } from 'react';

import { PoisonIcon } from '../icons/PoisonIcon';
import { ParticleBurst, type ParticleBurstHandle } from './ParticleBurst';

export interface SupportButtonProps {
  /** Dove si va a finire: la pagina delle donazioni. */
  href: string;
  /** Che cosa c'è scritto. È anche il nome accessibile, che resta anche quando il testo sparisce. */
  label?: string;
  /** Il segno. Senza, l'ampolla della peste. */
  icon?: ReactNode;
  /** Classi aggiuntive. */
  className?: string;
}

/**
 * **Il comando delle donazioni**, vestito da Ludoratti.
 *
 * ⚠️ **Il segno è l'ampolla della peste, e non il marchio di chi incassa** — scelto dall'utente:
 * «offrimi una pozione» invece di «offrimi un caffè». Di là quel segno è un `<img>` preso da
 * `storage.ko-fi.com` a ogni caricamento, cioè un'immagine remota su ogni pagina: è la stessa
 * famiglia del font di icone da CDN che questa libreria non usa, e in più lega l'aspetto del piede
 * a un server di qualcun altro. L'ampolla ce l'abbiamo in casa e segue il tema.
 *
 * ⚠️ **È vestito come una scheda autore, ed è voluto.** In un piede è l'unica cosa che chiede
 * qualcosa a chi legge: deve somigliare ai nomi che gli stanno accanto per non sembrare una
 * pubblicità, e insieme staccarsi abbastanza da farsi trovare. Il colore del marchio sul segno è
 * quello che fa il lavoro.
 *
 * ⚠️ **Sotto le 32rem di contenitore resta la sola ampolla**, e il nome accessibile no: il testo
 * si nasconde con una container query mentre `aria-label` porta la stessa parola sempre. Un
 * comando che si riduce a un segno senza nome è un comando muto.
 *
 * ⚠️ **Al clic sprigiona i segni della peste** — {@link ParticleBurst}, che è un componente a sé —
 * e la pagina delle donazioni si apre in una scheda nuova: lo scoppio resta da vedere su questa.
 */
export function SupportButton({
  href,
  label = 'Offrimi una pozione',
  icon = <PoisonIcon size={18} />,
  className = '',
}: SupportButtonProps) {
  const scoppio = useRef<ParticleBurstHandle>(null);

  return (
    <ParticleBurst ref={scoppio}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        // Un `<a>` risponde a Invio con un `click` vero, quindi qui non serve `usePress`: la
        // pressione lunga su un telefono, che era il motivo di quella scelta sulla mascotte, su un
        // collegamento non è il gesto con cui si apre.
        onClick={() => scoppio.current?.burst()}
        className={`flex items-center gap-1.5 rounded-lg border border-brand/40 px-2 py-1 text-sm font-medium text-brand-ink outline-none transition-colors hover:border-brand hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink ${className}`}
      >
        {icon}
        <span className="hidden @lg:inline">{label}</span>
      </a>
    </ParticleBurst>
  );
}
