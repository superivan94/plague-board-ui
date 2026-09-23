import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CodeIcon, CreditCard, binaryRain } from '../src';

describe('CreditCard', () => {
  it('è un segno e un nome, e il segno non si annuncia', () => {
    const { container } = render(<CreditCard name="AI-Dev" icon={<CodeIcon size={16} />} />);

    // Il nome è già scritto accanto: un segno che si annunciasse lo direbbe due volte.
    expect(screen.getByText('AI-Dev')).toBeInTheDocument();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('con un indirizzo è un collegamento a una scheda nuova, e il legame con questa si recide', () => {
    render(<CreditCard name="Superivan94" href="https://esempio.test/io" />);

    const collegamento = screen.getByRole('link', { name: 'Superivan94' });
    expect(collegamento).toHaveAttribute('href', 'https://esempio.test/io');
    expect(collegamento).toHaveAttribute('target', '_blank');
    // ⚠️ Senza `noopener` la pagina che si apre può riscrivere l'indirizzo di quella che l'ha
    // aperta, e questa è una firma: la cliccano persone che non si aspettano niente.
    expect(collegamento).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('senza indirizzo è un nome e basta, non un collegamento che non porta da nessuna parte', () => {
    const { container } = render(<CreditCard name="AI-Dev" />);

    // ⚠️ Si cerca l'**elemento**, non il ruolo: un `<a>` senza `href` il ruolo `link` non ce l'ha,
    // quindi `queryByRole('link')` darebbe `null` anche con l'ancora lì — con addosso il colore al
    // passaggio e l'anello di fuoco di un comando che non esiste. Provato spegnendo la riga.
    expect(container.querySelector('a')).toBeNull();
    expect(screen.getByText('AI-Dev')).toBeInTheDocument();
  });

  it('senza indirizzo il cursore resta la freccia, e il nome si può ancora selezionare', () => {
    render(<CreditCard name="AI-Dev" />);
    const classi = screen.getByText('AI-Dev').className.split(/\s+/);

    // ⚠️ Sopra un testo che non è un comando il browser mostra il cursore di testo, e su una scheda
    // sembra un campo da scrivere. Si cambia il cursore e basta: la selezione resta, perché un
    // nome è una cosa che si copia.
    expect(classi).toContain('cursor-default');
    expect(classi).not.toContain('select-none');
  });

  it('con un indirizzo il cursore resta quello del collegamento', () => {
    render(<CreditCard name="Superivan94" href="https://esempio.test/io" />);

    // Il `<span>` sta dentro l'ancora, ed è lui l'elemento sotto il puntatore: con `cursor-default`
    // addosso, la manina del collegamento sparirebbe.
    expect(screen.getByText('Superivan94').className.split(/\s+/)).not.toContain('cursor-default');
  });

  it('senza effetto non monta l’emettitore, quindi niente salto', () => {
    const { container } = render(<CreditCard name="AI-Dev" />);

    expect(container.querySelector('.pb-hover-hint')).toBeNull();
  });

  it('con un effetto si avvolge nell’emettitore, e gli passa il ritardo del salto', () => {
    const { container } = render(
      <CreditCard name="AI-Dev" href="https://esempio.test/ai" effect={binaryRain()} hintDelayMs={2000} />,
    );

    // Il collegamento resta dentro l'emettitore: l'easter egg si aggiunge alla scheda, non la
    // sostituisce.
    const salto = container.querySelector('.pb-hover-hint');
    expect(salto).toHaveStyle({ animationDelay: '2000ms' });
    expect(salto?.querySelector('a')).toHaveAttribute('href', 'https://esempio.test/ai');
  });
});
