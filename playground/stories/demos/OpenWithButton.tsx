'use client';

import { Button } from '@heroui/react';
import { cloneElement, isValidElement, useState, type ReactNode } from 'react';

/**
 * Un comando che apre un dialogo, e il dialogo che si chiude davvero.
 *
 * ⚠️ Sta qui e non nella storia per la stessa ragione di `WithHandle`: l'aperto e il chiuso sono uno
 * stato, e un file di storie non importa ganci. La variante arriva già resa, e questo pezzo le
 * attacca le quattro prop che servono ai due dialoghi — `isOpen` e `onOpenChange` per
 * `PlagueDialog`, `onConfirm` e `onCancel` per `PlagueConfirmDialog`. Quelle che un dialogo non ha,
 * le ignora.
 */
export function OpenWithButton({ children, label }: { children: ReactNode; label: string }) {
  const [aperto, setAperto] = useState(false);
  const chiudi = () => setAperto(false);

  return (
    <div className="flex flex-col items-start gap-4">
      <Button variant="secondary" onPress={() => setAperto(true)}>
        {label}
      </Button>
      {isValidElement<Record<string, unknown>>(children)
        ? cloneElement(children, { isOpen: aperto, onOpenChange: setAperto, onConfirm: chiudi, onCancel: chiudi })
        : children}
    </div>
  );
}
