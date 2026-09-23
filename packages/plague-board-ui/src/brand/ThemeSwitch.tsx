'use client';

import { ToggleButton, ToggleButtonGroup } from '@heroui/react';

import { MonitorIcon } from '../icons/MonitorIcon.js';
import { MoonIcon } from '../icons/MoonIcon.js';
import { SunIcon } from '../icons/SunIcon.js';
import {
  THEME_PREFERENCES,
  THEME_PREFERENCE_LABELS,
  isThemePreference,
  type ThemePreference,
} from './themePreference.js';

/** Il segno di ogni scelta. */
const SEGNI = { light: SunIcon, dark: MoonIcon, system: MonitorIcon } as const;

export interface ThemeSwitchProps {
  /**
   * La scelta di adesso. Accetta una stringa qualunque perché `useTheme` e `next-themes` danno una
   * stringa — e `undefined` prima dell'idratazione: quello che non è `light` o `dark` vale come
   * «del sistema».
   */
  value: string | undefined;
  /** Una scelta nuova. Salvarla e applicarla è di chi lo monta: di solito, il gancio del tema. */
  onChange: (value: ThemePreference) => void;
  /** Come si chiama il gruppo per chi non lo vede. Di serie «Tema». */
  label?: string;
  /** Come si chiamano le tre scelte: il commutatore mostra solo i segni. */
  labels?: Record<ThemePreference, string>;
  /** Classi aggiuntive sul gruppo. */
  className?: string;
}

/**
 * **Il commutatore del tema**: chiaro, scuro, o quello del sistema (utente, 2026-09-23), coi segni
 * del sole, della luna e dello schermo. Sopra il `ToggleButtonGroup` di HeroUI, che con la scelta
 * singola **è** un `radiogroup` — come {@link ToxicLevelSwitch}.
 *
 * ⚠️ **È controllato, e non sa dove si salva la scelta**: `value` e `onChange` e basta. Così va col
 * gancio `useTheme` di HeroUI come con `next-themes`, che Rattoteca usa oggi, senza che la libreria
 * ne scelga uno. Per non vedere il lampo del tema sbagliato al caricamento c'è
 * {@link themeBootScript}, da mettere nell'`<head>`.
 *
 * ⚠️ **«Del sistema» è una scelta vera, non l'assenza di una**: chi l'ha già decisa nelle
 * impostazioni del suo dispositivo non deve ripeterla qui. Il commutatore di oggi di Rattoteca la
 * supporta sotto e la nasconde — con `system` mostra «chiaro» qualunque cosa faccia il sistema.
 *
 * @example
 * ```tsx
 * const { theme, setTheme } = useTheme();   // da '@heroui/react'
 * <ThemeSwitch value={theme} onChange={setTheme} />
 * ```
 */
export function ThemeSwitch({
  value,
  onChange,
  label = 'Tema',
  labels = THEME_PREFERENCE_LABELS,
  className = '',
}: ThemeSwitchProps) {
  const scelta: ThemePreference = value === 'light' || value === 'dark' ? value : 'system';

  return (
    <ToggleButtonGroup
      size="sm"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[scelta]}
      onSelectionChange={(chiavi) => {
        const nuova: unknown = [...chiavi][0];
        if (isThemePreference(nuova)) onChange(nuova);
      }}
      aria-label={label}
      className={className}
    >
      {THEME_PREFERENCES.map((tema) => {
        const Segno = SEGNI[tema];

        return (
          <ToggleButton key={tema} id={tema} isIconOnly aria-label={labels[tema]}>
            {/* `size-4` accanto al numero: dentro un `ToggleButton` HeroUI sostituisce l'attributo. */}
            <Segno size={16} className="size-4" />
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}
