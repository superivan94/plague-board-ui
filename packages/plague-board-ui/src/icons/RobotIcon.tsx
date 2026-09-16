import { IconBase } from './IconBase';
import type { IconProps } from './types';

// Un tracciato solo, con gli occhi come sottotracciati: con `evenodd` diventano buchi, e l'icona
// resta leggibile su qualunque fondo. Due `<path>` separati li riempirebbero invece di bucarli, e
// per farli sembrare buchi bisognerebbe dipingerli del colore dello sfondo — cioè conoscerlo.
const ROBOT_PATH =
  'M12 1.5a1 1 0 0 1 1 1V4h3a4 4 0 0 1 4 4v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-1H3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1V8a4 4 0 0 1 4-4h3V2.5a1 1 0 0 1 1-1zM9.5 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM14.5 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z';

/**
 * **Robot.** Una testa squadrata con due occhi tondi, l'antenna sopra e le orecchie ai lati.
 *
 * È il segno dell'**autore AI** nella firma dei Ludoratti, in coppia con {@link CodeIcon}.
 *
 * ⚠️ È **ridisegnata**, e sostituisce due cose che di là erano separate senza motivo: il glifo
 * `smart_toy` di Material Symbols, che la firma usa davvero, e `SmartToyIcon.tsx`, un SVG scritto
 * a mano dello **stesso soggetto** che in RattInventario non ha nessun chiamante. Qui ce n'è una
 * sola, perché due icone che disegnano un robot sono un'icona sola disegnata due volte.
 */
export function RobotIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={ROBOT_PATH} fillRule="evenodd" />
    </IconBase>
  );
}
