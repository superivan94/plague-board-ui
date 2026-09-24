import { IconBase } from './IconBase.js';
import type { IconProps } from './types.js';

/**
 * La cornice dello schermo: un rettangolo stondato da 2 a 22 con dentro un rettangolo da 4 a 20.
 * Con `evenodd` il secondo **fora** il primo, e resta una cornice spessa 2.
 */
const SCREEN = 'M3.5 3.5h17a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 15V5a1.5 1.5 0 0 1 1.5-1.5Z' + 'M4 5.5h16v9H4Z';

/** Il collo e la base, pieni: un tracciato a parte, perché questi si sommano invece di forarsi. */
const STAND = 'M11 16.5h2V19h-2Z' + 'M8 19h8a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2Z';

/**
 * **Lo schermo: il tema del sistema.** Nel commutatore del tema, la scelta che segue quello che la
 * persona ha già deciso nelle impostazioni del suo dispositivo.
 *
 * ⚠️ **Due tracciati con due regole**, com'è regola in questa libreria: la cornice fora il suo
 * interno con `evenodd`, il piede si somma col `nonzero` predefinito. Oggi il collo tocca la cornice
 * senza entrarci, ma in un tracciato solo basterebbe allungarlo di mezza unità perché la
 * sovrapposizione diventasse un buco.
 */
export function MonitorIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path fillRule="evenodd" d={SCREEN} />
      <path d={STAND} />
    </IconBase>
  );
}
