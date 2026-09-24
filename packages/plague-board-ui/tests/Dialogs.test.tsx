import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LUDORATTI_COPY, PlagueConfirmDialog, PlagueDialog } from '../src';

const premi = (nome: string) => fireEvent.click(screen.getByRole('button', { name: nome }));
const esc = (elemento: Element) => fireEvent.keyDown(elemento, { key: 'Escape' });

describe('PlagueDialog', () => {
  const monta = (onOpenChange = vi.fn()) =>
    render(
      <PlagueDialog isOpen title="Le tue colonie" onOpenChange={onOpenChange} footer={<button type="button">Fatto</button>}>
        <p>Test Onlus e Default.</p>
      </PlagueDialog>,
    );

  it('chiuso non c’è', () => {
    render(
      <PlagueDialog isOpen={false} title="Le tue colonie" onOpenChange={vi.fn()}>
        niente
      </PlagueDialog>,
    );

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('aperto è un dialogo che si chiama col suo titolo, e il titolo è un `h2`', () => {
    // Il livello lo dà il `Dialog` di react-aria, che fuori da lui vale `h3`: il caso tiene quella
    // promessa, che non è nostra.
    monta();

    expect(screen.getByRole('dialog', { name: 'Le tue colonie' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Le tue colonie' })).toBeInTheDocument();
    expect(screen.getByText('Test Onlus e Default.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fatto' })).toBeInTheDocument();
  });

  it('il comando di chiusura parla italiano', () => {
    // Quello di HeroUI nasce «Close».
    const onOpenChange = vi.fn();
    monta(onOpenChange);

    premi('Chiudi');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('con Esc si chiude', () => {
    const onOpenChange = vi.fn();
    monta(onOpenChange);

    esc(screen.getByRole('dialog'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe('PlagueConfirmDialog', () => {
  const monta = (props: Partial<Parameters<typeof PlagueConfirmDialog>[0]> = {}) => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <PlagueConfirmDialog
        isOpen
        title="Estingui il ceppo"
        message="Questa scheda verrà eliminata, e non si torna indietro."
        onConfirm={onConfirm}
        onCancel={onCancel}
        {...props}
      />,
    );
    return { onConfirm, onCancel };
  };

  it('è un `alertdialog`, non un dialogo qualunque', () => {
    // ⚠️ Chi legge con la voce sente «avviso» e sa che gli si chiede di decidere: un `dialog`
    // direbbe solo che si è aperto qualcosa.
    monta();

    expect(screen.getByRole('alertdialog', { name: 'Estingui il ceppo' })).toBeInTheDocument();
    expect(screen.getByText('Questa scheda verrà eliminata, e non si torna indietro.')).toBeInTheDocument();
  });

  it('se distrugge, il comando dice che cosa fa in chiaro, e c’è il teschio', () => {
    // È la regola della voce `delete` del lessico: il titolo di casa, la conferma in chiaro.
    monta();

    expect(screen.getByRole('button', { name: LUDORATTI_COPY.delete.plain })).toBeInTheDocument();
    expect(screen.getByRole('alertdialog').querySelector('svg')).not.toBeNull();
  });

  it('se non distrugge, dice «Conferma»', () => {
    monta({ tone: 'primary' });

    expect(screen.getByRole('button', { name: 'Conferma' })).toBeInTheDocument();
  });

  it('le parole dei due comandi sono di chi lo monta', () => {
    monta({ confirmLabel: 'Esci dalla colonia', cancelLabel: 'Resto' });

    expect(screen.getByRole('button', { name: 'Esci dalla colonia' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resto' })).toBeInTheDocument();
  });

  it('conferma e annulla chiamano ognuno il suo', () => {
    const { onConfirm, onCancel } = monta();

    premi(LUDORATTI_COPY.delete.plain);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();

    premi('Annulla');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('con Esc annulla', () => {
    const { onCancel } = monta();

    esc(screen.getByRole('alertdialog'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('in attesa non si chiude, né con Esc né con «Annulla», e la conferma aspetta', () => {
    // ⚠️ Chiuderlo a metà vorrebbe dire non sapere più se l'eliminazione è avvenuta.
    const { onConfirm, onCancel } = monta({ isPending: true });

    esc(screen.getByRole('alertdialog'));
    premi('Annulla');
    premi(LUDORATTI_COPY.delete.plain);

    expect(onCancel).not.toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: LUDORATTI_COPY.delete.plain })).toHaveAttribute('aria-disabled', 'true');
  });
});
