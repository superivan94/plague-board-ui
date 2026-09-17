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
 * Non esce da `src/index.ts`: sono classi di Tailwind, cioè un dettaglio di come la barra è fatta.
 */
export const PLAGUE_BAR_PADDING: Record<PlagueBarSize, string> = {
  small: 'py-2',
  medium: 'py-3',
  large: 'py-4',
};
