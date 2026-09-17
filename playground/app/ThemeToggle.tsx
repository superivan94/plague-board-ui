'use client';

import { ToggleButton, ToggleButtonGroup } from '@heroui/react';
import { TechLabel } from 'plague-board-ui';
import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

/** La chiave del ricordo. La legge anche lo script del layout, prima che React esista. */
export const THEME_STORAGE_KEY = 'pb-playground-theme';

function apply(theme: Theme) {
  const root = document.documentElement.classList;
  root.toggle('dark', theme === 'dark');
  root.toggle('light', theme === 'light');

  // In navigazione privata `localStorage` può lanciare: il tema si applica lo stesso, non si
  // ricorda soltanto.
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* si prosegue senza memoria */
  }
}

/** Si osserva la classe della radice: se la cambia qualcun altro, il comando resta allineato. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

const read = (): Theme =>
  document.documentElement.classList.contains('light') ? 'light' : 'dark';

/**
 * Il commutatore del tema del playground.
 *
 * ⚠️ Scrive una **classe sulla radice**, che è il modo in cui sia HeroUI sia `theme.css`
 * riconoscono il tema. Non è un componente della libreria: come si sceglie il tema è una decisione
 * dell'applicazione — chi ha un menu utente lo mette lì, chi segue il sistema non lo mette affatto.
 *
 * ⚠️ **Lo stato non si copia in React.** La verità è la classe sulla radice, ce l'ha messa lo
 * script del layout prima dell'idratazione, e qui si legge con `useSyncExternalStore`: una copia
 * in `useState` diverge appena qualcosa tocca quella classe da fuori.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, read, (): Theme => 'dark');

  return (
    <ToggleButtonGroup
      size="sm"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[theme]}
      onSelectionChange={(keys) => {
        const next = [...keys][0] as Theme | undefined;
        if (next !== undefined) apply(next);
      }}
      aria-label="Tema"
    >
      <ToggleButton id="light">
        <TechLabel>chiaro</TechLabel>
      </ToggleButton>
      <ToggleButton id="dark">
        <TechLabel>scuro</TechLabel>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
