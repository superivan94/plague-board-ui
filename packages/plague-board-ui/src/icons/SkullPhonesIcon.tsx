import { IconBase } from './IconBase';
import type { IconProps } from './types';

/**
 * Il teschio con le orbite e il naso **ritagliati**, non dipinti di nero.
 *
 * ⚠️ È la differenza con quello di RattInventario, dove occhi e naso sono cerchi `fill="black"`:
 * su una superficie che non è nera si vedono tre macchie scure invece di tre buchi. Con
 * `fill-rule="evenodd"` i sottotracciati bucano il primo, quindi si vede quello che c'è sotto.
 */
export const SKULL_PATH =
  'M12 4C8.13 4 5 7.13 5 11c0 2.38 1.19 4.47 3 5.74V19c0 .55.45 1 1 1s1-.45 1-1v-1.26c.64.16 1.31.26 2 .26s1.36-.1 2-.26V19c0 .55.45 1 1 1s1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zM9.5 9a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2zm5 0a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2zM12 13.2l-1.1 2.1h2.2z';

/** L'archetto delle cuffie, che passa appena fuori dalla calotta. */
export const HEADBAND_PATH = 'M3.6 12.5V10a8.4 8.4 0 0 1 16.8 0v2.5';

/** I due padiglioni, uno per lato. */
export const EARCUP_PATHS = [
  'M1.6 11.4h2.8a1.6 1.6 0 0 1 1.6 1.6v2.6a1.6 1.6 0 0 1-1.6 1.6H1.6A1.6 1.6 0 0 1 0 15.6V13a1.6 1.6 0 0 1 1.6-1.6z',
  'M19.6 11.4h2.8A1.6 1.6 0 0 1 24 13v2.6a1.6 1.6 0 0 1-1.6 1.6h-2.8a1.6 1.6 0 0 1-1.6-1.6V13a1.6 1.6 0 0 1 1.6-1.6z',
];

/**
 * **La musica di casa.** Un teschio con le cuffie: è il segno con cui RattInventario marca il
 * comando dell'audio nella schermata di accesso, e vale «qui suona qualcosa» meglio di una nota,
 * perché la nota la usano tutti e il teschio è nostro.
 *
 * ⚠️ **È un disegno solo, e di là erano due `<svg>` sovrapposti** con tre riquadri `fill="black"`
 * dentro. Sovrapporne due vuol dire che il colore si passa due volte e che a misure diverse i due
 * si scollano; e il nero dipinto smette di funzionare appena la superficie non è nera. Qui i buchi
 * sono buchi e il colore è uno.
 *
 * Per lo stato spento c'è {@link SkullPhonesOffIcon}, che è questo con una sbarra.
 */
export function SkullPhonesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={SKULL_PATH} fillRule="evenodd" clipRule="evenodd" />
      <path d={HEADBAND_PATH} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {EARCUP_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </IconBase>
  );
}
