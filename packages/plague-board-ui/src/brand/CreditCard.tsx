'use client';

import type { ReactNode } from 'react';

import { HoverEmitter } from './HoverEmitter.js';
import type { HoverEffect } from './hoverEffects.js';

/** Chi ha fatto una cosa: un nome, e il resto è facoltativo. */
export interface CreditAuthor {
  /** Come si firma. */
  readonly name: string;
  /**
   * Il segno che lo distingue — `<CodeIcon size={16} />` per l'umano, `<RobotIcon size={16} />`
   * per l'AI.
   *
   * ⚠️ **È un nodo già reso e non un componente**, e non è un dettaglio: un autore si dichiara
   * dove stanno i dati dell'applicazione, che spesso è un modulo **server**, e una funzione non
   * attraversa quel confine mentre un elemento sì. È la stessa forma con cui `TalkingMascot`
   * riceve la faccia.
   */
  readonly icon?: ReactNode;
  /** Dove porta il nome. Senza, non è un collegamento. */
  readonly href?: string;
  /**
   * Che cosa succede quando lo si sfiora: `comicBubbles(FRASI)` per chi parla, `binaryRain()` per
   * chi no. Senza, niente easter egg e nessun timer.
   *
   * ⚠️ **È la taratura intera e non solo le frasi**, perché i due autori della firma di
   * RattInventario hanno due easter egg **diversi** — l'umano pensa, l'AI piove cifre — e
   * cablarne uno solo qui dentro avrebbe voluto dire scrivere in libreria quale dei due è
   * l'umano.
   */
  readonly effect?: HoverEffect;
}

export interface CreditCardProps extends CreditAuthor {
  /** Di quanto ritarda l'animazione del salto: vedi {@link HoverEmitterProps.hintDelayMs}. */
  hintDelayMs?: number;
  /** Classi aggiuntive sulla scheda. */
  className?: string;
}

/**
 * **La scheda di un autore**: un segno, un nome, e — se gli si passano delle frasi — l'easter egg
 * che gliele fa dire quando lo si sfiora.
 *
 * È la scheda in fondo alle pagine di RattInventario, dove umano e AI stanno in fila con il loro
 * segno. Qui l'autore è una **prop**: la libreria non sa chi ha scritto l'applicazione che la
 * installa, e i nomi dei Ludoratti non sono più veri di altri.
 *
 * ⚠️ **L'easter egg non è cablato dentro: è `HoverEmitter` con la taratura che gli si passa.**
 * Una scheda senza `effect` non monta nessun timer e nessun contenitore; e i due autori della
 * firma hanno due easter egg diversi senza che la libreria sappia quale dei due è l'umano.
 *
 * ⚠️ **Il collegamento esterno apre in una scheda nuova con `rel="noopener noreferrer"`**: senza
 * `noopener`, la pagina che si apre può riscrivere l'indirizzo di quella che l'ha aperta.
 */
export function CreditCard({ name, icon, href, effect, hintDelayMs, className = '' }: CreditCardProps) {
  // ⚠️ Senza indirizzo la scheda porta la freccia: sopra un testo che non è un comando il browser
  // mostra il cursore di testo, e una scheda sembrerebbe un campo da scrivere. Il nome resta
  // selezionabile, perché è una cosa che si copia. **Solo** senza indirizzo: questo `<span>` sta
  // dentro l'ancora, ed è lui l'elemento sotto il puntatore — con la freccia addosso, la manina del
  // collegamento sparirebbe.
  const corpo = (
    <span
      className={`flex items-center gap-1.5 rounded-lg border border-border px-2 py-0.5 text-xs font-medium transition-colors ${
        href ? '' : 'cursor-default'
      } ${className}`}
    >
      {icon}
      {name}
    </span>
  );

  const scheda = href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-lg hover:text-brand-ink focus-visible:focus-ring"
    >
      {corpo}
    </a>
  ) : (
    corpo
  );

  if (!effect) return scheda;

  return (
    <HoverEmitter effect={effect} hintDelayMs={hintDelayMs}>
      {scheda}
    </HoverEmitter>
  );
}
