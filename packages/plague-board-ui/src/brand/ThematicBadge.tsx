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
 * ⚠️ **La variante è `soft`, cioè quella che tinge anche il fondo — e serve al tema chiaro.**
 * Nella variante predefinita di HeroUI il colore vive **solo** nel testo (`--chip-fg`, col fondo
 * fermo su `--default`), e in scuro basta, perché quei testi sono tinte sature accanto a un
 * bianco. In chiaro sono invece tutte scure e vicine fra loro: misurato il 2026-09-20, fra
 * l'oliva di `accent` e il quasi-nero di `default` ci sono **2,50**, e a colpo d'occhio una
 * pastiglia colorata e una neutra sono la stessa cosa — segnalato dall'utente guardando il
 * playground. Con `soft` il fondo prende un velo del proprio colore e la pastiglia si legge come
 * verde, rossa o ambra anche in chiaro; il testo resta sopra **5,07** in tutti e cinque i colori.
 *
 * ⚠️ **Il bordo è `border-current`, cioè il colore del testo del chip**, ed è una rifinitura, non
 * il segnale: misurato vale 2,90 per `accent` e 1,97 per `danger` in scuro, 1,88 in chiaro. A
 * distinguere i colori sono il testo e — da qui in poi — il fondo.
 *
 * @example
 * ```tsx
 * const COLORE: Record<Piano, ThematicBadgeColor> = { free: 'default', plus: 'accent', premium: 'danger' };
 * <ThematicBadge color={COLORE[piano]} icon={<VirusIcon size={12} />}>{nomeTematico}</ThematicBadge>
 * ```
 */
export function ThematicBadge({ children, color = 'default', icon, className = '' }: ThematicBadgeProps) {
  return (
    <Chip color={color} variant="soft" className={`rounded-full border border-current/40 ${className}`}>
      {icon}
      <Chip.Label>{children}</Chip.Label>
    </Chip>
  );
}
