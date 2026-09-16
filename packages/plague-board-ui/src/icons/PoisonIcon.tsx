import { IconBase } from './IconBase';
import type { IconProps } from './types';

const POISON_PATH =
  'M7.5 2C8.33 2 9 2.67 9 3.5C9 4.33 8.33 5 7.5 5C6.67 5 6 4.33 6 3.5C6 2.67 6.67 2 7.5 2M16.5 2C17.33 2 18 2.67 18 3.5C18 4.33 17.33 5 16.5 5C15.67 5 15 4.33 15 3.5C15 2.67 15.67 2 16.5 2M7.5 7C8.88 7 10.13 7.5 11.13 8.38C11.88 7.55 12.92 7 14.13 7C16.88 7 19.13 9.25 19.13 12S16.88 17 14.13 17C12.92 17 11.88 16.45 11.13 15.62C10.13 16.5 8.88 17 7.5 17C4.75 17 2.5 14.75 2.5 12S4.75 7 7.5 7M7.5 9C5.84 9 4.5 10.34 4.5 12S5.84 15 7.5 15C8.28 15 8.97 14.72 9.5 14.25C9.91 13.88 10.19 13.42 10.31 12.88C10.36 12.59 10.38 12.3 10.38 12C10.38 11.7 10.36 11.41 10.31 11.12C10.19 10.58 9.91 10.12 9.5 9.75C8.97 9.28 8.28 9 7.5 9M14.13 9C15.78 9 17.13 10.34 17.13 12S15.78 15 14.13 15C13.34 15 12.66 14.72 12.13 14.25C11.72 13.88 11.44 13.42 11.31 12.88C11.27 12.59 11.25 12.3 11.25 12C11.25 11.7 11.27 11.41 11.31 11.12C11.44 10.58 11.72 10.12 12.13 9.75C12.66 9.28 13.34 9 14.13 9Z';

/**
 * **Veleno.** Due bocce affiancate sormontate da due gocce: la miscela che ribolle.
 *
 * È l'accento su un'**azione**, non su uno stato — di là sta dentro il pulsante che manda il
 * modulo di accesso e accanto ai dati di un profilo. Per il rischio, che è uno stato, c'è
 * {@link BiohazardIcon}; per il livello di contaminazione c'è {@link VirusIcon}.
 */
export function PoisonIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={POISON_PATH} />
    </IconBase>
  );
}
