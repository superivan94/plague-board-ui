import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { THEME_PREFERENCES, themeBootScript, useThemePreference, type ThemePreferenceOptions } from '../src';

/** L'applicazione che salva la sua scelta: ognuna con la sua chiave. */
const APP: ThemePreferenceOptions = { storageKey: 'rattoteca-theme' };
const radice = document.documentElement;

/**
 * Il sistema che risponde «scuro» o «chiaro» a `prefers-color-scheme`, e che può cambiare idea a
 * pagina aperta: restituisce la funzione che lo fa cambiare e avvisa chi ascolta.
 */
function sistema(scuro: boolean) {
  // Un `EventTarget` vero consegna il `change`, con la firma che `MediaQueryList` si aspetta.
  const bersaglio = new EventTarget();
  let adesso = scuro;
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      get matches() {
        return adesso && query.includes('dark');
      },
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: bersaglio.addEventListener.bind(bersaglio),
      removeEventListener: bersaglio.removeEventListener.bind(bersaglio),
      dispatchEvent: bersaglio.dispatchEvent.bind(bersaglio),
    }) as MediaQueryList;
  return (scuroOra: boolean) => {
    adesso = scuroOra;
    bersaglio.dispatchEvent(new Event('change'));
  };
}

/** Il tema scritto sulla radice: la classe e `data-theme`, le due cose che il CSS guarda. */
const temaDellaRadice = () => `${[...radice.classList].sort().join(' ')} · ${radice.getAttribute('data-theme')}`;

describe('useThemePreference', () => {
  const matchMediaVero = window.matchMedia;

  afterEach(() => {
    localStorage.clear();
    radice.className = '';
    radice.removeAttribute('data-theme');
    window.matchMedia = matchMediaVero;
    vi.restoreAllMocks();
  });

  it('legge la scelta sotto la chiave della sua applicazione, e senza vale quella di serie', () => {
    // ⚠️ In sviluppo le applicazioni girano tutte sulla 3000, cioè sulla stessa origine: con una
    // chiave sola si scambierebbero la preferenza.
    localStorage.setItem('rattinventario-theme', 'dark');
    expect(renderHook(() => useThemePreference(APP)).result.current.theme).toBe('system');
    expect(renderHook(() => useThemePreference({ ...APP, defaultTheme: 'dark' })).result.current.theme).toBe('dark');

    localStorage.setItem('rattoteca-theme', 'light');
    expect(renderHook(() => useThemePreference(APP)).result.current.theme).toBe('light');

    localStorage.setItem('rattoteca-theme', 'viola');
    expect(renderHook(() => useThemePreference(APP)).result.current.theme).toBe('system');
  });

  it('una scelta nuova si salva, si scrive sulla radice e arriva a chi la legge', () => {
    radice.classList.add('dark');
    const { result } = renderHook(() => useThemePreference(APP));

    act(() => result.current.setTheme('light'));

    expect(localStorage.getItem('rattoteca-theme')).toBe('light');
    expect(result.current.theme).toBe('light');
    expect(temaDellaRadice()).toBe('light · light');
  });

  it('«del sistema» segue il sistema anche quando cambia idea a pagina aperta, e una scelta esplicita no', () => {
    const cambia = sistema(true);
    const { result } = renderHook(() => useThemePreference(APP));

    act(() => result.current.setTheme('system'));
    expect(temaDellaRadice()).toBe('dark · dark');
    act(() => cambia(false));
    expect(temaDellaRadice()).toBe('light · light');

    act(() => result.current.setTheme('dark'));
    act(() => cambia(false));
    expect(temaDellaRadice()).toBe('dark · dark');
  });

  it('segue la scelta fatta in un’altra scheda', () => {
    // ⚠️ `storage` arriva solo alle **altre** schede della stessa origine: è l'unico modo in cui una
    // lo sa dell'altra, e senza la seconda resta col tema di prima finché non la si ricarica.
    const { result } = renderHook(() => useThemePreference(APP));

    localStorage.setItem('rattoteca-theme', 'dark');
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'rattoteca-theme', newValue: 'dark' }));
    });

    expect(result.current.theme).toBe('dark');
    expect(temaDellaRadice()).toBe('dark · dark');
  });

  it('se `localStorage` non risponde non lancia, e la scelta vale finché la pagina resta aperta', () => {
    // ⚠️ È il caso dei dati del sito bloccati, dove leggere `localStorage` lancia: `useTheme` di
    // HeroUI lì si porta via il componente che lo chiama.
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloccato');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloccato');
    });
    const { result } = renderHook(() => useThemePreference(APP));
    expect(result.current.theme).toBe('system');

    act(() => result.current.setTheme('dark'));

    expect(result.current.theme).toBe('dark');
    expect(temaDellaRadice()).toBe('dark · dark');
  });

  it('sul server — e quindi nell’idratazione — vale il valore di serie, anche con una scelta salvata', () => {
    // ⚠️ È la metà che `useTheme` di HeroUI sbaglia: legge `localStorage` già al primo render del
    // client, e l'HTML del server non torna più. `renderToString` chiama la risposta del server.
    localStorage.setItem('rattoteca-theme', 'dark');
    function Sonda() {
      return <span>{useThemePreference(APP).theme}</span>;
    }

    expect(renderToString(<Sonda />)).toContain('system');
  });

  it('scrive sulla radice quello che scrive lo script, per ogni scelta e ogni sistema', () => {
    // ⚠️ Sono due implementazioni della stessa cosa — lo script è una stringa che gira prima di
    // React — e il giorno che una cambia senza l'altra, ricaricando la pagina cambierebbe tema.
    for (const scuro of [true, false]) {
      sistema(scuro);
      for (const scelta of THEME_PREFERENCES) {
        localStorage.setItem(APP.storageKey, scelta);
        radice.className = 'dark';
        new Function(themeBootScript(APP))();
        const dalloScript = temaDellaRadice();

        radice.className = 'dark';
        radice.removeAttribute('data-theme');
        const { result, unmount } = renderHook(() => useThemePreference(APP));
        act(() => result.current.setTheme(scelta));
        unmount();

        expect(temaDellaRadice(), `${scelta} con il sistema ${scuro ? 'scuro' : 'chiaro'}`).toBe(dalloScript);
      }
    }
  });
});
