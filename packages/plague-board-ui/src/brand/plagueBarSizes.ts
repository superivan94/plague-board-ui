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
 * **La stessa misura, detta in classe invece che in numero**, per le barre che si compattano sul
 * telefono: `<RatIcon size={PLAGUE_BAR_MARK_SIZE[size]} className={PLAGUE_BAR_MARK_CLASS[size]} />`.
 *
 * ⚠️ **Serve perché un numero non risponde a una media query, e una classe sì.** `width` e
 * `height` di un `<svg>` sono proprietà **geometriche**: una regola CSS le sostituisce, ed è
 * l'unico modo di far rimpicciolire un segno che il componente ha già stampato. Il numero resta
 * la verità di chi non compatta.
 *
 * ⚠️ **Chi la dimentica non rompe niente**: il marchio resta grande anche sul telefono, che è il
 * modo giusto in cui una dimenticanza dovrebbe fallire. È lo stesso patto del `@container` che
 * serve alla firma — senza, la firma resta semplicemente lunga.
 */
export const PLAGUE_BAR_MARK_CLASS: Record<PlagueBarSize, string> = {
  small: 'size-5',
  medium: 'size-5 pb-roomy:size-6',
  large: 'size-5 pb-roomy:size-8',
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
 * Lo stesso rientro **per una lastra che sul telefono torna `small`**, che è ciò che
 * `isCompactOnMobile` accende — di default, su {@link PlagueBar} e su {@link PlagueFootBar}.
 *
 * Ogni voce è una frase di due parole: la prima è la taglia piccola e vale sempre, la seconda la
 * taglia dichiarata e vale **solo dove c'è posto**. `small` non ha la seconda, perché non c'è
 * niente da ripristinare.
 *
 * ⚠️ **Scritta mobile-first, e non è una preferenza di stile.** Con la taglia piena di base e la
 * compattazione in una `max-*`, chi vince dipenderebbe dall'**ordine** delle due regole nel CSS
 * generato — una media query non aggiunge specificità. Così invece la variante arriva sempre
 * dopo, e se un giorno sparisse la barra resterebbe compatta ovunque invece di restare grande sul
 * telefono: l'errore si vede, e dalla parte giusta.
 *
 * ⚠️ **Le classi vanno scritte per esteso, una per una.** Tailwind cerca le classi nel testo dei
 * file: `'pb-roomy:' + PLAGUE_BAR_PADDING[placement][size]` darebbe la stringa giusta e **nessuna
 * regola**, perché quella stringa non compare da nessuna parte. È il prezzo di questa tabella, ed
 * è il motivo per cui è una tabella e non una funzione.
 *
 * ⚠️ E la soglia è larghezza **e** altezza — `pb-roomy` in `theme.css`. Un telefono coricato è
 * largo 844 px e alto 390: guardando la sola larghezza, il posto dove lo spazio verticale è più
 * scarso di tutti sarebbe l'unico a non compattare.
 */
export const PLAGUE_BAR_COMPACT_PADDING: Record<PlagueBarPlacement, Record<PlagueBarSize, string>> = {
  top: {
    small: 'py-2',
    medium: 'py-2 pb-roomy:py-3',
    large: 'py-2 pb-roomy:py-4',
  },
  bottom: {
    small: 'py-1',
    medium: 'py-1 pb-roomy:py-2',
    large: 'py-1 pb-roomy:py-3',
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
 * Gli stessi due segni **per un piede che si compatta sul telefono**: il gemello di
 * {@link PLAGUE_BAR_MARK_CLASS}, e vale per la stessa ragione.
 *
 * `mark` lo applica {@link PlagueFootBar} da sé quando `isCompactOnMobile` è acceso — ma **solo al
 * segno predefinito**, perché di un'icona che arriva da fuori non conosce né la misura né il modo
 * in cui la porta. `authorMark` lo passa chi scrive la firma, accanto al numero:
 * `<CodeIcon size={PLAGUE_FOOT_MARK_SIZE[size].authorMark} className={PLAGUE_FOOT_MARK_CLASS[size].authorMark} />`.
 */
export const PLAGUE_FOOT_MARK_CLASS: Record<PlagueBarSize, { mark: string; authorMark: string }> = {
  small: { mark: 'size-5', authorMark: 'size-3.5' },
  medium: { mark: 'size-5 pb-roomy:size-[22px]', authorMark: 'size-3.5 pb-roomy:size-4' },
  large: { mark: 'size-5 pb-roomy:size-[26px]', authorMark: 'size-3.5 pb-roomy:size-[18px]' },
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

/**
 * Il rientro dell'incavo **per una lastra che sul telefono torna `small`**: la stessa frase in due
 * parole di {@link PLAGUE_BAR_COMPACT_PADDING}.
 *
 * ⚠️ **È la metà che si dimenticherebbe.** Un telefono con l'orecchia è esattamente il posto dove
 * la lastra compatta, quindi lasciare qui la taglia piena vorrebbe dire sommare l'incavo al
 * rientro **grande** proprio dove si volevano togliere pixel — e nei due modi la lastra
 * misurerebbe uguale, che è il difetto peggiore: silenzioso.
 */
export const PLAGUE_BAR_COMPACT_SAFE_PADDING: Record<PlagueBarPlacement, Record<PlagueBarSize, string>> = {
  top: {
    small: 'pt-[calc(var(--spacing)*2_+_env(safe-area-inset-top))]',
    medium:
      'pt-[calc(var(--spacing)*2_+_env(safe-area-inset-top))] pb-roomy:pt-[calc(var(--spacing)*3_+_env(safe-area-inset-top))]',
    large:
      'pt-[calc(var(--spacing)*2_+_env(safe-area-inset-top))] pb-roomy:pt-[calc(var(--spacing)*4_+_env(safe-area-inset-top))]',
  },
  bottom: {
    small: 'pb-[calc(var(--spacing)*1_+_env(safe-area-inset-bottom))]',
    medium:
      'pb-[calc(var(--spacing)*1_+_env(safe-area-inset-bottom))] pb-roomy:pb-[calc(var(--spacing)*2_+_env(safe-area-inset-bottom))]',
    large:
      'pb-[calc(var(--spacing)*1_+_env(safe-area-inset-bottom))] pb-roomy:pb-[calc(var(--spacing)*3_+_env(safe-area-inset-bottom))]',
  },
};
