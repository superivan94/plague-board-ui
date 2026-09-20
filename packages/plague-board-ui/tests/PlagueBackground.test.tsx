import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  PlagueBackground,
  PlaguePulse,
  TOXIC_LEVEL_SETTINGS,
  ToxicBubbles,
  ToxicLevelProvider,
  type ToxicLevel,
} from '../src';
// ⚠️ Dal modulo e non da `../src`: lo skyline è **scenografia del fondale**, non un pezzo che si
// monta da fuori, quindi da `src/index.ts` non esce. Qui servono i suoi numeri per non riscriverli.
import { CITTA, FINESTRE_TOTALI } from '../src/brand/plagueCityscape';
import { fineAnimazione } from './animazioni';
import { menoMovimento } from './preferenze';

const avanza = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

/** Mette la pagina in secondo piano, come una scheda dietro a un'altra. */
const paginaNascosta = (nascosta: boolean) => {
  Object.defineProperty(document, 'visibilityState', { value: nascosta ? 'hidden' : 'visible', configurable: true });
  Object.defineProperty(document, 'hidden', { value: nascosta, configurable: true });
};

const gocce = (container: HTMLElement) => container.querySelectorAll('.animate-drip');
const galleggianti = (container: HTMLElement) => container.querySelectorAll('.animate-float');
const bolle = (container: HTMLElement) => container.querySelectorAll('.pb-toxic-bubble');
const palazzi = (container: HTMLElement) => container.querySelectorAll('.pb-city-block');
const finestre = (container: HTMLElement) => container.querySelectorAll('.pb-city-block .animate-pulse');

const conFondale = (level: ToxicLevel) =>
  render(
    <ToxicLevelProvider defaultLevel={level}>
      <PlagueBackground>
        <p>il contenuto</p>
      </PlagueBackground>
    </ToxicLevelProvider>,
  );

const conBolle = (level: ToxicLevel) =>
  render(
    <ToxicLevelProvider defaultLevel={level}>
      <ToxicBubbles />
    </ToxicLevelProvider>,
  );

