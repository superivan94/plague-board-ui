import type { ThemePreferenceOptions } from 'plague-board-ui';

/**
 * Dove il playground salva la scelta del tema: lo leggono lo script del layout e il commutatore
 * della barra, e deve essere lo stesso oggetto per tutti e due.
 *
 * ⚠️ **In un modulo senza `'use client'`**, perché il layout è una pagina server: da un modulo
 * client gli arriverebbe un riferimento, non l'oggetto. ⚠️ E la chiave è quella che il playground
 * usava già prima di avere il commutatore della libreria, così chi aveva scelto non deve rifarlo.
 */
export const PLAYGROUND_THEME: ThemePreferenceOptions = { storageKey: 'pb-playground-theme' };
