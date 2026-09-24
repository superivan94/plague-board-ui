'use client';

import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * **Il piano su cui volano le cose effimere**: un portale sul `body`, sopra tutto, che non
 * intercetta il puntatore.
 *
 * ⚠️ **Esiste perché dentro non si può stare.** Un fumetto che nasce sopra una scheda, una cifra
 * che sale, una particella che scoppia: tutte escono dal riquadro che le ha generate, e basta un
 * antenato che nasconde il traboccamento per mozzarle. Nel piede dei Ludoratti quell'antenato è
 * **obbligatorio** — la riga deve tagliare, o non scorrerebbe di lato — e infatti lì i fumetti
 * della firma si vedevano a metà. Misurato il 2026-09-20.
 *
 * ⚠️ **Con `z-50` sta sopra anche alle due lastre**, che sono a `z-20`: un fumetto che vola sotto
 * la barra è tagliato uguale, solo in un altro modo.
 *
 * ⚠️ **Il prezzo è che le coordinate sono della finestra.** Chi lo usa misura il proprio riquadro
 * al momento in cui genera — una lettura del layout per gesto — e gli elementi dentro stanno in
 * `position: fixed`: se la pagina scorre mentre volano, restano dov'erano sullo schermo. Per
 * qualcosa che dura un secondo, è quello che ci si aspetta.
 */
export function EffectLayer({ children }: { children: ReactNode }) {
  // Sul server non c'è nessun `body` a cui appendersi. Non è un caso teorico: i componenti che lo
  // usano sono client, ma vengono resi anche nel prerender, dove `document` non esiste.
  if (typeof document === 'undefined') return null;

  return createPortal(
    <span aria-hidden className="pointer-events-none fixed inset-0 z-50">
      {children}
    </span>,
    document.body,
  );
}
