import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PlagueBar, PulseDot, TechLabel } from '../src';

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
});
