import { IconBase } from './IconBase';
import type { IconProps } from './types';

/**
 * **Il marchio dei Ludoratti.** Un anello, due orecchie tonde in alto, e sotto due curve che si
 * incontrano in punta.
 *
 * ⚠️ **Si legge in tre modi, e sono tutti e tre voluti** — è il segno principale del racconto, non
 * un'icona decorativa:
 *
 * 1. a prima vista è un **cuore**, cioè la salvezza;
 * 2. guardandolo meglio sono **due figure che si abbracciano**;
 * 3. ma le due orecchie dicono la verità: è il **muso di un ratto**.
 *
 * Da qui discende come si usa. È il marchio: sta dove parla la corporazione — una barra, una
 * schermata di accesso, un piede — e **non si usa come icona di dominio**. Per dire «peste» c'è
 * {@link BiohazardIcon}, per dire «gioco» il dado: un marchio che marca anche le cose smette di
 * marcare sé stesso.
 *
 * ⚠️ **Non è il ratto che attraversa la pagina.** Quello è un personaggio disegnato, con la livrea
 * e la coda, e vive altrove: qui c'è un emblema, fatto per essere riconosciuto a 18px.
 *
 * Il disegno arriva invariato da `ludoratti.it`, dove sta sopra il nome.
 */
export function RatIcon(props: IconProps) {
  return (
    <IconBase {...props} paint="stroke">
      {/* L'anello che contiene tutto. Tenue: è il recinto, non il soggetto. */}
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
        strokeOpacity="0.3"
        strokeWidth="1.5"
      />
      {/* Le due curve che formano il cuore, l'abbraccio e il muso. Si incontrano in alto al
          centro e scendono a chiudersi in punta. */}
      <path
        d="M12 18.5C14.1667 17.5 16 15 17 13C17.5 11.5 16 10 15 9.5C14 9 12 10.5 12 10.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 10.5S10 9 9 9.5C8 10 6.5 11.5 7 13C8 15 9.83333 17.5 12 18.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Le orecchie: sono l'unico pieno del disegno, e sono la cosa che rivela il ratto. */}
      <circle cx="14.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </IconBase>
  );
}
