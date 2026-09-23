import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { THEME_PREFERENCE_LABELS, ThemeSwitch, themeBootScript } from '../src';

const opzione = (nome: string) => screen.getByRole('radio', { name: nome });

describe('ThemeSwitch', () => {
  it('è un gruppo di tre scelte che si escludono, col suo nome', () => {
    // ⚠️ `radiogroup` come il selettore del livello: chi ascolta sente «2 di 3» e sa quante scelte ha.
    render(<ThemeSwitch value="dark" onChange={vi.fn()} />);

    expect(screen.getByRole('radiogroup', { name: 'Tema' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('mostra scelta quella che riceve', () => {
    render(<ThemeSwitch value="system" onChange={vi.fn()} />);

    expect(opzione(THEME_PREFERENCE_LABELS.system)).toBeChecked();
    expect(opzione(THEME_PREFERENCE_LABELS.dark)).not.toBeChecked();
  });

  it('una scelta nuova arriva a `onChange`, e ripremere quella di prima non la toglie', () => {
    const onChange = vi.fn();
    render(<ThemeSwitch value="dark" onChange={onChange} />);

    fireEvent.click(opzione(THEME_PREFERENCE_LABELS.light));
    expect(onChange).toHaveBeenLastCalledWith('light');

    onChange.mockClear();
    fireEvent.click(opzione(THEME_PREFERENCE_LABELS.dark));
    expect(onChange).not.toHaveBeenCalledWith(undefined);
  });

  it('un valore che non conosce vale come «del sistema»', () => {
    // `useTheme` e `next-themes` danno una stringa qualunque, e prima dell'idratazione `undefined`.
    render(<ThemeSwitch value={undefined} onChange={vi.fn()} />);

    expect(opzione(THEME_PREFERENCE_LABELS.system)).toBeChecked();
  });

  it('i nomi delle scelte e del gruppo sono di chi lo monta', () => {
    render(
      <ThemeSwitch
        value="light"
        onChange={vi.fn()}
        label="Aspetto"
        labels={{ light: 'Giorno', dark: 'Notte', system: 'Automatico' }}
      />,
    );

    expect(screen.getByRole('radiogroup', { name: 'Aspetto' })).toBeInTheDocument();
    expect(opzione('Notte')).toBeInTheDocument();
  });
});

describe('themeBootScript', () => {
  const radice = document.documentElement;
  const matchMediaVero = window.matchMedia;

  /** Il sistema che risponde «scuro» o «chiaro» a `prefers-color-scheme`. */
  const sistema = (scuro: boolean) => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: scuro && query.includes('dark'),
      media: query,
    }));
  };

  // Il testo dello script, eseguito come lo eseguirebbe il browser nell'`<head>`.
  const esegui = (script: string) => new Function(script)();

  afterEach(() => {
    localStorage.clear();
    radice.className = '';
    radice.removeAttribute('data-theme');
    window.matchMedia = matchMediaVero;
    vi.restoreAllMocks();
  });

  it('applica la scelta salvata: classe e `data-theme`, come `useTheme` di HeroUI', () => {
    localStorage.setItem('heroui-theme', 'dark');
    radice.classList.add('light');

    esegui(themeBootScript());

    expect(radice.classList.contains('dark')).toBe(true);
    expect(radice.classList.contains('light')).toBe(false);
    expect(radice.getAttribute('data-theme')).toBe('dark');
  });

  it('«del sistema» si risolve con `prefers-color-scheme`', () => {
    localStorage.setItem('heroui-theme', 'system');
    sistema(true);

    esegui(themeBootScript());
    expect(radice.getAttribute('data-theme')).toBe('dark');
  });

  it('senza una scelta, o con una che non conosce, vale quella di serie', () => {
    sistema(false);
    esegui(themeBootScript());
    expect(radice.getAttribute('data-theme')).toBe('light');

    localStorage.setItem('heroui-theme', 'viola');
    esegui(themeBootScript({ defaultTheme: 'dark' }));
    expect(radice.getAttribute('data-theme')).toBe('dark');
  });

  it('legge anche la chiave di un altro gancio, come `next-themes`', () => {
    localStorage.setItem('theme', 'dark');

    esegui(themeBootScript({ storageKey: 'theme' }));
    expect(radice.getAttribute('data-theme')).toBe('dark');
  });

  it('se `localStorage` non risponde non lancia, e ripiega', () => {
    // ⚠️ Uno script che si rompe nell'`<head>` si porta via quello che viene dopo.
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloccato');
    });
    sistema(true);

    expect(() => esegui(themeBootScript())).not.toThrow();
    expect(radice.getAttribute('data-theme')).toBe('dark');
  });
});
