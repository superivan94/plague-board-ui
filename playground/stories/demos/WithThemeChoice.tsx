'use client';

import { cloneElement, isValidElement, useState, type ReactNode } from 'react';

/**
 * Il commutatore del tema con una scelta che si vede: tiene il valore, e lo applica a un riquadro
 * di prova invece che alla pagina.
 *
 * ⚠️ Sta qui per la stessa ragione di `OpenWithButton`: il valore è uno stato, e un file di storie
 * non importa ganci. E si applica al **riquadro**, non alla radice, perché la cornice il suo tema ce
 * l'ha già: è la variante chiara o scura del catalogo. «Del sistema» lascia il riquadro senza classe,
 * cioè col tema della cornice — che qui fa da sistema.
 */
export function WithThemeChoice({ children }: { children: ReactNode }) {
  const [scelta, setScelta] = useState<string>('system');
  const isola = scelta === 'light' ? 'light' : scelta === 'dark' ? 'dark' : '';

  return (
    <div className="flex flex-col items-start gap-4">
      {isValidElement<Record<string, unknown>>(children)
        ? cloneElement(children, { value: scelta, onChange: setScelta })
        : children}
      <div className={`${isola} w-64 rounded-lg border border-border bg-background p-4 text-foreground`}>
        <p className="text-sm">Il riquadro segue la scelta.</p>
        <p className="text-xs text-muted">Scelta: {scelta}</p>
      </div>
    </div>
  );
}
