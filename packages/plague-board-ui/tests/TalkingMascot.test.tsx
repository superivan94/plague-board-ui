import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RatIcon, TalkingMascot } from '../src';

const DUE = ['Squit!', 'Squit squit!'] as const;
const UNA = ['Squit!'] as const;

/** Il comando che fa parlare la mascotte, preso per il suo nome accessibile. */
function grilletto(nome = 'Il ratto') {
  return screen.getByRole('button', { name: nome });
}

describe('TalkingMascot', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('rende il figlio che gli si dà, e non disegna una faccia sua', () => {
    render(
      <TalkingMascot label="Il ratto" phrases={DUE}>
        <img src="/logo.png" alt="" data-testid="faccia" />
      </TalkingMascot>,
    );

    // ⚠️ È il motivo per cui il componente esiste: la mascotte di RattInventario è un PNG, la
    // nostra è un SVG, e in Rattoteca sarà un'altra cosa ancora. Disegnare qui dentro vorrebbe dire
    // che una delle tre non può usarlo — e infatti qui il figlio non è nemmeno un'icona nostra.
    expect(screen.getByTestId('faccia')).toBeInTheDocument();
  });

  it('il grilletto è un pulsante, e ha un nome', () => {
    render(
      <TalkingMascot label="Il ratto" phrases={DUE}>
        <RatIcon size={56} />
      </TalkingMascot>,
    );

    // ⚠️ `label` è obbligatoria, e non è pignoleria: le nostre icone sono **decorative** —
    // `aria-hidden`, come dice il loro test — quindi un pulsante che contiene solo un segno
    // resterebbe senza nome accessibile. Chi avvolge un `<img alt>` scrive lo stesso testo e non
    // perde niente; chi avvolge un SVG senza `label` avrebbe un comando muto.
    expect(grilletto()).toBeInTheDocument();
  });

  it('prima che la si tocchi non dice niente', () => {
    render(
      <TalkingMascot label="Il ratto" phrases={DUE}>
        <RatIcon size={56} />
      </TalkingMascot>,
    );

    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('al clic dice una delle frasi che le sono state date', () => {
    render(
      <TalkingMascot label="Il ratto" phrases={DUE}>
        <RatIcon size={56} />
      </TalkingMascot>,
    );

    fireEvent.click(grilletto());

    expect(screen.getByRole('status').textContent).toBeOneOf([...DUE]);
  });

  it('parla anche da tastiera', () => {
    render(
      <TalkingMascot label="Il ratto" phrases={DUE}>
        <RatIcon size={56} />
      </TalkingMascot>,
    );

    // ⚠️ **In jsdom questo test misura `usePress`, non il `<button>`.** Sostituendo `pressProps`
    // con un `onClick` sullo stesso `<button>` vero, questo test — e solo questo — diventa rosso:
    // jsdom non sintetizza il `click` da un Invio, mentre `usePress` gestisce il tasto da sé.
    // In un browser vero il pulsante nativo fa già la sua parte, quindi il test è più severo della
    // realtà; ma è l'unica presa che un test ha sulla riga che tiene in piedi la tastiera.
    const bottone = grilletto();
    fireEvent.keyDown(bottone, { key: 'Enter' });
    fireEvent.keyUp(bottone, { key: 'Enter' });

    expect(screen.getByRole('status').textContent).toBeOneOf([...DUE]);
  });

  it('la regione viva non sta dentro al pulsante', () => {
    render(
      <TalkingMascot label="Il ratto" phrases={DUE}>
        <RatIcon size={56} />
      </TalkingMascot>,
    );

    // ⚠️ Appesa **dentro** il grilletto, la frase diventerebbe contenuto del comando: il nome
    // accessibile lo tiene fermo `aria-label`, ma la descrizione e il testo che un lettore legge
    // scorrendo i controlli no. Fuori, il pulsante è la faccia e il fumetto è un annuncio — due
    // cose, come nella realtà.
    expect(grilletto()).not.toContainElement(screen.getByRole('status'));
  });

  it('dopo il tempo che le si dà smette di parlare', () => {
    render(
      <TalkingMascot label="Il ratto" phrases={DUE} autoHideMs={1000}>
        <RatIcon size={56} />
      </TalkingMascot>,
    );

    fireEvent.click(grilletto());
    act(() => void vi.advanceTimersByTime(999));
    expect(screen.getByRole('status')).not.toBeEmptyDOMElement();

    // ⚠️ Smettere di dire è di qui, non dell'hook: `useRandomPhrase` tiene l'ultima frase e non la
    // dimentica più — è la memoria che gli serve per non ripeterla. Il silenzio è uno stato del
    // componente.
    act(() => void vi.advanceTimersByTime(1));
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('ripremendo prima della fine cambia frase', () => {
    render(
      <TalkingMascot label="Il ratto" phrases={DUE}>
        <RatIcon size={56} />
      </TalkingMascot>,
    );

    fireEvent.click(grilletto());
    const prima = screen.getByRole('status').textContent;

    act(() => void vi.advanceTimersByTime(500));
    fireEvent.click(grilletto());

    // ⚠️ Con due frasi sole la prova è esatta: «non ripete l'ultima» vuol dire che la seconda è
    // per forza l'altra. Ed è la condizione che fa ripartire animazione e conto alla rovescia,
    // perché `SpeechBubble` riparte quando il **messaggio** cambia.
    expect(screen.getByRole('status').textContent).not.toBe(prima);
  });

  it("con una frase sola ripremere non produce un fumetto nuovo, e lo si sa", () => {
    render(
      <TalkingMascot label="Il ratto" phrases={UNA}>
        <RatIcon size={56} />
      </TalkingMascot>,
    );

    fireEvent.click(grilletto());
    const nodo = screen.getByRole('status').firstElementChild;

    act(() => void vi.advanceTimersByTime(500));
    fireEvent.click(grilletto());

    // ⚠️ Il limite è ereditato e dichiarato: `useRandomPhrase` con una frase sola ridà quella, e
    // `SpeechBubble` riparte solo per un messaggio **diverso**. Quindi il conto alla rovescia
    // prosegue da dov'era invece di azzerarsi. Non è un difetto da aggirare con un contatore
    // fittizio: una mascotte con una battuta sola non è il caso per cui esiste questo componente,
    // e il test è qui perché il giorno che qualcuno ci prova legga il motivo invece del sintomo.
    expect(screen.getByRole('status').firstElementChild).toBe(nodo);
  });
});
