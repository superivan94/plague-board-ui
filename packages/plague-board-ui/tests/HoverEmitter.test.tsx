import { act, createEvent, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { HoverEmitter, binaryRain, comicBubbles, type HoverEffect } from '../src';

/** Una taratura da banco: cadenza tonda, vita lunga, niente caso nelle posizioni. */
const LENTO: HoverEffect = {
  everyMs: 100,
  lifeMs: [10_000, 10_000],
  contents: ['x'],
  className: 'pb-prova',
  left: [0, 0],
  top: [0, 0],
};

/** La stessa, ma con una vita corta: serve a guardare chi se ne va. */
const BREVE: HoverEffect = { ...LENTO, lifeMs: [1000, 1000] };

const FRASI = ['Mannaggia perché non va!', 'Ma sono Pr0!'];

const effimeri = (container: HTMLElement, classe = 'pb-prova') => container.querySelectorAll(`.${classe}`);
const avanza = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

/**
 * ⚠️ **L'ingresso del puntatore si manda come `pointerover`, non come `pointerenter`.** React non
 * ascolta `pointerenter`: `onPointerEnter` e `onPointerLeave` se li fabbrica lui da `pointerover` e
 * `pointerout`, che sono gli unici due nomi registrati sulla radice.
 *
 * ⚠️ **E `pointerType` si scrive a mano.** jsdom non ha `PointerEvent`, quindi
 * `@testing-library` ripiega su `Event` — che di quel campo non sa niente e lo butta, come fa con
 * `animationName` per le animazioni. Senza questa riga il tocco sarebbe indistinguibile da un mouse
 * e metà dei casi qui sotto passerebbero per il motivo sbagliato.
 */
const muovi = (nome: 'pointerOver' | 'pointerOut', nodo: Element, pointerType: string) => {
  const evento = createEvent[nome](nodo, { bubbles: true });
  Object.defineProperty(evento, 'pointerType', { value: pointerType });
  fireEvent(nodo, evento);
};

const entra = (nodo: Element, tipo = 'mouse') => muovi('pointerOver', nodo, tipo);
const esce = (nodo: Element, tipo = 'mouse') => muovi('pointerOut', nodo, tipo);

/** Accende o spegne `prefers-reduced-motion`, che il polyfill di `setup.ts` dice sempre spento. */
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

const monta = (effect: HoverEffect = LENTO, tapMs?: number) => {
  const resa = render(
    <HoverEmitter effect={effect} tapMs={tapMs}>
      <span>Superivan94</span>
    </HoverEmitter>,
  );

  return { ...resa, emettitore: resa.container.firstElementChild as HTMLElement };
};

describe('HoverEmitter', () => {
  const matchMediaVero = window.matchMedia;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    window.matchMedia = matchMediaVero;
  });

  it('da fermo non sputa niente, e fa il cenno', () => {
    const { container, emettitore } = monta();

    avanza(5000);
    expect(effimeri(container)).toHaveLength(0);
    expect(emettitore.querySelector('.pb-hover-hint')).not.toBeNull();
  });

  it('al passaggio del puntatore ne esce uno subito, e poi uno a ogni giro', () => {
    const { container, emettitore } = monta();

    entra(emettitore);
    // Uno subito: un easter egg che si fa aspettare non l'ha visto nessuno.
    expect(effimeri(container)).toHaveLength(1);

    avanza(99);
    expect(effimeri(container)).toHaveLength(1);

    avanza(1);
    expect(effimeri(container)).toHaveLength(2);

    avanza(200);
    expect(effimeri(container)).toHaveLength(4);
  });

  it('mentre sputa il cenno si ferma, e riprende all’uscita', () => {
    const { emettitore } = monta();

    entra(emettitore);
    expect(emettitore.querySelector('.pb-hover-hint')).toBeNull();

    esce(emettitore);
    expect(emettitore.querySelector('.pb-hover-hint')).not.toBeNull();
  });

  it('all’uscita smette di generarne, ma chi è in volo finisce la sua corsa', () => {
    const { container, emettitore } = monta(BREVE);

    entra(emettitore);
    avanza(200);
    expect(effimeri(container)).toHaveLength(3);

    esce(emettitore);
    // ⚠️ Nessuno sparisce di colpo: con la pioggia binaria sarebbero una ventina insieme.
    avanza(500);
    expect(effimeri(container)).toHaveLength(3);
  });

  it('ognuno se ne va da sé quando la sua vita è finita', () => {
    const { container, emettitore } = monta(BREVE);

    entra(emettitore);
    esce(emettitore);
    expect(effimeri(container)).toHaveLength(1);

    avanza(999);
    expect(effimeri(container)).toHaveLength(1);

    avanza(1);
    expect(effimeri(container)).toHaveLength(0);
  });

  it('col dito parte una raffica a tempo, e alzarlo non la interrompe', () => {
    const { container, emettitore } = monta(LENTO, 300);

    entra(emettitore, 'touch');
    // Il dito si alza subito: su un telefono è tutto quello che succede.
    esce(emettitore, 'touch');
    expect(effimeri(container)).toHaveLength(1);

    avanza(300);
    expect(effimeri(container).length).toBeGreaterThan(1);

    const durante = effimeri(container).length;
    avanza(2000);
    expect(effimeri(container)).toHaveLength(durante);
  });

  it('col mouse, invece, l’uscita ferma tutto subito', () => {
    const { container, emettitore } = monta();

    entra(emettitore);
    esce(emettitore);

    avanza(2000);
    expect(effimeri(container)).toHaveLength(1);
  });

  it('con meno movimento non esce niente, né col mouse né col dito', () => {
    menoMovimento(true);
    const { container, emettitore } = monta();

    entra(emettitore);
    avanza(1000);
    expect(effimeri(container)).toHaveLength(0);

    entra(emettitore, 'touch');
    avanza(1000);
    expect(effimeri(container)).toHaveLength(0);
  });

  it('un ridisegno del genitore non rimette la cadenza a zero', () => {
    const { container, emettitore, rerender } = monta();

    entra(emettitore);
    avanza(50);

    // La taratura è un oggetto: scritta in linea è nuova a ogni render del genitore.
    rerender(
      <HoverEmitter effect={{ ...LENTO }}>
        <span>Superivan94</span>
      </HoverEmitter>,
    );

    avanza(50);
    expect(effimeri(container)).toHaveLength(2);
  });

  it('lo smontaggio spegne la cadenza e tutte le scadenze', () => {
    const { emettitore, unmount } = monta(BREVE);

    entra(emettitore);
    avanza(200);
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('comicBubbles porta in pagina i numeri della scheda dello sviluppatore', () => {
    const { container } = render(
      <HoverEmitter effect={comicBubbles(FRASI)}>
        <span>Superivan94</span>
      </HoverEmitter>,
    );

    entra(container.firstElementChild!);
    const fumetto = effimeri(container, 'pb-comic-bubble')[0] as HTMLElement;

    expect(FRASI).toContain(fumetto.textContent);
    // I 2,5 s del foglio di stile, riscritti sull'elemento: è la sua vita, non un doppione.
    expect(Number.parseFloat(fumetto.style.animationDuration)).toBe(2.5);
    expect(Number.parseFloat(fumetto.style.left)).toBeGreaterThanOrEqual(-15);
    expect(Number.parseFloat(fumetto.style.left)).toBeLessThanOrEqual(85);
    // Nasce **sopra** il riquadro: è il motivo per cui nessun antenato può tagliare.
    expect(Number.parseFloat(fumetto.style.top)).toBeLessThanOrEqual(-10);
    expect(Number.parseFloat(fumetto.style.top)).toBeGreaterThanOrEqual(-70);
  });

  it('binaryRain porta in pagina i numeri della scheda dell’AI', () => {
    const { container } = render(
      <HoverEmitter effect={binaryRain()}>
        <span>AI-Dev</span>
      </HoverEmitter>,
    );

    entra(container.firstElementChild!);
    const cifra = effimeri(container, 'pb-binary-digit')[0] as HTMLElement;

    expect(['0', '1']).toContain(cifra.textContent);
    expect(Number.parseFloat(cifra.style.fontSize)).toBeGreaterThanOrEqual(0.5);
    expect(Number.parseFloat(cifra.style.fontSize)).toBeLessThanOrEqual(1);

    // ⚠️ La durata dev'esserci per forza: `.pb-binary-digit` dichiara l'animazione **senza**, cioè
    // a zero secondi, e una cifra senza questa riga salterebbe dritta al fotogramma trasparente.
    const durata = Number.parseFloat(cifra.style.animationDuration);
    expect(durata).toBeGreaterThanOrEqual(0.8);
    expect(durata).toBeLessThanOrEqual(1.8);
  });
});
