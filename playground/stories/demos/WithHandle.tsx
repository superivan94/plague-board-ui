'use client';

import { cloneElement, isValidElement, useState, type ReactNode } from 'react';

/**
 * Un comando accanto a un componente che si governa col **riferimento** — lo scoppio che parte
 * quando glielo si chiede, lo sciame che fa uscire un ratto adesso.
 *
 * ⚠️ Sta qui e non nella storia perché un riferimento vuole `useRef`, e un file di storie non
 * importa ganci: lo legge anche il catalogo, che è una pagina server. La variante gli arriva già
 * resa, e il riferimento glielo attacca questo pezzo clonandola — che in React 19 è una prop come
 * le altre.
 *
 * ⚠️ Il riferimento è una **funzione che scrive uno stato**, non un `useRef`: un oggetto
 * riferimento passato a `cloneElement` durante il render è ciò che `react-hooks/refs` rifiuta,
 * perché chi lo riceve potrebbe leggerlo subito. Costa un render in più al montaggio.
 */
export function WithHandle<H>({
  children,
  label,
  onPress,
}: {
  children: ReactNode;
  /** Che cosa fa il comando, detto come lo si direbbe: «Sprigiona», «Fai uscire un ratto». */
  label: string;
  /** Che cosa chiedere al riferimento. */
  onPress: (handle: H) => void;
}) {
  const [handle, setHandle] = useState<H | null>(null);

  return (
    <div className="flex flex-col items-start gap-4">
      {isValidElement<{ ref?: unknown }>(children) ? cloneElement(children, { ref: setHandle }) : children}
      <button
        type="button"
        onClick={() => {
          if (handle) onPress(handle);
        }}
        className="rounded-md border border-border px-3 py-1 text-sm focus-visible:focus-ring"
      >
        {label}
      </button>
    </div>
  );
}
