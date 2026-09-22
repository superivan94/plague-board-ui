'use client';

import { GoogleSignInButton, TechLabel } from 'plague-board-ui';
import { useEffect, useRef, useState } from 'react';

/** Quanto dura l'attesa finta: il tempo che ci mette un popup di Google ad aprirsi e tornare. */
const ATTESA_MS = 2500;

/**
 * Il comando di accesso nei suoi due stati: a riposo e in attesa.
 *
 * ⚠️ Sta in un file suo perché `onPress` è una funzione, e una funzione non attraversa il confine
 * fra una pagina server e un componente client. È la stessa ragione per cui `/corsa` ha `SwarmDemo`.
 */
export function SignInDemo() {
  const [inAttesa, setInAttesa] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const accedi = () => {
    setInAttesa(true);
    timer.current = window.setTimeout(() => setInAttesa(false), ATTESA_MS);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2 rounded-xl border border-border p-6">
        <GoogleSignInButton isPending={inAttesa} onPress={accedi} />
        <TechLabel className="text-muted">
          premilo · torna a riposo dopo {ATTESA_MS / 1000} secondi
        </TechLabel>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border p-6">
        {/* L'attesa ferma, per guardarla senza premere niente. Il comando resta raggiungibile con
            il Tab: è la differenza fra `isPending` e `isDisabled`, e si prova solo così. */}
        <GoogleSignInButton isPending label="Entra nella tana con Google" onPress={() => {}} />
        <TechLabel className="text-muted">isPending · etichetta sostituita</TechLabel>
      </div>
    </div>
  );
}
