import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GoogleIcon, GoogleSignInButton, LoginScreen, PlagueDivider, ToxicLevelProvider } from '../src';

const comando = () => screen.getByRole('button');

describe('GoogleIcon', () => {
  // ⚠️ È l'unica icona che non sta nella tabella di `icons.test.tsx`, e il motivo è l'opposto di
  // quello di `DripIcon`: quella non è quadrata, questa **non si tinge**. I casi condivisi la
  // boccerebbero tutti e due — il colore dentro `color`, i tracciati che lo leggono da
  // `currentColor` — perché qui il disegno è il marchio di qualcun altro, e le linee guida di
  // Google pretendono il logo così com'è. Sta qui perché è un pezzo della schermata di accesso.
  it('porta i quattro colori del marchio scritti sui tracciati', () => {
    const { container } = render(<GoogleIcon />);

    const colori = [...container.querySelectorAll('svg path')].map((p) => p.getAttribute('fill'));
    expect(colori).toStrictEqual(['#4285F4', '#34A853', '#FBBC05', '#EA4335']);
  });

  it('non ha un colore da ricevere: `color` non è nel suo contratto', () => {
    // @ts-expect-error — è la riga che difende il marchio, e lo fa in compilazione invece che a
    // schermo: `GoogleIconProps` è `IconProps` **meno** `color`, quindi chi prova a uniformarla
    // alle altre trova un errore di tipo e va a leggere il perché scritto accanto.
    const { container } = render(<GoogleIcon color="#a3e635" />);

    // E a runtime non cambierebbe niente lo stesso: il colore non arriva a nessun tracciato,
    // perché il loro ce l'hanno scritto addosso.
    expect(container.querySelectorAll('svg path[fill="currentColor"]')).toHaveLength(0);
  });

  it('si rende a 24 px, si ridimensiona e accetta una classe, come tutte le altre', () => {
    const grande = render(<GoogleIcon />);
    expect(grande.container.querySelector('svg')).toHaveAttribute('width', '24');
    grande.unmount();

    const { container } = render(<GoogleIcon size={20} className="shrink-0" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
    expect(svg).toHaveClass('shrink-0');
  });

  it('è decorativa se non ha un titolo, e si annuncia se ce l’ha', () => {
    const { container, unmount } = render(<GoogleIcon />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    unmount();

    render(<GoogleIcon title="Google" />);
    expect(screen.getByRole('img', { name: 'Google' })).toBeInTheDocument();
  });
});

describe('GoogleSignInButton', () => {
  it('si annuncia con la formula di Google, e chiama chi accede davvero', () => {
    const accedi = vi.fn();
    render(<GoogleSignInButton onPress={accedi} />);

    // ⚠️ L'etichetta predefinita **non** viene dal lessico di casa, ed è l'unica della libreria a
    // non venirci: le linee guida di Google prescrivono la formula, tradotta ma non riscritta.
    fireEvent.click(screen.getByRole('button', { name: 'Accedi con Google' }));

    expect(accedi).toHaveBeenCalledTimes(1);
  });

  it('lascia cambiare le parole a chi lo monta', () => {
    render(<GoogleSignInButton onPress={vi.fn()} label="Entra nella tana con Google" />);

    expect(screen.getByRole('button', { name: 'Entra nella tana con Google' })).toBeInTheDocument();
  });

  it('a riposo mostra il marchio di Google, decorativo', () => {
    const { container } = render(<GoogleSignInButton onPress={vi.fn()} />);

    const marchio = container.querySelector('svg');
    // I quattro colori sono il marchio: se il disegno cambia, questo caso se ne accorge.
    expect(marchio?.querySelectorAll('path[fill="#4285F4"]')).toHaveLength(1);
    expect(marchio).toHaveAttribute('aria-hidden', 'true');
  });

  it('il marchio misura 20 anche dentro il `Button` di HeroUI, come il cerchio che lo sostituisce', () => {
    const { container } = render(<GoogleSignInButton onPress={vi.fn()} />);

    // ⚠️ `.button svg` di HeroUI scrive `size-4` e sostituisce l'attributo: misurato il 2026-09-23,
    // `width="20"` e 16 px a schermo, mentre il cerchio dell'attesa — che porta `size-5` — ne misura
    // 20. Il comando cambiava taglia passando da un'icona all'altra. La classe sul segno vince,
    // perché sta in un layer più in alto di quello di HeroUI.
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('size-5');
  });

  it('in attesa non parte niente, ma il comando resta raggiungibile dalla tastiera', () => {
    const accedi = vi.fn();
    render(<GoogleSignInButton onPress={accedi} isPending />);

    fireEvent.click(comando());

    expect(accedi).not.toHaveBeenCalled();
    // ⚠️ `aria-disabled` e **non** `disabled`: un comando disabilitato esce dall'ordine di
    // tabulazione, e chi stava sopra col fuoco si ritrova il fuoco sul `body` proprio mentre la
    // pagina sta rispondendo. `isPending` di react-aria spegne la pressione e lascia il fuoco.
    expect(comando()).toHaveAttribute('aria-disabled', 'true');
    expect(comando()).not.toBeDisabled();
  });

  it('in attesa il marchio lascia il posto al cerchio che gira, e il cerchio è muto', () => {
    const { container, rerender } = render(<GoogleSignInButton onPress={vi.fn()} />);

    expect(container.querySelector('[data-slot="spinner"]')).toBeNull();

    rerender(<GoogleSignInButton onPress={vi.fn()} isPending />);

    // ⚠️ Il segno visibile lo mette il componente: lo stato `pending` di HeroUI è **solo**
    // `pointer-events: none`, quindi senza questo scambio il comando resterebbe identico a com'era
    // e chi ha premuto non saprebbe che sta succedendo qualcosa.
    const cerchio = container.querySelector('[data-slot="spinner"]');
    expect(cerchio).not.toBeNull();
    // Il suo `role="status"` con dentro «Loading» annuncerebbe una parola inglese che nessuno può
    // cambiare: l'annuncio dell'attesa lo fa già react-aria, con l'etichetta vera del comando.
    expect(cerchio).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('PlagueDivider', () => {
  it('è una parola fra due fili, e i fili sono separatori veri', () => {
    render(<PlagueDivider>Alternative Access</PlagueDivider>);

    expect(screen.getByText('Alternative Access')).toBeInTheDocument();
    expect(screen.getAllByRole('separator')).toHaveLength(2);
  });

  it('mette il virione ai due lati, decorativo', () => {
    const { container } = render(<PlagueDivider>oppure</PlagueDivider>);

    const segni = container.querySelectorAll('svg');
    expect(segni).toHaveLength(2);
    segni.forEach((segno) => expect(segno).toHaveAttribute('aria-hidden', 'true'));
  });

  it('con `icon={null}` resta la sola parola, che è la riga di Rattoteca', () => {
    const { container } = render(<PlagueDivider icon={null}>oppure</PlagueDivider>);

    expect(container.querySelectorAll('svg')).toHaveLength(0);
    expect(screen.getAllByRole('separator')).toHaveLength(2);
  });

  it('lascia sostituire il segno, e lo mette comunque da tutt’e due le parti', () => {
    const { container } = render(
      <PlagueDivider icon={<svg data-testid="mio" aria-hidden="true" />}>oppure</PlagueDivider>,
    );

    expect(container.querySelectorAll('[data-testid="mio"]')).toHaveLength(2);
  });
});

describe('LoginScreen', () => {
  const schermata = (props: Partial<Parameters<typeof LoginScreen>[0]> = {}) =>
    render(
      <ToxicLevelProvider>
        <LoginScreen title="Entra nella tana" {...props}>
          {props.children ?? <button type="button">Accedi</button>}
        </LoginScreen>
      </ToxicLevelProvider>,
    );

  it('il titolo è l’intestazione della pagina, non un titolino di scheda', () => {
    schermata({ subtitle: 'Gestisci i manuali della diffusione' });

    // ⚠️ `Card.Title` di HeroUI è un `h3`, e sotto a niente è un salto di livello che a schermo
    // non si vede. Una schermata di accesso **è** la pagina: il suo titolo è l’`h1`.
    expect(screen.getByRole('heading', { level: 1, name: 'Entra nella tana' })).toBeInTheDocument();
    expect(screen.getByText('Gestisci i manuali della diffusione')).toBeInTheDocument();
  });

  it('senza sottotitolo non lascia un paragrafo vuoto', () => {
    const { container } = schermata();

    expect(container.querySelector('[data-slot="card-description"]')).toBeNull();
  });

  it('monta il fondale della peste attorno al pannello', () => {
    const { container } = schermata();

    // La città è il pezzo del fondale che c’è a ogni livello: se manca, il fondale non c’è.
    expect(container.querySelector('.pb-city-block')).not.toBeNull();
    expect(container.querySelector('[data-slot="card"]')).not.toBeNull();
  });

  it('i comandi d’angolo e il piede compaiono solo se glieli si dà', () => {
    const { container } = schermata();
    expect(container.querySelector('[data-slot="card-footer"]')).toBeNull();
    expect(screen.queryByTestId('angolo')).toBeNull();

    schermata({ aside: <span data-testid="angolo">musica</span>, footer: <span>versione 0.1.0</span> });
    expect(screen.getByTestId('angolo')).toBeInTheDocument();
    expect(screen.getByText('versione 0.1.0')).toBeInTheDocument();
  });

  it('occupa la finestra intera, e spenta lascia l’altezza a chi la monta', () => {
    const { container, unmount } = schermata();
    expect(container.querySelector('.min-h-dvh')).not.toBeNull();
    unmount();

    // Spenta non vuol dire «più bassa»: vuol dire che la sua altezza non si oppone a quella che
    // arriva da `className` — una schermata dentro un riquadro, o un layout che ha già la sua.
    const { container: dentro } = schermata({ isFullHeight: false, className: 'h-96' });
    expect(dentro.querySelector('.min-h-dvh')).toBeNull();
    expect(dentro.querySelector('.h-96')).not.toBeNull();
  });

  describe('i ratti', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    const ratti = (container: HTMLElement) => container.querySelectorAll('.pb-rat-run');
    // Dentro `act`, o le pescate dello sciame e i versi della città cambierebbero stato fuori da
    // un render che React sta guardando, e il DOM resterebbe quello di prima.
    const avanza = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

    it('attraversano la schermata senza che nessuno li chieda', () => {
      const { container } = schermata();

      // Lo sciame nasce vuoto — è ciò che tiene insieme l’idratazione — e pesca dentro un timer.
      expect(ratti(container)).toHaveLength(0);

      avanza(20_000);
      expect(ratti(container).length).toBeGreaterThan(0);
    });

    it('si spengono con `hasRats={false}`, e il resto della scena resta', () => {
      const { container } = schermata({ hasRats: false });

      avanza(20_000);

      expect(ratti(container)).toHaveLength(0);
      expect(container.querySelector('.pb-city-block')).not.toBeNull();
    });
  });
});
