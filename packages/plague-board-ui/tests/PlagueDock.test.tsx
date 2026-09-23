import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PlagueDock, PlagueDockItem, SkullIcon, type PlagueDockProps } from '../src';
import { animazioni } from './fogli';

const avanza = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

const monta = (props: Partial<PlagueDockProps> = {}) =>
  render(
    <PlagueDock {...props}>
      <PlagueDockItem href="/catalogo" icon={<SkullIcon />} label="Catalogo" isCurrent />
      <PlagueDockItem href="/prestiti" icon={<SkullIcon />} label="Prestiti" />
    </PlagueDock>,
  );

const pannello = () => document.querySelector('[data-slot="dock-panel"]') as HTMLElement;
const ritirato = () => pannello().getAttribute('data-collapsed') === 'true';
const ricresci = () => screen.queryByRole('button', { name: 'Mostra la navigazione' });

describe('PlagueDock', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('è una navigazione col suo nome, e la voce corrente lo dice', () => {
    monta();

    expect(screen.getByRole('navigation', { name: 'Navigazione principale' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Catalogo' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Prestiti' })).not.toHaveAttribute('aria-current');
  });

  it.each<[NonNullable<PlagueDockProps['placement']>, string]>([
    ['bottom', 'horizontal'],
    ['top', 'horizontal'],
    ['left', 'vertical'],
    ['right', 'vertical'],
  ])('in `%s` le voci stanno in %s', (placement, verso) => {
    monta({ placement });

    expect(pannello()).toHaveAttribute('data-orientation', verso);
  });

  it('dopo 8 secondi senza gesti si ritira, e al suo posto resta il comando che la fa ricrescere', () => {
    monta();

    avanza(7999);
    expect(ritirato()).toBe(false);
    expect(ricresci()).toBeNull();

    avanza(1);
    expect(ritirato()).toBe(true);
    // ⚠️ Ritirata non si raggiunge più: `inert` la toglie dall'ordine di tabulazione e dall'albero
    // di accessibilità, mentre l'animazione la fa ancora vedere.
    expect(pannello()).toHaveAttribute('inert');
    expect(ricresci()).toHaveAttribute('aria-expanded', 'false');
  });

  it('un gesto sulla navigazione rimette il conto a zero', () => {
    // L'inattività è sulla navigazione, non sulla pagina (utente, 2026-09-23).
    monta();

    avanza(5000);
    fireEvent.pointerDown(screen.getByRole('link', { name: 'Prestiti' }));
    avanza(7999);
    expect(ritirato()).toBe(false);

    avanza(1);
    expect(ritirato()).toBe(true);
  });

  it('non si ritira col puntatore sopra, e riparte a contare quando se ne va', () => {
    monta();

    fireEvent.pointerOver(pannello());
    // ⚠️ Anche premendo: un clic rimette il conto a zero, ma col puntatore sopra il conto non deve
    // partire affatto, o si ritirerebbe sotto la mano otto secondi dopo.
    fireEvent.pointerDown(screen.getByRole('link', { name: 'Prestiti' }));
    avanza(30_000);
    expect(ritirato()).toBe(false);

    fireEvent.pointerOut(pannello());
    avanza(8000);
    expect(ritirato()).toBe(true);
  });

  it('non si ritira col fuoco dentro: chi naviga da tastiera la perderebbe a metà', () => {
    monta();

    act(() => screen.getByRole('link', { name: 'Prestiti' }).focus());
    // Un tasto col fuoco dentro è il caso vero: chi tabula fra le voci preme, e non deve contare.
    fireEvent.keyDown(screen.getByRole('link', { name: 'Prestiti' }), { key: 'Tab' });
    avanza(30_000);
    expect(ritirato()).toBe(false);

    act(() => screen.getByRole('link', { name: 'Prestiti' }).blur());
    avanza(8000);
    expect(ritirato()).toBe(true);
  });

  it('il comando la fa ricrescere, e il fuoco torna alla prima voce', () => {
    // ⚠️ Il comando sparisce quando la navigazione ricresce: senza spostare il fuoco, chi l'ha
    // premuto da tastiera se lo ritroverebbe sul `body`.
    monta();
    avanza(8000);

    fireEvent.click(ricresci() as HTMLElement);

    expect(ritirato()).toBe(false);
    expect(pannello()).not.toHaveAttribute('inert');
    expect(screen.getByRole('link', { name: 'Catalogo' })).toHaveFocus();
  });

  it('il ritiro si spegne, e il ritardo si cambia', () => {
    monta({ autoHideMs: 0 });
    avanza(60_000);
    expect(ritirato()).toBe(false);
  });

  it('il ritardo è di chi la monta', () => {
    monta({ autoHideMs: 2000 });
    avanza(2000);
    expect(ritirato()).toBe(true);
  });

  it('i nomi sono di chi la monta', () => {
    monta({ label: 'Sezioni della colonia', expandLabel: 'Apri le sezioni' });
    avanza(8000);

    expect(screen.getByRole('navigation', { name: 'Sezioni della colonia' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apri le sezioni' })).toBeInTheDocument();
  });

  it('con «meno movimento» il ritiro è uno scambio secco', () => {
    // Le transizioni non le ferma la regola delle animazioni: serve la sua.
    expect(animazioni).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{[^@]*\.pb-dock-panel[^@]*transition: none/,
    );
  });
});

describe('PlagueDockItem', () => {
  it('con `href` è un collegamento, con `onPress` un bottone', () => {
    const onPress = vi.fn();
    render(
      <>
        <PlagueDockItem href="/catalogo" icon={<SkullIcon />} label="Catalogo" />
        <PlagueDockItem onPress={onPress} icon={<SkullIcon />} label="Scansiona" />
      </>,
    );

    expect(screen.getByRole('link', { name: 'Catalogo' })).toHaveAttribute('href', '/catalogo');
    fireEvent.click(screen.getByRole('button', { name: 'Scansiona' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('il collegamento si sostituisce con `render`, come in HeroUI: è così che entra `next/link`', () => {
    render(
      <PlagueDockItem
        href="/catalogo"
        icon={<SkullIcon />}
        label="Catalogo"
        render={(props) => <a data-testid="mio" {...props} />}
      />,
    );

    expect(screen.getByTestId('mio')).toHaveAttribute('href', '/catalogo');
  });

  it('il segno è decorativo: il nome della voce è la sua parola', () => {
    const { container } = render(<PlagueDockItem href="/c" icon={<SkullIcon />} label="Catalogo" />);

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
