import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LUDORATTI_COPY, PlagueLoader } from '../src';
import { animazioni, blocco, fermatiDaMenoMovimento } from './fogli';

describe('PlagueLoader', () => {
  it('si annuncia come uno stato, con la frase di casa', () => {
    // ⚠️ È il motivo per cui non basta lo `Spinner` di HeroUI: nasce `role="status"` col nome
    // «Loading», in inglese e non sostituibile.
    render(<PlagueLoader />);

    expect(screen.getByRole('status', { name: LUDORATTI_COPY.loading.house })).toBeInTheDocument();
  });

  it('dice le parole che riceve', () => {
    render(<PlagueLoader label="Apertura della tana…" />);

    expect(screen.getByRole('status', { name: 'Apertura della tana…' })).toBeInTheDocument();
  });

  it('piccolo è il marchio pieno che batte, e il ratto non c’è', () => {
    const { container } = render(<PlagueLoader />);

    const battito = container.querySelector('.pb-loader-beat');
    expect(battito?.querySelector('svg')).not.toBeNull();
    expect(container.querySelector('.pb-rat')).toBeNull();
  });

  it('piccolo non scrive la frase a schermo: dentro un bottone la direbbe due volte', () => {
    const { container } = render(<PlagueLoader />);

    expect(container).toHaveTextContent('');
  });

  it('grande è il ratto che corre sul posto, con la frase scritta sotto', () => {
    const { container } = render(<PlagueLoader variant="block" />);

    // Sul posto: le zampe e la coda si muovono, ma la traversata di `RatRun` non c'è.
    expect(container.querySelector('.pb-rat.pb-rat--running')).not.toBeNull();
    expect(container.querySelector('.pb-rat-run')).toBeNull();
    // ⚠️ E la frase è il contenuto, non un `aria-label` accanto: col nome e il testo insieme, chi
    // legge con la voce la sentirebbe due volte.
    expect(screen.getByRole('status')).toHaveTextContent(LUDORATTI_COPY.loading.house);
    expect(screen.getByRole('status')).not.toHaveAttribute('aria-label');
  });

  it('i segni sono decorativi: a dire che si aspetta è la frase', () => {
    const { container } = render(
      <>
        <PlagueLoader />
        <PlagueLoader variant="block" />
      </>,
    );

    for (const segno of container.querySelectorAll('svg')) {
      expect(segno).toHaveAttribute('aria-hidden', 'true');
    }
  });

  it('batte col battito del marchio, più svelto', () => {
    // Lo stesso keyframe: due battiti diversi sarebbero due marchi.
    expect(blocco(animazioni, '.pb-loader-beat {')).toMatch(/pb-heartbeat/);
  });

  it('con «meno movimento» si ferma, e la frase resta', () => {
    // Il ratto grande è già fermato dalle regole di `pb-rat--running`; la classe del battito
    // svelto è nostra, e la regola di «meno movimento» non la prende da sé.
    expect(fermatiDaMenoMovimento).toContain('.pb-loader-beat');
  });
});
