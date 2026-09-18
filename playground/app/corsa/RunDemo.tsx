'use client';

import { RAT_LIVERIES, RatRun, type RatLivery, type RatRunProps } from 'plague-board-ui';
import { useEffect, useState, useSyncExternalStore } from 'react';

/** Un ratto come lo pescherebbe lo sciame: livrea, kit, lato, altezza e passo scelti a caso. */
interface Passaggio {
  readonly key: number;
  readonly ratto: Pick<RatRunProps, 'livery' | 'hasSkull' | 'hasCollar' | 'hasVial' | 'from' | 'top' | 'duration'>;
}

/** La pausa fra un ratto uscito e il prossimo che entra. */
const PAUSA_MS = 800;

const LIVREE = Object.keys(RAT_LIVERIES) as RatLivery[];
const caso = () => Math.random() < 0.5;

const pesca = (key: number): Passaggio => ({
  key,
  ratto: {
    livery: LIVREE[Math.floor(Math.random() * LIVREE.length)],
    hasSkull: caso(),
    hasCollar: caso(),
    hasVial: caso(),
    from: caso() ? 'left' : 'right',
    top: `${15 + Math.floor(Math.random() * 45)}%`,
    duration: 4 + Math.random() * 2,
  },
});

const nessunaSottoscrizione = () => () => {};

/**
 * `true` solo dopo l'idratazione. Un componente client viene reso anche sul server, e ciò che
 * dipende dal caso — un `Math.random` — lì dà un risultato diverso da quello del client: React
 * scarta l'HTML del server, ridisegna la pagina intera e lo dice in console. Con
 * `useSyncExternalStore` il server e la passata di idratazione leggono `false` — la fascia è vuota
 * in entrambi — e il ratto compare al render successivo, che è solo del client. È il modo di dire
 * «solo sul client» senza un `setState` dentro un effetto, che il lint rifiuta.
 */
const useMontato = () =>
  useSyncExternalStore(
    nessunaSottoscrizione,
    () => true,
    () => false,
  );

/**
 * La fascia in cui un ratto attraversa lo schermo, e poco dopo che è uscito ne entra un altro
 * diverso. È un `RatSwarm` da uno: il caso — quale ratto, da dove, a che altezza — è qui, e
 * `RatRun` non ne sa niente. ⚠️ La `key` cambia a ogni passaggio, così il contenitore è un nodo
 * **nuovo** e la traversata riparte da fuori: riusando il nodo, l'animazione non ripartirebbe.
 *
 * ⚠️ **Fra un ratto e l'altro c'è una pausa, e non è estetica.** Con `prefers-reduced-motion` la
 * traversata dura un millisecondo e `onDone` arriva subito: rimettere un ratto direttamente
 * nell'`onDone` del precedente farebbe girare la fascia a vuoto, un render a fotogramma.
 */
export function RunDemo() {
  const montato = useMontato();
  const [passaggio, setPassaggio] = useState<Passaggio>(() => pesca(0));
  const [uscito, setUscito] = useState(false);

  useEffect(() => {
    if (!uscito) return;
    const timer = setTimeout(() => {
      setPassaggio((precedente) => pesca(precedente.key + 1));
      setUscito(false);
    }, PAUSA_MS);
    return () => clearTimeout(timer);
  }, [uscito]);

  return (
    <div className="relative h-40 overflow-hidden rounded-lg border border-border bg-surface">
      {montato && !uscito && (
        <RatRun key={passaggio.key} {...passaggio.ratto} size={56} onDone={() => setUscito(true)} />
      )}
    </div>
  );
}
