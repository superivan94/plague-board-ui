'use client';

import { type ReactNode, useRef, useState } from 'react';
import { usePress } from 'react-aria';

import { useRandomPhrase } from '../hooks/useRandomPhrase.js';
import { SpeechBubble } from './SpeechBubble.js';

export interface TalkingMascotProps {
  /** La faccia: un SVG, un `<img>`, quello che si vuole. La mascotte non ne disegna una sua. */
  children: ReactNode;
  /**
   * Le frasi fra cui pescare — {@link RAT_PHRASES}, {@link DEV_PHRASES} o le proprie.
   *
   * ⚠️ **Si passa un array stabile**, cioè una costante di modulo e non un letterale scritto in
   * linea: un array nuovo a ogni render cambia identità, e con lui il sorteggio.
   */
  phrases: readonly string[];
  /**
   * Il nome del comando — «Il ratto dei Ludoratti», «La mascotte».
   *
   * ⚠️ **Obbligatorio, e non è pignoleria.** Le icone della libreria sono **decorative**: portano
   * `aria-hidden` finché non gli si dà un `title`. Un pulsante che contiene solo un segno resta
   * quindi senza nome accessibile, cioè è un comando che esiste e non si sa che cos'è. Qui il nome
   * non dipende da che cosa capita di avvolgere.
   */
  label: string;
  /** Quanto resta il fumetto. Vedi {@link SpeechBubbleProps.autoHideMs}. */
  autoHideMs?: number;
  /** Classi aggiuntive sul contenitore. */
  className?: string;
}

/**
 * **La mascotte che al clic dice una frase.** Avvolge qualunque figlio: è il cablaggio fra
 * {@link useRandomPhrase} e {@link SpeechBubble}, che senza di lei ogni applicazione riscriverebbe.
 *
 * ⚠️ **Al clic, non al passaggio del mouse.** In RattInventario la mascotte parla su
 * `onMouseEnter`, e su un telefono quell'evento non arriva mai: l'easter egg è invisibile a chi
 * usa l'app dal telefono, che è la maggioranza.
 *
 * ⚠️ **Il grilletto è un `<button>` vero, e la pressione la gestisce `usePress` di `react-aria`**,
 * che è già fra le peer del pacchetto perché ci gira sopra HeroUI. Non è un vezzo: letto nel suo
 * sorgente, `usePress` aspetta il `click` per far scattare `onPress` — quindi da tastiera e da
 * mouse si comporta come un pulsante qualunque — ma se dopo il rilascio il `click` non arriva
 * entro 80ms **lo sintetizza lui**, perché iOS e Android non lo emettono dopo una pressione lunga.
 * Con un semplice `onClick`, tenere premuta la mascotte su un telefono non la fa parlare.
 *
 * ⚠️ **Il fumetto sta fuori dal pulsante.** Sono fratelli dentro lo stesso contenitore posizionato:
 * dentro, la frase diventerebbe contenuto del comando invece che un annuncio, e il grilletto
 * cambierebbe nome accessibile ogni volta che la mascotte apre bocca.
 */
export function TalkingMascot({
  children,
  phrases,
  label,
  autoHideMs,
  className = '',
}: TalkingMascotProps) {
  const { phrase, pick } = useRandomPhrase(phrases);
  // ⚠️ «Sta parlando» è uno stato di qui, non dell'hook: `useRandomPhrase` ricorda l'ultima frase
  // e non la dimentica più — è la memoria che gli serve per non ripeterla. Dire e *smettere di
  // dire* sono due cose, e la seconda è di chi rende il fumetto.
  const [isTalking, setIsTalking] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const { pressProps, isPressed } = usePress({
    ref: triggerRef,
    onPress: () => {
      pick();
      setIsTalking(true);
    },
  });

  return (
    <span className={`relative inline-flex ${className}`}>
      <button
        {...pressProps}
        ref={triggerRef}
        type="button"
        aria-label={label}
        // ⚠️ Nessuna traccia di pulsante addosso: niente fondo, niente rientro, niente altezza. Un
        // `Button` di HeroUI qui non va perché **ha una taglia** — `.button` è `h-10 px-4
        // rounded-3xl`, e la sua taglia `sm` arriva a imporre `size-4` agli SVG che contiene: un
        // segno da 56px ci entrerebbe a 16. L'anello di fuoco invece resta, perché è l'unica cosa
        // che dice a chi naviga da tastiera dove si trova.
        //
        // ⚠️ **L'anello è `brand-ink`, non `brand`.** Un indicatore di fuoco è grafica, e vuole 3
        // di contrasto sul fondo che lo circonda: il lime della corporazione su una pagina chiara
        // fa **1,38** e sparisce. Il token che cambia col tema fa **4,58** in chiaro e 13,35 in
        // scuro. Misurato il 2026-09-17 scrivendolo prima con `brand`.
        className={`inline-flex cursor-pointer rounded-lg transition-transform focus-visible:focus-ring motion-reduce:transition-none ${
          isPressed ? 'scale-95' : ''
        }`}
      >
        {children}
      </button>

      <SpeechBubble
        message={isTalking ? phrase : null}
        autoHideMs={autoHideMs}
        onHide={() => setIsTalking(false)}
      />
    </span>
  );
}