describe('PlagueBackground', () => {
  it('rende il contenuto che avvolge', () => {
    conFondale('high');

    expect(screen.getByText('il contenuto')).toBeInTheDocument();
  });

  it('mette in scena tanti pezzi quanti ne dichiara il livello', () => {
    for (const livello of ['off', 'low', 'medium', 'high'] as const) {
      const { container, unmount } = conFondale(livello);

      expect(gocce(container)).toHaveLength(TOXIC_LEVEL_SETTINGS[livello].drips);
      expect(galleggianti(container)).toHaveLength(TOXIC_LEVEL_SETTINGS[livello].floaters);
      expect(finestre(container)).toHaveLength(TOXIC_LEVEL_SETTINGS[livello].windows);

      unmount();
    }
  });

  it('la città c’è a ogni livello, anche spento: a cambiare sono le finestre accese', () => {
    // ⚠️ È la riga che tiene ferma la distinzione: il livello governa quello che **si muove**, e
    // una città non si muove. Facendo sparire i palazzi, «spento» direbbe che la città è fatta di
    // gas — e una schermata che perde il suo skyline abbassando le emissioni sembra rotta.
    for (const livello of ['off', 'low', 'medium', 'high'] as const) {
      const { container, unmount } = conFondale(livello);

      expect(palazzi(container)).toHaveLength(CITTA.length);
      unmount();
    }
  });

  it('accende le finestre in ordine, senza sfondare il tetto della città', () => {
    const { container } = conFondale('high');

    expect(finestre(container)).toHaveLength(FINESTRE_TOTALI);
    expect(TOXIC_LEVEL_SETTINGS.high.windows).toBeLessThanOrEqual(FINESTRE_TOTALI);
  });

  it('le tre gocce sono di tre misure diverse', () => {
    // ⚠️ Segnalato dall'utente il 2026-09-20 guardando la pagina: tre gocce identiche che cadono
    // a ritmi diversi si leggono come un'animazione che si ripete, non come pioggia. Le misure
    // sono quelle di `ludoratti.it`.
    const { container } = conFondale('high');

    const misure = [...gocce(container)].map((colonna) => {
      const disegno = colonna.querySelector('svg');
      return `${disegno?.getAttribute('width')}×${disegno?.getAttribute('height')}`;
    });

    expect(misure).toHaveLength(3);
    expect(new Set(misure).size).toBe(3);
  });

  it('la goccia è una goccia, non un rettangolo tagliato in cima', () => {
    // La sagoma di `DripIcon` è appuntita in alto e tonda in basso: era il secondo difetto
    // segnalato — un bordo dritto in cima si legge come un pezzo tagliato via, non come liquido.
    const { container } = conFondale('low');

    const disegno = gocce(container)[0].querySelector('svg');
    expect(disegno).toHaveAttribute('viewBox', '0 0 8 20');
    expect(disegno?.querySelector('path')?.getAttribute('d')).toContain('C');
  });

  it('è decorativo: gli strati non si annunciano, il contenuto sì', () => {
    // ⚠️ Un `aria-hidden` sul contenitore intero nasconderebbe anche i figli, che sono la pagina.
    // Il velo sta in un fratello del contenuto, non in un suo antenato.
    const { container } = conFondale('high');

    const testo = screen.getByText('il contenuto');
    expect(testo.closest('[aria-hidden="true"]')).toBeNull();
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('non prende i clic destinati a quello che ci sta sopra', () => {
    const { container } = conFondale('high');

    const strato = container.querySelector('[aria-hidden="true"]');
    expect(strato?.className).toContain('pointer-events-none');
  });
});

describe('ToxicBubbles', () => {
  const matchMediaVero = window.matchMedia;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    window.matchMedia = matchMediaVero;
    paginaNascosta(false);
  });

  it('a livello spento non ne fa nascere nessuna, per quanto si aspetti', () => {
    const { container } = conBolle('off');

    avanza(60_000);
    expect(bolle(container)).toHaveLength(0);
  });

  it('ne fa nascere una a ogni attesa e si ferma al tetto del livello', () => {
    const { container } = conBolle('high');

    // La prima non c'è al montaggio: server e idratazione rendono lo stesso identico niente,
    // perché la misura e la corsia si pescano a caso.
    expect(bolle(container)).toHaveLength(0);

    avanza(2000);
    expect(bolle(container).length).toBeGreaterThan(0);

    avanza(120_000);
    expect(bolle(container)).toHaveLength(TOXIC_LEVEL_SETTINGS.high.maxBubbles);
  });

  it('con «meno movimento» non ne nasce nessuna, ed è obbedienza, non un guasto', () => {
    menoMovimento(true);
    const { container } = conBolle('high');

    avanza(60_000);
    expect(bolle(container)).toHaveLength(0);
  });

  it('non ne genera mentre la pagina è in secondo piano', () => {
    // ⚠️ Lì il browser sospende le animazioni: `animationend` non arriva, nessuna bolla se ne va,
    // e al ritorno ci si ritroverebbe il tetto pieno di bolle ferme.
    paginaNascosta(true);
    const { container } = conBolle('high');

    avanza(60_000);
    expect(bolle(container)).toHaveLength(0);
  });

  it('se ne va quando la salita finisce, e non prima', () => {
    const { container } = conBolle('high');

    avanza(2000);
    const prima = bolle(container)[0];
    expect(prima).toBeDefined();

    // ⚠️ L'ondeggiamento è un'animazione **infinita su un figlio**, e il suo evento passa di qui
    // salendo. Senza il filtro sul nome, la bolla sparirebbe al primo respiro laterale.
    act(() => fineAnimazione(prima.firstElementChild ?? prima, 'pb-toxic-sway'));
    expect(container.contains(prima)).toBe(true);

    act(() => fineAnimazione(prima, 'pb-toxic-rise'));
    expect(container.contains(prima)).toBe(false);
  });

  it('scrive addosso a ogni bolla il diametro del suo livello, e l’ondeggiamento in proporzione', () => {
    const { container } = conBolle('low');

    avanza(20_000);
    const colonna = bolle(container)[0] as HTMLElement;
    const pelle = colonna.firstElementChild as HTMLElement;

    // La durata della salita è **un numero solo**, scritto una volta: la usano l'animazione che
    // sale e quella che gonfia, e se ognuna avesse la sua potrebbero scollarsi.
    expect(colonna.style.getPropertyValue('--pb-toxic-rise-duration')).toMatch(/^\d+ms$/);

    const [minimo, massimo] = TOXIC_LEVEL_SETTINGS.low.bubbleSize;
    const lato = Number.parseFloat(pelle.style.getPropertyValue('--pb-toxic-size'));
    expect(lato).toBeGreaterThanOrEqual(minimo);
    expect(lato).toBeLessThanOrEqual(massimo);

    // ⚠️ Di là l'ondeggiamento era 15–40 px **fissi**, per bolle da 20 a 90: una bolla piccola
    // sbandava di due volte la propria larghezza. Qui è una frazione del diametro.
    const sbandata = Number.parseFloat(pelle.style.getPropertyValue('--pb-toxic-sway'));
    expect(sbandata).toBeGreaterThan(0);
    expect(sbandata).toBeLessThan(lato);
  });
});

describe('PlaguePulse', () => {
  it('fa pulsare quello che avvolge, senza toccarlo', () => {
    const { container } = render(
      <PlaguePulse>
        <button type="button">Avvia il protocollo</button>
      </PlaguePulse>,
    );

    const lastra = container.firstElementChild;
    expect(lastra?.className).toContain('animate-plague-pulse');
    expect(screen.getByRole('button', { name: 'Avvia il protocollo' })).toBeInTheDocument();
  });

  it('lascia aggiungere classi senza perdere la sua', () => {
    // La forma della lastra — quanto è arrotondata, quanto è larga — la decide chi la monta:
    // il pulsare è l'unica cosa che il componente possiede.
    const { container } = render(
      <PlaguePulse className="rounded-full">
        <button type="button">Avvia il protocollo</button>
      </PlaguePulse>,
    );

    const lastra = container.firstElementChild as HTMLElement;
    expect(lastra.className).toContain('animate-plague-pulse');
    expect(lastra.className).toContain('rounded-full');
  });
});
