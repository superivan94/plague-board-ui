import { IconBase } from './IconBase';
import { EARCUP_PATHS, HEADBAND_PATH, SKULL_PATH } from './SkullPhonesIcon';
import type { IconProps } from './types';

/** La sbarra che spegne, in diagonale come vuole la convenzione dei comandi muti. */
const SLASH_PATH = 'M3.2 2.6 20.8 21.4';

/**
 * **La musica spenta**: {@link SkullPhonesIcon} con una sbarra sopra.
 *
 * ⚠️ **Sono due icone e non una con una prop**, perché `IconProps` è il contratto di un disegno,
 * non di uno stato: un'icona che sapesse se la musica sta suonando non si potrebbe più sostituire
 * con la propria. I tracciati però sono gli stessi, importati — due copie dello stesso teschio
 * divergerebbero al primo ritocco.
 *
 * ⚠️ **La sbarra non basta da sola.** Un comando muto si riconosce dalla sbarra **e** dal suo
 * `aria-pressed`: {@link MusicToggle} porta tutti e due, perché chi non vede l'icona la sbarra non
 * ce l'ha.
 */
export function SkullPhonesOffIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={SKULL_PATH} fillRule="evenodd" clipRule="evenodd" />
      <path d={HEADBAND_PATH} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {EARCUP_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
      <path d={SLASH_PATH} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </IconBase>
  );
}
