import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RAT_ICON_MUZZLE_FLOOR, RatIcon, type RatIconMuzzle } from '../src';

/**
 * Il marchio dei Ludoratti, i suoi due stati e il suo battito.
 *
 * Il **contratto di icona** — misura, colore, classe, `aria-hidden`, un disegno diverso da ogni
 * altra — lo prova la tabella di `icons.test.tsx`, dove `RatIcon` è in elenco come tutte. Qui c'è
 * quello che ha solo lei: il cuore che si riempie, e il cuore che batte.
 *
 * ⚠️ **In jsdom un'animazione non gira**: `getAnimations()` non esiste e ogni rettangolo misura
 * zero. Si prova quindi **dove va a finire la classe**, che è la sola cosa che decide chi si
 * muove — e che l'animazione si veda davvero sta in `COLLAUDI.md`.
 */

const marchio = (props: Parameters<typeof RatIcon>[0] = {}) => {
  const { container } = render(<RatIcon {...props} />);
  const svg = container.querySelector('svg')!;
  return {
    svg,
    /**
     * La classe del gruppo che batte — cuore e orecchie insieme, con l'anello fuori.
     *
     * ⚠️ Si legge con `getAttribute`: su un elemento SVG `className` è un `SVGAnimatedString`,
     * cioè un oggetto, quindi è **sempre** vero e un `toBeFalsy()` su di lui non prova niente.
     */
    classe: svg.querySelector('g')?.getAttribute('class'),
    classeSvg: svg.getAttribute('class'),
    gruppo: svg.querySelector('g'),
    riempimento: svg.querySelector('path[fill="currentColor"]'),
    /** Le due curve del contorno: sono le sole a portare i capi tondi **e** i giunti tondi. */
    curve: [...svg.querySelectorAll('path[stroke-linejoin]')],
    /** I baffi: l'unico tracciato a tratto senza giunti, perché sono segmenti aperti. */
    baffi: svg.querySelector('path[stroke-linecap]:not([stroke-linejoin])'),
    tracciati: [...svg.querySelectorAll('path')],
  };
};

/** I sei segmenti dei baffi, letti dal `d` e riportati a coppie di punti. */
const segmenti = (d: string) =>
  d
    .split('M')
    .filter(Boolean)
    .map((pezzo) => pezzo.split('L').map((punto) => punto.trim().split(' ').map(Number) as [number, number]));

describe('RatIcon — i due stati', () => {
  it('senza niente il cuore è vuoto: c’è il contorno e non c’è la campitura', () => {
    const { riempimento, tracciati } = marchio();

    // ⚠️ È lo stato storico del marchio, quello che arriva invariato da `ludoratti.it`, e il primo
    // caso lo difende: un riempimento comparso per sbaglio non romperebbe niente — darebbe solo un
    // altro marchio.
    expect(riempimento).toBeNull();
    expect(tracciati).toHaveLength(3);
  });

  it('con `isFilled` il cuore si riempie, e il contorno resta', () => {
    const { riempimento, tracciati } = marchio({ isFilled: true });

    expect(riempimento).toBeInTheDocument();
    // Quattro: l'anello, le due curve del contorno, più la campitura. ⚠️ Il contorno **non** si
    // toglie: il tratto è largo 1,5 e dipinge mezza unità oltre il percorso, quindi senza di lui
    // il cuore pieno sarebbe più magro di quello vuoto, e i due stati si vedrebbero cambiare
    // taglia invece che riempirsi.
    expect(tracciati).toHaveLength(4);
    expect(riempimento).toHaveAttribute('stroke', 'none');
  });

  it('la campitura segue lo stesso contorno delle due curve, non un disegno suo', () => {
    const { riempimento, curve } = marchio({ isFilled: true });
    const [destra, sinistra] = curve;

    // ⚠️ È il caso che tiene i due stati sullo stesso disegno. La campitura è la concatenazione
    // letterale delle due curve più la chiusura: ritoccandone una sola, il pieno sborderebbe dal
    // vuoto di qualche decimo — che a 18px è invisibile e a 96 è un alone.
    const contorno = destra.getAttribute('d')! + sinistra.getAttribute('d')!.replace('M12 10.5', '');
    expect(riempimento).toHaveAttribute('d', `${contorno}Z`);
  });
});

