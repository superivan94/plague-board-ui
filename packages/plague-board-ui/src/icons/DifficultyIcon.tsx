import { IconBase } from './IconBase';
import type { IconProps } from './types';

/**
 * Il pezzo di puzzle: un contorno solo, col dente a destra e l'incavo a sinistra.
 *
 * ⚠️ **Dente e incavo stanno nel contorno, e non possono fare altrimenti.** Un dente attaccato come
 * cerchio a parte si salderebbe — ma un incavo no: un cerchio a cavallo del bordo, con `evenodd`,
 * toglie la parte dentro e **lascia dipinta quella fuori**, cioè appiccica una mezzaluna al fianco
 * del pezzo. L'unica forma che regge tutti e due è il contorno che esce ed entra da sé.
 *
 * ⚠️ **Sono archi maggiori, e il collo stretto viene da lì.** Il primo giro li aveva disegnati con
 * due curve di Bézier, ed è uscito un bozzo largo e basso: il termine cubico del punto di partenza
 * domina l'inizio della curva, quindi il sottosquadro non si forma nemmeno spingendo i punti di
 * controllo fuori dal riquadro. Un arco di raggio 2,6 fra due punti distanti 2,6 ha il centro a
 * 2,25 **oltre** il bordo e percorre 240°: collo di 2,6 unità, bulbo largo 5,2, sporgenza 4,85. È
 * la proporzione che fa leggere «incastro» invece di «etichetta».
 *
 * ⚠️ **I flag sono `1 1` per il dente e `1 0` per l'incavo**, e non è una coppia da tirare a
 * indovinare: quando `large-arc` e `sweep` sono **uguali** la specifica sceglie il centro dalla
 * parte opposta al verso, e quando sono **diversi** quello dalla stessa parte. Il contorno gira in
 * senso orario, quindi il dente (che esce) li vuole uguali e l'incavo (che rientra) diversi. Con la
 * coppia sbagliata il pezzo non si rompe: il dente diventa una tacca e l'incavo un bozzo.
 */
const DIFFICULTY_PATH =
  'M5 4H14.5a2 2 0 0 1 2 2V10.45' +
  'a2.6 2.6 0 1 1 0 2.6' +
  'V17.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V13.05' +
  'a2.6 2.6 0 1 0 0-2.6' +
  'V6a2 2 0 0 1 2-2Z';

/**
 * **Difficoltà.** Quanto è complicato imparare e giocare: il segno che sta davanti a «media» o a un
 * peso da 1 a 5 sulla scheda di un gioco.
 *
 * È un **pezzo di puzzle**, che nel software è il segno di ciò che va capito e incastrato. Le
 * alternative erano una scala di barre — che si legge come un grafico, cioè come un dato e non
 * come una fatica — e un cervello, che dice intelligenza e non complessità.
 *
 * ⚠️ **Non dice quanta**, dice che quel valore parla di difficoltà. Un segno che cresce con la
 * difficoltà sarebbe un segno diverso per ogni gradino, e la scala la scrive l'applicazione:
 * «leggero», «medio», «cinghiale».
 *
 * ⚠️ **Il pezzo non è quadrato apposta**: il dente sporge di 4,85 unità a destra e l'incavo entra
 * altrettanto a sinistra, quindi il corpo è 13,5×15,5 dentro un ingombro largo 18,35. Con un pezzo
 * quadrato e dente e incavo appena accennati, a 16px resta un quadrato stondato — che è un
 * quadrato stondato.
 */
export function DifficultyIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={DIFFICULTY_PATH} />
    </IconBase>
  );
}
