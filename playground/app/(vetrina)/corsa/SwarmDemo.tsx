'use client';

import { Button } from '@heroui/react';
import { RatSwarm, TechLabel, useReducedMotion, type RatSwarmHandle } from 'plague-board-ui';
import { useRef, useState } from 'react';

/** Gli estremi del cursore, e da dove parte: fitto, perché è una demo che si guarda dieci secondi. */
const CADENZA_MIN = 400;
const CADENZA_MAX = 15_000;
const CADENZA_INIZIALE = 2400;

/** La cadenza predefinita di `RatSwarm`: dieci secondi in media, cioè `[5000, 15000]`. */
const CADENZA_PREDEFINITA = 10_000;

/**
 * Da una cadenza media ai due estremi di `everyMs`: metà e una volta e mezzo, che è la forma del
 * valore predefinito della libreria — con dieci secondi vengono esattamente i suoi `[5000, 15000]`.
 */
const estremi = (media: number): [number, number] => [media / 2, media * 1.5];

const secondi = (ms: number) => (ms / 1000).toFixed(1).replace('.', ',');

/**
 * Lo sciame come lo monterebbe un'applicazione: una fascia `relative` con `overflow-hidden`, i
 * numeri scelti da chi lo mette, e il riferimento per far uscire un ratto a comando — che in
 * RattInventario è il clic sul titolo dell'intestazione.
 *
 * ⚠️ **Le prop impostate stanno sopra la fascia, il comando sotto**, e non sulla stessa riga: con
 * la cadenza accanto al pulsante sembrava che fosse lui a cambiarla. `spawn()` non tocca niente —
 * aggiunge un ratto e basta, e il turno del timer arriva quando deve.
 *
 * ⚠️ **Muovendo il cursore l'attesa in corso riparte**, perché `everyMs` cambia e con lui il
 * timer: durante il trascinamento non entra nessun ratto, e il primo arriva dopo il rilascio. È il
 * comportamento giusto — una cadenza nuova non si applica al giro già cominciato — e si vede solo
 * qui, dove quei numeri li muove una persona invece di stare scritti nella pagina.
 *
 * ⚠️ La riga sotto il comando c'è **sempre**, non solo quando la preferenza è accesa: uno sciame
 * che con «meno movimento» non genera niente è indistinguibile da uno rotto, e questa pagina è il
 * posto dove si impara la differenza.
 */
export function SwarmDemo() {
  const sciame = useRef<RatSwarmHandle>(null);
  const menoMovimento = useReducedMotion();
  const [cadenza, setCadenza] = useState(CADENZA_INIZIALE);
  const [minimo, massimo] = estremi(cadenza);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <label className="flex items-center gap-3">
          <TechLabel className="text-muted">cadenza</TechLabel>
          <input
            type="range"
            min={CADENZA_MIN}
            max={CADENZA_MAX}
            step={100}
            value={cadenza}
            onChange={(e) => setCadenza(Number(e.target.value))}
            className="w-48 accent-brand-ink"
            aria-label="Un ratto ogni quanti millisecondi, in media"
          />
          <span className="w-80 whitespace-nowrap tabular-nums text-muted">
            un ratto ogni {secondi(cadenza)} s · everyMs [{minimo}, {massimo}]
          </span>
        </label>
        <span className="flex items-center gap-2">
          <TechLabel className="text-muted">maxAlive</TechLabel>
          <span className="text-muted">non dichiarato — nessun tetto</span>
        </span>
      </div>

      <div className="relative h-56 overflow-hidden rounded-lg border border-border bg-surface">
        <RatSwarm ref={sciame} everyMs={[minimo, massimo]} crossingMs={[3000, 5000]} band={[12, 70]} size={52} />
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
        Il cursore è di questa pagina, non del componente: <code>everyMs</code> è una prop, e un
        ratto ogni mezzo secondo o uno ogni quindici sono lo stesso sciame con due numeri diversi.
        Senza dichiararla vale {secondi(CADENZA_PREDEFINITA)} s, cioè{' '}
        <code>[{estremi(CADENZA_PREDEFINITA)[0]}, {estremi(CADENZA_PREDEFINITA)[1]}]</code>: gli
        estremi si ripescano a ogni giro, così il passaggio non diventa un metronomo.
      </p>

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
