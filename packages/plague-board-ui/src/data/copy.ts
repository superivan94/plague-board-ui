/**
 * Il lessico dei Ludoratti: le parole di casa, ognuna accanto a quella generica che sostituisce.
 *
 * ⚠️ **È un dato, non un testo dentro un componente**, come {@link RAT_PHRASES}. La regola «nessun
 * componente contiene il testo di un'applicazione» resta intera: i componenti continuano a ricevere
 * le parole come prop, la libreria esporta il dizionario, e chi vuole la voce di casa lo applica —
 * chi non la vuole lo ignora e il pacchetto non se ne accorge.
 *
 * ⚠️ **Ogni voce porta il termine generico, e non è decorazione: è dove va messa.** Un dizionario
 * di sole parole di casa è un elenco di battute che nessuno sa dove mettere — «Torna nelle fogne»
 * da solo non dice che è il comando di uscita. Il generico è la chiave di ricerca umana: si cerca
 * la parola che si stava per scrivere e si trova la nostra.
 *
 * ⚠️ **In italiano, e non è una scelta rimandabile.** L'aggregatore parla italiano, la schermata di
 * accesso di RattInventario parla inglese («Initialize Plague Protocol», «Enter the plague
 * sequence»), e le due lingue non possono convivere in un dizionario solo: una frase tradotta a
 * metà è peggio di una non tradotta. Il giorno che servisse l'inglese, è un secondo dizionario con
 * le stesse chiavi, non un campo in più qui dentro.
 *
 * ⚠️ **È di casa, non di un'applicazione.** Vale la stessa riga che tiene {@link RAT_PHRASES}: qui
 * stanno i termini che **tutte e quattro** le app hanno — accedere, uscire, cercare, le
 * impostazioni. «I tuoi manuali» e «il tuo inventario» non ci stanno, perché sono di una sola, e
 * un'applicazione che vuole i suoi li tiene a casa propria e li **affianca** a questi.
 */

/** Una voce del lessico: la parola generica e quella di casa che le va al posto. */
export interface LudorattiTerm {
  /**
   * Il termine generico, quello che si sarebbe scritto senza pensarci.
   *
   * Serve a due cose: dice **dove** va usata la parola di casa, e resta l'etichetta da tenere
   * quando quella di casa non si può permettere — vedi l'avvertenza su `delete`.
   */
  readonly plain: string;
  /** La parola di casa, quella che si vede a schermo quando l'applicazione veste la voce. */
  readonly house: string;
}

/**
 * Il dizionario.
 *
 * ⚠️ **Tredici voci arrivano dalle app e non si ritoccano** — da `ludoratti.it` e dalla schermata
 * di accesso di RattInventario — per la stessa ragione per cui le frasi del ratto arrivano
 * invariate: riscriverle sarebbe riscrivere l'identità, che è la cosa che questa libreria deve
 * conservare. Sono `signIn`, `signOut`, `signUp`, `hasAccount`, `hasInvite`, `catalog`, `archive`,
 * `settings`, `social`, `roadmap`, `beta`, `payoff` e `support`.
 *
 * ⚠️ **Le altre dieci sono coniate qui**, il 2026-09-20, perché con le sole tredici il dizionario
 * copriva l'accesso e niente altro: un caricamento, un elenco vuoto e un errore sono le tre
 * schermate che un'applicazione mostra più spesso, e senza una parola nostra tornano a essere
 * quelle di chiunque.
 *
 * ⚠️ E le voci stanno **raggruppate per mestiere**, non per provenienza: chi cerca una parola parte
 * da dove la userebbe.
 */
export const LUDORATTI_COPY = {
  // ── L'accesso: sono le parole della schermata che le quattro app hanno identica ──────────────
  signIn: { plain: 'Accedi', house: 'Entra nella tana' },
  signOut: { plain: 'Esci', house: 'Torna nelle fogne' },
  signUp: { plain: 'Crea un account', house: 'Fonda la tua colonia' },
  hasAccount: { plain: 'Hai già un account?', house: 'Sei un Untore?' },
  hasInvite: { plain: 'Hai un invito?', house: 'Conosci una colonia?' },

  // ── Il posto: come si chiamano le zone in cui si entra ───────────────────────────────────────
  home: { plain: 'Home', house: 'Il covo' },
  catalog: { plain: 'Catalogo pubblico', house: 'I vettori ludici classificati' },
  archive: { plain: 'Archivio', house: 'L’Archivio Centrale delle conoscenze pestilenziali' },
  settings: { plain: 'Impostazioni', house: 'Parametri del Grande Piano' },
  profile: { plain: 'Il tuo profilo', house: 'La tua cartella clinica' },
  community: { plain: 'La community', house: 'La colonia' },
  social: { plain: 'Seguici', house: 'Il nostro covo social' },

  // ── La corporazione: le parole che parlano dei Ludoratti, non dell'applicazione ───────────────
  roadmap: { plain: 'Il progetto', house: 'Il Grande Piano' },
  beta: { plain: 'In lavorazione', house: 'Ceppo sperimentale · in incubazione' },
  payoff: {
    plain: 'La nostra missione',
    house: 'Costruiamo il futuro sotto una nuova, oscura cupola. Un topo alla volta.',
  },
  support: { plain: 'Offrimi un caffè', house: 'Offrimi una pozione' },

  // ── Gli stati: le tre schermate che un'applicazione mostra più spesso ─────────────────────────
  loading: { plain: 'Caricamento…', house: 'Incubazione in corso…' },
  empty: { plain: 'Nessun risultato', house: 'Nessuna traccia nelle fogne' },
  error: { plain: 'Qualcosa è andato storto', house: 'Il ceppo è degenerato' },

  // ── Le azioni ────────────────────────────────────────────────────────────────────────────────
  search: { plain: 'Cerca', house: 'Fiuta' },
  notifications: { plain: 'Notifiche', house: 'Focolai' },
  save: { plain: 'Salva', house: 'Sigilla' },
  /**
   * ⚠️ **Questa è l'unica voce che si usa col generico accanto, non al suo posto.** Un comando che
   * cancella per sempre deve dire che cosa fa a chi non conosce il nostro vocabolario: «Estingui»
   * è una bella parola e non è un'etichetta sufficiente da sola. La forma che regge è il titolo di
   * casa e la conferma in chiaro — «Estingui il ceppo · questa scheda verrà eliminata».
   */
  delete: { plain: 'Elimina', house: 'Estingui' },
} as const satisfies Record<string, LudorattiTerm>;

/**
 * Le chiavi del dizionario.
 *
 * ⚠️ Esiste perché il tipo sia **quello vero** e non `string`: un'applicazione che scrive
 * `LUDORATTI_COPY.signin` deve diventare rossa in compilazione, non restituire `undefined` a
 * schermo. È lo stesso motivo per cui il dizionario è `as const satisfies` e non annotato: il
 * `satisfies` controlla la forma di ogni voce, l'`as const` tiene le chiavi letterali.
 */
export type LudorattiTermKey = keyof typeof LUDORATTI_COPY;
