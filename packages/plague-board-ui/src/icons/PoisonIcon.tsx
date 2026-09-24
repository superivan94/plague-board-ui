import { IconBase } from './IconBase.js';
import type { IconProps } from './types.js';

/**
 * La boccia e le **tre bolle forate** dentro: la miscela che ribolle.
 *
 * Le bolle sono buchi e non dischi dipinti — come i punti del dado e i granuli del virione — così
 * da lì si vede il fondo, qualunque sia. Sono tre e di tre misure diverse: due uguali e simmetriche
 * dentro un corpo si leggono come due occhi, ed è successo davvero provando il batterio.
 */
const POISON_BODY =
  'M5.7 14.8a6.3 6.3 0 1 1 12.6 0a6.3 6.3 0 1 1 -12.6 0Z' +
  'M8.6 16.2a1.3 1.3 0 1 1 2.6 0a1.3 1.3 0 1 1 -2.6 0Z' +
  'M12.7 17a1 1 0 1 1 2 0a1 1 0 1 1 -2 0Z' +
  'M12.32 13.5a0.78 0.78 0 1 1 1.56 0a0.78 0.78 0 1 1 -1.56 0Z';

/**
 * Il collo e il tappo, che scendono **dentro** la boccia invece di posarcisi sopra.
 *
 * ⚠️ **Stanno in un tracciato a parte apposta**: nel corpo le bolle si forano con `evenodd`, e con
 * la stessa regola qui il collo si cancellerebbe nel punto in cui entra nella boccia, lasciando una
 * tacca. Due tracciati, due regole — quello del corpo fora, questo somma.
 */
const POISON_GLASS = 'M9.2 1.8h5.6a1.1 1.1 0 0 1 0 2.2H9.2a1.1 1.1 0 0 1 0-2.2ZM10.1 4h3.8v6.4h-3.8Z';

/**
 * **Veleno.** L'ampolla: boccia tonda, collo stretto, tappo, e dentro qualcosa che fa le bolle.
 *
 * ⚠️ **È l'oggetto che la mascotte tiene in mano**, ed è il motivo per cui è questo il disegno del
 * veleno e non un altro: il ratto con l'ampolla, il ratto che corre e questa icona diventano la
 * stessa storia invece di tre disegni che si somigliano. Vale la stessa regola dell'inchiostro
 * `#180828` — l'identità sta nel ripetere le stesse cose, non nel disegnarne di nuove.
 *
 * È l'accento su un'**azione**, non su uno stato — di là sta dentro il pulsante che manda il
 * modulo di accesso e accanto ai dati di un profilo. Per il rischio, che è uno stato, c'è
 * {@link BiohazardIcon}; per la malattia {@link VirusIcon}.
 *
 * ⚠️ **Non è la tazza delle donazioni.** {@link PotionMugIcon} ha un manico e sta dentro un comando
 * che chiede di sostenere il progetto, e ha quella sagoma perché la tazza è la convenzione che nel
 * software dice «offrimi qualcosa». Questa è un recipiente da laboratorio, e dice l'opposto.
 *
 * ⚠️ **Fino al 2026-09-20 erano due bocce affiancate con due gocce sopra**, un glifo di Material
 * Design Icons che arrivava da RattInventario. Segnalato dall'utente il 2026-09-20: «bella da
 * vedere, ma non si capisce». Era vero — a grandezza vera sono due bolle e due puntini, e nessuno
 * dei due dice veleno.
 *
 * ⚠️ **Il collo è largo 3,8 unità su 24**, cioè 2,5 pixel a 16 e meno di due a 12: sotto i 16 la
 * boccia resta e il collo diventa un accenno. La sagoma regge lo stesso, perché a portare il segno
 * è il corpo tondo col tappo sopra.
 */
export function PoisonIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={POISON_BODY} fillRule="evenodd" />
      <path d={POISON_GLASS} />
    </IconBase>
  );
}
