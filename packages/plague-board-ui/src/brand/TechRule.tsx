import { Separator } from '@heroui/react';
import type { ReactNode } from 'react';

import { TechLabel } from './TechLabel';

export interface TechRuleProps {
  /** Il nome della categoria che comincia qui. Due parole, non una frase. */
  children: ReactNode;
  /** `horizontal` fra due blocchi impilati, `vertical` dentro una riga. Orizzontale di default. */
  orientation?: 'horizontal' | 'vertical';
  /** Classi aggiuntive. ⚠️ Il **colore si mette qui**, e vale per il filo e per il nome. */
  className?: string;
}

/**
 * **Dove comincia una categoria.** Un filo di un pixel e, subito dopo, il nome del gruppo nella
 * voce di servizio dei Ludoratti. Nella barra del playground è la riga che separa le pagine che
 * mostrano i componenti da quelle che spiegano come sono pensati — «filosofia».
 *
 * ⚠️ **Non è un titolo e non è una voce disattivata.** Un titolo apre una sezione e sta nella
 * gerarchia dei `<h*>`; una voce disattivata è un comando che al momento non si può usare, ed è la
 * cosa peggiore da imitare: chi naviga con la tastiera ci passa sopra e non capisce perché non
 * succede niente. Questo è un **confine**, e dice solo che da qui in là le cose sono di un'altra
 * specie. Convive con un `<h2>`, non lo sostituisce.
 *
 * ⚠️ **Il filo è il `Separator` di HeroUI, vestito.** Quella riga *è* il confine, e chi non la vede
 * ha lo stesso bisogno di sapere che il gruppo cambia: il ruolo e l'orientamento li mette lui,
 * perché sotto c'è il primitivo di `react-aria`. Scriverlo a mano avrebbe voluto dire rifare a
 * mano `role="separator"` e `aria-orientation`, cioè esattamente ciò che una dipendenza già pagata
 * fa meglio di noi.
 *
 * ⚠️ **Il colore del filo però è nostro, e resta statico.** `--separator` di HeroUI su
 * `gray-950` fa **1,24** di contrasto — misurato il 2026-09-17: la riga sparisce, perché quel
 * token è tarato sulle superfici chiare del suo tema e non sul nero dei Ludoratti. `gray-700` fa
 * **1,96**. Non diventa una variabile finché non si sa che cosa deve fare nel tema chiaro, dove
 * un grigio scuro su bianco è un'altra domanda: quando i colori si rifiniranno, la leva giusta è
 * ridichiarare `--separator` in `theme.css`, che sistema anche i separatori disegnati dentro i
 * componenti di HeroUI.
 *
 * ⚠️ **Il nome non ridichiara la taglia del testo.** `TechLabel` porta già il suo `text-[11px]`, e
 * un secondo valore arbitrario della stessa proprietà non si risolve in modo prevedibile: nella
 * stessa classe vince chi sta più in basso nel CSS generato, non chi sta più a destra
 * nell'attributo.
 */
export function TechRule({ children, orientation = 'horizontal', className = '' }: TechRuleProps) {
  const isVertical = orientation === 'vertical';

  return (
    <span
      className={`flex text-brand/60 ${isVertical ? 'items-center gap-4' : 'flex-col gap-2'} ${className}`}
    >
      <Separator
        orientation={orientation}
        className={`bg-gray-700 ${isVertical ? 'h-4 shrink-0' : 'w-full'}`}
      />
      <TechLabel>{children}</TechLabel>
    </span>
  );
}
