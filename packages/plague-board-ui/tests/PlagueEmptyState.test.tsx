import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LUDORATTI_COPY, PlagueEmptyState, SkullIcon } from '../src';

describe('PlagueEmptyState', () => {
  it('di serie mostra la mascotte e il titolo di casa, e il titolo è un titolo vero', () => {
    const { container } = render(<PlagueEmptyState />);

    expect(screen.getByRole('heading', { level: 2, name: LUDORATTI_COPY.empty.house })).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeNull();
  });

  it('la mascotte è decorativa: a dire che non c’è niente è il titolo', () => {
    // Un'immagine col suo nome sarebbe annunciata prima del titolo, e direbbe «ratto con
    // l'ampolla» dove chi ascolta vuole sapere che la lista è vuota.
    render(<PlagueEmptyState />);

    expect(screen.queryByRole('img')).toBeNull();
  });

  it('prende la spiegazione e il comando da chi lo monta', () => {
    render(
      <PlagueEmptyState
        title="Nessun manuale"
        description="Crea il primo, o importalo da Notion."
        action={<button type="button">Nuovo manuale</button>}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Nessun manuale' })).toBeInTheDocument();
    expect(screen.getByText('Crea il primo, o importalo da Notion.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nuovo manuale' })).toBeInTheDocument();
  });

  it('il livello del titolo lo sceglie chi lo monta, perché dipende dalla pagina', () => {
    render(<PlagueEmptyState headingLevel={3} />);

    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('l’illustrazione si sostituisce, e con `null` si toglie', () => {
    const { container, rerender } = render(<PlagueEmptyState illustration={<SkullIcon size={48} />} />);

    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('svg')).not.toBeNull();

    rerender(<PlagueEmptyState illustration={null} />);
    expect(container.querySelector('img, svg')).toBeNull();
  });

  it('senza spiegazione non lascia un paragrafo vuoto', () => {
    const { container } = render(<PlagueEmptyState />);

    expect(container.querySelector('p:empty')).toBeNull();
  });
});
