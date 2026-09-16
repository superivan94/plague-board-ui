import { IconBase } from './IconBase';
import type { IconProps } from './types';

/**
 * **Scintille.** Tre stelle a quattro punte, una grande in alto e due più in basso ai lati.
 *
 * È il secondo segno dell'accento «AI» del marchio, e a differenza di {@link RobotIcon} non dice
 * *chi* ha fatto una cosa ma *che una cosa è stata suggerita*: di là marca i campi compilati
 * dall'assistente e il comando che li genera. Le due non si scambiano.
 *
 * Il disegno arriva invariato da RattInventario — lì era già un SVG, non un glifo di un font.
 */
export function SparklesIcon(props: IconProps) {
  return (
    <IconBase {...props} paint="stroke">
      <path d="m12 3-1.5 3-3 1.5 3 1.5 1.5 3 1.5-3 3-1.5-3-1.5z" />
      <path d="m5 12-1.5 3-3 1.5 3 1.5 1.5 3 1.5-3 3-1.5-3-1.5z" />
      <path d="m19 12-1.5 3-3 1.5 3 1.5 1.5 3 1.5-3 3-1.5-3-1.5z" />
    </IconBase>
  );
}
