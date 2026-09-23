import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LUDORATTI_COPY, ProfileMenu } from '../src';

const monta = () => {
  const onAction = vi.fn();
  const onSignOut = vi.fn();
  render(
    <ProfileMenu
      name="Superivan94"
      email="ivan@example.com"
      rank={{ label: 'Signore Dabbonico', color: 'warning' }}
      items={[
        { key: 'profile', label: 'La tua cartella clinica' },
        { key: 'settings', label: 'Impostazioni' },
      ]}
      onAction={onAction}
      onSignOut={onSignOut}
    />,
  );
  return { onAction, onSignOut };
};

const apri = () => fireEvent.click(screen.getByRole('button', { name: 'Profilo di Superivan94' }));

describe('ProfileMenu', () => {
  it('il comando è un bottone vero che dice di chi è il profilo, e che apre un menù', () => {
    monta();

    const comando = screen.getByRole('button', { name: 'Profilo di Superivan94' });
    expect(comando).toHaveAttribute('aria-haspopup');
    expect(comando).toHaveAttribute('aria-expanded', 'false');
  });

  it('a menù chiuso mostra il grado accanto al nome', () => {
    monta();

    expect(screen.getByText('Signore Dabbonico')).toBeInTheDocument();
  });

  it('aperto mostra chi è, le voci dell’applicazione e l’uscita', () => {
    monta();
    apri();

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('ivan@example.com')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'La tua cartella clinica' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Impostazioni' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: LUDORATTI_COPY.signOut.house })).toBeInTheDocument();
  });

  it('una voce dell’applicazione arriva a `onAction` con la sua chiave', () => {
    const { onAction, onSignOut } = monta();
    apri();

    fireEvent.click(screen.getByRole('menuitem', { name: 'Impostazioni' }));

    expect(onAction).toHaveBeenCalledWith('settings');
    expect(onSignOut).not.toHaveBeenCalled();
  });

  it('l’uscita arriva a `onSignOut`, e non a `onAction`', () => {
    // ⚠️ Due canali e non uno: una chiave magica per l'uscita dentro `onAction` sarebbe una
    // chiave che l'applicazione potrebbe usare anche per una voce sua, per sbaglio.
    const { onAction, onSignOut } = monta();
    apri();

    fireEvent.click(screen.getByRole('menuitem', { name: LUDORATTI_COPY.signOut.house }));

    expect(onSignOut).toHaveBeenCalledTimes(1);
    expect(onAction).not.toHaveBeenCalled();
  });

  it('l’uscita ha il testo dove HeroUI lo colora di rosso', () => {
    // ⚠️ La variante `danger` scrive il colore solo su `[data-slot="label"]`: col testo nudo dentro
    // la voce, l'uscita era bianca come le altre. È un contratto col CSS di HeroUI, e qui si tiene.
    monta();
    apri();

    const uscita = screen.getByRole('menuitem', { name: LUDORATTI_COPY.signOut.house });
    expect(uscita.querySelector('[data-slot="label"]')).toHaveTextContent(LUDORATTI_COPY.signOut.house);
  });

  it('le parole del comando e dell’uscita sono di chi lo monta', () => {
    render(<ProfileMenu name="Superivan94" label="Il mio account" signOutLabel="Esci" onSignOut={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Il mio account' }));
    expect(screen.getByRole('menuitem', { name: 'Esci' })).toBeInTheDocument();
  });
});
