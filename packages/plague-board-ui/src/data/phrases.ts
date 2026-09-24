/**
 * Le frasi di casa dei Ludoratti.
 *
 * ⚠️ **Sono un dato, non un componente**, e stanno in un modulo che non dichiara `'use client'`:
 * il meccanismo che ne pesca una è `useRandomPhrase`, e sta altrove. Chi vuole la voce dei
 * Ludoratti prende questi array; chi vuole solo il meccanismo passa i suoi.
 *
 * ⚠️ **Sono di casa, non di un'applicazione.** Nominano la Rattoteca e i LudoRatti perché sono la
 * voce della corporazione, che è la stessa in tutte e quattro le app. Il giorno in cui una frase
 * parlasse di manuali, catalogo o inventario, quella frase non starebbe più qui.
 */

/**
 * Le diciannove del ratto, portate da `useRatPhrases` di RattInventario **senza ritoccarle**:
 * riscriverle sarebbe riscrivere l'identità, che è la cosa che questa libreria deve conservare.
 *
 * ⚠️ Due avvertenze per chi le rilegge e le crede sbagliate:
 * - **«Preparatti» è voluto** — è «preparatevi» coi ratti dentro, non un refuso;
 * - **le ultime due si parlano fra loro**: una indica a destra e l'altra risponde da sinistra.
 *   Pescate a caso e da sole, la freccia non indica niente. Vanno bene dove di mascotte ce ne sono
 *   due, e chi ne ha una sola farebbe meglio a passarle un sottoinsieme.
 */
export const RAT_PHRASES: readonly string[] = [
  'Squit!',
  'Execute order E.',
  'Corvax, rendi tutti pazzi per giochi da tavolo',
  'Squit squit!',
  "È solo l'inizio... 🏭",
  'Preparatti per la grande invasione!',
  'Ogni gioco ha bisogno di un ratto!',
  "Squit-squadra, all'attacco!",
  'La Rattoteca deve espandersi...',
  "Diffondete la passione... e null'altro! 🦠",
  'I LudoRatti dominano il mondo!',
  'Squit! Squit! SQUIT!',
  'Psst... hai visto qualche gioco interessante?',
  'Il magazzino ha sempre nuove sorprese...',
  'Un vero ratto non abbandona mai la partita!',
  'Sssh... sto organizzando la prossima scorribanda!',
  'Una pizza quattro formaggi! 🧀',
  'Strofinati il muso...➡️',
  '...⬅️ Una bella stretta di zampa!',
];

/**
 * Le frasi dello sviluppatore. Sono la voce **umana** della firma «umano e AI», e servono a
 * `CreditCard`: il ratto dice squit, lo sviluppatore dice che funzionava sul suo computer.
 *
 * ⚠️ **Le prime quattordici vengono dalla scheda autore di RattInventario e non si toccano**; le
 * otto in fondo sono nuove, chieste dall'utente il 2026-09-19 perché con quattordici sole
 * l'easter egg si ripeteva sotto gli occhi di chi guardava. Un emettitore ne fa uscire una ogni
 * 1,2 secondi: chi resta col puntatore fermo dieci secondi ne vede otto, e il mazzo deve essere
 * abbastanza grosso da non sembrare corto. ⚠️ Sono di casa, non di un'applicazione: parlano del
 * mestiere, non di manuali o di inventario.
 *
 * ⚠️ **E sono corte apposta.** Il fumetto di `comicBubbles` non manda a capo: una frase più larga
 * del riquadro si scrive sul niente. La più lunga qui dentro è di RattInventario — «SONO UN MAGO
 * DELLA PROGRAMMAZIONE!» — e misurata sul browser vero occupa **179 px**: sui 180 di là era un
 * pixel dal bordo, ed è il motivo per cui `.pb-comic-bubble` adesso ne dichiara 200. Una frase
 * nuova si **misura**, non si conta a occhio; il caso in `useRandomPhrase.test.ts` guarda i
 * caratteri, che è tutto quello che jsdom può fare.
 */
export const DEV_PHRASES: readonly string[] = [
  'Mannaggia perché non va!',
  'Ma sono Pr0!',
  'È un bug o una feature?',
  'CTRL+S, CTRL+S',
  'Funzionava sul mio computer...',
  'Chi ha toccato il mio codice?!',
  'Ok, ora del caffè.',
  'Sarà colpa del caching, sicuro.',
  'git blame... ah, sono stato io.',
  'EVVAI! FUNZIONA!',
  "L'ho fixato con una riga.",
  'SONO UN MAGO DELLA PROGRAMMAZIONE!',
  'Deploy in produzione, YOLO!',
  'Ma perché `null` è un `object`???',
  'Compila! Non chiedermi perché.',
  'Non è un bug, è retrocompatibilità.',
  'Ho solo aggiornato una dipendenza...',
  "Ce l'ho quasi, manca una cosa sola.",
  'Tre ore per una virgola.',
  'Basta un console.log e capiamo tutto.',
  'Merge senza conflitti. Oggi si vola.',
  'Rifattorizzo domani, promesso.',
];
