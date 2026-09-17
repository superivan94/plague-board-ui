import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SpeechBubble } from '../src';

describe('SpeechBubble', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('senza niente da dire non dice niente', () => {
    render(<SpeechBubble message={null} />);

    expect(screen.queryByText(/./)).toBeNull();
  });

  it('il messaggio si annuncia da sé', () => {
    render(<SpeechBubble message="Squit!" />);

    // ⚠️ `status` e non `button`: il fumetto è un messaggio che compare e se ne va, e una regione
    // viva lo fa leggere quando arriva. Di là il fumetto intero era un `role="button"` con
    // `aria-label="Chiudi messaggio"`, e quel nome **sostituisce** il contenuto: la frase non
    // entrava nel nome accessibile del solo elemento che la conteneva.
    expect(screen.getByRole('status')).toHaveTextContent('Squit!');
  });

  it('la regione viva esiste anche prima che ci sia qualcosa da dire', () => {
    render(<SpeechBubble message={null} />);

    // ⚠️ Non è un dettaglio: una regione viva che nasce **insieme** al suo contenuto può non
    // essere annunciata affatto, perché alcuni lettori la osservano solo da quando esiste. Perciò
    // il contenitore c'è sempre e si riempie dopo.
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('dopo il tempo che gli si dà, chiama chi lo deve chiudere', () => {
    const onHide = vi.fn();
    render(<SpeechBubble message="Squit!" onHide={onHide} autoHideMs={2500} />);

    act(() => void vi.advanceTimersByTime(2499));
    expect(onHide).not.toHaveBeenCalled();

    act(() => void vi.advanceTimersByTime(1));
    expect(onHide).toHaveBeenCalledOnce();
  });

  it('un render in più non fa ripartire il conto alla rovescia', () => {
    const onHide = vi.fn();
    const { rerender } = render(<SpeechBubble message="Squit!" onHide={() => onHide()} />);

    // ⚠️ È il difetto che si porta dietro chiunque metta la callback fra le dipendenze
    // dell'effetto: chi usa il componente scrive `onHide={() => setX(null)}`, cioè una funzione
    // **nuova a ogni render**, e il timer riparte da capo ogni volta. Con un genitore che si
    // ridisegna spesso, il fumetto non si chiude mai. Qui si riparte solo se cambia il messaggio.
    act(() => void vi.advanceTimersByTime(2000));
    rerender(<SpeechBubble message="Squit!" onHide={() => onHide()} />);
    act(() => void vi.advanceTimersByTime(500));

    expect(onHide).toHaveBeenCalledOnce();
  });

  it('cambiando frase il conto riparte', () => {
    const onHide = vi.fn();
    const { rerender } = render(<SpeechBubble message="Squit!" onHide={onHide} />);

    act(() => void vi.advanceTimersByTime(2000));
    rerender(<SpeechBubble message="Squit squit!" onHide={onHide} />);
    act(() => void vi.advanceTimersByTime(2000));
    expect(onHide).not.toHaveBeenCalled();

    act(() => void vi.advanceTimersByTime(500));
    expect(onHide).toHaveBeenCalledOnce();
  });

  it("l'animazione dura quanto il fumetto", () => {
    render(<SpeechBubble message="Squit!" autoHideMs={4000} />);

    // ⚠️ `--animate-bubble-pop` finisce a opacità zero dopo 2,5s, che è il valore predefinito. Con
    // un `autoHideMs` diverso e la durata lasciata com'è, il fumetto svanirebbe e poi resterebbe
    // lì invisibile — o sparirebbe prima di aver finito di comparire. Le due durate sono la stessa
    // cosa, quindi si scrivono una volta.
    expect(screen.getByRole('status').querySelector('[class*="animate-bubble-pop"]')).toHaveStyle({
      animationDuration: '4000ms',
    });
  });

  it('uno zero non vuol dire «resta per sempre», e non chiude subito', () => {
    const onHide = vi.fn();
    render(<SpeechBubble message="Squit!" onHide={onHide} autoHideMs={0} />);

    // ⚠️ Senza la riga che lo riporta al valore predefinito, questo sarebbe un `setTimeout` a zero:
    // il fumetto si chiuderebbe nello stesso istante in cui compare, e chi ricollega `onHide` a
    // «dì un'altra frase» ci girerebbe dentro all'infinito. Ci sono cascato scrivendo la demo.
    act(() => void vi.advanceTimersByTime(0));
    expect(onHide).not.toHaveBeenCalled();

    act(() => void vi.advanceTimersByTime(2500));
    expect(onHide).toHaveBeenCalledOnce();
  });

  it('una frase nuova è un nodo nuovo, non lo stesso con dentro altre parole', () => {
    const { rerender } = render(<SpeechBubble message="Squit!" />);
    const primo = screen.getByRole('status').firstElementChild;

    rerender(<SpeechBubble message="Squit squit!" />);
    const secondo = screen.getByRole('status').firstElementChild;

    // ⚠️ Qui si asserisce **l'identità del nodo**, e non è pignoleria: in jsdom le animazioni non
    // girano, quindi «l'animazione riparte» non è osservabile. Il nodo nuovo è il meccanismo che
    // la fa ripartire, ed è la parte che un test può tenere. Riusando lo stesso nodo — che è ciò
    // che React fa quando cambia solo il testo — l'animazione prosegue da dov'era: misurato nel
    // browser il 2026-09-17 a 1558ms invece di 0, e lo scenario sta in COLLAUDI.md.
    expect(secondo).not.toBe(primo);
    expect(secondo).toHaveTextContent('Squit squit!');
  });

  it('smontato non chiama più niente', () => {
    const onHide = vi.fn();
    const { unmount } = render(<SpeechBubble message="Squit!" onHide={onHide} />);

    unmount();
    act(() => void vi.advanceTimersByTime(5000));

    expect(onHide).not.toHaveBeenCalled();
  });
});
