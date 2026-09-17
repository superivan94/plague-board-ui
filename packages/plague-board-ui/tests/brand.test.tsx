import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  PLAGUE_BAR_MARK_SIZE,
  PlagueBar,
  type PlagueBarSize,
  PulseDot,
  TechLabel,
  TechRule,
} from '../src';

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

describe('TechRule', () => {
  it('dice il nome della categoria', () => {
    render(<TechRule>filosofia</TechRule>);

    expect(screen.getByText('filosofia')).toBeInTheDocument();
  });

  it('il filo è un separatore vero, e da verticale lo dichiara', () => {
    const { rerender } = render(<TechRule>filosofia</TechRule>);

    // ⚠️ Un separatore e non un filo decorativo con `aria-hidden`: quella riga **è** il confine fra
    // due gruppi, e chi non la vede ha lo stesso bisogno di sapere che il gruppo cambia.
    // ⚠️ E l'orizzontale **non** scrive `aria-orientation`, misurato qui: è il valore predefinito
    // del ruolo, e `react-aria` — che sta sotto al `Separator` di HeroUI — mette l'attributo solo
    // quando serve. Scriverlo a mano sarebbe stato rumore.
    expect(screen.getByRole('separator')).not.toHaveAttribute('aria-orientation');

    rerender(<TechRule orientation="vertical">filosofia</TechRule>);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('il colore si cambia da fuori, e vale per il filo e per il nome', () => {
    const { container } = render(<TechRule className="text-gray-500">filosofia</TechRule>);

    // ⚠️ Il colore sta sul contenitore e il nome lo **eredita**: è la stessa scelta delle icone,
    // dove il colore viaggia su `color` e non dentro `fill`. Scrivendolo sull'etichetta, chi usa
    // il componente non avrebbe modo di cambiarlo senza riscriverlo.
    expect(container.firstElementChild).toHaveClass('text-gray-500');
    expect(screen.getByText('filosofia')).not.toHaveClass('text-gray-500');
  });

  it('non litiga con la taglia del testo di `TechLabel`', () => {
    render(<TechRule>filosofia</TechRule>);

    // ⚠️ Due valori arbitrari della stessa proprietà — `text-[10px]` addosso a `text-[11px]` —
    // non si risolvono in modo prevedibile: nella classe vince chi sta più in basso nel CSS
    // generato, non chi sta più a destra nell'attributo. Qui la taglia dev'essere **una sola**,
    // quella che `TechLabel` porta di suo.
    const sizes = screen.getByText('filosofia').className.match(/text-\[\d+px\]/g) ?? [];
    expect(sizes).toHaveLength(1);
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
