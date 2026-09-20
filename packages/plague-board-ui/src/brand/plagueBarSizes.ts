/**
 * Le misure della barra, in un modulo **senza** `'use client'`.
 *
 * ⚠️ **Non è pignoleria di organizzazione: è l'unico posto dove possono stare.** Un modulo che
 * dichiara `'use client'` non consegna a un componente server i valori che esporta — gli consegna
 * un **riferimento** a quel modulo, che React risolverà sul client. Per un componente va bene, è
 * esattamente il meccanismo; per una tabella di numeri no: chi la indicizza da una pagina server
 * ottiene `undefined`, senza errori e senza build rossa. Misurato il 2026-09-17 leggendo la pagina
 * `/barra` del playground, dove l'etichetta diceva «segno px» col numero mancante.
 */

/** Le tre altezze della barra: 36, 48 e 64 pixel di riga, più il filo del bordo. */
export type PlagueBarSize = 'small' | 'medium' | 'large';

/**
 * A quale estremità della pagina sta la lastra.
 *
 * ⚠️ Sta qui e non in `PlagueBar.tsx` per la stessa ragione delle tabelle: da lì dentro non
 * potrebbe indicizzarle senza tirarsi dietro un modulo `'use client'`.
 */
export type PlagueBarPlacement = 'top' | 'bottom';

/**
 * **Quanto è grande il segno del marchio dentro una barra di quella taglia.** Non è una misura che
 * la barra impone — non sa nemmeno di avere un marchio dentro — è quella che chi lo mette dovrebbe
 * usare perché la riga torni: `<RatIcon size={PLAGUE_BAR_MARK_SIZE[size]} />`.
 *
 * ⚠️ **Il 20 della compatta è un pavimento misurato, non un gusto**: sotto quella misura il tratto
 * interno di `RatIcon` scende sotto il pixel e il cuore diventa un graffio. È il motivo per cui
 * `small` accorcia la barra di 12px ma il segno solo di 4.
 */
export const PLAGUE_BAR_MARK_SIZE: Record<PlagueBarSize, number> = {
  small: 20,
  medium: 24,
  large: 32,
};

/**
 * ⚠️ **Solo verticale.** L'altezza è l'unica misura che la barra possiede: quanto è larga la
 * colonna dentro — `mx-auto`, `max-w-*`, il rientro laterale — lo decide chi la usa, perché
 * dipende dalla pagina e non dalla barra. Se anche il contenuto porta il suo `py`, le due
 * spaziature si sommano e la taglia smette di voler dire qualcosa.
 *
 * ⚠️ **A parità di taglia la lastra in fondo rientra di meno di quella in cima**, di un gradino
 * esatto: 4, 8 e 12 px per lato invece di 8, 12 e 16. Non è un'eccezione. Un'intestazione è il
 * posto da cui si parte e regge lo spazio che ha; un piede è una firma, e su una lastra
 * appiccicata ogni pixel che prende è un pixel tolto alla pagina **a ogni schermata**. Col
 * contenuto che {@link PlagueFootBar} monta, le tre taglie misurano **35, 45 e 57 px** — prima di
 * questo scarto la più piccola ne faceva 45. Chiesto dall'utente il 2026-09-20, che voleva le tre
 * taglie del piede «come quelle dell'header».
 *
 * Non esce da `src/index.ts`: sono classi di Tailwind, cioè un dettaglio di come la barra è fatta.
 */
export const PLAGUE_BAR_PADDING: Record<PlagueBarPlacement, Record<PlagueBarSize, string>> = {
  top: {
    small: 'py-2',
    medium: 'py-3',
    large: 'py-4',
  },
  bottom: {
    small: 'py-1',
    medium: 'py-2',
    large: 'py-3',
  },
};

/**
 * **Quanto è grande il segno dentro un piede di quella taglia**: il gemello di
 * {@link PLAGUE_BAR_MARK_SIZE}, e vale per la stessa ragione — la lastra non può ridimensionare un
 * `<svg>` che non conosce, quindi la misura giusta si legge da qui.
 *
 * `mark` è il segno del comando donazioni, che {@link PlagueFootBar} applica da sé; `authorMark` è
 * quello di una scheda autore, che arriva dall'applicazione insieme al nome e quindi lo passa chi
 * scrive la firma — `<CodeIcon size={PLAGUE_FOOT_MARK_SIZE.medium.authorMark} />`.
 *
 * ⚠️ **Il segno del comando è più grande del testo che gli sta accanto, in tutte e tre le taglie.**
 * Quando la riga si stringe il testo sparisce e resta lui solo: è il pezzo che deve reggere da
 * solo, e va dimensionato per primo.
 */
export const PLAGUE_FOOT_MARK_SIZE: Record<PlagueBarSize, { mark: number; authorMark: number }> = {
  small: { mark: 20, authorMark: 14 },
  medium: { mark: 22, authorMark: 16 },
  large: { mark: 26, authorMark: 18 },
};

/**
 * Lo stesso rientro **più l'incavo del dispositivo**, dal lato in cui la lastra tocca il bordo
 * dello schermo: in cima l'orecchia della fotocamera, in fondo la barra del gesto.
 *
 * ⚠️ **Si somma al rientro, non lo sostituisce.** `env(safe-area-inset-*)` da solo metterebbe il
 * contenuto a filo della lastra su un telefono senza incavo, dove quel valore è **zero**: il
 * `calc` tiene la taglia e ci aggiunge quello che serve. Tailwind ordina le utility di un lato
 * dopo quelle di un asse, quindi questa vince su `py-*` comunque le si scriva.
 *
 * ⚠️ **Vale solo se la pagina dichiara `viewport-fit=cover`.** Senza, il browser tiene già il
 * contenuto lontano dagli incavi e quei valori restano a zero — che non fa danno, ma nemmeno
 * niente: è il motivo per cui il playground lo dichiara in `layout.tsx`.
 */
export const PLAGUE_BAR_SAFE_PADDING: Record<'top' | 'bottom', Record<PlagueBarSize, string>> = {
  top: {
    small: 'pt-[calc(var(--spacing)*2_+_env(safe-area-inset-top))]',
    medium: 'pt-[calc(var(--spacing)*3_+_env(safe-area-inset-top))]',
    large: 'pt-[calc(var(--spacing)*4_+_env(safe-area-inset-top))]',
  },
  bottom: {
    small: 'pb-[calc(var(--spacing)*1_+_env(safe-area-inset-bottom))]',
    medium: 'pb-[calc(var(--spacing)*2_+_env(safe-area-inset-bottom))]',
    large: 'pb-[calc(var(--spacing)*3_+_env(safe-area-inset-bottom))]',
  },
};
