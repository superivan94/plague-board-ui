import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RAT_LIVERIES, Rat, type RatLivery } from '../src';

const parti = (container: HTMLElement) => ({
  coda: container.querySelector('.pb-rat-tail'),
  corpo: container.querySelector('.pb-rat-body'),
  orecchie: container.querySelector('.pb-rat-ears'),
  zampeAvanti: container.querySelectorAll('.pb-rat-leg-front'),
  zampeDietro: container.querySelectorAll('.pb-rat-leg-back'),
});

describe('Rat', () => {
  it('le tre livree sono quelle di là, e si scelgono per nome', () => {
    for (const livery of Object.keys(RAT_LIVERIES) as RatLivery[]) {
      const { container, unmount } = render(<Rat livery={livery} />);

      // ⚠️ Il colore si legge dalla **coda**, non dal corpo: è l'unica parte che nella livrea
      // bianca non vale quanto il corpo — `tail` è il rosa `#fec5d6`, `body` il bianco sporco. Un
      // test che guardasse il corpo resterebbe verde anche scambiando due slot su tre.
      expect(parti(container).coda).toHaveAttribute('stroke', RAT_LIVERIES[livery].tail);
      unmount();
    }
  });

  it('senza livrea è grigio, che è il ratto normale', () => {
    const { container } = render(<Rat />);

    expect(parti(container).coda).toHaveAttribute('stroke', RAT_LIVERIES.grey.tail);
  });

  it('non porta un foglio di stile dentro', () => {
    const { container } = render(<Rat />);

    // ⚠️ È il contratto di questo componente, non un dettaglio. L'originale di RattInventario
    // teneva **novanta righe** di `<style>` incorporato nell'SVG, con sei `@keyframes` dentro: così
    // ogni ratto sullo schermo ne porta una copia, e le animazioni non si possono spegnere né
    // riusare. Qui il disegno è fermo, e chi lo fa correre è un altro.
    expect(container.querySelector('style')).toBeNull();
    expect(container.querySelector('[style*="animation"]')).toBeNull();
  });

  it('le parti che si muovono hanno un nome, perché qualcun altro le muoverà', () => {
    const { container } = render(<Rat />);
    const p = parti(container);

    // ⚠️ Sono la cucitura verso `RatRun`: il disegno resta fermo, e le regole che animano coda,
    // orecchie e zampe stanno in `animations.css`, agganciate a una classe messa più in alto. Senza
    // questi nomi, far correre il ratto vorrebbe dire rimetterci dentro il foglio di stile.
    expect(p.coda).not.toBeNull();
    expect(p.corpo).not.toBeNull();
    expect(p.orecchie).not.toBeNull();
    expect(p.zampeAvanti).toHaveLength(2);
    expect(p.zampeDietro).toHaveLength(2);
  });

  it("la misura è l'altezza, e la lunghezza viene dal disegno", () => {
    const { container } = render(<Rat size={50} />);
    const svg = container.querySelector('svg');

    // ⚠️ Un ratto è lungo tre volte quanto è alto, quindi «il lato» non vuol dire niente: `size` è
    // l'altezza, come per `RatMascot`, e la larghezza la porta il rapporto del disegno.
    expect(svg).toHaveAttribute('height', '50');
    expect(Number(svg?.getAttribute('width'))).toBeGreaterThan(50);
  });

  it('è decorativo finché non gli si dà un nome', () => {
    const { container, rerender } = render(<Rat />);

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    rerender(<Rat title="Un ratto" />);
    expect(screen.getByRole('img', { name: 'Un ratto' })).toBeInTheDocument();
  });

  it('il disegno sta tutto dentro la sua cornice', () => {
    const { container } = render(<Rat />);
    const viewBox = container.querySelector('svg')?.getAttribute('viewBox')?.split(' ').map(Number);

    // ⚠️ Di là il `viewBox` era `0 0 120 60` con `overflow: visible`, e la coda usciva fino a
    // x = −33,75: il ratto sbordava dalla propria scatola, quindi la sua misura non diceva quanto
    // spazio occupava. Qui la cornice comincia in negativo perché **contiene** la coda.
    //
    // ⚠️ I numeri vengono dai **pixel dipinti** — l'SVG su una tela a 4×, primo e ultimo pixel non
    // trasparente — perché né `getBBox()` né `getBoundingClientRect()` contano il tratto: danno la
    // coda a −31,67 invece che a −33,75, e fidandosi di loro resterebbe tagliata di due unità.
    expect(viewBox?.[0]).toBeLessThanOrEqual(-33.75);
    expect(viewBox?.[0] + viewBox?.[2]).toBeGreaterThanOrEqual(122);
    expect(container.querySelector('svg')).not.toHaveStyle({ overflow: 'visible' });
  });
});
