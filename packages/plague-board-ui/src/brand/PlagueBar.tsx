import { Surface } from '@heroui/react';
import type { ReactNode } from 'react';

export interface PlagueBarProps {
  /** Quello che la barra contiene: marchio, collegamenti, comandi. Li decide chi la usa. */
  children: ReactNode;
  /** Classi aggiuntive. Si sommano alle sue, non le sostituiscono. */
  className?: string;
  /** Resta in cima mentre la pagina scorre. Vero di default. */
  isSticky?: boolean;
}

/**
 * **La barra dei Ludoratti.** Una lastra scura semitrasparente che sfoca quello che le passa
 * sotto, con un filo verde in basso a separarla dalla pagina.
 *
 * ⚠️ **È un contenitore, non un'intestazione.** Non disegna un logo, non sa che voci mostrare e
 * non conosce nessun indirizzo: quelle cose sono dell'applicazione, e la barra le ospita. È la
 * stessa regola per cui nella libreria non entra un header ma il topo che ci vive dentro.
 *
 * ⚠️ **Veste il `Surface` di HeroUI**, non lo riscrive, e lo rende come `<header>`: una barra di
 * navigazione che esce come `div` perde il ruolo `banner`, e chi naviga per punti di riferimento
 * non la trova più. In HeroUI 3 il cambio di elemento si chiede con `render`, non con `as`.
 *
 * La sfocatura viene da `ludoratti.it`, dove le schede stanno su `bg-gray-900/50` con
 * `backdrop-blur`: è il segno che sotto c'è qualcosa che si muove — i ratti, le gocce, il fondale
 * appestato — e che la barra ci galleggia sopra invece di coprirlo.
 */
export function PlagueBar({ children, className = '', isSticky = true }: PlagueBarProps) {
  return (
    <Surface
      variant="transparent"
      render={(props) => <header {...props} />}
      className={`${isSticky ? 'sticky top-0 z-20' : ''} w-full border-b border-brand/20 bg-gray-950/70 backdrop-blur-sm ${className}`}
    >
      {children}
    </Surface>
  );
}
