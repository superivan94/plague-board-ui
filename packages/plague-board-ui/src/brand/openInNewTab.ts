/**
 * Quel poco di finestra che serve ad aprire una scheda. È un'interfaccia e non `Window` per un
 * motivo solo: il ripiego si prova passando una finestra finta, e in jsdom `location.assign` non
 * si può spiare — la sua proprietà è dichiarata non riconfigurabile.
 */
export interface OpenableWindow {
  open(url: string, target: string): { opener: unknown } | null;
  location: { href: string };
}

/**
 * Apre `href` in una scheda nuova, e se le finestre nuove sono bloccate ripiega su questa.
 *
 * ⚠️ **Fra le opzioni non c'è `noopener`, ed è la sostanza di questa funzione.** Con quella parola
 * la specifica prescrive che `window.open` torni **`null` anche quando la scheda si è aperta**: il
 * ripiego qui sotto non avrebbe modo di distinguere il successo dal blocco, scatterebbe sempre, e
 * chi ha premuto si ritroverebbe la pagina delle donazioni **due volte** — in una scheda nuova e al
 * posto di quella da cui è partito. Segnalato dall'utente il 2026-09-20.
 *
 * Il legame con chi apre si recide subito dopo, azzerando `opener`: è la stessa protezione che dà
 * `noopener`, presa per un'altra strada. ⚠️ Il prezzo dichiarato è il `Referer`, che con
 * `noreferrer` non sarebbe partito e per questa via parte: verso una pagina di donazioni che sta
 * lì per essere raggiunta da noi, è un prezzo che si può pagare.
 */
export function openInNewTab(href: string, finestra: OpenableWindow): void {
  const scheda = finestra.open(href, '_blank');

  if (scheda) {
    scheda.opener = null;
    return;
  }

  // Un comando che di fronte a un blocco non fa niente sembra rotto: meglio andarci da qui.
  finestra.location.href = href;
}