describe('RatIcon — il battito', () => {
  it('batte da sé, senza che chi lo monta se lo ricordi', () => {
    // ⚠️ Deroga dichiarata alla regola della tazza e del pallino, dove l'interruttore sta su chi
    // monta il pezzo: questo è il **marchio**, e il suo battito è identità, non decorazione.
    expect(marchio().classeSvg).toContain('pb-mark-beat');
  });

  it('batte tutto insieme, che è quello che il marchio ha sempre fatto', () => {
    const { classeSvg, classe } = marchio();

    // ⚠️ La classe va sull'`<svg>` e **non** sul gruppo: da sempre l'intestazione passava
    // `animate-heartbeat` addosso all'icona intera, e cambiare il predefinito vorrebbe dire
    // cambiare l'aspetto di ogni marchio già montato senza che nessuno l'abbia chiesto.
    expect(classeSvg).toContain('pb-mark-beat');
    expect(classe).toBeFalsy();
  });

  it('o solo dentro, con l’anello fermo', () => {
    const { classeSvg, classe } = marchio({ beat: 'inner' });

    // Il modificatore porta il perno in unità del `viewBox`. ⚠️ Senza di lui, sull'`<svg>` esterno
    // quei numeri tornerebbero pixel dello schermo e a 96px il marchio pulserebbe attorno a un
    // punto vicino allo spigolo: è per questo che le classi sono due e non una.
    expect(classe).toBe('pb-mark-beat pb-mark-beat--inner');
    expect(classeSvg).not.toContain('pb-mark-beat');
  });

  it('si può fermare, e allora non batte né fuori né dentro', () => {
    expect(marchio({ animateOn: 'none' }).classe).toBeFalsy();
    expect(marchio({ animateOn: 'none' }).classeSvg).not.toContain('pb-mark-beat');
    expect(marchio({ animateOn: 'none', beat: 'inner' }).classe).toBeFalsy();
  });

  it('e si può far battere in uno stato solo', () => {
    // Il caso vero: una lista di preferiti, dove a muoversi è quello scelto e gli altri stanno
    // fermi — o l'opposto, se a chiamare l'occhio dev'essere quello ancora da scegliere.
    expect(marchio({ animateOn: 'filled', isFilled: true }).classeSvg).toContain('pb-mark-beat');
    expect(marchio({ animateOn: 'filled' }).classeSvg).not.toContain('pb-mark-beat');
    expect(marchio({ animateOn: 'empty', beat: 'inner' }).classe).toContain('pb-mark-beat');
    expect(marchio({ animateOn: 'empty', beat: 'inner', isFilled: true }).classe).toBeFalsy();
  });

  it('la classe di chi lo monta non si perde quando il marchio batte', () => {
    // ⚠️ La variante predefinita scrive sull'`<svg>`, cioè sullo stesso attributo che riceve
    // `className`. Sostituendolo invece di comporlo, un marchio che batte perderebbe il colore e
    // lo `shrink-0` che chi lo mette in una barra gli ha dato — e si vedrebbe come un marchio
    // schiacciato, non come una classe persa.
    const { classeSvg } = marchio({ className: 'text-brand shrink-0' });

    expect(classeSvg).toContain('text-brand');
    expect(classeSvg).toContain('shrink-0');
    expect(classeSvg).toContain('pb-mark-beat');
  });

  it('l’anello non batte da solo: sta fuori dal gruppo', () => {
    const { svg, gruppo } = marchio({ beat: 'inner' });
    const anello = svg.querySelector('path[stroke-opacity]');

    // ⚠️ Nella variante interna l'anello è il recinto, non il soggetto. Dentro il gruppo
    // pulserebbe anche lui, e le due varianti diventerebbero la stessa cosa.
    expect(anello).toBeInTheDocument();
    expect(gruppo?.contains(anello!)).toBe(false);
  });
});

