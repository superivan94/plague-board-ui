import { act, render } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RatSwarm, type RatSwarmHandle } from '../src';
import { fineTraversata } from './animazioni';

const ratti = (container: HTMLElement) => container.querySelectorAll('.pb-rat-run');

const avanza = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

/**
 * Accende o spegne `prefers-reduced-motion`. Il polyfill di `tests/setup.ts` risponde sempre
 * `false`: qui si sostituisce per il tempo di un test, e si rimette com'era.
 */
const menoMovimento = (acceso: boolean) => {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: acceso && query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
};

/** Mette la pagina in secondo piano, come una scheda dietro a un'altra. */
const paginaNascosta = (nascosta: boolean) => {
  Object.defineProperty(document, 'visibilityState', { value: nascosta ? 'hidden' : 'visible', configurable: true });
  Object.defineProperty(document, 'hidden', { value: nascosta, configurable: true });
};

describe('RatSwarm', () => {
  const matchMediaVero = window.matchMedia;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    window.matchMedia = matchMediaVero;
    paginaNascosta(false);
  });

  it('non fa entrare nessuno finché la prima attesa non è scaduta, e la dichiara chi lo monta', () => {
    const { container } = render(<RatSwarm everyMs={[1000, 1000]} />);

    // ⚠️ Il primo render non ha ratti anche sul server: è ciò che tiene insieme l'idratazione,
    // visto che livrea, kit e altezza si pescano a caso.
    expect(ratti(container)).toHaveLength(0);

    avanza(999);
    expect(ratti(container)).toHaveLength(0);

    avanza(1);
    expect(ratti(container)).toHaveLength(1);
  });

  it('ne fa entrare uno a ogni attesa, e ognuno è un nodo suo', () => {
    const { container } = render(<RatSwarm everyMs={[1000, 1000]} />);

    avanza(3000);
    expect(ratti(container)).toHaveLength(3);
  });

  it('senza un tetto dichiarato non c’è nessun tetto', () => {
    const { container } = render(<RatSwarm everyMs={[1000, 1000]} />);

    // In jsdom nessuno esce, perché `animationend` non lo emette nessuno: è il caso adatto a
    // verificare che il valore predefinito non stia limitando di nascosto.
    avanza(12_000);
    expect(ratti(container)).toHaveLength(12);
  });

  it('rispetta il tetto quando glielo si dichiara', () => {
    const { container } = render(<RatSwarm everyMs={[1000, 1000]} maxAlive={2} />);

    avanza(10_000);
    expect(ratti(container)).toHaveLength(2);
  });

  it('non genera mentre la pagina è in secondo piano', () => {
    // ⚠️ È il caso misurato in browser: con la scheda dietro il browser sospende le animazioni,
    // quindi `animationend` non arriva e nessun ratto esce — ma i timer continuano. Generare lì
    // vorrebbe dire accumulare ratti fermi che nessuno vede e nessuno toglie.
    paginaNascosta(true);
    const { container } = render(<RatSwarm everyMs={[1000, 1000]} />);

    avanza(10_000);
    expect(ratti(container)).toHaveLength(0);

    paginaNascosta(false);
    avanza(1000);
    expect(ratti(container)).toHaveLength(1);
  });

  it('toglie il ratto che è uscito dall’altra parte', () => {
    const { container } = render(<RatSwarm everyMs={[1000, 1000]} />);

    avanza(2000);
    expect(ratti(container)).toHaveLength(2);

    act(() => fineTraversata(ratti(container)[0]));
    expect(ratti(container)).toHaveLength(1);
  });

  it('dal riferimento si fa uscire un ratto adesso', () => {
    const sciame = createRef<RatSwarmHandle>();
    const { container } = render(<RatSwarm ref={sciame} everyMs={[60_000, 60_000]} />);

    expect(ratti(container)).toHaveLength(0);
    act(() => sciame.current?.spawn());
    expect(ratti(container)).toHaveLength(1);
  });

  it('un render del genitore non azzera l’attesa', () => {
    // ⚠️ `everyMs` è un letterale: a ogni render del genitore è un array nuovo. Se l'effetto del
    // timer dipendesse dall'array invece che dai due numeri, ogni render rimetterebbe l'attesa a
    // zero e con un genitore che si ridisegna spesso non uscirebbe **mai** un ratto.
    const Genitore = ({ n }: { n: number }) => (
      <div>
        <span>{n}</span>
        <RatSwarm everyMs={[1000, 1000]} />
      </div>
    );

    const { container, rerender } = render(<Genitore n={0} />);
    avanza(600);
    rerender(<Genitore n={1} />);
    avanza(400);

    expect(ratti(container)).toHaveLength(1);
  });

  it('con meno movimento non genera niente, né dal timer né a mano', () => {
    // ⚠️ Non è un guasto, ed è il motivo per cui sta scritto in tre posti: con
    // `prefers-reduced-motion` la traversata dura un millisecondo, quindi un ratto sarebbe un
    // guizzo di un fotogramma e il timer lavorerebbe per dipingere l'invisibile.
    menoMovimento(true);
    const sciame = createRef<RatSwarmHandle>();
    const { container } = render(<RatSwarm ref={sciame} everyMs={[1000, 1000]} />);

    avanza(10_000);
    act(() => sciame.current?.spawn());

    expect(ratti(container)).toHaveLength(0);
  });

  it('smette quando lo si toglie dalla pagina', () => {
    const { container, unmount } = render(<RatSwarm everyMs={[1000, 1000]} />);

    avanza(1000);
    expect(ratti(container)).toHaveLength(1);

    unmount();
    avanza(10_000);
    expect(document.querySelectorAll('.pb-rat-run')).toHaveLength(0);
  });
});
