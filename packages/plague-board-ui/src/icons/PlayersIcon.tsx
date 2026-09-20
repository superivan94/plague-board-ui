import { IconBase } from './IconBase';
import type { IconProps } from './types';

/**
 * Due teste e due spalle, in un tracciato solo.
 *
 * ⚠️ **L'incavo fra le due spalle non è disegnato: nasce dall'incrocio.** Sono due mezzi dischi di
 * raggio 5,6 con i centri a 9,2 l'uno dall'altro, quindi si sovrappongono e il contorno dell'unione
 * fa una V profonda 2,4 unità — un pixel e mezzo a 16px. È l'unica cosa che distingue due persone
 * da una pagnotta con sopra due teste, e per questo le spalle **devono** sovrapporsi: accostate,
 * l'incavo non c'è.
 */
const PLAYERS_PATH =
  'M4 7.4a3.4 3.4 0 1 0 6.8 0a3.4 3.4 0 1 0-6.8 0Z' +
  'M13.2 7.4a3.4 3.4 0 1 0 6.8 0a3.4 3.4 0 1 0-6.8 0Z' +
  'M1.8 19.5v-1.5a5.6 5.6 0 0 1 11.2 0v1.5a1 1 0 0 1-1 1H2.8a1 1 0 0 1-1-1Z' +
  'M11 19.5v-1.5a5.6 5.6 0 0 1 11.2 0v1.5a1 1 0 0 1-1 1h-9.2a1 1 0 0 1-1-1Z';

/**
 * **Giocatori.** Quante persone servono a tavola: il segno che sta davanti a «2–4» sulla scheda di
 * un gioco, e davanti al filtro che cerca i giochi per quel numero.
 *
 * Due busti sovrapposti sono la convenzione universale per «più persone», ed è il caso in cui
 * inventare qualcosa di nostro costerebbe soltanto: questo segno deve essere riconosciuto in un
 * quarto di secondo dentro una riga di sei numeri, non ammirato.
 *
 * ⚠️ **Non dice quante persone**, dice che quel numero parla di persone. Un'icona con tre teste
 * per «3 giocatori» sarebbe un'icona da rifare a ogni gioco, e a 16px tre teste sono tre puntini.
 *
 * ⚠️ **Non scende sotto i 16px.** Fra le due teste ci sono 2,4 unità, cioè 1,6 pixel a 16 e uno a
 * 12: sotto, le teste si chiudono in una sola e restano un ovale su una gobba.
 */
export function PlayersIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={PLAYERS_PATH} />
    </IconBase>
  );
}
