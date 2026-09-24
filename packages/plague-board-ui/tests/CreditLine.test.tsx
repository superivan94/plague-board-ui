import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CreditLine } from '../src';

const AUTORI = [
  { name: 'Superivan94' },
  { name: 'AI-Dev' },
] as const;

/** Le classi una per una: `@max-lg:hidden` contiene la parola `hidden`, e non è la stessa cosa. */
const classi = (elemento: Element) => elemento.className.split(/\s+/);

describe('CreditLine', () => {
  it('tiene il primo autore sempre, e nasconde gli altri solo in un contenitore stretto', () => {
    render(<CreditLine authors={AUTORI} />);

    const primo = screen.getByText('Superivan94').closest('span[class]')!;
    const secondo = screen.getByText('AI-Dev').closest('span[class]')!;

    // Il primo autore è quello che sopravvive: in una firma «umano e AI» è la persona.
    expect(classi(primo.parentElement!)).not.toContain('hidden');
    // ⚠️ La forma lunga è la **base** e la corta sta dietro `@max-lg:`. Senza un `@container`
    // sopra, una container query non si applica e resta la classe di base: così chi dimentica il
    // contenitore vede la firma intera — un difetto che si nota —, non un autore che sparisce.
    expect(classi(secondo.parentElement!)).not.toContain('hidden');
    expect(classi(secondo.parentElement!)).toContain('@max-lg:hidden');
  });

  it('senza contenitore l’etichetta è quella lunga, e la corta aspetta che uno la stringa', () => {
    render(<CreditLine authors={AUTORI} />);

    expect(classi(screen.getByText('Creato da'))).not.toContain('hidden');
    expect(classi(screen.getByText('Creato da'))).toContain('@max-lg:hidden');
    expect(classi(screen.getByText('By:'))).toEqual(expect.arrayContaining(['hidden', '@max-lg:inline']));
  });

  it('con `isCompact` è corta a qualunque larghezza, e il contenitore non conta più', () => {
    render(<CreditLine authors={AUTORI} isCompact />);

    const secondo = screen.getByText('AI-Dev').closest('span[class]')!;

    // ⚠️ Nessuna container query: la forma corta sta nelle classi di base, quindi vale anche
    // senza un `@container` sopra e dentro uno largo. È anche l'unico modo di mostrarla in una
    // colonna larga, cioè in una storia guardata a 768.
    expect(classi(screen.getByText('Creato da'))).toContain('hidden');
    expect(classi(screen.getByText('By:'))).not.toContain('hidden');
    expect(classi(secondo.parentElement!)).toContain('hidden');
    for (const pezzo of [screen.getByText('Creato da'), screen.getByText('By:'), secondo.parentElement!]) {
      expect(pezzo.className).not.toMatch(/@max-lg:/);
    }
  });
});
