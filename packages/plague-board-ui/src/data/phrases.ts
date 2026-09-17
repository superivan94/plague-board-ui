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
 * Le quattordici dello sviluppatore, dalla scheda autore di RattInventario. Sono la voce **umana**
 * della firma «umano e AI», e servono a `CreditCard`: il ratto dice squit, lo sviluppatore dice
 * che funzionava sul suo computer.
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
];
