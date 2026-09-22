'use client';

import {
  GoogleSignInButton,
  LoginScreen,
  PlagueDivider,
  TechLabel,
  ToxicLevelProvider,
  ToxicLevelSwitch,
  VersionTag,
} from 'plague-board-ui';
import { useState } from 'react';

/**
 * La schermata montata intera, dentro la pagina invece che sulla finestra.
 *
 * ⚠️ `isFullHeight={false}` toglie il `min-h-dvh` e lascia l'altezza a `className`: è l'unico modo
 * di rimpicciolirla, perché due `min-h-*` nello stesso attributo non si risolvono nell'ordine in
 * cui li si scrive.
 */
export function ScreenDemo() {
  const [inAttesa, setInAttesa] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <ToxicLevelProvider defaultLevel="medium">
        <LoginScreen
          isFullHeight={false}
          className="min-h-[34rem] rounded-xl"
          title="Entra nella tana"
          subtitle="Gestisci i manuali della diffusione"
          // Il comando d'angolo governa la scena, non l'accesso: cambiandolo si vede che il
          // fondale che gli sta sotto è lo stesso `PlagueBackground` di `/atmosfera`.
          aside={<ToxicLevelSwitch />}
          footer={<VersionTag version="0.1.0" />}
        >
          <GoogleSignInButton
            isPending={inAttesa}
            onPress={() => {
              setInAttesa(true);
              window.setTimeout(() => setInAttesa(false), 2000);
            }}
          />
          <PlagueDivider>Alternative Access</PlagueDivider>
          <p className="text-center text-xs text-muted">
            Qui ci va quello che l’applicazione vuole: un modulo, un invito, l’avviso di una
            sessione scaduta. La libreria non ne sa niente.
          </p>
        </LoginScreen>
      </ToxicLevelProvider>
      <TechLabel className="text-muted">
        isFullHeight={'{false}'} · min-h-[34rem] · a schermo intero non serve né altezza né bordo
      </TechLabel>
    </div>
  );
}
