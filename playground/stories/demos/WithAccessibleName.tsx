'use client';

import { TechLabel } from 'plague-board-ui';
import { useCallback, useState, useSyncExternalStore, type ReactNode } from 'react';

/**
 * Un comando fatto di solo segno, con scritto sotto **il nome con cui si annuncia**.
 *
 * ⚠️ Serve perché quel nome a schermo non c'è: è l'`aria-label`, e una variante che cambia solo lui
 * è identica alle altre per chi guarda (l'utente, sulle parole di `MusicToggle`). Il nome si legge
 * **dal DOM** e non dalle prop, così è quello vero — e cambia sotto gli occhi quando il comando
 * cambia stato.
 *
 * ⚠️ Il nodo si tiene in uno **stato** attaccato come riferimento, non in un `useRef`: la lettura
 * avviene dentro `useSyncExternalStore`, e un riferimento letto lì è ciò che `react-hooks/refs`
 * rifiuta. Al server e all'idratazione il nome è vuoto; compare al render dopo il montaggio.
 */
export function WithAccessibleName({ children }: { children: ReactNode }) {
  const [box, setBox] = useState<HTMLSpanElement | null>(null);

  const subscribe = useCallback(
    (notify: () => void) => {
      if (!box) return () => {};
      const observer = new MutationObserver(notify);
      observer.observe(box, { attributes: true, subtree: true, attributeFilter: ['aria-label'] });
      return () => observer.disconnect();
    },
    [box],
  );
  const name = useSyncExternalStore(
    subscribe,
    () => box?.querySelector('[aria-label]')?.getAttribute('aria-label') ?? '',
    () => '',
  );

  return (
    <span className="flex flex-col items-start gap-2">
      <span ref={setBox}>{children}</span>
      <TechLabel className="text-muted">si annuncia «{name}»</TechLabel>
    </span>
  );
}
