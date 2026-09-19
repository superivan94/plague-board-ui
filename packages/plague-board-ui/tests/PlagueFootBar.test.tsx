import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  CreditLine,
  ParticleBurst,
  PlagueBar,
  PlagueFootBar,
  SupportButton,
  VersionTag,
  type ParticleBurstHandle,
} from '../src';
import { menoMovimento } from './preferenze';

// ⚠️ Si cercano nel **documento** e non nel contenitore reso: stanno in un portale sul `body`, che
// è ciò che le salva dal taglio di qualunque antenato col traboccamento nascosto — e quel portale
// è anche il motivo per cui questa riga non può usare il `container` di `render`.
const particelle = () => document.querySelectorAll('.pb-particle');
const avanza = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

const AUTORI = [
  { name: 'Superivan94' },
  { name: 'AI-Dev' },
] as const;

describe('ParticleBurst', () => {
  const matchMediaVero = window.matchMedia;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    window.matchMedia = matchMediaVero;
  });

  it('da fermo non sprigiona niente', () => {
    render(
      <ParticleBurst>
        <span>grazie</span>
      </ParticleBurst>,
    );

    avanza(5000);
    expect(particelle()).toHaveLength(0);
  });

  it('al comando ne parte una manciata, ognuna con la sua direzione', () => {
    const scoppio = createRef<ParticleBurstHandle>();
    render(
      <ParticleBurst ref={scoppio} count={6}>
        <span>grazie</span>
      </ParticleBurst>,
    );

    act(() => scoppio.current?.burst());
    expect(particelle()).toHaveLength(6);

    // ⚠️ Le tre variabili devono esserci **tutte**: un `@keyframes` a cui ne manca una ripiega sul
    // valore di riserva e la particella resta ferma al centro, senza che niente diventi rosso.
    for (const particella of particelle()) {
      const stile = (particella as HTMLElement).style;
      expect(stile.getPropertyValue('--pb-dx')).toMatch(/px$/);
      expect(stile.getPropertyValue('--pb-dy')).toMatch(/px$/);
      expect(stile.getPropertyValue('--pb-apex')).toMatch(/^-.*px$/);
      expect(stile.getPropertyValue('--pb-spin')).toMatch(/deg$/);
      expect(Number.parseFloat(stile.animationDuration)).toBeGreaterThan(0);
    }
  });

  it('ognuna se ne va quando la sua vita è finita', () => {
    const scoppio = createRef<ParticleBurstHandle>();
    render(
      // ⚠️ `staggerMs` a zero perché qui si guarda **la vita**: col ritardo, ognuna vive quanto il
      // suo volo più la sua attesa, e i quattro numeri non scadrebbero insieme.
      <ParticleBurst ref={scoppio} count={4} lifeMs={[1000, 1000]} staggerMs={0}>
        <span>grazie</span>
      </ParticleBurst>,
    );

    act(() => scoppio.current?.burst());
    avanza(999);
    expect(particelle()).toHaveLength(4);

    avanza(1);
    expect(particelle()).toHaveLength(0);
  });

  it('una parte dopo l’altra: è quello che la fa sembrare una fontana', () => {
    const scoppio = createRef<ParticleBurstHandle>();
    render(
      <ParticleBurst ref={scoppio} count={4} staggerMs={30}>
        <span>grazie</span>
      </ParticleBurst>,
    );

    act(() => scoppio.current?.burst());

    const ritardi = [...particelle()].map((n) => (n as HTMLElement).style.animationDelay);
    expect(ritardi).toStrictEqual(['0ms', '30ms', '60ms', '90ms']);
  });

  it('un getto alla volta: finché zampilla, premere di nuovo non fa niente', () => {
    const scoppio = createRef<ParticleBurstHandle>();
    render(
      <ParticleBurst ref={scoppio} count={3} lifeMs={[1000, 1000]} staggerMs={0}>
        <span>grazie</span>
      </ParticleBurst>,
    );

    act(() => scoppio.current?.burst());
    avanza(500);
    // ⚠️ Due getti sovrapposti non si leggono come due: si leggono come un pasticcio.
    act(() => scoppio.current?.burst());
    expect(particelle()).toHaveLength(3);

    // Finito il primo, il comando torna a funzionare.
    avanza(500);
    expect(particelle()).toHaveLength(0);
    act(() => scoppio.current?.burst());
    expect(particelle()).toHaveLength(3);
  });

  it('con meno movimento non parte niente', () => {
    menoMovimento(true);
    const scoppio = createRef<ParticleBurstHandle>();
    render(
      <ParticleBurst ref={scoppio}>
        <span>grazie</span>
      </ParticleBurst>,
    );

    // ⚠️ Si guarda **subito**, non dopo un `avanza`: con la vita predefinita di 0,7–1,2 s, dopo
    // due secondi la scena è vuota comunque, e il caso passerebbe anche con la guardia spenta.
    // Provato togliendola: restava verde, ed è il motivo per cui questa riga sta qui e non sotto.
    act(() => scoppio.current?.burst());
    expect(particelle()).toHaveLength(0);

    avanza(2000);
    expect(particelle()).toHaveLength(0);
  });

  it('lo smontaggio spegne tutte le scadenze', () => {
    const scoppio = createRef<ParticleBurstHandle>();
    const { unmount } = render(
      <ParticleBurst ref={scoppio} count={5}>
        <span>grazie</span>
      </ParticleBurst>,
    );

    act(() => scoppio.current?.burst());
    expect(vi.getTimerCount()).toBe(5);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('la lastra alle due estremità', () => {
  it('in cima è un `header` col filo sotto', () => {
    const { container } = render(<PlagueBar>ciao</PlagueBar>);
    const lastra = container.firstElementChild!;

    expect(lastra.tagName).toBe('HEADER');
    expect(lastra.className).toContain('border-b');
    expect(lastra.className).toContain('top-0');
  });

  it('in fondo è un `footer` col filo sopra', () => {
    // ⚠️ Non è pignoleria sull'elemento: `header` e `footer` sono `banner` e `contentinfo`, due
    // punti di riferimento diversi. Un piede reso come intestazione sarebbe un secondo `banner`.
    const { container } = render(<PlagueBar placement="bottom">ciao</PlagueBar>);
    const lastra = container.firstElementChild!;

    expect(lastra.tagName).toBe('FOOTER');
    expect(lastra.className).toContain('border-t');
    expect(lastra.className).toContain('bottom-0');
  });
});

describe('i pezzi del piede', () => {
  it('la firma tiene il primo autore sempre, e nasconde gli altri quando si stringe', () => {
    render(<CreditLine authors={AUTORI} />);

    const primo = screen.getByText('Superivan94').closest('span[class]')!;
    const secondo = screen.getByText('AI-Dev').closest('span[class]')!;

    // Il primo autore è quello che sopravvive: in una firma «umano e AI» è la persona.
    expect(primo.parentElement!.className).not.toContain('hidden');
    expect(secondo.parentElement!.className).toContain('hidden');
    expect(secondo.parentElement!.className).toContain('@lg:flex');
  });

  it('la versione porta la `v` e le cifre a larghezza fissa', () => {
    render(<VersionTag version="4.0.0" />);

    const tag = screen.getByText('v4.0.0');
    expect(tag.className).toContain('tabular-nums');
  });

  it('il comando donazioni resta nominato anche quando il testo sparisce', () => {
    render(<SupportButton href="https://esempio.test/dona" />);

    const comando = screen.getByRole('link', { name: 'Offrimi una pozione' });
    expect(comando).toHaveAttribute('target', '_blank');
    expect(comando).toHaveAttribute('rel', 'noopener noreferrer');

    // ⚠️ Il testo si nasconde con una container query, quindi il nome accessibile non può venire
    // da lì: viene da `aria-label`, che c'è sempre.
    expect(comando.querySelector('span')!.className).toContain('hidden');
  });

  it('al clic sul comando i segni della peste sprigionano', () => {
    vi.useFakeTimers();
    render(<SupportButton href="https://esempio.test/dona" />);

    expect(particelle()).toHaveLength(0);

    fireEvent.click(screen.getByRole('link'));
    expect(particelle().length).toBeGreaterThan(0);

    vi.useRealTimers();
  });

  it('il piede monta i tre pezzi in una riga sola che scorre', () => {
    const { container } = render(
      <PlagueFootBar authors={AUTORI} version="4.0.0" supportHref="https://esempio.test/dona" />,
    );

    const lastra = container.firstElementChild!;
    expect(lastra.tagName).toBe('FOOTER');

    const riga = lastra.firstElementChild!;
    // Una riga sola: niente `flex-wrap`, e quando non ci sta si scorre di lato.
    expect(riga.className).toContain('overflow-x-auto');
    expect(riga.className).not.toContain('flex-wrap');
    // Il contenitore delle query è la riga, non la finestra.
    expect(riga.className).toContain('@container');

    expect(screen.getByText('Superivan94')).toBeInTheDocument();
    expect(screen.getByText('v4.0.0')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Offrimi una pozione' })).toBeInTheDocument();
  });

  it('senza versione e senza indirizzo, il piede resta la sola firma', () => {
    render(<PlagueFootBar authors={AUTORI} />);

    expect(screen.getByText('Superivan94')).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
