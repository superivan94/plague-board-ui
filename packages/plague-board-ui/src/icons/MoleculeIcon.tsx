import { IconBase } from './IconBase';
import type { IconProps } from './types';

const MOLECULE_PATH =
  'M12,2.5A2,2 0 0,1 14,4.5A2,2 0 0,1 12,6.5A2,2 0 0,1 10,4.5A2,2 0 0,1 12,2.5M22,12A2,2 0 0,1 20,14A2,2 0 0,1 18,12A2,2 0 0,1 20,10A2,2 0 0,1 22,12M10,19.5A2,2 0 0,1 8,21.5A2,2 0 0,1 6,19.5A2,2 0 0,1 8,17.5A2,2 0 0,1 10,19.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z';

/**
 * **Molecola.** Un anello con tre dischi disposti attorno: un nucleo e quello che gli sta legato.
 *
 * ⚠️ **Fino al 2026-09-17 si chiamava `BiohazardIcon`, ed era un nome che mentiva.** Il simbolo
 * del rischio biologico ha tre lobi uncinati che si toccano al centro; questo ha tre dischi
 * staccati attorno a un anello, e non gli somiglia affatto. Messo accanto a quello vero —
 * {@link BiohazardIcon}, che arriva da `ludoratti.it` — la differenza si vede al primo sguardo.
 *
 * È il segno del **laboratorio**: qualcosa di analizzato, composto, sotto osservazione. Sta bene
 * dove si parla di una sostanza o di un ceppo; per il pericolo c'è il biohazard, per la malattia
 * il {@link VirusIcon}.
 *
 * ⚠️ **È la sola della famiglia che regge a 16px**: i tre dischi sono staccati, quindi restano tre
 * macchie anche quando tutto il resto si impasta. Dove serve un segno piccolo della peste, è
 * questo.
 */
export function MoleculeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d={MOLECULE_PATH} />
    </IconBase>
  );
}
