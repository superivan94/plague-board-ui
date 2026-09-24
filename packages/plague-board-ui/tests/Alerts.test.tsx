import { toast } from '@heroui/react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { PlagueAlert, PlagueToastRegion, SkullIcon, type PlagueStatus } from '../src';

/** Il tracciato del teschio, per riconoscerlo dove lo mette qualcun altro. */
const teschio = () => render(<SkullIcon />).container.querySelector('path')?.getAttribute('d');

describe('PlagueAlert', () => {
  it.each<[PlagueStatus, 'status' | 'alert']>([
    ['default', 'status'],
    ['accent', 'status'],
    ['success', 'status'],
    ['warning', 'alert'],
    ['danger', 'alert'],
  ])('%s si annuncia come `%s`', (status, ruolo) => {
    // ⚠️ L'`Alert` di HeroUI **un ruolo non ce l'ha**: è un `<div>`, e un avviso che non si annuncia
    // a chi legge con la voce non avvisa nessuno. `alert` interrompe, quindi va solo dove serve.
    render(<PlagueAlert status={status} title="Sigillato" />);

    expect(screen.getByRole(ruolo)).toHaveTextContent('Sigillato');
  });

  it('porta il titolo e la spiegazione', () => {
    render(
      <PlagueAlert status="warning" title="Il ceppo è degenerato">
        Il salvataggio non è andato a buon fine: riprova fra poco.
      </PlagueAlert>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Il ceppo è degenerato');
    expect(screen.getByRole('alert')).toHaveTextContent('Il salvataggio non è andato a buon fine');
  });

  it('il segno di serie viene dalla peste, e si sostituisce', () => {
    const d = teschio();
    const { container, rerender } = render(<PlagueAlert status="danger" title="Estinto" />);

    expect(container.querySelector('path')?.getAttribute('d')).toBe(d);

    rerender(<PlagueAlert status="danger" title="Estinto" icon={<span data-testid="mio" />} />);
    expect(screen.getByTestId('mio')).toBeInTheDocument();
  });

  it('il segno è decorativo: a dire che cosa succede sono le parole', () => {
    const { container } = render(<PlagueAlert status="success" title="Sigillato" />);

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('PlagueToastRegion', () => {
  afterEach(() => {
    act(() => toast.clear());
  });

  it('mostra le notifiche mandate con `toast()` di HeroUI', () => {
    // ⚠️ `toast()` si importa da HeroUI e non da qui: le peer si dichiarano, non si riesportano.
    render(<PlagueToastRegion />);

    act(() => {
      toast('Manuale sigillato', { description: 'Le modifiche sono al sicuro.' });
    });

    expect(screen.getByText('Manuale sigillato')).toBeInTheDocument();
    expect(screen.getByText('Le modifiche sono al sicuro.')).toBeInTheDocument();
  });

  it('coi segni della peste al posto di quelli di HeroUI', () => {
    const d = teschio();
    render(<PlagueToastRegion />);

    act(() => {
      toast.danger('Il ceppo è degenerato');
    });

    const indicatore = document.querySelector('[data-slot="toast-indicator"]');
    expect(indicatore?.querySelector('path')?.getAttribute('d')).toBe(d);
  });

  it('un’attesa mostra il marchio che batte', () => {
    render(<PlagueToastRegion />);

    act(() => {
      toast('Importo da Notion…', { isLoading: true });
    });

    expect(document.querySelector('[data-slot="toast-indicator"] .pb-loader-beat')).not.toBeNull();
  });

  it('il comando che chiude parla italiano', () => {
    render(<PlagueToastRegion />);

    act(() => {
      toast('Manuale sigillato');
    });

    expect(screen.getByRole('button', { name: 'Chiudi' })).toBeInTheDocument();
  });
});
