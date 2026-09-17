import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PLAGUE_BAR_MARK_SIZE, PlagueBar, type PlagueBarSize, PulseDot, TechLabel } from '../src';

describe('PulseDot', () => {
  it('pulsa, se non gli si dice di stare fermo', () => {
    const { container } = render(<PulseDot />);

    expect(container.firstElementChild).toHaveClass('animate-pulse');
  });

  it('sta fermo quando glielo si chiede', () => {
    const { container } = render(<PulseDot isStatic />);

    // ⚠️ Non è pignoleria: il pallino marca anche voci in elenco, e venti pallini che pulsano
    // insieme sono rumore. Chi ne mette più d'uno deve poterli spegnere.
    expect(container.firstElementChild).not.toHaveClass('animate-pulse');
  });

  it('è decorativo: non si annuncia', () => {
    const { container } = render(<PulseDot />);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('TechLabel', () => {
  it('rende il testo che riceve', () => {
    render(<TechLabel>rete della peste</TechLabel>);

    expect(screen.getByText('rete della peste')).toBeInTheDocument();
  });

  it('non maiuscolizza il testo, lo maiuscolizza il disegno', () => {
    render(<TechLabel>rete della peste</TechLabel>);

    // ⚠️ `uppercase` è CSS: il testo nel DOM resta com'era. Chi lo trasformasse in JavaScript
    // romperebbe la ricerca sulla pagina e la copia negli appunti.
    const label = screen.getByText('rete della peste');
    expect(label).toHaveClass('uppercase');
    expect(label.textContent).toBe('rete della peste');
  });
});

describe('PlagueBar', () => {
  it('è un `<header>`, non una `<div>`', () => {
    render(
      <PlagueBar>
        <span>contenuto</span>
      </PlagueBar>,
    );

    // ⚠️ È la sola asserzione che vale davvero qui: una barra di navigazione che si rende come
    // `div` non ha il ruolo `banner`, quindi chi naviga per landmark non la trova.
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('contenuto')).toBeInTheDocument();
  });

  it('resta in cima scorrendo, e si può dirle di no', () => {
    const { rerender } = render(<PlagueBar>x</PlagueBar>);
    expect(screen.getByRole('banner')).toHaveClass('sticky');

    rerender(<PlagueBar isSticky={false}>x</PlagueBar>);
    expect(screen.getByRole('banner')).not.toHaveClass('sticky');
  });

  it('accetta classi in più senza perdere le sue', () => {
    render(<PlagueBar className="px-8">x</PlagueBar>);

    const bar = screen.getByRole('banner');
    expect(bar).toHaveClass('px-8');
    expect(bar).toHaveClass('sticky');
  });

  // ⚠️ L'altezza è **l'unica misura che la barra possiede**: quanto è larga la colonna dentro lo
  // decide chi la usa, e infatti il playground ci mette il suo `mx-auto max-w-5xl px-4`. Se un
  // giorno la spaziatura verticale tornasse nel contenuto, queste tre righe diventano rosse ed è
  // il posto giusto dove accorgersene: due `py` annidati non si sommano in modo prevedibile a
  // occhio, e la barra smetterebbe di avere una taglia.
  it.each([
    ['small', 'py-2'],
    ['medium', 'py-3'],
    ['large', 'py-4'],
  ] as const)('la taglia %s porta la sua altezza', (size, padding) => {
    render(<PlagueBar size={size}>x</PlagueBar>);

    expect(screen.getByRole('banner')).toHaveClass(padding);
  });

  it('senza taglia è media', () => {
    render(<PlagueBar>x</PlagueBar>);

    expect(screen.getByRole('banner')).toHaveClass('py-3');
  });

  it('il segno cresce con la barra e non scende mai sotto i 20px', () => {
    const sizes: readonly PlagueBarSize[] = ['small', 'medium', 'large'];
    const marks = sizes.map((size) => PLAGUE_BAR_MARK_SIZE[size]);

    // ⚠️ Il 20 non è un gusto: sotto quella misura il tratto interno di `RatIcon` scende sotto il
    // pixel e il cuore diventa un graffio. È il pavimento della barra **compatta**, ed è la prima
    // cosa che verrebbe sacrificata da chi la vuole ancora più bassa.
    expect(Math.min(...marks)).toBeGreaterThanOrEqual(20);
    expect(marks).toStrictEqual([...marks].sort((a, b) => a - b));
    expect(new Set(marks).size).toBe(sizes.length);
  });
});
