/**
 * Quel poco di finestra che serve ad aprire una scheda. È un'interfaccia e non `Window` per un
 * motivo solo: qui si prova anche il caso in cui la scheda **non** si apre, e per provarlo basta
 * passare una finestra finta.
 */
export interface OpenableWindow {
  open(url: string, target: string): { opener: unknown } | null;
}

/**
 * Apre `href` in una scheda nuova. Torna `false` se il browser non l'ha aperta.
 *
 * ⚠️ **Fra le opzioni non c'è `noopener`, ed è metà della sostanza di questa funzione.** Con quella
 * parola la specifica prescrive che `window.open` torni **`null` anche quando la scheda si è
 * aperta**: chi guarda il valore di ritorno non distinguerebbe più il successo dal blocco.
 * Segnalato dall'utente il 2026-09-20, che vedeva aprirsi **due** pagine di donazioni.
 *
 * Il legame con chi apre si recide subito dopo, azzerando `opener`: è la stessa protezione che dà
 * `noopener`, presa per un'altra strada. ⚠️ Il prezzo dichiarato è il `Referer`, che con
 * `noreferrer` non sarebbe partito e per questa via parte: verso una pagina di donazioni che sta
 * lì per essere raggiunta da noi, è un prezzo che si può pagare.
 *
 * ⚠️ **E quando la scheda non si apre, qui non succede nient'altro** — l'altra metà. La via che
 * viene in mente, portare _questa_ pagina all'indirizzo, è la peggiore di tutte: chi ha premuto un
 * comando in un piede perde lo stato dell'applicazione in cui stava lavorando. Chi chiama guarda
 * il `false` e decide; nel nostro caso {@link SupportButton} smette di trattenere il clic, così il
 * successivo apre col gesto vero, che nessun browser blocca.
 */
export function openInNewTab(href: string, finestra: OpenableWindow): boolean {
  const scheda = finestra.open(href, '_blank');

  if (!scheda) return false;

  scheda.opener = null;
  return true;
}
