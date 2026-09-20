import type { IconProps } from 'plague-board-ui';
import type { ComponentType } from 'react';

/**
 * Il registro delle pagine del playground.
 *
 * ⚠️ È l'unico posto dove una pagina si dichiara: la barra di navigazione lo legge, e al punto 3
 * lo leggerà anche l'indice delle storie. Una pagina che non è qui non si raggiunge — che è lo
 * stesso difetto che Rattoteca difende con un guard, perché una pagina orfana compila, risponde
 * se digiti l'indirizzo, e l'unica cosa che non fa è farsi trovare.
 */

/**
 * Le famiglie in cui la barra raggruppa le pagine. ⚠️ Sono nate quando le pagine sono diventate
 * sette e la barra una fila di nomi da leggere tutta: con tre famiglie in vista, quello che si
 * cerca sta sempre a un salto di distanza.
 */
export type PlaygroundFamily = 'fondamenta' | 'ratto' | 'sorprese' | 'filosofia';

export interface PlaygroundFamilyInfo {
  readonly key: PlaygroundFamily;
  /** Il nome in barra: una parola, perché di parole in barra ce ne sono altre tre. */
  readonly title: string;
  /** Che cosa tiene insieme le pagine di questa famiglia. Una riga, in cima al popover. */
  readonly blurb: string;
}

export const PLAYGROUND_FAMILIES: readonly PlaygroundFamilyInfo[] = [
  {
    key: 'fondamenta',
    title: 'Fondamenta',
    blurb: 'Quello su cui posa tutto il resto: i colori, i segni, le superfici.',
  },
  {
    key: 'ratto',
    title: 'Il ratto',
    blurb: 'Il personaggio: come è fatto, come si muove, e come lo si guarda da vicino.',
  },
  {
    key: 'sorprese',
    title: 'Le sorprese',
    blurb: 'Quello che succede quando qualcuno tocca, preme o sfiora qualcosa.',
  },
];

export interface PlaygroundPage {
  href: string;
  /**
   * Il nome di casa: due parole, non una frase.
   *
   * ⚠️ **Resta quello dei Ludoratti anche adesso che le pagine sono sette**, ed è una scelta
   * dell'utente: a dire con precisione di che cosa parla una pagina ci pensa {@link components},
   * che nel popover ci sta sotto. «La corsa» è la voce del progetto, `RatRun · RatSwarm` è quello
   * che si cerca davvero.
   */
  title: string;
  /** I componenti che la pagina mostra, coi loro nomi veri. Vuoto per una pagina che non ne mostra. */
  components: readonly string[];
  /** Che cosa ci si trova. Una riga. */
  blurb: string;
  /** In quale delle {@link PLAYGROUND_FAMILIES} sta — o `filosofia`, che in barra è un nome solo. */
  family: PlaygroundFamily;
  /**
   * Il segno accanto alla voce.
   *
   * ⚠️ **Oggi non lo passa nessuno, e la barra è tutta testo** — deciso dall'utente: un'icona
   * accanto a un nome corto aggiunge poco. Il posto per metterla però c'è, e ha la forma che ha
   * tutto il resto della libreria: un componente che rispetta `IconProps`, non un nome da cercare
   * in una tabella. Chi ne vuole una la scrive qui e la barra la mostra.
   */
  icon?: ComponentType<IconProps>;
}

export const PLAYGROUND_PAGES: readonly PlaygroundPage[] = [
  {
    href: '/',
    title: 'Tavolozza',
    components: ['colori', 'icone'],
    blurb: 'I colori, i due che il tema cambia, e le icone alle misure vere.',
    family: 'fondamenta',
  },
  {
    href: '/barra',
    title: 'La barra',
    components: ['PlagueBar', 'PlagueFootBar', 'BarRow'],
    blurb: 'Le due lastre — in cima e in fondo — le tre altezze, e la riga che non va a capo.',
    family: 'fondamenta',
  },
  {
    href: '/atmosfera',
    title: 'L’atmosfera',
    components: ['PlagueBackground', 'ToxicBubbles', 'ToxicLevelSwitch', 'GlitchText', 'PlaguePulse'],
    blurb: 'Il fondale della peste, i quattro livelli, e il comando che dice quanta ce ne deve essere.',
    family: 'fondamenta',
  },
  {
    href: '/profilo',
    title: 'La scheda',
    components: ['PlagueAvatar', 'ThematicBadge', 'PlaguePanel'],
    blurb: 'I tre pezzi della scheda profilo: il ritratto con l’anello, il grado, e la superficie.',
    family: 'fondamenta',
  },
  {
    href: '/corsa',
    title: 'La corsa',
    components: ['RatRun', 'RatSwarm'],
    blurb: 'Il ratto che attraversa lo schermo, e lo sciame che ne fa passare tanti ogni tanto.',
    family: 'ratto',
  },
  {
    href: '/lente',
    title: 'La lente',
    components: ['Rat'],
    blurb: 'Il ratto da solo, ingrandito e fermo a un istante del passo: per guardare le cuciture.',
    family: 'ratto',
  },
  {
    href: '/voce',
    title: 'La voce',
    components: ['TalkingMascot', 'SpeechBubble', 'useRandomPhrase'],
    blurb: 'Le frasi di casa, il sorteggio che non ripete, e il fumetto che se ne va da solo.',
    family: 'sorprese',
  },
  {
    href: '/tocco',
    title: 'Il tocco',
    components: ['HoverEmitter', 'comicBubbles', 'binaryRain'],
    blurb: 'L’easter egg che si accende quando lo sfiori, e che su un telefono si tocca.',
    family: 'sorprese',
  },
  {
    href: '/stile',
    title: 'La direzione',
    components: [],
    blurb: 'Il bersaglio: come deve venire una schermata vestita da Ludoratti.',
    family: 'filosofia',
  },
  {
    href: '/lessico',
    title: 'Il lessico',
    components: ['LUDORATTI_COPY'],
    blurb: 'Le parole di casa, ognuna accanto a quella generica che sostituisce.',
    family: 'filosofia',
  },
];
