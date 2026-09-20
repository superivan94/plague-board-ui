import { IconBase } from './IconBase';
import type { IconProps } from './types';

/**
 * Il piatto, la torta, due candele e due fiamme, in un tracciato che somma.
 *
 * ⚠️ **I pezzi si sovrappongono apposta.** Le candele entrano nel dolce di otto decimi e le fiamme
 * poggiano sulle candele di sei: staccati, alla misura vera, diventano sei pezzi sospesi sopra una
 * scatola. E il tracciato è uno solo perché tutti e sei girano nello stesso verso — con `evenodd`,
 * o con un pezzo girato al contrario, le candele si scaverebbero nel dolce invece di infilarcisi.
 *
 * ⚠️ **La fiamma è larga più del doppio della candela** (3,45 contro 1,6). Il primo giro le aveva
 * a 2,4 contro 1,8, e a guardarle ingrandite sembravano due matite: una fiamma che sporge di quattro
 * decimi per lato e finisce a punta è una punta temperata. Il rapporto che la fa leggere è **circa
 * due volte**, e sotto quello non c'è misura a cui funzioni.
 *
 * ⚠️ **Il piatto non è decorazione**: senza, la torta è un parallelepipedo con due bastoncini sopra,
 * cioè una scatola con delle antenne. La barra larga alla base è quello che dice «dolce servito», ed
 * è anche il pezzo che resta visibile quando tutto il resto si chiude, a 12px.
 */
const AGE_PATH =
  'M2.5 19h19a1 1 0 0 1 0 2h-19a1 1 0 0 1 0-2Z' +
  'M4 19.2V14.4a2.4 2.4 0 0 1 2.4-2.4h11.2a2.4 2.4 0 0 1 2.4 2.4v4.8Z' +
  'M8.6 7.8h1.6v5h-1.6Z' +
  'M13.8 7.8h1.6v5h-1.6Z' +
  'M9.4 3.4c2.3 2.2 2.3 3.2 0 5c-2.3-1.8-2.3-2.8 0-5Z' +
  'M14.6 3.4c2.3 2.2 2.3 3.2 0 5c-2.3-1.8-2.3-2.8 0-5Z';

/**
 * **Età consigliata.** Da che età si gioca: il segno che sta davanti a «10+» sulla scheda di un
 * gioco, e davanti al filtro che cerca qualcosa da fare coi bambini.
 *
 * La torta con le candeline è il segno del compleanno, cioè degli anni compiuti — che è esattamente
 * quello che dice un «10+» sulla scatola. Le alternative erano un bambino stilizzato, che dice
 * «per bambini» e non «da dieci anni in su», e uno scudo, che dice divieto.
 *
 * ⚠️ **Le candele sono due, non tante.** Il numero lo scrive l'applicazione accanto al segno; una
 * fila di candeline, a 16px, è una frangia di puntini. Due bastano a dire «compleanno» e restano
 * larghe più di un pixel a quella misura.
 */
export function AgeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={AGE_PATH} />
    </IconBase>
  );
}
