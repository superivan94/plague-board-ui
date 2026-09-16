import { IconBase } from './IconBase';
import type { IconProps } from './types';

/**
 * **Codice.** Due parentesi angolari che si guardano — il `<>` di chi scrive software.
 *
 * È il segno dell'**autore umano** nella firma dei Ludoratti, dove sta accanto a
 * {@link RobotIcon}: i due si leggono in coppia, e da soli non vogliono dire «umano» e «AI».
 *
 * ⚠️ È **ridisegnata**, non portata: di là è il glifo `code` di Material Symbols, cioè un font
 * scaricato da un CDN su ogni pagina per due icone. Il disegno è a tratto perché quello lo era —
 * in RattInventario il `code` è chiesto senza riempimento, mentre il robot lo ha.
 */
export function CodeIcon(props: IconProps) {
  return (
    <IconBase {...props} paint="stroke">
      <path d="m9 17-5-5 5-5" />
      <path d="m15 7 5 5-5 5" />
    </IconBase>
  );
}
