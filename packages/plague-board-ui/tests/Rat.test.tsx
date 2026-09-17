import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RAT_LIVERIES, Rat, type RatLivery } from '../src';

const parti = (container: HTMLElement) => ({
  coda: container.querySelector('.pb-rat-tail'),
  corpo: container.querySelector('.pb-rat-body'),
  orecchie: container.querySelector('.pb-rat-ears'),
  zampeAvanti: container.querySelectorAll('.pb-rat-leg-front'),
  zampeDietro: container.querySelectorAll('.pb-rat-leg-back'),
  teschio: container.querySelector('.pb-rat-skull'),
  ampolla: container.querySelector('.pb-rat-vial'),
});

const viewBoxDi = (container: HTMLElement) =>
  container.querySelector('svg')?.getAttribute('viewBox')?.split(' ').map(Number) ?? [];

describe('Rat', () => {
  it('le tre livree sono quelle di là, e si scelgono per nome', () => {
    for (const livery of Object.keys(RAT_LIVERIES) as RatLivery[]) {
      const { container, unmount } = render(<Rat livery={livery} />);

      // ⚠️ Il colore si legge dalla **coda**, non dal corpo: è l'unica parte che nella livrea
      // bianca non vale quanto il corpo — `tail` è il rosa `#fec5d6`, `body` il bianco sporco. Un
      // test che guardasse il corpo resterebbe verde anche scambiando due slot su tre.
      expect(parti(container).coda).toHaveAttribute('fill', RAT_LIVERIES[livery].tail);
      unmount();
    }
  });

  it('senza livrea è grigio, che è il ratto normale', () => {
    const { container } = render(<Rat />);

    expect(parti(container).coda).toHaveAttribute('fill', RAT_LIVERIES.grey.tail);
  });

  it("le zampe in ombra sono pelo in ombra, non coda: sull'albino grigio chiaro, non rosa", () => {
    const { container } = render(<Rat livery="white" />);

    // ⚠️ Le zampe lontane prendevano il colore della **coda**, e sull'albino venivano rosa: la coda
    // è pelle nuda, una zampa in ombra è pelo, e il pelo bianco in ombra è grigio chiaro. Lo slot è
    // `shade`, e per tutte e tre le livree deve essere diverso dalla coda. Le zampe lontane sono i
    // gruppi di zampa dentro un `<g transform>`.
    const lontane = [...container.querySelectorAll('g[transform^="translate"] path')];
    expect(lontane).toHaveLength(2);
    for (const zampa of lontane) {
      expect(zampa).toHaveAttribute('fill', RAT_LIVERIES.white.shade);
      expect(zampa).not.toHaveAttribute('fill', RAT_LIVERIES.white.tail);
    }
    for (const livery of Object.keys(RAT_LIVERIES) as RatLivery[]) {
      expect(RAT_LIVERIES[livery].shade).not.toBe(RAT_LIVERIES[livery].tail);
    }
  });

  it("l'albino ha l'occhio rosso, non d'inchiostro", () => {
    const { container } = render(<Rat livery="white" />);

    // ⚠️ Nel primo studio l'occhio era inchiostrato come il contorno per tutte e tre le livree, e
    // il ratto bianco aveva perso il suo tratto più riconoscibile — quello che ha anche la mascotte
    // con l'ampolla. L'occhio è il cerchio pieno più grande: la luce sopra è più piccola e bianca.
    const occhio = [...container.querySelectorAll('circle')].find(
      (el) => el.getAttribute('fill') === RAT_LIVERIES.white.eye,
    );
    expect(occhio).toBeDefined();
    expect(occhio).toHaveAttribute('r', '3.8');
  });

  it('non porta un foglio di stile dentro', () => {
    const { container } = render(<Rat hasSkull hasVial />);

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

  it('le zampe lontane portano lo spostamento fuori dal gruppo che si anima', () => {
    const { container } = render(<Rat />);

    // ⚠️ Una `transform` in CSS **sostituisce** l'attributo `transform`, non si somma. Se la classe
    // stesse sullo stesso `<g>` che porta `translate(-14,2)`, il primo fotogramma dell'animazione
    // riporterebbe la zampa lontana sopra a quella vicina. Il gruppo con la classe non deve avere
    // nessun attributo `transform`, e il suo genitore sì.
    for (const zampa of container.querySelectorAll('.pb-rat-leg-back, .pb-rat-leg-front')) {
      expect(zampa).not.toHaveAttribute('transform');
    }
    const lontane = [...container.querySelectorAll('g[transform^="translate"]')];
    expect(lontane).toHaveLength(2);
    // ⚠️ `getAttribute('class')` e non `className`: su un `Element` il tipo di `className` è
    // `string`, ma a runtime su un `<g>` jsdom dà un `SVGAnimatedString` — quindi `.baseVal`
    // passava il test e falliva `tsc`. Ed è passato un commit così, perché `typecheck` in un `tail`
    // perde il codice d'uscita.
    for (const g of lontane) expect(g.firstElementChild?.getAttribute('class')).toMatch(/pb-rat-leg/);
  });

  it("i baffi vanno avanti, e non tornano verso l'occhio", () => {
    const { container } = render(<Rat />);
    const baffi = [...container.querySelectorAll('.pb-rat-whiskers path')];
    const occhioX = Number(
      [...container.querySelectorAll('circle')]
        .find((el) => el.getAttribute('r') === '3.8')
        ?.getAttribute('cx'),
    );

    // ⚠️ Nella prima versione i baffi partivano dal naso e tornavano verso la guancia fino a x 164,
    // cioè **sotto l'occhio** a 174: a seconda della livrea leggevano come una ruga o uno strizzare,
    // e l'espressione cambiava da sola. Qui si legge ogni coordinata x di ogni baffo e si chiede che
    // stia davanti all'occhio di almeno dieci unità. Sono tre, e devono esserci tutti.
    expect(baffi).toHaveLength(3);
    for (const baffo of baffi) {
      const xs = (baffo.getAttribute('d') ?? '').match(/(-?\d+(?:\.\d+)?),/g)?.map((s) => Number(s.slice(0, -1))) ?? [];
      expect(xs.length).toBeGreaterThan(0);
      expect(Math.min(...xs)).toBeGreaterThanOrEqual(occhioX + 10);
    }
  });

  it('una zampa è un percorso solo, e le dita non hanno contorno', () => {
    const { container } = render(<Rat />);

    // ⚠️ Prima erano tre pezzi per zampa — coscia a blob, capsula, piede a parte — e dove si
    // sovrapponevano i contorni si raddoppiavano. Ora ogni gruppo di zampa vicina ha **un** percorso
    // col contorno e **uno** senza (il cuscinetto delle dita); quelli lontani ne hanno uno solo.
    const gruppi = [...container.querySelectorAll('.pb-rat-leg-back, .pb-rat-leg-front')];
    expect(gruppi).toHaveLength(4);
    for (const g of gruppi) {
      const percorsi = [...g.querySelectorAll('path')];
      const conContorno = percorsi.filter((p) => p.getAttribute('stroke') !== 'none');
      expect(conContorno).toHaveLength(1);
      expect(percorsi.length).toBeLessThanOrEqual(2);
    }
  });

  it("nasce senza niente addosso, e l'allestimento si accende a pezzi", () => {
    const nudo = render(<Rat />);
    expect(parti(nudo.container).teschio).toBeNull();
    expect(parti(nudo.container).ampolla).toBeNull();
    nudo.unmount();

    const conTeschio = render(<Rat hasSkull />);
    expect(parti(conTeschio.container).teschio).not.toBeNull();
    expect(parti(conTeschio.container).ampolla).toBeNull();
    conTeschio.unmount();

    const conTutto = render(<Rat hasSkull hasVial />);
    expect(parti(conTutto.container).teschio).not.toBeNull();
    expect(parti(conTutto.container).ampolla).not.toBeNull();
  });

  it("la cornice è la stessa con e senza l'allestimento", () => {
    const nudo = render(<Rat />);
    const cornice = viewBoxDi(nudo.container);
    nudo.unmount();

    const vestito = render(<Rat hasSkull hasVial />);

    // ⚠️ In uno sciame i ratti hanno tutti la stessa scatola, qualunque cosa portino: se
    // l'ampolla allargasse la cornice, accenderla sposterebbe il ratto di qualche pixel e cambierebbe
    // la sua misura — e in una riga di testo, la riga. La cornice contiene sempre tutto.
    expect(viewBoxDi(vestito.container)).toEqual(cornice);
  });

  it("la misura è l'altezza, e la lunghezza viene dal disegno", () => {
    const { container } = render(<Rat size={50} />);
    const svg = container.querySelector('svg');

    // ⚠️ Un ratto è lungo due volte e mezzo quanto è alto, quindi «il lato» non vuol dire niente:
    // `size` è l'altezza, come per `RatMascot`, e la larghezza la porta il rapporto del disegno.
    expect(svg).toHaveAttribute('height', '50');
    expect(Number(svg?.getAttribute('width'))).toBeGreaterThan(100);
  });

  it('è decorativo finché non gli si dà un nome', () => {
    const { container, rerender } = render(<Rat />);

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    rerender(<Rat title="Un ratto" />);
    expect(screen.getByRole('img', { name: 'Un ratto' })).toBeInTheDocument();
  });

  it('il disegno sta tutto dentro la sua cornice, tratto compreso', () => {
    const { container } = render(<Rat hasSkull hasVial />);
    const [x, y, w, h] = viewBoxDi(container);

    // ⚠️ I numeri vengono dai **pixel dipinti** del ratto con tutto addosso — l'SVG su una tela a
    // 4×, primo e ultimo pixel non trasparente — perché né `getBBox()` né `getBoundingClientRect()`
    // contano il tratto. Qui si tiene il vincolo, non il valore: la cornice deve contenere la punta
    // della coda a sinistra (11,75 con la coda ad arco; era 9,75 con quella a ricciolo), il tappo
    // dell'ampolla in alto (0), il becco a destra (229,5) e la pianta dei piedi in basso (88,25,
    // dopo il ridisegno delle zampe: prima era 89,25). Sono le quattro cifre misurate il 2026-09-18
    // — e la prima cornice, scritta prima di misurare, questo test l'avrebbe presa: finiva a 88 con
    // i piedi a 89,25. Ogni volta che si sposta un pezzo, si rimisura e si aggiorna qui.
    expect(x).toBeLessThanOrEqual(11.75);
    expect(y).toBeLessThanOrEqual(0);
    expect(x + w).toBeGreaterThanOrEqual(229.5);
    expect(y + h).toBeGreaterThanOrEqual(88.25);
    expect(container.querySelector('svg')).not.toHaveStyle({ overflow: 'visible' });
  });
});
