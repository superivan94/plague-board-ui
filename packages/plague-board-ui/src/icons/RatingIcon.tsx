import { IconBase } from './IconBase';
import type { IconProps } from './types';

/**
 * Dieci vertici alternati su due raggi concentrici: 9,4 fuori e 3,8 dentro, centro (12 · 12,4).
 *
 * ⚠️ **Il rapporto fra i due raggi è l'unica misura che conta**: 0,40. Sotto, le punte si
 * assottigliano e a 16px spariscono; sopra, la stella si gonfia e diventa un fiore. È il motivo per
 * cui i vertici sono scritti a coordinate assolute e non ricavati da un ciclo: sono dieci numeri
 * misurati, e un ciclo li renderebbe modificabili per sbaglio.
 */
const RATING_PATH =
  'M12 3L14.23 9.33L20.94 9.5L15.61 13.57L17.53 20L12 16.2L6.47 20L8.39 13.57L3.06 9.5L9.77 9.33Z';

/**
 * **Valutazione.** Il voto di un gioco: il segno che sta davanti a «7,8» sulla scheda, e davanti
 * all'ordinamento per voto.
 *
 * La stella è la convenzione che nel software dice «giudizio», e come i due busti dei giocatori è
 * un posto in cui inventare qualcosa di nostro costerebbe soltanto.
 *
 * ⚠️ **È una stella sola, e non è mezza né vuota.** Qui c'è il segno dell'attributo, non il voto:
 * chi vuole cinque stelle ne monta cinque, chi vuole una stella piena e una vuota le colora
 * diversamente. Una libreria che desse «la stella a metà» darebbe anche la scala, che è
 * dell'applicazione.
 *
 * ⚠️ **Le punte sono vive**, senza raccordi, al contrario del resto della famiglia che ha gli
 * spigoli tondi. A 16px una punta arrotondata si spunta e la stella diventa un pentagono gonfio: è
 * la sola forma della libreria in cui lo spigolo vivo è la scelta giusta.
 */
export function RatingIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={RATING_PATH} />
    </IconBase>
  );
}
