'use client';

import { Surface } from '@heroui/react';
import type { ReactNode } from 'react';

import { PLAGUE_BAR_PADDING, type PlagueBarSize } from './plagueBarSizes';

export interface PlagueBarProps {
  /** Quello che la barra contiene: marchio, collegamenti, comandi. Li decide chi la usa. */
  children: ReactNode;
  /** Classi aggiuntive. Si sommano alle sue, non le sostituiscono. */
  className?: string;
  /** Resta in cima mentre la pagina scorre. Vero di default. */
  isSticky?: boolean;
  /** Quanto è alta. `medium` di default: è la barra di un'applicazione. */
  size?: PlagueBarSize;
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
 * ⚠️ **E per questo il file dichiara `'use client'`**: `render` è una **funzione**, `Surface` è un
 * componente client, e una funzione non attraversa il confine server→client. Senza la direttiva,
 * la barra usata da una pagina server fa fallire il prerender — che è il caso normale, visto che
 * le intestazioni vivono in `layout.tsx`. Misurato con `next build` il 2026-09-17; il guard in
 * `tests/boundaries.test.ts` lo tiene.
 *
 * La sfocatura viene da `ludoratti.it`, dove le schede stanno su `bg-gray-900/50` con
 * `backdrop-blur`: è il segno che sotto c'è qualcosa che si muove — i ratti, le gocce, il fondale
 * appestato — e che la barra ci galleggia sopra invece di coprirlo.
 *
 * ⚠️ **Le tre taglie sono altezze, e la taglia non arriva a chi sta dentro.** La barra non ha modo
 * di ridimensionare un `<svg>` che non conosce, quindi chi mette il marchio legge da sé quanto
 * farlo grande in `PLAGUE_BAR_MARK_SIZE`, che sta in `plagueBarSizes.ts` — fuori da questo file, e
 * il motivo è scritto là. È lo stesso confine di sempre: la lastra è della libreria, quello che ci
 * vive dentro è dell'applicazione.
 */
export function PlagueBar({
  children,
  className = '',
  isSticky = true,
  size = 'medium',
}: PlagueBarProps) {
  return (
    <Surface
      variant="transparent"
      render={(props) => <header {...props} />}
      className={`${isSticky ? 'sticky top-0 z-20' : ''} w-full border-b border-brand/20 bg-gray-950/70 backdrop-blur-sm ${PLAGUE_BAR_PADDING[size]} ${className}`}
    >
      {children}
    </Surface>
  );
}
