'use client';

import { Button } from '@heroui/react';
import { RatSwarm, TechLabel, useReducedMotion, type RatSwarmHandle } from 'plague-board-ui';
import { useRef } from 'react';

/** Ogni quanto entra un ratto, qui: fitto, perché una demo che si guarda per dieci secondi. */
const OGNI_MS: readonly [number, number] = [1200, 3500];

/**
 * Lo sciame come lo monterebbe un'applicazione: una fascia `relative` con `overflow-hidden`, i
 * numeri scelti da chi lo mette, e il riferimento per far uscire un ratto a comando — che in
 * RattInventario è il clic sul titolo dell'intestazione.
 *
 * ⚠️ **Le prop impostate stanno sopra la fascia, il comando sotto**, e non sulla stessa riga: con
 * la cadenza accanto al pulsante sembrava che fosse lui a cambiarla. `spawn()` non tocca niente —
 * aggiunge un ratto e basta, e il turno del timer arriva quando deve.
 *
 * ⚠️ La riga sotto il comando c'è **sempre**, non solo quando la preferenza è accesa: uno sciame
 * che con «meno movimento» non genera niente è indistinguibile da uno rotto, e questa pagina è il
 * posto dove si impara la differenza.
 */
export function SwarmDemo() {
  const sciame = useRef<RatSwarmHandle>(null);
  const menoMovimento = useReducedMotion();

  return (
    <section className="flex flex-col gap-3">
      <dl className="flex flex-wrap gap-x-6 gap-y-1">
        <span className="flex items-baseline gap-2">
          <dt>
            <TechLabel className="text-muted">everyMs</TechLabel>
          </dt>
          <dd className="text-sm">
            [{OGNI_MS[0]}, {OGNI_MS[1]}] — un ratto ogni {OGNI_MS[0] / 1000}–{OGNI_MS[1] / 1000} s
          </dd>
        </span>
        <span className="flex items-baseline gap-2">
          <dt>
            <TechLabel className="text-muted">maxAlive</TechLabel>
          </dt>
          <dd className="text-sm">non dichiarato — nessun tetto</dd>
        </span>
      </dl>

      <div className="relative h-56 overflow-hidden rounded-lg border border-border bg-surface">
        <RatSwarm ref={sciame} everyMs={OGNI_MS} crossingMs={[3000, 5000]} band={[12, 70]} size={52} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" isDisabled={menoMovimento} onPress={() => sciame.current?.spawn()}>
          Fai uscire un ratto
        </Button>
        <TechLabel className="text-muted">
          spawn() dal ref: uno adesso, fuori turno — la cadenza non la tocca
        </TechLabel>
      </div>

      <p className="max-w-2xl text-sm text-muted">
        {menoMovimento ? (
          <>
            <strong className="text-foreground">Il tuo sistema chiede meno movimento</strong>, e lo
            sciame lo rispetta: la fascia resta vuota e il comando è spento.
          </>
        ) : (
          <>
            <strong className="text-foreground">Con «meno movimento» questa fascia resta vuota</strong> e
            il comando è spento.
          </>
        )}{' '}
        Non è un guasto: con quella preferenza la traversata dura un millisecondo — è ciò che fa
        arrivare <code>onDone</code> e impedisce a un ratto di restare piantato a metà schermo —
        quindi un ratto in più sarebbe un guizzo che nessuno vede. La preferenza si accende dalle
        impostazioni del sistema, e una pagina la legge con <code>useReducedMotion</code> proprio
        per poterlo dire, invece di sembrare rotta.
      </p>
    </section>
  );
}
