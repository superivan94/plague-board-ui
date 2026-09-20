import { IconBase } from './IconBase';
import type { IconProps } from './types';

/**
 * Il capside: un disco pieno con **tre granuli forati** dentro.
 *
 * I granuli sono buchi e non dischi dipinti, per la stessa ragione dei punti del dado — da lì si
 * vede quello che c'è dietro, qualunque fondo sia. Stanno tutti entro 2,3 unità dal centro, cioè
 * ben dentro al disco: se un buco toccasse la radice di una punta, la punta lo richiuderebbe.
 */
const VIRUS_BODY =
  'M6.8 12a5.2 5.2 0 1 1 10.4 0a5.2 5.2 0 1 1 -10.4 0Z' +
  'M9.3 11a1 1 0 1 1 2 0a1 1 0 1 1 -2 0Z' +
  'M12.5 11.6a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1 -1.6 0Z' +
  'M10.75 13.9a0.85 0.85 0 1 1 1.7 0a0.85 0.85 0 1 1 -1.7 0Z';

/**
 * Le otto punte, una ogni 45°: un gambo e un **pomello** in cima.
 *
 * Ogni punta è un quadrilatero dal raggio 4,4 al 7,7 più un disco di 1,45 sulla punta; il gambo
 * nasce **dentro** il capside, così non si vede la giunzione. ⚠️ **Stanno in un tracciato a parte
 * apposta**: nel disco i granuli si forano con `evenodd`, e con la stessa regola qui un gambo
 * sovrapposto al corpo si cancellerebbe invece di saldarcisi. Due tracciati, due regole — quello
 * del corpo fora, questo somma.
 *
 * ⚠️ E i quadrilateri girano **nello stesso verso** dei dischi: a soletta piena due sagome di mano
 * opposta si annullano dove si toccano, e ogni pomello si mangerebbe la cima del suo gambo.
 */
const VIRUS_SPIKES =
  'M16.4 12.75L16.4 11.25L19.7 11.25L19.7 12.75ZM18.25 12a1.45 1.45 0 1 1 2.9 0a1.45 1.45 0 1 1 -2.9 0Z' +
  'M14.58 15.64L15.64 14.58L17.98 16.91L16.91 17.98ZM15.99 17.44a1.45 1.45 0 1 1 2.9 0a1.45 1.45 0 1 1 -2.9 0Z' +
  'M11.25 16.4L12.75 16.4L12.75 19.7L11.25 19.7ZM10.55 19.7a1.45 1.45 0 1 1 2.9 0a1.45 1.45 0 1 1 -2.9 0Z' +
  'M8.36 14.58L9.42 15.64L7.09 17.98L6.02 16.91ZM5.11 17.44a1.45 1.45 0 1 1 2.9 0a1.45 1.45 0 1 1 -2.9 0Z' +
  'M7.6 11.25L7.6 12.75L4.3 12.75L4.3 11.25ZM2.85 12a1.45 1.45 0 1 1 2.9 0a1.45 1.45 0 1 1 -2.9 0Z' +
  'M9.42 8.36L8.36 9.42L6.02 7.09L7.09 6.02ZM5.11 6.56a1.45 1.45 0 1 1 2.9 0a1.45 1.45 0 1 1 -2.9 0Z' +
  'M12.75 7.6L11.25 7.6L11.25 4.3L12.75 4.3ZM10.55 4.3a1.45 1.45 0 1 1 2.9 0a1.45 1.45 0 1 1 -2.9 0Z' +
  'M15.64 9.42L14.58 8.36L16.91 6.02L17.98 7.09ZM15.99 6.56a1.45 1.45 0 1 1 2.9 0a1.45 1.45 0 1 1 -2.9 0Z';

/**
 * **Virus.** Il virione: un capside pieno coi granuli dentro e otto punte col pomello in cima.
 *
 * È il segno della **malattia**, quello che marca uno stato o una misura — di là sta ai due lati
 * del livello tossico, nel piede e nella pagina di accesso — ed è il contagio più usato della
 * libreria. Per il pericolo c'è {@link BiohazardIcon}, che è un cartello; per il laboratorio
 * {@link MoleculeIcon}; per gli organismi vivi {@link BacillusIcon} e {@link CoccusIcon}.
 *
 * ⚠️ **È l'unico contagio a campitura piena**, e non è una scelta estetica: i due batteri sono a
 * tratto, quindi in una riga di segni il virus è una **massa** e loro un contorno. È quello che li
 * tiene distinguibili anche quando sono piccoli e il dettaglio è sparito.
 *
 * ⚠️ **Fino al 2026-09-20 era un ingranaggio con un bersaglio dentro.** Il disegno che arrivava da
 * RattInventario è un glifo di Material Design Icons, e le sue protuberanze sono **denti
 * trapezoidali**: a grandezza vera è l'icona delle impostazioni con un mirino in mezzo. Come per
 * la nuvola, Material non entra nella libreria — ma qui il motivo non è la regola, è che il
 * disegno diceva un'altra cosa.
 *
 * ⚠️ **Da 24 in su dice «virione»; a 12 e 14 è un puntino irto**, ed è la misura a cui viene usato
 * davvero — dentro una pastiglia del grado, accanto alla firma della direzione. Lì non c'è disegno
 * che regga: quello che conta è che la macchia sia irta e piena, cioè diversa dai due batteri.
 */
export function VirusIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={VIRUS_BODY} fillRule="evenodd" />
      <path d={VIRUS_SPIKES} />
    </IconBase>
  );
}
