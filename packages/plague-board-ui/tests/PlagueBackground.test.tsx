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
import { fermatiDaMenoMovimento } from './fogli';
import { menoMovimento, paginaNascosta } from './preferenze';

const avanza = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

const gocce = (container: HTMLElement) => container.querySelectorAll('.animate-drip');
const galleggianti = (container: HTMLElement) => container.querySelectorAll('.animate-float');
const bolle = (container: HTMLElement) => container.querySelectorAll('.pb-toxic-bubble');
const palazzi = (container: HTMLElement) => container.querySelectorAll('.pb-city-block');
const finestre = (container: HTMLElement) => container.querySelectorAll('.pb-city-window');
const marchio = (container: HTMLElement) => container.querySelector('.pb-scene-mark');

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

  it('segue il tema della pagina: nessun `dark` addosso, e il fondo è quello della scena', () => {
    const { container } = conFondale('high');
    const scena = container.firstElementChild;

    // ⚠️ Fino al 2026-09-23 il fondale portava `dark` in tutti e due i temi, e la schermata di
    // accesso era solo scura — contro la decisione «due temi per ogni componente». Chi vuole la
    // scena scura su una pagina chiara la avvolge in un'isola `dark`, come le altre superfici.
    expect(scena).not.toHaveClass('dark');
    expect(scena).toHaveClass('bg-(--pb-scene)');
    // Resta: dentro un'isola `dark` il colore del testo va risolto di nuovo qui, o chi lo prende da
    // `currentColor` scrive col colore già calcolato fuori — il 1,19 del selettore del livello.
    expect(scena).toHaveClass('text-foreground');
  });

  it('il marchio gigante sta nella scena a ogni livello, pieno, col muso e fermo', () => {
    // ⚠️ Come la città, non dipende dal livello: il livello dice quanto gas c'è, il marchio è chi
    // abita il posto. E non batte: a quella misura lo `scale(1.12)` del battito sono centinaia di
    // pixel che si muovono dietro al contenuto — respira, e il respiro sta in `animations.css`.
    for (const livello of ['off', 'low', 'medium', 'high'] as const) {
      const { container, unmount } = conFondale(livello);
      const disegno = marchio(container);

      expect(disegno).not.toBeNull();
      expect(disegno?.closest('[aria-hidden="true"]')).not.toBeNull();
      expect(disegno?.querySelector('path[fill="currentColor"]')).not.toBeNull();
      expect(disegno?.querySelector('path[stroke-linecap]:not([stroke-linejoin])')).not.toBeNull();
      expect(disegno?.getAttribute('class')).not.toContain('pb-mark-beat');
      expect(disegno?.querySelector('.pb-mark-beat')).toBeNull();
      unmount();
    }
  });

  it('il marchio sta dietro a tutto il resto della scena', () => {
    const { container } = conFondale('high');
    const disegno = marchio(container)!;

    // Le gocce, le icone e la città gli passano davanti: è lo sfondo dello sfondo.
    for (const pezzo of [gocce(container)[0], galleggianti(container)[0], palazzi(container)[0]]) {
      expect(disegno.compareDocumentPosition(pezzo) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
  });

  it('con «meno movimento» il marchio smette di respirare', () => {
    expect(fermatiDaMenoMovimento).toContain('.pb-scene-mark');
  });

  it('mette in scena tanti pezzi quanti ne dichiara il livello', () => {
    for (const livello of ['off', 'low', 'medium', 'high'] as const) {
      const { container, unmount } = conFondale(livello);

      expect(gocce(container)).toHaveLength(TOXIC_LEVEL_SETTINGS[livello].drips);
      expect(galleggianti(container)).toHaveLength(TOXIC_LEVEL_SETTINGS[livello].floaters);

      unmount();
    }
  });

  it('la città non dipende dal livello: c’è tutta, accesa, anche a spento', () => {
    // ⚠️ È la riga che tiene ferma la distinzione, scelta dall'utente: il livello dice quanto gas
    // c'è in giro, e la corrente di una città non c'entra. Facendo dipendere i palazzi — o le loro
    // luci — dal livello, «spento» direbbe che la città è fatta di gas.
    for (const livello of ['off', 'low', 'medium', 'high'] as const) {
      const { container, unmount } = conFondale(livello);

      expect(palazzi(container)).toHaveLength(CITTA.length);
      expect(finestre(container)).toHaveLength(FINESTRE_TOTALI);
      unmount();
    }
  });

  it('ogni finestra cala di tensione per conto suo', () => {
    // Sette finestre con lo stesso ciclo calano insieme, e insieme non sono sette luci: sono un
    // temporale. Il caso guarda che nessuna coppia condivida durata **e** ritardo.
    const { container } = conFondale('high');

    const tempi = [...finestre(container)].map((finestra) => {
      const stile = (finestra as HTMLElement).style;
      return `${stile.getPropertyValue('--pb-window-duration')}/${stile.getPropertyValue('--pb-window-delay')}`;
    });

    expect(tempi).toHaveLength(FINESTRE_TOTALI);
    expect(new Set(tempi).size).toBe(FINESTRE_TOTALI);
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
