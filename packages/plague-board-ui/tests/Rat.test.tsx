import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RAT_LIVERIES, Rat, RatRun, type RatLivery } from '../src';
import { RAT_COLLAR, RAT_HARNESS, RAT_PARTS, RAT_SKULL, RAT_TORSO, RAT_VIEW_BOX } from '../src/brand/ratArt';

const kit = (container: HTMLElement) => ({
  corpo: container.querySelector('.pb-rat-body'),
  tronco: container.querySelector('.pb-rat-torso'),
  teschio: container.querySelector('.pb-rat-skull'),
  collare: container.querySelector('.pb-rat-collar'),
  ampolla: container.querySelector('.pb-rat-vial'),
});

const viewBoxDi = (container: HTMLElement) => container.querySelector('svg')?.getAttribute('viewBox');
const classiDi = (el: Element) => [...(el.getAttribute('class') ?? '').split(/\s+/)].filter(Boolean);

/**
 * ⚠️ jsdom non ha `AnimationEvent`, e la cosa costa due volte. `fireEvent.animationEnd` ripiega su
 * `Event`, che **scarta** `animationName`: l'evento si costruisce a mano, con la proprietà aggiunta
 * sopra. E React, non trovando `AnimationEvent` in `window`, registra `onAnimationEnd` sul nome
 * **col prefisso** — `webkitAnimationEnd`, perché `WebkitAnimation` sta in `style` — quindi un
 * `animationend` liscio non arriva a nessun handler. Misurato con una sonda il 2026-09-18: si
 * emette il nome che React ascolta, deciso come lo decide lui.
 */
const fineAnimazione = (target: Element, animationName: string) => {
  const type = 'AnimationEvent' in window ? 'animationend' : 'webkitAnimationEnd';
  const event = new Event(type, { bubbles: true });
  Object.defineProperty(event, 'animationName', { value: animationName });
  fireEvent(target, event);
};

