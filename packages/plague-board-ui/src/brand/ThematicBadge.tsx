import { Chip } from '@heroui/react';
import type { ReactNode } from 'react';

/** I colori che HeroUI dà a un `Chip`, e che il nostro tema ha già accordato alla tavolozza. */
export type ThematicBadgeColor = 'default' | 'accent' | 'success' | 'warning' | 'danger';

export interface ThematicBadgeProps {
  /** Il nome tematico: «Paziente Zero», «Untore», quello che è. */
  children: ReactNode;
  /** Quale dei colori del tema. Senza, il neutro. */
  color?: ThematicBadgeColor;
  /** Un segno prima del nome. Decorativo: il nome lo dice già il testo. */
  icon?: ReactNode;
  /** Classi aggiuntive. */
  className?: string;
}

/**
 * **La pastiglia col nome tematico**: il grado, il piano, il livello di contagio — quello che
 * l'applicazione chiama così invece di chiamarlo «premium».
 *
 * Sopra il `Chip` di HeroUI, con addosso le due cose che la fanno leggere come nostra: la
 * **forma a pillola** e il **bordo nel proprio colore**, che di là è quello che stacca la
 * pastiglia dalla superficie scura.
 *
 * ⚠️ **I nomi dei piani e i loro colori non stanno qui, e non è una dimenticanza.** Di là
 * `getPlanBadgeStyle` mappa `free`/`plus`/`premium` su grigio, blu e viola: è il modello di
 * abbonamento di quell'applicazione, non l'identità dei Ludoratti. Questa libreria dà la
 * pastiglia e i cinque colori del tema; quale grado sia di che colore lo decide chi la monta, ed
 * è una riga di `Record<Piano, ThematicBadgeColor>` a casa sua.
 *
 * ⚠️ **Il bordo è `border-current`, cioè il colore del testo del chip.** HeroUI, per i suoi
 * colori, cambia solo `--chip-fg` — il fondo resta `--default` — quindi il colore scelto si vede
 * nel testo e, grazie a questa riga, anche nel contorno: senza, un `accent` e un `danger` a
 * mezzo metro di distanza sono la stessa pastiglia grigia.
 *
 * @example
 * ```tsx
 * const COLORE: Record<Piano, ThematicBadgeColor> = { free: 'default', plus: 'accent', premium: 'danger' };
 * <ThematicBadge color={COLORE[piano]} icon={<VirusIcon size={12} />}>{nomeTematico}</ThematicBadge>
 * ```
 */
export function ThematicBadge({ children, color = 'default', icon, className = '' }: ThematicBadgeProps) {
  return (
    <Chip color={color} className={`rounded-full border border-current/40 ${className}`}>
      {icon}
      <Chip.Label>{children}</Chip.Label>
    </Chip>
  );
}
