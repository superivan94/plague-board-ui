import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import { useReducedMotion } from '../src';
import { menoMovimento } from './preferenze';

/** Scrive a schermo la risposta del gancio, così la si legge da tutti e due i lati. */
function Sonda() {
  return <span>{useReducedMotion() ? 'fermo' : 'mosso'}</span>;
}

describe('useReducedMotion', () => {
  const matchMediaVero = window.matchMedia;

  afterEach(() => {
    window.matchMedia = matchMediaVero;
  });

  it('nel browser legge la preferenza di chi guarda', () => {
    menoMovimento(true);
    render(<Sonda />);

    expect(screen.getByText('fermo')).toBeInTheDocument();
  });

  it('sul server risponde «nessuna preferenza», anche quando la persona l’ha chiesta', () => {
    // ⚠️ È la metà che tiene in piedi l'idratazione, e un render normale non la esercita mai: il
    // server non sa niente delle impostazioni di chi guarda, e se rispondesse a caso l'HTML che
    // manda e il primo render del client darebbero due alberi diversi — React li butterebbe via
    // entrambi. `renderToString` chiama la risposta **del server** anche qui dentro jsdom, dove
    // la preferenza c'è: è per questo che la prova vale.
    menoMovimento(true);

    expect(renderToString(<Sonda />)).toContain('mosso');
  });
});
