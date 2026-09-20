import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PlagueBackground, TOXIC_LEVEL_SETTINGS, ToxicLevelProvider, type ToxicLevel } from '../src';
// ⚠️ Dal modulo e non da `../src`: i tetti sono **scenografia del fondale**, non un pezzo che si
// monta da fuori. Qui servono per sapere dove un verso ha il diritto di nascere.
import { TETTI } from '../src/brand/plagueCityscape';
import { menoMovimento, paginaNascosta } from './preferenze';

const avanza = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

/**
 * L'attesa più lunga possibile prima del primo verso, a livello `alto`.
 *
 * ⚠️ **Non un numero più grande**, e la differenza è un test che sbatte: un fumetto vive 3,2 s,
 * quindi aspettando 6 s uno nato al secondo 2,5 è già sparito e il caso conta zero. A 5 s —
 * l'estremo alto della cadenza — ce n'è **sempre** almeno uno in scena, qualunque numero esca dal
 * sorteggio.
 */
const PRIMA_USCITA_MS = TOXIC_LEVEL_SETTINGS.high.chatterEveryMs[1];

const versi = (container: HTMLElement) => container.querySelectorAll('.pb-city-chatter');

const conFondale = (level: ToxicLevel) =>
  render(
    <ToxicLevelProvider defaultLevel={level}>
      <PlagueBackground />
    </ToxicLevelProvider>,
  );

describe('i versi della città', () => {
  const matchMediaVero = window.matchMedia;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    window.matchMedia = matchMediaVero;
    paginaNascosta(false);
  });

  it('a livello spento la città tace, per quanto si aspetti', () => {
    const { container } = conFondale('off');

    avanza(120_000);
    expect(versi(container)).toHaveLength(0);
  });

  it('ne fa uscire uno a ogni attesa e si ferma al tetto del livello', () => {
    const { container } = conFondale('high');

    expect(versi(container)).toHaveLength(0);

    avanza(PRIMA_USCITA_MS);
    expect(versi(container).length).toBeGreaterThan(0);
    expect(versi(container).length).toBeLessThanOrEqual(TOXIC_LEVEL_SETTINGS.high.maxChatter);
  });

  it('un verso se ne va da solo, e non si allunga la vita quando ne compare un altro', () => {
    // ⚠️ È la trappola che il componente evita armando la scadenza alla nascita: un effetto che
    // guardasse l'elenco dei vivi rifarebbe tutti i timer a ogni nascita, e il primo fumetto
    // resterebbe in scena finché la città parla.
    const { container } = conFondale('high');

    avanza(PRIMA_USCITA_MS);
    expect(versi(container).length).toBeGreaterThan(0);

    avanza(20_000);
    paginaNascosta(true);
    avanza(4000);

    expect(versi(container)).toHaveLength(0);
  });

  it('nasce sopra un tetto, non in mezzo al cielo', () => {
    const { container } = conFondale('high');

    avanza(PRIMA_USCITA_MS);
    const verso = versi(container)[0] as HTMLElement;

    const x = Number.parseFloat(verso.style.left);
    const y = Number.parseFloat(verso.style.top);

    // Lo scarto dichiarato è ±6 attorno alla x del palazzo: se un giorno nascessero a caso su
    // tutta la larghezza, «sparsi principalmente nelle zone degli edifici» sarebbe solo scritto.
    expect(TETTI.some((tetto) => Math.abs(tetto.x - x) <= 6.5)).toBe(true);
    expect(TETTI.some((tetto) => y <= tetto.y - 4 && y >= tetto.y - 10)).toBe(true);
  });

  it('contro un bordo si appoggia di lato invece di centrarsi', () => {
    // ⚠️ Un fumetto largo 180 px centrato su un palazzo al 10% comincia fuori dal riquadro, e lì
    // il fondale lo taglia. L'ancoraggio è la cura, e dipende da **dove** nasce.
    const { container } = conFondale('high');

    avanza(PRIMA_USCITA_MS);
    const verso = versi(container)[0] as HTMLElement;
    const x = Number.parseFloat(verso.style.left);

    const atteso = x < 25 ? '0 0' : x > 75 ? '-100% 0' : '-50% 0';
    expect(verso.style.translate).toBe(atteso);
  });

  it('con «meno movimento» non ne esce nessuno', () => {
    menoMovimento(true);
    const { container } = conFondale('high');

    avanza(60_000);
    expect(versi(container)).toHaveLength(0);
  });

  it('non parla mentre la pagina è in secondo piano', () => {
    paginaNascosta(true);
    const { container } = conFondale('high');

    avanza(60_000);
    expect(versi(container)).toHaveLength(0);
  });

  it('dice le parole che riceve, e un elenco vuoto la zittisce', () => {
    const { container, unmount } = render(
      <ToxicLevelProvider defaultLevel="high">
        <PlagueBackground phrases={['Squit di prova']} />
      </ToxicLevelProvider>,
    );

    avanza(PRIMA_USCITA_MS);
    expect(versi(container)[0]).toHaveTextContent('Squit di prova');
    unmount();

    const muta = render(
      <ToxicLevelProvider defaultLevel="high">
        <PlagueBackground phrases={[]} />
      </ToxicLevelProvider>,
    );

    avanza(60_000);
    expect(versi(muta.container)).toHaveLength(0);
  });
});
