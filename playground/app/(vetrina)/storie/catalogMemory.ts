/**
 * Quello che il catalogo ricorda mentre lo si sfoglia: il formato scelto e l'ultima storia vista.
 *
 * ⚠️ **In `sessionStorage`, cioè per scheda e per sessione**, ed è una comodità di chi guarda, non
 * uno stato da cui dipende qualcosa: se il browser la rifiuta — navigazione privata, dati bloccati —
 * il catalogo funziona lo stesso, e non ricorda soltanto. Per questo ogni lettura e ogni scrittura
 * sta in un `try`.
 *
 * ⚠️ Si legge con `useSyncExternalStore`, come il tema del playground: il server non sa niente di
 * questa scheda, quindi rende il valore predefinito, e il client lo corregge dopo l'idratazione
 * senza che React la veda come una differenza.
 */

export const FORMAT_KEYS = ['phone', 'tablet', 'full'] as const;
export type FormatKey = (typeof FORMAT_KEYS)[number];

const FORMAT_STORAGE = 'pb-playground-story-format';
const LAST_STORY_STORAGE = 'pb-playground-last-story';

const listeners = new Set<() => void>();

/** Per `useSyncExternalStore`: avvisa chi legge quando cambia il formato in questa pagina. */
export function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function read(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* si prosegue senza memoria */
  }
}

const isFormatKey = (value: string | null): value is FormatKey => FORMAT_KEYS.some((key) => key === value);

export function readFormat(): FormatKey {
  const value = read(FORMAT_STORAGE);
  return isFormatKey(value) ? value : 'phone';
}

export function writeFormat(format: FormatKey) {
  write(FORMAT_STORAGE, format);
  listeners.forEach((onChange) => onChange());
}

export function readLastStory(): string | null {
  return read(LAST_STORY_STORAGE);
}

export function rememberStory(name: string) {
  write(LAST_STORY_STORAGE, name);
}
