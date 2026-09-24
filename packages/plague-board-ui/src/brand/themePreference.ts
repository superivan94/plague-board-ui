/**
 * Le tre scelte del tema: chiaro, scuro, o quello del sistema. Sono i tre valori che `useTheme` di
 * HeroUI salva, e anche quelli di `next-themes`: il commutatore va con tutti e due.
 */
export type ThemePreference = 'light' | 'dark' | 'system';

/** Le tre scelte nell'ordine in cui il commutatore le mette in fila. */
export const THEME_PREFERENCES: readonly ThemePreference[] = ['light', 'dark', 'system'];

/**
 * Come si chiamano le tre scelte per chi le ascolta: il commutatore mostra solo i segni.
 *
 * ⚠️ **È un dato e non un testo dentro il componente**, come i nomi dei livelli tossici: un'app in
 * un'altra lingua le cambia senza riscrivere il commutatore.
 */
export const THEME_PREFERENCE_LABELS: Record<ThemePreference, string> = {
  light: 'Tema chiaro',
  dark: 'Tema scuro',
  system: 'Tema del sistema',
};

/** Se un valore arrivato da fuori — `localStorage`, un gancio, un cookie — è una delle tre scelte. */
export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

/**
 * La chiave con cui `useTheme` di HeroUI salva la scelta in `localStorage`, per chi usa il suo
 * gancio invece di {@link useThemePreference}: è fissa, e il gancio non la lascia cambiare.
 */
export const HEROUI_THEME_STORAGE_KEY = 'heroui-theme';

/**
 * Dove si salva la scelta del tema, e che cosa vale quando non c'è.
 *
 * ⚠️ **Lo stesso oggetto va a {@link themeBootScript} e a {@link useThemePreference}**: lo script
 * legge la scelta prima del primo disegno, il gancio la scrive, e con due chiavi diverse ogni
 * caricamento tornerebbe al valore di serie. Si dichiara una volta sola, in un modulo **senza**
 * `'use client'` — lo script si chiama dal layout, che è una pagina server, e un modulo client
 * consegnerebbe al server un riferimento invece dell'oggetto.
 */
export interface ThemePreferenceOptions {
  /**
   * La chiave in `localStorage`: **una per applicazione**, come `rattoteca-theme`.
   *
   * ⚠️ `localStorage` è già diviso per origine, quindi due applicazioni su due domini non si vedono
   * comunque. La chiave serve quando l'origine è la stessa — in sviluppo, dove girano tutte sulla
   * 3000 — ed è obbligatoria perché una chiave di serie le farebbe scambiare proprio lì. Con
   * `next-themes` è `theme`, con `useTheme` di HeroUI {@link HEROUI_THEME_STORAGE_KEY}.
   */
  storageKey: string;
  /** Che cosa vale senza una scelta salvata. Di serie `system`. */
  defaultTheme?: ThemePreference;
}

/**
 * **Lo script che applica il tema prima del primo disegno**, da mettere nell'`<head>` come testo di
 * un `<script>`: legge la scelta salvata, risolve «del sistema» con `prefers-color-scheme`, e scrive
 * sulla radice la classe e `data-theme` — le due cose che il CSS di HeroUI e il nostro guardano.
 *
 * ⚠️ **Uno script e non un effetto**, ed è la regola misurata col playground: gli effetti partono
 * dopo il primo disegno, e lì il lampo del tema sbagliato si vede a ogni caricamento. Il prezzo è
 * che il server rende una classe e il client ne trova un'altra: sull'`<html>` va
 * `suppressHydrationWarning`, che dice «questa differenza è voluta».
 *
 * ⚠️ **Scrive quello che scrive {@link useThemePreference}, e niente di più** — che è anche quello
 * che scrive `useTheme` di HeroUI —, così quando il gancio prende il comando trova la radice già
 * com'è. Niente `style.colorScheme`, per esempio: il gancio non lo aggiorna, e resterebbe scuro dopo
 * il passaggio al chiaro — il `color-scheme` lo dà già il CSS di HeroUI sulla classe. Che i due
 * scrivano lo stesso lo tiene un test, scelta per scelta. E se `localStorage` non risponde — una
 * finestra privata, i dati bloccati — ripiega sul valore di serie invece di lanciare, perché uno
 * script che si rompe nell'`<head>` si porta via anche quello che viene dopo.
 *
 * È una **funzione che restituisce una stringa**, e si chiama da una pagina server: è un dato, non
 * una funzione passata a un componente client.
 *
 * @example
 * ```tsx
 * // theme.ts, senza 'use client': lo leggono il layout e il commutatore
 * export const THEME: ThemePreferenceOptions = { storageKey: 'rattoteca-theme' };
 *
 * <html lang="it" suppressHydrationWarning>
 *   <head>
 *     <script dangerouslySetInnerHTML={{ __html: themeBootScript(THEME) }} />
 *   </head>
 * ```
 */
export function themeBootScript({ storageKey, defaultTheme = 'system' }: ThemePreferenceOptions): string {
  return `(function(){var d=document.documentElement,t=${JSON.stringify(defaultTheme)};try{var s=localStorage.getItem(${JSON.stringify(storageKey)});if(s==="light"||s==="dark"||s==="system")t=s}catch(e){}var r=t==="system"?(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):t;d.classList.remove(r==="dark"?"light":"dark");d.classList.add(r);d.setAttribute("data-theme",r)})();`;
}
