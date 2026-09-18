import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RAT_LIVERIES, Rat, type RatLivery } from '../src';
import { RAT_BODY, RAT_COLLAR, RAT_HARNESS, RAT_SKULL, RAT_VIEW_BOX } from '../src/brand/ratArt';

const kit = (container: HTMLElement) => ({
  corpo: container.querySelector('.pb-rat-body'),
  teschio: container.querySelector('.pb-rat-skull'),
  collare: container.querySelector('.pb-rat-collar'),
  ampolla: container.querySelector('.pb-rat-vial'),
});

const viewBoxDi = (container: HTMLElement) => container.querySelector('svg')?.getAttribute('viewBox');

describe('Rat', () => {
  it('il disegno è quello ricalcato, e ogni percorso è un percorso', () => {
    // ⚠️ `ratArt.ts` è generato: questo test è quello che si accorge se una rigenerazione lo
    // svuota o lo rompe. Il corpo ricalcato dal grigio ha decine di percorsi, e ognuno comincia
    // con un `M` — è la forma che scrive il vettorizzatore.
    for (const arte of [RAT_BODY, RAT_SKULL, RAT_COLLAR, RAT_HARNESS]) {
      expect(arte.length).toBeGreaterThan(5);
      for (const p of arte) expect(p.d).toMatch(/^M -?\d/);
    }
    // Dopo il despeckle il corpo sta sui 50 percorsi (erano 96 con le briciole): la soglia è
    // sotto per non rompersi a ogni taratura, e sopra il livello in cui il ricalco è vuoto.
    expect(RAT_BODY.length).toBeGreaterThan(30);
  });

  it('ogni slot del corpo trova il suo colore in ogni livrea', () => {
    for (const livery of Object.keys(RAT_LIVERIES) as RatLivery[]) {
      const { container, unmount } = render(<Rat livery={livery} />);

      // ⚠️ Il tipo lo garantisce già, ma il tipo non vede un file rigenerato con uno slot nuovo che
      // qualcuno ha dimenticato di aggiungere alle livree: qui nessun percorso può restare senza
      // riempimento.
      for (const p of kit(container).corpo!.querySelectorAll('path')) {
        expect(p.getAttribute('fill')).toMatch(/^#[0-9a-f]{6}$/);
      }
      unmount();
    }
  });

  it('le tre livree sono davvero tre: il pelo cambia, il rosa e il rosso no', () => {
    const peli = (Object.keys(RAT_LIVERIES) as RatLivery[]).map((l) => RAT_LIVERIES[l].fur);
    expect(new Set(peli).size).toBe(3);

    // ⚠️ Occhio rosso e rosa delle estremità sono l'identità comune dei tre, come nelle reference:
    // un ratto senza occhio rosso non è un Ludoratto.
    for (const livery of Object.keys(RAT_LIVERIES) as RatLivery[]) {
      expect(RAT_LIVERIES[livery].eye).toBe(RAT_LIVERIES.grey.eye);
      expect(RAT_LIVERIES[livery].pink).toBe(RAT_LIVERIES.grey.pink);
      expect(RAT_LIVERIES[livery].ink).toBe(RAT_LIVERIES.grey.ink);
    }
  });

  it("l'occhio prende il colore della livrea", () => {
    const { container } = render(<Rat livery="brown" />);
    const occhi = [...kit(container).corpo!.querySelectorAll('path')].filter(
      (p) => p.getAttribute('fill') === RAT_LIVERIES.brown.eye,
    );

    expect(occhi.length).toBeGreaterThan(0);
  });

  it('senza livrea è grigio, che è il ratto normale', () => {
    const { container } = render(<Rat />);
    const peli = [...kit(container).corpo!.querySelectorAll('path')].filter(
      (p) => p.getAttribute('fill') === RAT_LIVERIES.grey.fur,
    );

    expect(peli.length).toBeGreaterThan(0);
  });

  it('non porta un foglio di stile dentro', () => {
    const { container } = render(<Rat hasSkull hasCollar hasVial />);

    // ⚠️ È il contratto di questo componente. L'originale di RattInventario teneva **novanta
    // righe** di `<style>` incorporato nell'SVG: così ogni ratto sullo schermo ne porta una copia,
    // e le animazioni non si possono spegnere né riusare. Qui il disegno è fermo, e chi lo fa
    // correre è un altro.
    expect(container.querySelector('style')).toBeNull();
    expect(container.querySelector('[style*="animation"]')).toBeNull();
  });

  it("nasce nudo, e i tre kit si accendono uno indipendentemente dall'altro", () => {
    const nudo = render(<Rat />);
    expect(kit(nudo.container).teschio).toBeNull();
    expect(kit(nudo.container).collare).toBeNull();
    expect(kit(nudo.container).ampolla).toBeNull();
    nudo.unmount();

    // ⚠️ Tre interruttori e non un menù: uno sciame li deve poter combinare a caso — un bruno con
    // l'ampolla, un albino col teschio — e otto combinazioni vengono da tre booleani.
    const soloCollare = render(<Rat hasCollar />);
    expect(kit(soloCollare.container).collare).not.toBeNull();
    expect(kit(soloCollare.container).teschio).toBeNull();
    expect(kit(soloCollare.container).ampolla).toBeNull();
    soloCollare.unmount();

    const tutto = render(<Rat hasSkull hasCollar hasVial />);
    expect(kit(tutto.container).teschio).not.toBeNull();
    expect(kit(tutto.container).collare).not.toBeNull();
    expect(kit(tutto.container).ampolla).not.toBeNull();
  });

  it('il teschio sta sopra a tutto, il collare sotto', () => {
    const { container } = render(<Rat hasSkull hasCollar hasVial />);
    const gruppi = [...container.querySelectorAll('svg > g')].map((g) => g.getAttribute('class'));

    // ⚠️ L'ordine è quello del disegno: il teschio copre il bordo dell'orecchio, l'imbracatura
    // passa sopra il collare alla spalla. Invertirli non rompe niente a runtime — e si vede.
    expect(gruppi).toEqual(['pb-rat-body', 'pb-rat-collar', 'pb-rat-vial', 'pb-rat-skull']);
  });

  it("la cornice è la stessa con e senza l'allestimento, ed è quella del ricalco", () => {
    const nudo = render(<Rat />);
    const cornice = viewBoxDi(nudo.container);
    nudo.unmount();

    const vestito = render(<Rat hasSkull hasCollar hasVial />);

    // ⚠️ In uno sciame i ratti hanno tutti la stessa scatola, qualunque cosa portino: se l'ampolla
    // allargasse la cornice, accenderla sposterebbe il ratto e cambierebbe la sua misura. La cornice
    // la misura lo script sui pixel del ratto con tutto addosso, ed è questa.
    expect(viewBoxDi(vestito.container)).toBe(cornice);
    expect(cornice).toBe(`${RAT_VIEW_BOX.x} ${RAT_VIEW_BOX.y} ${RAT_VIEW_BOX.width} ${RAT_VIEW_BOX.height}`);
  });

  it("la misura è l'altezza, e la lunghezza viene dal disegno", () => {
    const { container } = render(<Rat size={50} />);
    const svg = container.querySelector('svg');

    // ⚠️ Un ratto in corsa è lungo il doppio di quanto è alto, quindi «il lato» non vuol dire
    // niente: `size` è l'altezza, come per `RatMascot`, e la larghezza la porta il rapporto.
    expect(svg).toHaveAttribute('height', '50');
    expect(Number(svg?.getAttribute('width'))).toBe(Math.round((50 * RAT_VIEW_BOX.width) / RAT_VIEW_BOX.height));
  });

  it('è decorativo finché non gli si dà un nome', () => {
    const { container, rerender } = render(<Rat />);

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    rerender(<Rat title="Un ratto" />);
    expect(screen.getByRole('img', { name: 'Un ratto' })).toBeInTheDocument();
  });
});
