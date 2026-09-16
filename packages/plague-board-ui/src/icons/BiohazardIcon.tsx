import { IconBase } from './IconBase';
import type { IconProps } from './types';

const BIOHAZARD_PATH =
  'M12,2.5A2,2 0 0,1 14,4.5A2,2 0 0,1 12,6.5A2,2 0 0,1 10,4.5A2,2 0 0,1 12,2.5M22,12A2,2 0 0,1 20,14A2,2 0 0,1 18,12A2,2 0 0,1 20,10A2,2 0 0,1 22,12M10,19.5A2,2 0 0,1 8,21.5A2,2 0 0,1 6,19.5A2,2 0 0,1 8,17.5A2,2 0 0,1 10,19.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z';

/**
 * **Rischio biologico.** Tre lobi disposti a raggiera attorno a un anello: il segno
 * internazionale del contagio.
 *
 * È l'**emblema** della famiglia — quello che sta in cima a una schermata o dentro una pastiglia
 * per dire «questa è roba della peste», e di là è infatti la più usata: onboarding, riepilogo del
 * piano, dialoghi. Dice appartenenza, non pericolo imminente: per quello c'è {@link SkullIcon}.
 */
export function BiohazardIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={BIOHAZARD_PATH} />
    </IconBase>
  );
}
