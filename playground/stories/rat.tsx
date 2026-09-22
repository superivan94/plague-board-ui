import { Rat, RatMascot, RatRun, RatSwarm, type RatSwarmHandle } from 'plague-board-ui';

import { WithHandle } from './demos/WithHandle';
import { defineStory, type StoryDecorator } from './types';

export const ratStory = defineStory(Rat, {
  description:
    'Il ratto, ricalcato dalle tre illustrazioni di riferimento: tre livree e tre accessori, fermo o col passo.',
  variants: [
    { name: 'grigio, fermo', args: { size: 120 } },
    { name: 'albino', args: { size: 120, livery: 'white' } },
    { name: 'bruno col teschio', args: { size: 120, livery: 'brown', hasSkull: true } },
    { name: 'col collare e l’ampolla', args: { size: 120, hasCollar: true, hasVial: true } },
    { name: 'col passo', args: { size: 120, isRunning: true } },
  ],
});

/**
 * La fascia che i ratti attraversano.
 *
 * ⚠️ Un ratto che corre non disegna un contenitore suo: va dentro un genitore `relative` che taglia
 * il traboccamento, e il posto lo sceglie chi lo mette.
 */
function lane(height: string): StoryDecorator {
  return function inLane(variant) {
    return <div className={`relative overflow-hidden rounded-lg border border-border ${height}`}>{variant}</div>;
  };
}

export const ratRunStory = defineStory(RatRun, {
  description:
    'Un ratto che attraversa una volta, da un lato all’altro, e poi se ne va. Chi lo vuole rivedere ricarica la cornice.',
  variants: [
    { name: 'da sinistra', args: { top: 16 } },
    { name: 'da destra, bruno', args: { top: 16, from: 'right', livery: 'brown' } },
    { name: 'col teschio, più lento', args: { top: 16, hasSkull: true, duration: 9 } },
  ],
  decorators: [lane('h-24')],
});

export const ratSwarmStory = defineStory(RatSwarm, {
  description:
    'Lo sciame: ogni tanto ne fa passare uno, con livrea, lato, altezza e passo pescati a caso. Con «meno movimento» non ne fa passare nessuno.',
  variants: [
    { name: 'i tempi di casa, da 5 a 15 secondi', args: {} },
    { name: 'fitto, uno alla volta', args: { everyMs: [800, 1600], crossingMs: [3000, 4500], maxAlive: 1, size: 56 } },
  ],
  // ⚠️ Il comando sta **dentro** la fascia: il riferimento va attaccato allo sciame, quindi
  // `WithHandle` deve avvolgerlo direttamente, e fuori c'è solo la fascia.
  decorators: [
    lane('h-40'),
    (variant) => (
      <WithHandle<RatSwarmHandle> label="Fai uscire un ratto" onPress={(sciame) => sciame.spawn()}>
        {variant}
      </WithHandle>
    ),
  ],
});

export const ratMascotStory = defineStory(RatMascot, {
  description: 'La faccia di marca: la mascotte con l’ampolla, che viaggia col pacchetto.',
  variants: [
    { name: 'la misura predefinita', args: {} },
    { name: 'grande', args: { size: 160 } },
  ],
});
