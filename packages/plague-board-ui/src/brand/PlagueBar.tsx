'use client';

import { Surface } from '@heroui/react';
import type { ReactNode } from 'react';

import {
  PLAGUE_BAR_COMPACT_PADDING,
  PLAGUE_BAR_COMPACT_SAFE_PADDING,
  PLAGUE_BAR_PADDING,
  PLAGUE_BAR_SAFE_PADDING,
  type PlagueBarPlacement,
  type PlagueBarSize,
} from './plagueBarSizes';

export type { PlagueBarPlacement };

export interface PlagueBarProps {
  /** Quello che la barra contiene: marchio, collegamenti, comandi. Li decide chi la usa. */
  children: ReactNode;
  /** Classi aggiuntive. Si sommano alle sue, non le sostituiscono. */
  className?: string;
  /** Resta attaccata alla sua estremità mentre la pagina scorre. Vero di default. */
  isSticky?: boolean;
  /**
   * In cima o in fondo. Cambiano tre cose e nessun'altra: l'elemento — `<header>` di sopra,
   * `<footer>` di sotto, perché sono due punti di riferimento diversi per chi naviga a salti — il
   * lato del filo verde, e il lato a cui si appiccica.
   */
  placement?: PlagueBarPlacement;
  /** Quanto è alta. `medium` di default: è la barra di un'applicazione. */
  size?: PlagueBarSize;
  /**
   * Sul telefono la taglia torna `small`, qualunque sia quella dichiarata. **Vero di default.**
   *
   * ⚠️ La soglia è larghezza **e** altezza — `pb-roomy` in `theme.css` — perché il posto dove lo
   * spazio verticale è più scarso è un telefono coricato, che di larghezza ne ha da vendere.
   * Si spegne quando la barra non vive in una pagina intera: dentro un riquadro di demo, o in
   * un'applicazione che ha già una sua idea di come si comporta sul telefono.
   */
  isCompactOnMobile?: boolean;
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
 * ⚠️ **La barra è un'isola di tema scuro, e porta `dark` addosso.** È la lastra dei Ludoratti: resta
 * scura anche in una pagina chiara. Ma «scura» dev'essere vero anche per **quello che ci sta
 * dentro**, altrimenti i componenti di HeroUI e i token `*-ink` leggono il tema della pagina e
 * scrivono scuro su scuro. Misurato in chiaro prima di metterla: l'etichetta del commutatore faceva
 * **2,05** di contrasto, il collegamento corrente **1,67**. La classe sul contenitore è lo stesso
 * meccanismo con cui il playground affianca i due temi nella stessa pagina.
 *
 * ⚠️ **E per questo il velo è al 90%, non al 70%.** Al 70% su pagina chiara la lastra compone un
 * grigio medio invece del nero: la sfocatura si vede lo stesso, ma «resta scura» smette di essere
 * vero proprio dove serve.
 *
 * ⚠️ **Le tre taglie sono altezze, e la taglia non arriva a chi sta dentro.** La barra non ha modo
 * di ridimensionare un `<svg>` che non conosce, quindi chi mette il marchio legge da sé quanto
 * farlo grande in `PLAGUE_BAR_MARK_SIZE` — o in `PLAGUE_FOOT_MARK_SIZE`, se la lastra sta in
 * fondo — che stanno in `plagueBarSizes.ts`, fuori da questo file, e il motivo è scritto là. È lo
 * stesso confine di sempre: la lastra è della libreria, quello che ci vive dentro è
 * dell'applicazione.
 *
 * ⚠️ **E la stessa taglia vale meno in fondo che in cima**, di un gradino: `small` rientra di 8 px
 * per lato sopra e di 4 sotto. Un piede è una firma, e su una lastra appiccicata lo spazio che
 * prende lo toglie alla pagina a ogni schermata.
 *
 * ⚠️ **Sul telefono la taglia dichiarata non vale: vale `small`.** È `isCompactOnMobile`, acceso
 * di default, e succede **in CSS** — due classi, quella piccola sempre e quella dichiarata sotto
 * `pb-roomy`. Con un gancio che legge la larghezza sarebbe successo dopo l'idratazione, cioè con
 * la pagina già disegnata: il server non sa quanto è largo lo schermo, quindi ogni caricamento su
 * un telefono avrebbe mosso la pagina di venti pixel. ⚠️ **La soglia guarda la finestra e non il
 * contenitore**, al contrario di quello che fanno i pezzi dentro la riga: il rientro sta sulla
 * lastra, e una container query può interrogare solo un antenato — che qui è la pagina di chi
 * installa la libreria.
 */
export function PlagueBar({
  children,
  className = '',
  isSticky = true,
  placement = 'top',
  size = 'medium',
  isCompactOnMobile = true,
}: PlagueBarProps) {
  const inCima = placement === 'top';
  // ⚠️ Due tabelle e non un prefisso calcolato: Tailwind cerca le classi nel **testo** dei file, e
  // una stringa composta a runtime non genera nessuna regola. Il perché per esteso sta là dentro.
  const rientro = isCompactOnMobile ? PLAGUE_BAR_COMPACT_PADDING : PLAGUE_BAR_PADDING;
  const incavo = isCompactOnMobile ? PLAGUE_BAR_COMPACT_SAFE_PADDING : PLAGUE_BAR_SAFE_PADDING;

  return (
    <Surface
      variant="transparent"
      // ⚠️ Due elementi e non uno con un `role`: `<header>` e `<footer>` sono `banner` e
      // `contentinfo`, cioè due punti di riferimento distinti nell'elenco che uno screen reader
      // offre per saltare. Un piede reso come intestazione sarebbe un secondo `banner`, che è
      // proprio la cosa che quell'elenco non deve avere.
      render={(props) => (inCima ? <header {...props} /> : <footer {...props} />)}
      className={`dark ${isSticky ? `sticky z-20 ${inCima ? 'top-0' : 'bottom-0'}` : ''} w-full ${
        inCima ? 'border-b' : 'border-t'
      } border-brand/20 bg-gray-950/90 backdrop-blur-sm ${rientro[placement][size]} ${
        incavo[placement][size]
      } ${className}`}
    >
      {children}
    </Surface>
  );
}