describe('Rat', () => {
  it('il disegno è quello ricalcato, e ogni percorso è un percorso', () => {
    // ⚠️ `ratArt.ts` è generato: questo test è quello che si accorge se una rigenerazione lo
    // svuota o lo rompe. Ogni percorso comincia con un `M` — è la forma che scrive il vettorizzatore.
    for (const arte of [RAT_TORSO, ...RAT_PARTS.map((p) => p.paths), ...[...RAT_SKULL, ...RAT_COLLAR, ...RAT_HARNESS].map((q) => q.paths)]) {
      expect(arte.length).toBeGreaterThan(0);
      for (const p of arte) expect(p.d).toMatch(/^M -?\d/);
    }
    // Dopo il despeckle il tronco sta sui 35 percorsi: la soglia è sotto per non rompersi a ogni
    // taratura, e sopra il livello in cui il ricalco è vuoto.
    expect(RAT_TORSO.length).toBeGreaterThan(20);
  });

  it('è un pupazzo: cinque parti con un perno dentro la cornice, davanti o dietro al tronco', () => {
    const nomi = RAT_PARTS.map((p) => p.name).sort();
    expect(nomi).toEqual(['legBackFar', 'legBackNear', 'legFrontFar', 'legFrontNear', 'tail']);

    // ⚠️ Un perno fuori dalla cornice è un perno sbagliato: la zampa ruoterebbe attorno a un punto
    // nel vuoto e uscirebbe dal corpo. E le parti lontane stanno dietro, le vicine davanti.
    for (const p of RAT_PARTS) {
      expect(p.pivot.x).toBeGreaterThan(RAT_VIEW_BOX.x);
      expect(p.pivot.x).toBeLessThan(RAT_VIEW_BOX.x + RAT_VIEW_BOX.width);
      expect(p.pivot.y).toBeGreaterThan(RAT_VIEW_BOX.y);
      expect(p.pivot.y).toBeLessThan(RAT_VIEW_BOX.y + RAT_VIEW_BOX.height);
      expect(p.behind).toBe(p.name === 'tail' || p.name.endsWith('Far'));
    }
  });

  it('le parti dietro stanno prima del tronco nel DOM, quelle davanti dopo', () => {
    const { container } = render(<Rat />);
    const figli = [...kit(container).corpo!.children].map((el) => classiDi(el));
    const indiceTronco = figli.findIndex((c) => c.includes('pb-rat-torso'));

    // ⚠️ In SVG chi viene dopo copre chi viene prima: è l'unico z-order che c'è. Coda e zampe
    // lontane devono stare **prima** del tronco, le zampe vicine **dopo**, o la coda passa sopra
    // la groppa.
    expect(indiceTronco).toBeGreaterThan(0);
    for (const [i, c] of figli.entries()) {
      if (c.includes('pb-rat-tail') || c.includes('pb-rat-leg-back-far') || c.includes('pb-rat-leg-front-far')) expect(i).toBeLessThan(indiceTronco);
      if (c.includes('pb-rat-leg-back-near') || c.includes('pb-rat-leg-front-near')) expect(i).toBeGreaterThan(indiceTronco);
    }
  });

  it('ogni parte porta il suo perno come transform-origin, nelle unità della cornice', () => {
    const { container } = render(<Rat hasCollar hasVial />);

    for (const p of RAT_PARTS) {
      const nome = p.name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
      const g = container.querySelector(`.pb-rat-${nome}`) as HTMLElement | null;
      // ⚠️ Senza `transform-origin` ogni rotazione partirebbe dall'angolo in alto a sinistra del
      // `viewBox`, e la zampa descriverebbe un arco enorme invece di oscillare sull'anca. Il valore è
      // in `px` perché `transform-box: view-box` li legge come unità del disegno.
      expect(g?.style.transformOrigin).toBe(`${p.pivot.x}px ${p.pivot.y}px`);
    }
    // E i pendagli dei kit: pedina e dado oscillano, cinghie e collare no.
    expect((container.querySelector('.pb-rat-collar-pawn') as HTMLElement).style.transformOrigin).not.toBe('');
    expect((container.querySelector('.pb-rat-vial-dice') as HTMLElement).style.transformOrigin).not.toBe('');
    expect((container.querySelector('.pb-rat-vial-straps') as HTMLElement).style.transformOrigin).toBe('');
  });

  it("da fermo sta fermo: la classe della corsa c'è solo con `isRunning`", () => {
    const fermo = render(<Rat />);
    expect(fermo.container.querySelector('svg')).not.toHaveClass('pb-rat--running');
    fermo.unmount();

    const inCorsa = render(<Rat isRunning />);
    // ⚠️ Il tempo non è qui: è in `animations.css`, agganciato a questa classe. Il componente
    // possiede il pelo, i perni e l'ordine; il resto è del foglio di stile, e si spegne da lì.
    expect(inCorsa.container.querySelector('svg')).toHaveClass('pb-rat--running');
    expect(inCorsa.container.querySelector('style')).toBeNull();
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

  it('il teschio sta sopra a tutto, il collare sotto, e i kit dopo le zampe vicine', () => {
    const { container } = render(<Rat hasSkull hasCollar hasVial />);
    const figli = [...kit(container).corpo!.children].map((el) => classiDi(el)[classiDi(el).length - 1]);

    // ⚠️ L'ordine è quello del disegno: il teschio copre il bordo dell'orecchio, l'imbracatura passa
    // sopra il collare alla spalla, e tutti stanno sopra le zampe. Invertirli non rompe niente a
    // runtime — e si vede.
    expect(figli.slice(-3)).toEqual(['pb-rat-collar', 'pb-rat-vial', 'pb-rat-skull']);
  });

  it("la cornice è la stessa con e senza l'allestimento, ed è quella del ricalco", () => {
    const nudo = render(<Rat />);
    const cornice = viewBoxDi(nudo.container);
    nudo.unmount();

    const vestito = render(<Rat hasSkull hasCollar hasVial />);

    // ⚠️ In uno sciame i ratti hanno tutti la stessa scatola, qualunque cosa portino: se l'ampolla
    // allargasse la cornice, accenderla sposterebbe il ratto e cambierebbe la sua misura.
    expect(viewBoxDi(vestito.container)).toBe(cornice);
    expect(cornice).toBe(`${RAT_VIEW_BOX.x} ${RAT_VIEW_BOX.y} ${RAT_VIEW_BOX.width} ${RAT_VIEW_BOX.height}`);
  });

  it("la misura è l'altezza, e la lunghezza viene dal disegno", () => {
    const { container } = render(<Rat size={50} />);
    const svg = container.querySelector('svg');

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

describe('RatRun', () => {
  it('mette il ratto in corsa dentro un contenitore che attraversa, dal lato che gli si dice', () => {
    const { container } = render(<RatRun from="right" duration={7} top="30%" livery="brown" hasSkull />);
    const corsa = container.firstElementChild as HTMLElement;

    expect(corsa).toHaveClass('pb-rat-run', 'pb-rat-run--right');
    expect(corsa.style.animationDuration).toBe('7s');
    expect(corsa.style.top).toBe('30%');
    expect(corsa.querySelector('svg')).toHaveClass('pb-rat--running');
    // ⚠️ Il disegno guarda a destra: da destra si ribalta, e lo si fa sull'`svg`, non sul
    // contenitore, o si ribalterebbe anche la direzione della traversata.
    expect(corsa.querySelector('svg')).toHaveClass('-scale-x-100');
    expect(corsa.querySelector('.pb-rat-skull')).not.toBeNull();
  });

  it('da sinistra non è ribaltato, e dura cinque secondi se non gli si dice altro', () => {
    const { container } = render(<RatRun />);
    const corsa = container.firstElementChild as HTMLElement;

    expect(corsa).toHaveClass('pb-rat-run--left');
    expect(corsa.style.animationDuration).toBe('5s');
    expect(corsa.querySelector('svg')).not.toHaveClass('-scale-x-100');
  });

  it("`onDone` arriva alla fine della traversata, e non a ogni passo delle zampe", () => {
    const onDone = vi.fn();
    const { container } = render(<RatRun onDone={onDone} />);
    const corsa = container.firstElementChild as HTMLElement;

    // ⚠️ Le zampe emettono un `animationend` a ogni ciclo, e risale fino al contenitore: senza il
    // filtro sul nome dell'animazione il ratto verrebbe tolto al primo passo. Qui si simula prima
    // un passo, poi la traversata.
    fineAnimazione(corsa.querySelector('.pb-rat-tail')!, 'pb-rat-wag');
    expect(onDone).not.toHaveBeenCalled();

    fineAnimazione(corsa, 'pb-rat-cross-left');
    expect(onDone).toHaveBeenCalledOnce();
  });

  it('è decorativo: un ratto che passa non si annuncia, salvo che gli si dia un nome', () => {
    const { container, rerender } = render(<RatRun />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    rerender(<RatRun title="Un ratto di passaggio" />);
    expect(screen.getByRole('img', { name: 'Un ratto di passaggio' })).toBeInTheDocument();
  });
});