/**
 * Il muso: occhi e baffi, disegnati dall'utente a mano e riportati in unità del `viewBox` con una
 * sonda a componenti connesse (`COLLAUDI.md`, «Il muso del marchio»).
 */
describe('RatIcon — il muso', () => {
  it('non c’è, se non lo si chiede', () => {
    const { baffi, riempimento } = marchio({ isFilled: true });

    // ⚠️ Il predefinito è `none` per la stessa ragione per cui `beat` è `whole`: il marchio è già
    // montato in una barra, in un piede e in una schermata di accesso, e un muso comparso da sé
    // cambierebbe l'identità di tutti e tre senza che nessuno l'abbia chiesto.
    expect(baffi).toBeNull();
    expect(riempimento!.getAttribute('d')).not.toContain('Q');
  });

  it('con `eyes` gli occhi sono due fori nella campitura, non due sagome dipinte', () => {
    const { riempimento, baffi, curve } = marchio({ isFilled: true, muzzle: 'eyes' });
    const [destra, sinistra] = curve;
    const cuore = destra.getAttribute('d')! + sinistra.getAttribute('d')!.replace('M12 10.5', '');

    // ⚠️ È il vincolo che decide il disegno: la campitura è `currentColor`, quindi un occhio
    // **dipinto** dello stesso colore non esiste. Gli occhi stanno nello stesso `d` del cuore e
    // sono cavati con `evenodd`, che qui funziona perché sono **interamente dentro** la sagoma —
    // il caso dei buchi, non quello delle sagome affiancate, dove la regola pari/dispari le
    // conterebbe insieme.
    expect(riempimento).toHaveAttribute('fill-rule', 'evenodd');
    expect(riempimento!.getAttribute('d')!.startsWith(`${cuore}Z`)).toBe(true);
    expect(riempimento!.getAttribute('d')!.length).toBeGreaterThan(`${cuore}Z`.length);
    expect(baffi).toBeNull();
  });

  it('e i due occhi sono lo stesso disegno specchiato sull’asse del marchio', () => {
    const { riempimento, curve } = marchio({ isFilled: true, muzzle: 'eyes' });
    const [destra, sinistra] = curve;
    const cuore = `${destra.getAttribute('d')!}${sinistra.getAttribute('d')!.replace('M12 10.5', '')}Z`;
    const occhi = riempimento!.getAttribute('d')!.slice(cuore.length);
    const [sx, dx] = occhi.split('Z').filter(Boolean);

    // Le due `x` di un occhio e quelle dell'altro devono sommare a 24 a coppie, una volta rimesse
    // in ordine: è la simmetria, e un occhio spostato a mano da un lato solo la rompe.
    const ics = (d: string) =>
      [...d.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)].map((m) => Number(m[1])).sort((a, b) => a - b);
    const a = ics(sx);
    const b = ics(dx);

    expect(a).toHaveLength(b.length);
    expect(a.map((x, i) => Number((x + b[b.length - 1 - i]).toFixed(2)))).toStrictEqual(a.map(() => 24));
  });

  it('con `full` arrivano i baffi: sei segmenti, tre per lato, a tratto sottile', () => {
    const { baffi } = marchio({ isFilled: true, muzzle: 'full' });

    expect(baffi).toBeInTheDocument();
    // ⚠️ 0,45 e non 1,5: il tratto misurato sul disegno a mano è ~0,55, e sopra 0,8 i baffi non
    // sono più baffi ma **zampe** — il primo giro sembrava una rana seduta.
    expect(baffi).toHaveAttribute('stroke-width', '0.45');
    expect(baffi).toHaveAttribute('stroke-linecap', 'round');
    expect(segmenti(baffi!.getAttribute('d')!)).toHaveLength(6);
  });

  it('i baffi si dipingono prima della campitura, così la radice non si vede', () => {
    const { baffi, riempimento } = marchio({ isFilled: true, muzzle: 'full' });

    // ⚠️ Nascono **dentro** la sagoma apposta: il cuore pieno li copre e il moncone interno
    // sparisce da sé, senza calcolare dove la retta incontra la curva. È lo stesso mestiere del
    // giunto sintetico dietro al tronco del ratto che corre. Invertendo l'ordine, da ogni baffo
    // spunterebbe un mozzicone dentro il muso.
    expect(baffi!.compareDocumentPosition(riempimento!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('nessun baffo tocca l’anello, nemmeno al picco del battito interno', () => {
    const { baffi } = marchio({ isFilled: true, muzzle: 'full' });

    // ⚠️ Questo è il caso che un occhio non trova. Col battito **interno** il gruppo scala 1,12
    // attorno a (12 · 13) mentre l'anello resta fermo: le punte gli si avvicinano, e nella prima
    // taratura due su tre lo **tagliavano** al picco — un lampo chiaro attraverso una riga tenue,
    // per un ottavo di secondo ogni 3,2 s. I franchi misurati: 0,54 · 0,38 · 0,43.
    const PERNO = [12, 13];
    const PICCO = 1.12;
    const R_INTERNO = 9.25; // raggio 10 meno mezzo tratto da 1,5
    const MEZZO_BAFFO = (0.45 * PICCO) / 2;

    for (const [, punta] of segmenti(baffi!.getAttribute('d')!)) {
      const x = PERNO[0] + (punta[0] - PERNO[0]) * PICCO;
      const y = PERNO[1] + (punta[1] - PERNO[1]) * PICCO;
      expect(Math.hypot(x - 12, y - 12) + MEZZO_BAFFO).toBeLessThan(R_INTERNO);
    }
  });

  it('il muso sta dentro il gruppo che batte, o si staccherebbe dalla faccia', () => {
    const { gruppo, baffi, riempimento } = marchio({ isFilled: true, muzzle: 'full', beat: 'inner' });

    expect(gruppo?.contains(baffi!)).toBe(true);
    expect(gruppo?.contains(riempimento!)).toBe(true);
  });

  it('sul cuore vuoto non c’è muso, perché non c’è campitura che lo tenga', () => {
    const { baffi, riempimento, tracciati } = marchio({ muzzle: 'full' });

    // ⚠️ Non è una prop ignorata: `muzzle` dice **com'è fatto lo stato pieno**, esattamente come
    // `animateOn: 'filled'` dice in quale stato si batte. Senza campitura gli occhi non hanno
    // dove essere cavati, e i baffi non hanno niente che copra la radice: sarebbero sei trattini
    // che entrano in un cuore vuoto.
    expect(baffi).toBeNull();
    expect(riempimento).toBeNull();
    expect(tracciati).toHaveLength(3);
  });

  it('i pavimenti sono dichiarati, e crescono con quello che si aggiunge', () => {
    const musi: RatIconMuzzle[] = ['none', 'eyes', 'full'];

    // ⚠️ La tabella esiste perché il componente **non può** decidere da sé: una classe `size-*`
    // sostituisce l'attributo `width`, quindi `size` non è un testimone attendibile di quanto il
    // segno verrà dipinto davvero. Il numero lo dà la libreria, la scelta la fa chi monta.
    expect(Object.keys(RAT_ICON_MUZZLE_FLOOR).sort()).toStrictEqual([...musi].sort());
    expect(RAT_ICON_MUZZLE_FLOOR.none).toBeLessThan(RAT_ICON_MUZZLE_FLOOR.eyes);
    expect(RAT_ICON_MUZZLE_FLOOR.eyes).toBeLessThan(RAT_ICON_MUZZLE_FLOOR.full);
  });
});
