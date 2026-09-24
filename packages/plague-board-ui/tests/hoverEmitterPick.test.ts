import { describe, expect, it } from 'vitest';

import { comicBubbles, type HoverEffect } from '../src';
import { pesca } from '../src/brand/hoverEmitterPick';

// ⚠️ **Il sorteggio si prova sulla funzione, non sulla pagina**, e non è una scorciatoia: da quando
// gli effimeri volano in un portale, `left` e `top` sono **pixel della finestra** calcolati dal
// riquadro che li genera — e in jsdom ogni rettangolo misura zero, quindi dall'elemento uscirebbe
// sempre `0px`. Qui il riquadro glielo si dà finto, e il conto si vede per intero. Dove nasce
// davvero un fumetto lo dice il collaudo, in browser.
const RIQUADRO = { left: 100, top: 200, width: 140, height: 40 } as DOMRect;

describe('dove nasce un effimero', () => {
  it('con le corsie nessuno nasce all’altezza del precedente', () => {
    const taratura: HoverEffect = {
      everyMs: 100,
      lifeMs: [10_000, 10_000],
      contents: ['x'],
      className: 'pb-prova',
      left: [0, 0],
      top: [0, 300],
      lanes: 3,
    };

    const altezze = [0, 1, 2].map((giro) => pesca(giro, taratura, -1, RIQUADRO).effimero.style.top);

    // I due estremi e la metà, in percentuale dell'altezza del riquadro: 0, 150% e 300% di 40 px
    // sommati al suo bordo di sopra. Tre altezze **fisse** ed equidistanti, percorse a turno.
    expect(altezze).toStrictEqual(['200.0px', '260.0px', '320.0px']);
  });

  it('il fumetto nasce sopra il riquadro e centrato sulla sua metà', () => {
    // ⚠️ L'altra metà della prova di sopra: qui contano gli estremi della taratura vera.
    const { effimero } = pesca(0, comicBubbles(['Mannaggia perché non va!']), -1, RIQUADRO);

    // `left` va dal 35% al 65% di 140 px, sommati al bordo sinistro: da 149 a 191.
    const sinistra = Number.parseFloat(String(effimero.style.left));
    expect(sinistra).toBeGreaterThanOrEqual(149);
    expect(sinistra).toBeLessThanOrEqual(191);
    // La prima corsia è −100% di 40 px: quaranta pixel **sopra** il bordo di sopra.
    expect(effimero.style.top).toBe('160.0px');
  });
});
