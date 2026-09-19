'use client';

import { useRef, type MouseEvent, type ReactNode } from 'react';

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
 * ⚠️ **Al clic zampilla, e la pagina delle donazioni si apre _dopo_.** Con `target="_blank"` e
 * basta, il browser porta subito chi ha premuto sulla scheda nuova e la fontana non la vede
 * nessuno — segnalato dall'utente. Il comando chiede quindi a {@link ParticleBurst} **quanto dura
 * il getto**, ferma la navigazione per quel tanto e poi apre. Non è un numero scritto qui: dipende
 * da quante particelle sono e da quanto vola la più lenta, e a saperlo è solo lei.
 */
export function SupportButton({
  href,
  label = 'Offrimi una pozione',
  icon = <PoisonIcon size={18} />,
  className = '',
}: SupportButtonProps) {
  const scoppio = useRef<ParticleBurstHandle>(null);

  const vai = (evento: MouseEvent<HTMLAnchorElement>) => {
    // ⚠️ **I clic speciali restano del browser.** Ctrl o cmd per aprire in una scheda, shift per
    // una finestra, il tasto centrale: sono gesti che chi legge si aspetta, e intercettarli per
    // fare una cosa nostra è il modo più veloce di rendere antipatico un collegamento.
    if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey || evento.button !== 0) {
      return;
    }

    const durataMs = scoppio.current?.burst() ?? 0;
    // Niente da guardare — «meno movimento», o una fontana già in corso: si va subito, come un
    // collegamento qualunque.
    if (durataMs === 0) return;

    evento.preventDefault();
    window.setTimeout(() => {
      // ⚠️ **`window.open` dentro un timer funziona ancora**, perché l'attivazione che il clic
      // concede dura qualche secondo e non finisce con la funzione. Se però qualcuno blocca le
      // finestre nuove, `open` torna `null`: lì si va nella stessa scheda, che è meglio di un
      // comando che non fa niente.
      const aperta = window.open(href, '_blank', 'noopener,noreferrer');
      if (!aperta) window.location.href = href;
    }, durataMs);
  };

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
        onClick={vai}
        className={`flex items-center gap-1.5 rounded-lg border border-brand/40 px-2 py-1 text-sm font-medium text-brand-ink outline-none transition-colors hover:border-brand hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink ${className}`}
      >
        {icon}
        <span className="hidden @lg:inline">{label}</span>
      </a>
    </ParticleBurst>
  );
}
