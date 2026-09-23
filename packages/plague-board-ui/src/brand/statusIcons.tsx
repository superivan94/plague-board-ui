import type { ReactNode } from 'react';

import { BiohazardIcon } from '../icons/BiohazardIcon.js';
import { PoisonIcon } from '../icons/PoisonIcon.js';
import { RatIcon } from '../icons/RatIcon.js';
import { SkullIcon } from '../icons/SkullIcon.js';

/**
 * Il tono di un avviso. Sono gli stessi cinque di HeroUI — `Alert`, `AlertDialog` e `Toast` li
 * chiamano così — e restano quelli apposta: passano ai suoi componenti come sono, senza una tabella
 * di traduzione che si scollerebbe alla prima versione nuova.
 */
export type PlagueStatus = 'default' | 'accent' | 'success' | 'warning' | 'danger';

/**
 * **Il segno di serie di ogni tono**, preso dal vocabolario della peste invece che dai cerchi con
 * l'esclamativo di HeroUI: il marchio vuoto per un'informazione, l'ampolla per un accento, il
 * marchio **pieno** per un successo — è il «l'ho scelto» del preferito —, il biohazard per un
 * pericolo, il teschio per ciò che distrugge.
 *
 * ⚠️ **Il marchio qui non batte** (`animateOn="none"`): un avviso che pulsa chiede attenzione anche
 * quando l'ha già avuta.
 *
 * ⚠️ **`size-5` accanto al numero** non è un doppione: dentro i componenti di HeroUI una regola
 * sui loro `svg` sostituisce l'attributo, e la classe è l'unica cosa che vince.
 */
export function statusIcon(status: PlagueStatus): ReactNode {
  switch (status) {
    case 'default':
      return <RatIcon animateOn="none" size={20} className="size-5" />;
    case 'accent':
      return <PoisonIcon size={20} className="size-5" />;
    case 'success':
      return <RatIcon isFilled animateOn="none" size={20} className="size-5" />;
    case 'warning':
      return <BiohazardIcon size={20} className="size-5" />;
    case 'danger':
      return <SkullIcon size={20} className="size-5" />;
  }
}
