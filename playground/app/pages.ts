/**
 * Il registro delle pagine del playground.
 *
 * ⚠️ È l'unico posto dove una pagina si dichiara: la barra di navigazione lo legge, e al punto 3
 * lo leggerà anche l'indice delle storie. Una pagina che non è qui non si raggiunge — che è lo
 * stesso difetto che Rattoteca difende con un guard, perché una pagina orfana compila, risponde
 * se digiti l'indirizzo, e l'unica cosa che non fa è farsi trovare.
 */
export interface PlaygroundPage {
  href: string;
  /** Il nome nella barra: due parole, non una frase. */
  title: string;
  /** Che cosa ci si trova. Una riga. */
  blurb: string;
  /**
   * `essenziale` — spiega la filosofia della libreria e come i componenti vanno usati;
   * `demo` — mostra dei componenti.
   */
  kind: 'essenziale' | 'demo';
}

export const PLAYGROUND_PAGES: readonly PlaygroundPage[] = [
  {
    href: '/',
    title: 'Tavolozza',
    blurb: 'I colori, i due che il tema cambia, e le icone alle misure vere.',
    kind: 'demo',
  },
  {
    href: '/stile',
    title: 'La direzione',
    blurb: 'Il bersaglio: come deve venire una schermata vestita da Ludoratti.',
    kind: 'essenziale',
  },
];
