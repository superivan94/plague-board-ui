import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CreditLine, PlagueBar, PlagueFootBar, SupportButton, VersionTag } from '../src';
import { openInNewTab } from '../src/brand/openInNewTab';
import { particelle } from './particelle';
import { menoMovimento } from './preferenze';

const AUTORI = [
  { name: 'Superivan94' },
  { name: 'AI-Dev' },
] as const;

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

  it('senza versione e senza indirizzo, il piede resta la sola firma', () => {
    render(<PlagueFootBar authors={AUTORI} />);

    expect(screen.getByText('Superivan94')).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
