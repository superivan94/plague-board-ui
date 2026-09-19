'use client';

import { useSyncExternalStore } from 'react';

const DOMANDA = '(prefers-reduced-motion: reduce)';

const sottoscrivi = (avvisa: () => void) => {
  const preferenza = window.matchMedia(DOMANDA);
  preferenza.addEventListener('change', avvisa);
  return () => preferenza.removeEventListener('change', avvisa);
};

const quiEOra = () => window.matchMedia(DOMANDA).matches;

const sulServer = () => false;

/**
 * **`true` se chi guarda ha chiesto meno movimento.**
 *
 * La preferenza non la dichiara la pagina: la dichiara la persona nelle impostazioni del suo
 * sistema — su Windows «Effetti di animazione», su macOS e iOS «Riduci movimento» — e il browser la
 * espone alla media query `prefers-reduced-motion`. Quasi sempre la accende chi con parallasse,
 * zoom e cose grosse che scorrono sta male davvero: i disturbi vestibolari danno capogiri, nausea,
 * emicrania. Non vuol dire «pagina senza grafica»: contenuti, colori e immagini restano, e ciò che
 * si toglie è il **moto ampio e ripetuto**.
 *
 * Quasi tutto, qui, la rispetta **senza JavaScript**: `animations.css` ha una regola sola che
 * spegne le animazioni, e i componenti non ne sanno niente. Questo gancio serve nell'altro caso —
 * quando la decisione non è come disegnare qualcosa ma **se metterlo al mondo**, come in
 * {@link RatSwarm}, che con meno movimento non fa partire nessun timer. Chi costruisce un'interfaccia
 * sopra la libreria lo può leggere per dire a schermo perché una decorazione manca, invece di
 * lasciar credere che sia rotta.
 *
 * ⚠️ **Sul server, e nella passata di idratazione, vale `false`.** `matchMedia` lì non esiste, e
 * rendere due alberi diversi farebbe scartare a React tutto l'HTML del server. La risposta vera
 * arriva al primo render del client, che è anche quando si può cominciare a muovere qualcosa.
 *
 * ⚠️ **Legge la preferenza di sistema, non l'interruttore di HeroUI.** La sua variante
 * `motion-reduce` risponde anche a `[data-reduce-motion="true"]`, ma è una regola CSS: da
 * JavaScript quell'attributo non lo vede nessuno, e nemmeno il blocco di `animations.css` lo
 * guarda. Le due cose restano d'accordo perché guardano la stessa media query.
 */
export const useReducedMotion = (): boolean => useSyncExternalStore(sottoscrivi, quiEOra, sulServer);
