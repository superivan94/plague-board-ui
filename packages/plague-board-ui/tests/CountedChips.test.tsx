import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CountedChips, ThematicBadge } from '../src';

const VOCI = ['peste', 'dadi', 'cooperativo', 'medioevo', 'ratti'];

const chips = (voci: readonly string[] = VOCI) =>
  voci.map((voce) => <ThematicBadge key={voce}>{voce}</ThematicBadge>);

const comando = () => screen.queryByRole('button');

describe('CountedChips', () => {
  it('sotto il limite non conta niente, e non mette nessun comando', () => {
    render(<CountedChips visible={3}>{chips(['peste', 'dadi'])}</CountedChips>);

    expect(screen.getByText('peste')).toBeInTheDocument();
    expect(screen.getByText('dadi')).toBeInTheDocument();
    expect(comando()).toBeNull();
  });

  it('al limite esatto non mette nessun comando', () => {
    // Il bordo: con `+0` il comando esisterebbe senza avere niente da mostrare.
    render(<CountedChips visible={3}>{chips(VOCI.slice(0, 3))}</CountedChips>);

    expect(comando()).toBeNull();
  });

  it('oltre il limite ne mostra pochi, e conta quelle che restano', () => {
    render(<CountedChips visible={3}>{chips()}</CountedChips>);

    expect(screen.getByText('peste')).toBeInTheDocument();
    expect(screen.getByText('cooperativo')).toBeInTheDocument();
    // ⚠️ Il conto è di quelle **nascoste**, non del totale: cinque voci, tre viste, «+2».
    expect(comando()).toHaveTextContent('+2');
  });

  it('quello che non si vede non è nella pagina, non è solo invisibile', () => {
    render(<CountedChips visible={3}>{chips()}</CountedChips>);

    // ⚠️ Stessa scelta dell'interruttore di `GlitchText`: un elemento nascosto con una classe lo
    // troverebbero lo stesso la ricerca nella pagina, la selezione e chi copia.
    expect(screen.queryByText('medioevo')).toBeNull();
    expect(screen.queryByText('ratti')).toBeNull();
  });

  it('è un comando vero, e dichiara di essere chiuso', () => {
    render(<CountedChips visible={3}>{chips()}</CountedChips>);

    const apri = comando();
    expect(apri?.tagName).toBe('BUTTON');
    expect(apri).toHaveAttribute('aria-expanded', 'false');
  });

  it('premuto apre tutto, e ripremuto richiude', () => {
    render(<CountedChips visible={3}>{chips()}</CountedChips>);

    fireEvent.click(comando()!);
    expect(screen.getByText('medioevo')).toBeInTheDocument();
    expect(screen.getByText('ratti')).toBeInTheDocument();
    expect(comando()).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(comando()!);
    expect(screen.queryByText('ratti')).toBeNull();
    expect(comando()).toHaveAttribute('aria-expanded', 'false');
  });

  it('il suo nome contiene quello che c’è scritto sopra', () => {
    render(<CountedChips visible={3}>{chips()}</CountedChips>);

    // ⚠️ Non è pignoleria: chi comanda il browser con la voce legge «più due» e lo dice, e se il
    // nome accessibile non contiene il testo visibile quel comando non si può pronunciare. Per
    // questo il conto entra nel nome invece di restare solo a schermo.
    const apri = screen.getByRole('button', { name: 'Mostra tutti (+2)' });
    expect(apri).toHaveTextContent('+2');
  });

  it('il nome non cambia aprendo: a dire lo stato è `aria-expanded`', () => {
    render(<CountedChips visible={3}>{chips()}</CountedChips>);

    fireEvent.click(comando()!);

    // Un comando che cambia nome mentre si apre è un comando che chi legge deve ritrovare: il
    // modo giusto di dire «adesso chiude» è lo stato, non una parola diversa.
    expect(screen.getByRole('button', { name: 'Mostra tutti (+2)' })).toBeInTheDocument();
  });

  it('lascia cambiare la parola a chi lo monta', () => {
    render(
      <CountedChips visible={1} moreLabel="Scopri gli altri ceppi">
        {chips()}
      </CountedChips>,
    );

    expect(screen.getByRole('button', { name: 'Scopri gli altri ceppi (+4)' })).toBeInTheDocument();
  });

  it('con `visible={0}` non se ne vede nessuna, e il conto è tutto', () => {
    render(<CountedChips visible={0}>{chips()}</CountedChips>);

    expect(screen.queryByText('peste')).toBeNull();
    expect(comando()).toHaveTextContent('+5');
  });

  it('le classi arrivano al contenitore', () => {
    const { container } = render(
      <CountedChips className="justify-center">{chips()}</CountedChips>,
    );

    expect(container.firstElementChild).toHaveClass('justify-center');
  });
});
