import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PlagueBar, PlagueFootBar, SupportButton, VersionTag } from '../src';
import { openInNewTab } from '../src/brand/openInNewTab';
import { particelle } from './particelle';
import { menoMovimento } from './preferenze';

const AUTORI = [
  { name: 'Superivan94' },
  { name: 'AI-Dev' },
] as const;

/** Le classi una per una: `@max-lg:hidden` contiene la parola `hidden`, e non è la stessa cosa. */
const classi = (elemento: Element) => elemento.className.split(/\s+/);

describe('la lastra alle due estremità', () => {
  it('in cima è un `header` col filo sotto', () => {
    const { container } = render(<PlagueBar>ciao</PlagueBar>);
    const lastra = container.firstElementChild!;

    expect(lastra.tagName).toBe('HEADER');
    expect(lastra.className).toContain('border-b');
    expect(lastra.className).toContain('top-0');
  });

  it('la stessa taglia rientra di un gradino meno in fondo che in cima', () => {
    const { container: cima } = render(<PlagueBar size="small">ciao</PlagueBar>);
    const { container: fondo } = render(
      <PlagueBar placement="bottom" size="small">
        ciao
      </PlagueBar>,
    );

    // ⚠️ Un'intestazione regge lo spazio che ha; un piede appiccicato lo toglie alla pagina a ogni
    // schermata. Per questo la scala è la stessa ma sfalsata di un gradino.
    expect(cima.firstElementChild!.className).toContain('py-2');
    expect(fondo.firstElementChild!.className).toContain('py-1');

    // E il rientro dell'incavo segue la taglia, o su un telefono i due numeri si sconterebbero.
    expect(fondo.firstElementChild!.className).toContain('*1_+_env(safe-area-inset-bottom)');
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

// La firma da sola sta in `CreditLine.test.tsx`: qui restano gli altri pezzi e il piede montato.
describe('i pezzi del piede', () => {
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
    // da lì: viene da `aria-label`, che c'è sempre. E si nasconde **solo** in un contenitore
    // stretto: senza contenitore resta, come la firma accanto.
    const etichetta = comando.querySelector('span')!;
    expect(classi(etichetta)).not.toContain('hidden');
    expect(classi(etichetta)).toContain('@max-lg:hidden');
  });

  it('al clic sul comando i segni della peste sprigionano, e la pagina si apre dopo', () => {
    vi.useFakeTimers();
    const scheda = { opener: window } as unknown as Window;
    const apri = vi.spyOn(window, 'open').mockReturnValue(scheda);
    render(<SupportButton href="https://esempio.test/dona" />);

    expect(particelle()).toHaveLength(0);

    const clic = fireEvent.click(screen.getByRole('link'));
    expect(particelle().length).toBeGreaterThan(0);

    // ⚠️ **La navigazione si ferma finché la fontana zampilla.** Con `target="_blank"` e basta, il
    // browser porta subito chi ha premuto sulla scheda nuova e lo spettacolo non lo vede nessuno.
    // `fireEvent` torna `false` quando qualcuno ha chiamato `preventDefault`.
    expect(clic).toBe(false);
    expect(apri).not.toHaveBeenCalled();

    // ⚠️ L'attesa ha un tetto: una scheda aperta da un timer vale come una finestra nuova, e il
    // credito che il clic concede è di **1 s** nel browser più stretto. A 800 ms non è ancora ora.
    act(() => void vi.advanceTimersByTime(800));
    expect(apri).not.toHaveBeenCalled();

    act(() => void vi.advanceTimersByTime(200));
    // ⚠️ **Niente `noopener` fra le opzioni.** Quella parola fa tornare `null` a `window.open`
    // **anche quando la scheda si è aperta davvero**: il ripiego qui sotto scatterebbe lo stesso e
    // porterebbe via pure questa pagina — due pagine di donazioni per un clic solo. Il legame si
    // recide dopo, azzerando `opener`.
    expect(apri).toHaveBeenCalledWith('https://esempio.test/dona', '_blank');
    expect(scheda.opener).toBeNull();

    apri.mockRestore();
    vi.useRealTimers();
  });

  it('quando la scheda non si apre lo dice, e non fa nient’altro', () => {
    // ⚠️ Si prova **sulla funzione**, passandole una finestra finta: nel componente il caso non si
    // saprebbe distinguere, e soprattutto non c'è nessun altro effetto da osservare — è il punto.
    expect(openInNewTab('https://esempio.test/dona', { open: () => null })).toBe(false);

    const scheda = { opener: {} };
    expect(openInNewTab('https://esempio.test/dona', { open: () => scheda })).toBe(true);
    expect(scheda.opener).toBeNull();
  });

  it('dopo un’apertura bloccata il clic torna al browser, e la pagina non si muove', () => {
    vi.useFakeTimers();
    const apri = vi.spyOn(window, 'open').mockReturnValue(null);
    render(<SupportButton href="https://esempio.test/dona" />);

    // Il primo clic è trattenuto per far vedere la fontana, e l'apertura viene bloccata.
    expect(fireEvent.click(screen.getByRole('link'))).toBe(false);
    act(() => void vi.advanceTimersByTime(5000));
    expect(apri).toHaveBeenCalledTimes(1);

    // ⚠️ Il secondo **non** si tocca: lo gestisce il browser col `target="_blank"` del
    // collegamento, cioè col gesto vero, che nessuno blocca. Trattenerlo di nuovo vorrebbe dire un
    // comando che non funziona mai; portarci questa pagina vorrebbe dire buttare via lo stato
    // dell'applicazione di chi ha premuto.
    expect(fireEvent.click(screen.getByRole('link'))).toBe(true);
    act(() => void vi.advanceTimersByTime(5000));
    expect(apri).toHaveBeenCalledTimes(1);

    apri.mockRestore();
    vi.useRealTimers();
  });

  it.each([
    ['ctrl', { ctrlKey: true }],
    ['cmd', { metaKey: true }],
    ['shift', { shiftKey: true }],
    ['alt', { altKey: true }],
    ['il tasto centrale', { button: 1 }],
  ])('con %s il clic resta del browser: niente fontana e niente attesa', (_, modo) => {
    // ⚠️ Sono gesti che chi legge si aspetta — aprire in una scheda, in una finestra, salvare — e
    // trattenerli per fare una cosa nostra è il modo più veloce di rendere antipatico un
    // collegamento.
    vi.useFakeTimers();
    const apri = vi.spyOn(window, 'open').mockReturnValue(null);
    render(<SupportButton href="https://esempio.test/dona" />);

    expect(fireEvent.click(screen.getByRole('link'), modo)).toBe(true);
    expect(particelle()).toHaveLength(0);
    act(() => void vi.advanceTimersByTime(5000));
    expect(apri).not.toHaveBeenCalled();

    apri.mockRestore();
    vi.useRealTimers();
  });

  it('con meno movimento il comando è un collegamento e basta', () => {
    menoMovimento(true);
    vi.useFakeTimers();
    const apri = vi.spyOn(window, 'open').mockReturnValue(window);
    render(<SupportButton href="https://esempio.test/dona" />);

    // ⚠️ Niente fontana, quindi niente da aspettare: il clic non si tocca e il browser fa il suo.
    // Un comando che trattiene la navigazione per un'animazione che non c'è è solo lento.
    expect(fireEvent.click(screen.getByRole('link'))).toBe(true);
    act(() => void vi.advanceTimersByTime(5000));
    expect(apri).not.toHaveBeenCalled();

    apri.mockRestore();
    vi.useRealTimers();
  });

  it('la tazza ribolle dentro il comando, e le tre bolle non partono insieme', () => {
    render(<SupportButton href="https://esempio.test/dona" />);
    const comando = screen.getByRole('link');

    // ⚠️ Il legame fra l'icona e le sue animazioni è fatto di due classi che devono combaciare:
    // l'interruttore sul comando e i bersagli nel disegno. In jsdom il movimento non si vede, ma
    // se una delle due sparisce il legame è rotto, e a schermo non se ne accorgerebbe nessuno.
    expect(comando.className).toContain('pb-potion-live');

    const bolle = comando.querySelectorAll('.pb-potion-bubble');
    expect(bolle).toHaveLength(3);
    // Due delle tre portano una classe in più: è lì che sta il loro ritardo.
    expect(comando.querySelectorAll('.pb-potion-bubble-b, .pb-potion-bubble-c')).toHaveLength(2);
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

  it('la taglia del piede decide quanto è grande il segno delle donazioni', () => {
    const { unmount } = render(<PlagueFootBar authors={AUTORI} supportHref="https://esempio.test" />);
    // `small` è il valore predefinito: un piede non è un'intestazione.
    expect(screen.getByRole('link').querySelector('svg')).toHaveAttribute('width', '20');
    unmount();

    render(<PlagueFootBar authors={AUTORI} supportHref="https://esempio.test" size="large" />);
    expect(screen.getByRole('link').querySelector('svg')).toHaveAttribute('width', '26');
  });

  // ⚠️ **Il segno si compatta con una classe, non con l'attributo**: `width` e `height` di un
  // `<svg>` sono proprietà geometriche, e una regola CSS le sostituisce. È l'unico modo di far
  // rispondere a una media query un numero che un componente ha già stampato.
  it('e sul telefono lo riporta ai 20px della taglia piccola', () => {
    const { unmount } = render(
      <PlagueFootBar authors={AUTORI} supportHref="https://esempio.test" size="large" />,
    );
    const segno = screen.getByRole('link').querySelector('svg')!;

    expect(segno.getAttribute('class')).toContain('size-5');
    expect(segno.getAttribute('class')).toContain('pb-roomy:size-[26px]');
    unmount();

    render(
      <PlagueFootBar
        authors={AUTORI}
        supportHref="https://esempio.test"
        size="large"
        isCompactOnMobile={false}
      />,
    );
    expect(screen.getByRole('link').querySelector('svg')!.getAttribute('class')).not.toContain('size-5');
  });

  it('il piede passa il modo alla sua lastra', () => {
    const { container, unmount } = render(<PlagueFootBar authors={AUTORI} size="large" />);

    // In fondo la scala è sfalsata di un gradino: `py-1` sotto la soglia, `py-3` sopra.
    expect(container.firstElementChild!.className).toContain('py-1');
    expect(container.firstElementChild!.className).toContain('pb-roomy:py-3');
    unmount();

    const { container: fisso } = render(
      <PlagueFootBar authors={AUTORI} size="large" isCompactOnMobile={false} />,
    );
    expect(fisso.firstElementChild!.className).toContain('py-3');
    expect(fisso.firstElementChild!.className).not.toContain('pb-roomy:');
  });

  it('senza versione e senza indirizzo, il piede resta la sola firma', () => {
    render(<PlagueFootBar authors={AUTORI} />);

    expect(screen.getByText('Superivan94')).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
