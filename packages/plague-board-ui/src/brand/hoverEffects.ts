import type { RandomRange } from '../randomRange.js';

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
 * **I fumetti dello sviluppatore**: un pensiero per volta, appena sopra a ciò che si sta
 * sfiorando. Entra in un quarto di secondo, resta fermo due secondi e mezzo, esce in un altro
 * quarto — e solo dopo, con due decimi di respiro, ne nasce un altro da un'altra parte.
 *
 * Le frasi si passano — `DEV_PHRASES` è la voce umana della firma «umano e AI» — perché una
 * taratura è un meccanismo e le parole sono di chi firma.
 *
 * ⚠️ **Dei numeri di RattInventario non ne resta quasi nessuno, e sono tutte correzioni chieste
 * dall'utente guardando la pagina.** Di là ne esce uno ogni 1,2 secondi e ne vivono tre insieme:
 * si accavallavano, e nessuna disposizione li salva, perché un fumetto è largo quanto la frase che
 * contiene. **Uno per volta** è la cura vera — `everyMs` è la vita più due decimi, quindi il
 * successivo nasce a scena vuota — e le tre corsie servono a farlo comparire ogni volta da
 * un'altra parte, non più a tenerli separati.
 *
 * ⚠️ **E stanno vicini alla scheda.** `left` si stringe attorno alla metà e il fumetto ci si
 * **centra** — di là ci appoggia lo spigolo, quindi una frase da 179 px su una scheda da 142
 * sbordava di 81 px a destra — mentre `top` tiene il fondo del fumetto fra i 2 e i 20 px sopra il
 * bordo, che è dove la sua punta indica qualcosa. Il primo giro li mandava a 80 px di altezza:
 * «più in alto del dovuto», ed era vero.
 */
export const comicBubbles = (phrases: readonly string[]): HoverEffect => ({
  everyMs: 3200,
  lifeMs: [3000, 3000],
  contents: phrases,
  className: 'pb-comic-bubble',
  left: [35, 65],
  top: [-100, -55],
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
