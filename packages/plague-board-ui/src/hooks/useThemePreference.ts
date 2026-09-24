'use client';

import { useCallback, useSyncExternalStore } from 'react';

import { isThemePreference, type ThemePreference, type ThemePreferenceOptions } from '../brand/themePreference.js';

const DOMANDA = '(prefers-color-scheme: dark)';

/**
 * Chi legge ogni chiave in questa pagina. ⚠️ L'evento `storage` arriva solo alle **altre** schede:
 * senza questo elenco, una scelta fatta qui non la saprebbe nemmeno il commutatore che l'ha fatta.
 */
const lettori = new Map<string, Set<() => void>>();

/**
 * La scelta di chi non può salvarla — i dati del sito bloccati, dove leggere `localStorage` lancia
 * —, finché la pagina resta aperta. Si consulta solo quando la lettura lancia.
 */
const ripiego = new Map<string, ThemePreference>();

function leggi(chiave: string, diSerie: ThemePreference): ThemePreference {
  let salvata: unknown;
  try {
    salvata = localStorage.getItem(chiave);
  } catch {
    salvata = ripiego.get(chiave);
  }
  return isThemePreference(salvata) ? salvata : diSerie;
}

function scrivi(chiave: string, scelta: ThemePreference) {
  try {
    localStorage.setItem(chiave, scelta);
  } catch {
    ripiego.set(chiave, scelta);
  }
  lettori.get(chiave)?.forEach((avvisa) => avvisa());
}

/** Scrive sulla radice quello che scrive `themeBootScript`: la classe e `data-theme`. */
function applica(scelta: ThemePreference) {
  const risolto = scelta === 'system' ? (window.matchMedia(DOMANDA).matches ? 'dark' : 'light') : scelta;
  const radice = document.documentElement;
  radice.classList.remove(risolto === 'dark' ? 'light' : 'dark');
  radice.classList.add(risolto);
  radice.setAttribute('data-theme', risolto);
}

/** Che cosa restituisce {@link useThemePreference}: la forma di `useTheme` di `next-themes`. */
export interface ThemePreferenceState {
  /** La scelta salvata — `system` compreso —, da passare a `ThemeSwitch` come `value`. */
  theme: ThemePreference;
  /** Salva una scelta nuova e la applica subito alla radice. */
  setTheme: (theme: ThemePreference) => void;
}

/**
 * **La scelta del tema che resta da una visita all'altra**: la salva in `localStorage` sotto la
 * chiave dell'applicazione, la scrive sulla radice e la tiene allineata. Si monta accanto a
 * `ThemeSwitch`, e con {@link themeBootScript} che riceve **lo stesso oggetto di opzioni**.
 *
 * ⚠️ **Sta qui e non in `ThemeSwitch`**, che resta controllato: così il commutatore va anche con
 * `next-themes`, e un'applicazione non si trova con due memorie in disaccordo (utente, 2026-09-24).
 *
 * ⚠️ **Perché non `useTheme` di HeroUI**, che fa lo stesso mestiere: la sua chiave è fissa, quindi
 * in sviluppo sulla 3000 le applicazioni si scambiano la preferenza; legge `localStorage` già al
 * primo render del client, e l'HTML del server non torna; lo chiama senza `try`, e coi dati del
 * sito bloccati lancia; e non sa niente delle altre schede. Qui la lettura passa da
 * `useSyncExternalStore`, che sul server e nell'idratazione usa il valore di serie e subito dopo
 * quello vero, come `useReducedMotion`.
 *
 * ⚠️ **La radice la scrivono i gesti, non il render.** Al caricamento l'ha già scritta lo script;
 * poi la riscrivono una scelta nuova, una scelta fatta in un'altra scheda, e il sistema che cambia
 * idea mentre la scelta è «del sistema». Un effetto che la riscrivesse a ogni render partirebbe
 * anche nell'idratazione, col valore di serie, e la pagina lampeggerebbe.
 *
 * @example
 * ```tsx
 * const { theme, setTheme } = useThemePreference(THEME);   // THEME: vedi themeBootScript
 * <ThemeSwitch value={theme} onChange={setTheme} />
 * ```
 */
export function useThemePreference({ storageKey, defaultTheme = 'system' }: ThemePreferenceOptions): ThemePreferenceState {
  const sottoscrivi = useCallback(
    (avvisa: () => void) => {
      const diQuestaPagina = lettori.get(storageKey) ?? new Set<() => void>();
      lettori.set(storageKey, diQuestaPagina);
      diQuestaPagina.add(avvisa);

      // `key` è `null` quando l'altra scheda ha svuotato tutto con `clear()`.
      const dallAltraScheda = (evento: StorageEvent) => {
        if (evento.key !== null && evento.key !== storageKey) return;
        applica(leggi(storageKey, defaultTheme));
        avvisa();
      };
      const dalSistema = () => {
        if (leggi(storageKey, defaultTheme) === 'system') applica('system');
      };
      const sistema = window.matchMedia(DOMANDA);
      window.addEventListener('storage', dallAltraScheda);
      sistema.addEventListener('change', dalSistema);

      return () => {
        diQuestaPagina.delete(avvisa);
        window.removeEventListener('storage', dallAltraScheda);
        sistema.removeEventListener('change', dalSistema);
      };
    },
    [storageKey, defaultTheme],
  );

  const theme = useSyncExternalStore(
    sottoscrivi,
    () => leggi(storageKey, defaultTheme),
    () => defaultTheme,
  );

  const setTheme = useCallback(
    (scelta: ThemePreference) => {
      scrivi(storageKey, scelta);
      applica(scelta);
    },
    [storageKey],
  );

  return { theme, setTheme };
}
