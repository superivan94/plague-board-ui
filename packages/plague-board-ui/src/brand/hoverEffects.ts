import type { RandomRange } from '../randomRange';

/**
 * La taratura di un emettitore: **quanto spesso ne esce uno, quanto vive, che cosa c'è scritto e
 * dove nasce**. È il ritratto di un easter egg in sette numeri e un elenco di parole.
 *
 * ⚠️ **Dentro non c'è nessuna funzione, ed è una scelta.** Una taratura che portasse un
 * `emit()` potrebbe dipingere qualunque JSX, ma sarebbe un oggetto **non serializzabile**: una
 * pagina server che lo costruisse e lo passasse a {@link HoverEmitter} — che è client — romperebbe
 * il prerender con «Functions cannot be passed directly to Client Components». È la trappola
 * misurata il 2026-09-17 con la prop `render` di HeroUI, e qui si evita per costruzione: fatta di
 * soli numeri e stringhe, una taratura attraversa il confine come qualunque altra prop, si stampa
 * a schermo, e si ritocca con uno `spread` — `{ ...binaryRain(), everyMs: 300 }`.
 *
 * Il prezzo, dichiarato: quello che vola è **testo**. Un emettitore di icone vorrebbe un'altra
 * forma, e il giorno che servisse sarebbe un componente diverso, non questo con una funzione
 * dentro.
 */
export interface HoverEffect {
  /**
   * Ogni quanto ne esce uno, in millisecondi.
   *
   * ⚠️ È un numero fisso e non due estremi come in `RatSwarm`, di proposito: un emettitore vive
   * i pochi secondi in cui qualcuno lo sta sfiorando, e lì la regolarità **è** l'effetto — una
   * pioggia battente a 80 ms, un pensiero ogni secondo e mezzo.
   */
  readonly everyMs: number;
  /**
   * Quanto vive un elemento, in millisecondi. È anche la **durata della sua animazione**, scritta
   * sull'elemento: le due cose sono lo stesso numero, così non si può sbagliare a tenerle in pari.
   */
  readonly lifeMs: RandomRange;
  /** I testi fra cui si pesca a ogni giro. Un elenco vuoto spegne l'emettitore. */
  readonly contents: readonly string[];
  /**
   * La classe che porta geometria e animazione: `pb-comic-bubble` e `pb-binary-digit` stanno in
   * `animations.css`. Ci si aggiunge quello che serve — `pb-binary-digit text-plague-400` — perché
   * il colore è dell'applicazione, non dell'effetto.
   */
  readonly className: string;
  /** Dove nasce, in percentuale della larghezza del riquadro. Può sbordare: vedi il componente. */
  readonly left: RandomRange;
  /** Dove nasce, in percentuale dell'altezza del riquadro. Negativo vuol dire sopra. */
  readonly top: RandomRange;
  /** Quanto è grande, in rem. Senza, la dimensione resta quella che decide il foglio di stile. */
  readonly fontSizeRem?: RandomRange;
}

/**
 * **I fumetti dello sviluppatore**: un pensiero ogni 1,2 secondi, sopra a ciò che si sta
 * sfiorando, che si gonfia e svanisce in due secondi e mezzo.
 *
 * I numeri sono quelli della scheda di `Superivan94` in RattInventario. Le frasi si passano —
 * `DEV_PHRASES` è la voce umana della firma «umano e AI» — perché una taratura è un meccanismo e
 * le parole sono di chi firma.
 */
export const comicBubbles = (phrases: readonly string[]): HoverEffect => ({
  everyMs: 1200,
  lifeMs: [2500, 2500],
  contents: phrases,
  className: 'pb-comic-bubble',
  left: [-15, 85],
  top: [-70, -10],
});

/**
 * **La pioggia binaria dello sviluppatore AI**: una cifra ogni 80 millisecondi, di misura sempre
 * diversa, che sale e svanisce fra gli 0,8 e gli 1,8 secondi.
 *
 * I numeri sono quelli della scheda di `AI-Dev` in RattInventario. Il colore no: lì è quello
 * dell'autore, e qui si aggiunge alla classe da fuori.
 */
export const binaryRain = (): HoverEffect => ({
  everyMs: 80,
  lifeMs: [800, 1800],
  contents: ['0', '1'],
  className: 'pb-binary-digit',
  left: [0, 95],
  top: [-20, 20],
  fontSizeRem: [0.5, 1],
});
