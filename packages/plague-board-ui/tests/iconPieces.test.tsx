import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BacillusIcon, CloudIcon, CoccusIcon, DiceIcon, PoisonIcon, VirusIcon } from '../src';

// Le prove sulla **forma** dei disegni che ne hanno una da difendere: quanti pezzi, e con quale
// regola si compongono. Il contratto comune a tutte le icone sta in `icons.test.tsx`.

/**
 * Quanti pezzi staccati ha un tracciato: ogni `M` ne comincia uno.
 *
 * ⚠️ È l'unica misura di un disegno che jsdom concede — `getBBox` lì non esiste, e ogni
 * rettangolo misura zero — quindi la sagoma, i margini e le proporzioni stanno in `COLLAUDI.md`.
 * Quello che si prova qui è che i pezzi ci siano **tutti**: un tracciato che ne perde uno in un
 * copia e incolla continua a disegnare qualcosa di plausibile.
 */
function pezzi(d: string | null | undefined): number {
  return (d?.match(/M/g) ?? []).length;
}

describe('DiceIcon', () => {
  it('i cinque punti sono buchi nel corpo, non dischi dipinti', () => {
    const { container } = render(<DiceIcon />);

    const tracciato = container.querySelector('svg path');
    // ⚠️ Senza `evenodd` il dado non si rompe: si riempie. I cinque cerchi si sommano al corpo
    // invece di forarlo, e resta un quadrato stondato pieno — verde in ogni test che guarda le
    // prop, e sbagliato in pagina. È l'unica riga che difende il disegno.
    expect(tracciato).toHaveAttribute('fill-rule', 'evenodd');
    expect(pezzi(tracciato?.getAttribute('d'))).toBe(6);
  });
});

describe.each([
  { nome: 'CoccusIcon', Icon: CoccusIcon, appendici: 6 },
  { nome: 'BacillusIcon', Icon: BacillusIcon, appendici: 4 },
])('$nome', ({ Icon, appendici }) => {
  it('è un corpo, le sue appendici, e tre granuli dentro', () => {
    const { container } = render(<Icon />);

    const [corpo, code] = [...container.querySelectorAll('svg path')];
    expect(pezzi(corpo?.getAttribute('d'))).toBe(1);
    expect(pezzi(code?.getAttribute('d'))).toBe(appendici);

    // ⚠️ I granuli non sono decorazione: sono quello che toglie l'altro disegno di mezzo. Senza,
    // il cocco torna a essere un sole e il bacillo diventa una pillola — due segni che in una
    // libreria della peste non c'entrano niente, e che nessun test sulle prop vedrebbe mai.
    // E devono essere **tre**: due, simmetrici dentro un corpo, si leggono come due occhi.
    expect(container.querySelectorAll('circle[fill="currentColor"]')).toHaveLength(3);
  });
});

describe.each([
  { nome: 'VirusIcon', Icon: VirusIcon, corpo: 4, secondo: 16 },
  { nome: 'PoisonIcon', Icon: PoisonIcon, corpo: 4, secondo: 2 },
])('$nome', ({ Icon, corpo, secondo }) => {
  it('il corpo fora, il pezzo sopra somma — e sono due tracciati perché le regole sono due', () => {
    const { container } = render(<Icon />);

    const [dentro, sopra] = [...container.querySelectorAll('svg path')];

    // Il corpo è la sagoma più i tre buchi dentro. Senza `evenodd` non si rompe niente: i buchi si
    // riempiono, e restano un disco liscio e un'ampolla vuota.
    expect(dentro).toHaveAttribute('fill-rule', 'evenodd');
    expect(pezzi(dentro?.getAttribute('d'))).toBe(corpo);

    // ⚠️ E il secondo **non** deve portarla. Con `evenodd` anche qui, ogni pezzo che si sovrappone
    // al corpo si cancellerebbe invece di saldarcisi: le punte del virione si staccherebbero dal
    // capside, e il collo dell'ampolla lascerebbe una tacca dove entra nella boccia.
    expect(sopra).not.toHaveAttribute('fill-rule');
    expect(pezzi(sopra?.getAttribute('d'))).toBe(secondo);
  });
});

describe('CloudIcon', () => {
  it('è tre lobi più la base piatta, che è ciò che la rende una cappa', () => {
    const { container } = render(<CloudIcon />);

    const tracciato = container.querySelector('svg path');
    expect(pezzi(tracciato?.getAttribute('d'))).toBe(4);
    // ⚠️ E **non** porta `evenodd`, al contrario del dado: lì i pezzi si forano, qui si sommano.
    // Con la regola sbagliata i tre lobi si buchererebbero a vicenda dove si sovrappongono, e la
    // nuvola diventerebbe un intreccio di spicchi.
    expect(tracciato).not.toHaveAttribute('fill-rule');
  });
});
