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
  /**
   * Dove nasce, in percentuale della larghezza del riquadro. Può sbordare: vedi il componente.
   *
   * ⚠️ **A che punto dell'elemento si riferisca lo decide la classe**, che è la proprietaria della
   * geometria: `pb-binary-digit` ci appoggia lo spigolo sinistro, `pb-comic-bubble` ci **centra**
   * il fumetto, perché una frase lunga ancorata a sinistra scappa fuori a destra di ottanta pixel
   * e sembra il fumetto di qualcun altro.
   */
  readonly left: RandomRange;
  /** Dove nasce, in percentuale dell'altezza del riquadro. Negativo vuol dire sopra. */
  readonly top: RandomRange;
  /**
   * Quante **altezze fisse** si ricavano dai due estremi di `top`, equidistanti e percorse a
   * turno: due elementi consecutivi non nascono mai alla stessa altezza, e con tante corsie
   * quanti ne stanno vivi insieme non se ne sovrappongono mai due. Senza, l'altezza si pesca
   * libera in tutta la fascia — che è quello che serve a una pioggia, dove il disordine è
   * l'effetto.
   *
   * ⚠️ **Gli estremi vanno distanti almeno quanto è alto l'elemento**, o due corsie vicine si
   * toccano lo stesso: qui `top` è un punto d'attacco, non un riquadro, e di quanto sia alto ciò
   * che ci nasce l'emettitore non sa niente.
   */
  readonly lanes?: number;
  /** Quanto è grande, in rem. Senza, la dimensione resta quella che decide il foglio di stile. */
  readonly fontSizeRem?: RandomRange;
}

/**
 * **I fumetti dello sviluppatore**: un pensiero ogni 1,2 secondi, sopra a ciò che si sta
 * sfiorando, che si gonfia e svanisce in tre secondi.
 *
 * Le frasi si passano — `DEV_PHRASES` è la voce umana della firma «umano e AI» — perché una
 * taratura è un meccanismo e le parole sono di chi firma.
 *
 * ⚠️ **Tre numeri non sono quelli di RattInventario, e sono correzioni misurate il 2026-09-19.**
 * La vita passa da 2,5 a 3 secondi perché a leggerle davvero le frasi lunghe non si facevano in
 * tempo. La fascia di `left` si stringe attorno alla metà — di là va da −15% a 85% e il fumetto
 * ci appoggia lo spigolo, quindi una frase da 143 px su una scheda da 142 sbordava di **81 px** a
 * destra, e sembrava appartenere a qualcos'altro. E `top` si allarga a 150 punti per fare spazio a
 * **tre corsie** distanti 28 px l'una dall'altra: in una fascia da 23 px, tre fumetti alti 18 si
 * coprivano a vicenda. Tre è anche quanti ne vivono insieme — tre secondi di vita, uno ogni 1,2 —
 * quindi due fumetti non si sovrappongono mai.
 */
export const comicBubbles = (phrases: readonly string[]): HoverEffect => ({
  everyMs: 1200,
  lifeMs: [3000, 3000],
  contents: phrases,
  className: 'pb-comic-bubble',
  left: [25, 75],
  top: [-210, -60],
  lanes: 3,
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
