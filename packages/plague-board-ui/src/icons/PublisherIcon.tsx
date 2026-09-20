import { IconBase } from './IconBase';
import type { IconProps } from './types';

/**
 * Il palazzo — torre alta a sinistra, corpo basso a destra — e le otto finestre che lo forano.
 *
 * ⚠️ **La sagoma è un contorno a gradino, non due rettangoli accostati.** Con `evenodd` due sagome
 * affiancate si contano insieme, e chi sta dentro la prima vede i bordi della seconda: basta uno
 * scarto di un decimo sui bordi che combaciano perché una delle due si spenga, o perché fra le due
 * compaia una fessura. Un contorno solo non ha quel problema, e costa una riga in meno.
 *
 * ⚠️ **Le finestre sono buchi**, come i punti del dado: da lì si vede il fondo, qualunque sia.
 */
const PUBLISHER_PATH =
  'M4 20.5V5A1.5 1.5 0 0 1 5.5 3.5h6.5A1.5 1.5 0 0 1 13.5 5V9.5h5.5A1.5 1.5 0 0 1 20.5 11V20.5Z' +
  'M5.5 6.3h2.5v2.5h-2.5Z' +
  'M9.5 6.3h2.5v2.5h-2.5Z' +
  'M5.5 10.3h2.5v2.5h-2.5Z' +
  'M9.5 10.3h2.5v2.5h-2.5Z' +
  'M5.5 14.3h2.5v2.5h-2.5Z' +
  'M9.5 14.3h2.5v2.5h-2.5Z' +
  'M15.8 11.8h2.5v2.5h-2.5Z' +
  'M15.8 15.8h2.5v2.5h-2.5Z';

/**
 * **Editore.** Chi pubblica il gioco: il segno che sta davanti al nome della casa editrice sulla
 * scheda, e davanti al filtro che cerca i giochi di quella casa.
 *
 * Il palazzo per uffici è la convenzione con cui il software dice «un'azienda», e serve proprio
 * perché il nome accanto è un nome proprio: senza il segno, «Cranio Creations» in una riga di dati
 * potrebbe essere l'autore, l'illustratore o la collana.
 *
 * ⚠️ **Il gradino è la metà del segno.** Un parallelepipedo con le finestre dentro, alla misura
 * vera, si legge come un calendario o una griglia; a fare «palazzo» è il profilo a due altezze, che
 * è anche quello che distingue questo segno dalle finestre della città del fondale.
 *
 * ⚠️ **Non scende sotto i 16px.** Le finestre sono larghe 2,5 unità su 24, cioè 1,7 pixel a 16 e
 * 1,25 a 12: sotto, si chiudono e resta una sagoma piena — che è ancora un palazzo, ma senza
 * finestre è una scatola.
 */
export function PublisherIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={PUBLISHER_PATH} fillRule="evenodd" />
    </IconBase>
  );
}
