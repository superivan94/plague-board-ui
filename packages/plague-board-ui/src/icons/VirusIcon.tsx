import { IconBase } from './IconBase';
import type { IconProps } from './types';

const VIRUS_PATH =
  'M12,2A1,1 0 0,0 11,3V4.08C10.16,4.21 9.34,4.42 8.56,4.73L7.8,3.97L6.39,5.39L7.15,6.15C6.84,6.93 6.63,7.75 6.5,8.59H5.42A1,1 0 0,0 4.42,9.59V14.41A1,1 0 0,0 5.42,15.41H6.5C6.63,16.25 6.84,17.07 7.15,17.85L6.39,18.61L7.8,20.03L8.56,19.27C9.34,19.58 10.16,19.79 11,19.92V21A1,1 0 0,0 12,22A1,1 0 0,0 13,21V19.92C13.84,19.79 14.66,19.58 15.44,19.27L16.2,20.03L17.61,18.61L16.85,17.85C17.16,17.07 17.37,16.25 17.5,15.41H18.58A1,1 0 0,0 19.58,14.41V9.59A1,1 0 0,0 18.58,8.59H17.5C17.37,7.75 17.16,6.93 16.85,6.15L17.61,5.39L16.2,3.97L15.44,4.73C14.66,4.42 13.84,4.21 13,4.08V3A1,1 0 0,0 12,2M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10Z';

/**
 * **Virus.** Un anello irto di protuberanze con due cerchi concentrici dentro: un virione visto
 * al microscopio.
 *
 * È il segno **piccolo e ripetuto**, quello che marca una misura invece di una schermata: di là
 * compare a 16px ai due lati del livello tossico, nel piede e nella pagina di accesso. Cresciuto
 * oltre i 32px i suoi cerchi concentrici diventano un bersaglio, e va usato
 * {@link BiohazardIcon}.
 */
export function VirusIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={VIRUS_PATH} />
    </IconBase>
  );
}
