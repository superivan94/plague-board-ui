import { IconBase } from './IconBase';
import type { IconProps } from './types';

const SKULL_PATH =
  'M12,2A9,9 0 0,0 3,11C3,14.03 4.53,16.82 7,18.47V22H9V19H11V22H13V19H15V22H17V18.46C19.47,16.81 21,14.02 21,11A9,9 0 0,0 12,2M8,11A2,2 0 0,1 10,13A2,2 0 0,1 8,15A2,2 0 0,1 6,13A2,2 0 0,1 8,11M16,11A2,2 0 0,1 18,13A2,2 0 0,1 16,15A2,2 0 0,1 14,13A2,2 0 0,1 16,11M12,14L13.5,17H10.5L12,14Z';

/**
 * **Teschio.** Un cranio con due occhi tondi, il naso triangolare e i denti sul bordo inferiore.
 *
 * È il segno più forte della famiglia, e serve a **coprire il fondo**: di là sta nelle
 * intestazioni e nel fondale della peste, mai dentro un comando. Un teschio su un pulsante
 * promette una conseguenza che il pulsante non ha.
 */
export function SkullIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={SKULL_PATH} />
    </IconBase>
  );
}
