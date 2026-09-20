import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RatIcon } from '../src';

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
    gruppo: svg.querySelector('g'),
    riempimento: svg.querySelector('path[fill="currentColor"]'),
    /** Le due curve del contorno: sono le sole a portare i capi tondi. */
    curve: [...svg.querySelectorAll('path[stroke-linecap]')],
    tracciati: [...svg.querySelectorAll('path')],
  };
};

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
    expect(marchio().gruppo).toHaveClass('pb-mark-beat');
  });

  it('si può fermare', () => {
    expect(marchio({ animateOn: 'none' }).classe).toBeFalsy();
  });

  it('e si può far battere in uno stato solo', () => {
    // Il caso vero: una lista di preferiti, dove a muoversi è quello scelto e gli altri stanno
    // fermi — o l'opposto, se a chiamare l'occhio dev'essere quello ancora da scegliere.
    expect(marchio({ animateOn: 'filled', isFilled: true }).classe).toBe('pb-mark-beat');
    expect(marchio({ animateOn: 'filled' }).classe).toBeFalsy();
    expect(marchio({ animateOn: 'empty' }).classe).toBe('pb-mark-beat');
    expect(marchio({ animateOn: 'empty', isFilled: true }).classe).toBeFalsy();
  });

  it('l’anello non batte: sta fuori dal gruppo', () => {
    const { svg, gruppo } = marchio();
    const anello = svg.querySelector('path[stroke-opacity]');

    // ⚠️ L'anello è il recinto, non il soggetto. Dentro il gruppo pulserebbe anche lui, e un
    // marchio che si gonfia tutto insieme non è un cuore che batte: è un segno che respira.
    expect(anello).toBeInTheDocument();
    expect(gruppo?.contains(anello!)).toBe(false);
  });
});
