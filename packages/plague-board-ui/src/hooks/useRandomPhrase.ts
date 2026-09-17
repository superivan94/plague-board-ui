'use client';

import { useCallback, useState } from 'react';

export interface RandomPhrase {
  /** Quella detta per ultima, o `null` finché non si è chiesto niente. */
  phrase: string | null;
  /** Ne pesca un'altra. ⚠️ Non è quella di adesso, salvo che non ce ne siano altre. */
  pick: () => void;
}

/**
 * **Pesca una frase a caso, e non ripete quella appena detta.** È il meccanismo dietro la mascotte
 * che parla: chi lo usa gli passa le frasi che vuole — {@link RAT_PHRASES} per la voce del ratto,
 * le sue per qualunque altra cosa — e il mostrarle è affare di chi rende il fumetto.
 *
 * ⚠️ **L'array si passa stabile**, cioè una costante di modulo e non un letterale scritto in linea.
 * Un array nuovo a ogni render cambia identità, e con lui `pick`: chi la mette fra le dipendenze di
 * un effetto se lo ritrova che riparte di continuo. È il difetto dell'originale di RattInventario,
 * dove l'array stava **dentro** il corpo dell'hook.
 *
 * ⚠️ **«Non ripete l'ultima» non si ottiene estraendo finché non esce diversa.** Quel ciclo con una
 * frase sola non esce mai, ed è la ragione per cui l'originale si difendeva con una condizione in
 * più che però guardava la visibilità del fumetto — cioè smetteva di valere proprio mentre il
 * fumetto era aperto. Qui si sceglie fra **le frasi che restano**: se non ne restano, si tiene
 * quella che c'è, e non c'è nessun ciclo da terminare.
 */
export function useRandomPhrase(phrases: readonly string[]): RandomPhrase {
  const [phrase, setPhrase] = useState<string | null>(null);

  const pick = useCallback(() => {
    // ⚠️ Aggiornamento funzionale, non `phrase` letta dalla chiusura: è ciò che tiene `pick` fuori
    // dalle dipendenze della frase corrente, e quindi stabile fra un render e l'altro.
    setPhrase((current) => {
      const rimaste = current === null ? phrases : phrases.filter((altra) => altra !== current);
      if (rimaste.length === 0) return current;

      return rimaste[Math.floor(Math.random() * rimaste.length)];
    });
  }, [phrases]);

  return { phrase, pick };
}
