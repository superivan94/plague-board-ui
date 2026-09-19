import { act, render } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ParticleBurst, type ParticleBurstHandle } from '../src';
import { particelle } from './particelle';
import { menoMovimento } from './preferenze';

const avanza = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

describe('ParticleBurst', () => {
  const matchMediaVero = window.matchMedia;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    window.matchMedia = matchMediaVero;
  });

  it('da fermo non sprigiona niente', () => {
    render(
      <ParticleBurst>
        <span>grazie</span>
      </ParticleBurst>,
    );

    avanza(5000);
    expect(particelle()).toHaveLength(0);
  });

  it('al comando ne parte una manciata, ognuna con la sua direzione', () => {
    const scoppio = createRef<ParticleBurstHandle>();
    render(
      <ParticleBurst ref={scoppio} count={6}>
        <span>grazie</span>
      </ParticleBurst>,
    );

    act(() => scoppio.current?.burst());
    expect(particelle()).toHaveLength(6);

    // ⚠️ Le tre variabili devono esserci **tutte**: un `@keyframes` a cui ne manca una ripiega sul
    // valore di riserva e la particella resta ferma al centro, senza che niente diventi rosso.
    for (const particella of particelle()) {
      const stile = (particella as HTMLElement).style;
      expect(stile.getPropertyValue('--pb-dx')).toMatch(/px$/);
      expect(stile.getPropertyValue('--pb-dy')).toMatch(/px$/);
      expect(stile.getPropertyValue('--pb-apex')).toMatch(/^-.*px$/);
      expect(stile.getPropertyValue('--pb-spin')).toMatch(/deg$/);
      expect(Number.parseFloat(stile.animationDuration)).toBeGreaterThan(0);
    }
  });

  it('ognuna se ne va quando la sua vita è finita', () => {
    const scoppio = createRef<ParticleBurstHandle>();
    render(
      // ⚠️ `staggerMs` a zero perché qui si guarda **la vita**: col ritardo, ognuna vive quanto il
      // suo volo più la sua attesa, e i quattro numeri non scadrebbero insieme.
      <ParticleBurst ref={scoppio} count={4} lifeMs={[1000, 1000]} staggerMs={0}>
        <span>grazie</span>
      </ParticleBurst>,
    );

    act(() => scoppio.current?.burst());
    avanza(999);
    expect(particelle()).toHaveLength(4);

    avanza(1);
    expect(particelle()).toHaveLength(0);
  });

  it('una parte dopo l’altra: è quello che la fa sembrare una fontana', () => {
    const scoppio = createRef<ParticleBurstHandle>();
    render(
      <ParticleBurst ref={scoppio} count={4} staggerMs={30}>
        <span>grazie</span>
      </ParticleBurst>,
    );

    act(() => scoppio.current?.burst());

    const ritardi = [...particelle()].map((n) => (n as HTMLElement).style.animationDelay);
    expect(ritardi).toStrictEqual(['0ms', '30ms', '60ms', '90ms']);
  });

  it('dice quanto dura, e dice zero quando non parte', () => {
    const scoppio = createRef<ParticleBurstHandle>();
    render(
      <ParticleBurst ref={scoppio} count={4} lifeMs={[1000, 1000]} staggerMs={50}>
        <span>grazie</span>
      </ParticleBurst>,
    );

    // ⚠️ La più lunga, non la somma: l'ultima parte con 150 ms di ritardo e vola per mille.
    let durata = 0;
    act(() => {
      durata = scoppio.current?.burst() ?? -1;
    });
    expect(durata).toBe(1150);

    // Mentre zampilla, il secondo getto non parte — e chi chiede lo sa da questo zero.
    act(() => {
      durata = scoppio.current?.burst() ?? -1;
    });
    expect(durata).toBe(0);
  });

  it('un getto alla volta: finché zampilla, premere di nuovo non fa niente', () => {
    const scoppio = createRef<ParticleBurstHandle>();
    render(
      <ParticleBurst ref={scoppio} count={3} lifeMs={[1000, 1000]} staggerMs={0}>
        <span>grazie</span>
      </ParticleBurst>,
    );

    act(() => scoppio.current?.burst());
    avanza(500);
    // ⚠️ Due getti sovrapposti non si leggono come due: si leggono come un pasticcio.
    act(() => scoppio.current?.burst());
    expect(particelle()).toHaveLength(3);

    // Finito il primo, il comando torna a funzionare.
    avanza(500);
    expect(particelle()).toHaveLength(0);
    act(() => scoppio.current?.burst());
    expect(particelle()).toHaveLength(3);
  });

  it('con meno movimento non parte niente', () => {
    menoMovimento(true);
    const scoppio = createRef<ParticleBurstHandle>();
    render(
      <ParticleBurst ref={scoppio}>
        <span>grazie</span>
      </ParticleBurst>,
    );

    // ⚠️ Si guarda **subito**, non dopo un `avanza`: con la vita predefinita di 0,7–1,2 s, dopo
    // due secondi la scena è vuota comunque, e il caso passerebbe anche con la guardia spenta.
    // Provato togliendola: restava verde, ed è il motivo per cui questa riga sta qui e non sotto.
    act(() => scoppio.current?.burst());
    expect(particelle()).toHaveLength(0);

    avanza(2000);
    expect(particelle()).toHaveLength(0);
  });

  it('lo smontaggio spegne tutte le scadenze', () => {
    const scoppio = createRef<ParticleBurstHandle>();
    const { unmount } = render(
      <ParticleBurst ref={scoppio} count={5}>
        <span>grazie</span>
      </ParticleBurst>,
    );

    act(() => scoppio.current?.burst());
    expect(vi.getTimerCount()).toBe(5);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
