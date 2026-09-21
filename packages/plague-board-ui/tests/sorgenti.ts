import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// ⚠️ Il percorso si ricava dalla cartella di lavoro e non da `import.meta.url`: i test girano in
// jsdom, dove quell'URL è un `http://localhost/…` e `fileURLToPath` lo rifiuta. Che la cartella sia
// quella giusta lo verifica il primo caso di ogni guard che legge queste liste — un guard che
// scandaglia zero file è verde per costruzione.
const SRC = join(process.cwd(), 'src');

/** Un modulo della libreria: il suo testo, e il nome con cui un `import` lo nomina. */
export interface Sorgente {
  /** Il percorso dentro `src/`, sempre con le barre avanti: su Windows `readdirSync` le rovescia. */
  readonly name: string;
  /** Lo stesso percorso senza estensione, che è come lo scrive un `from './…'`. */
  readonly module: string;
  readonly text: string;
}

/**
 * Tutti i sorgenti di `src/`, `index.ts` compreso.
 *
 * ⚠️ Sta in un file a parte perché al terzo guard che scandaglia l'albero — il confine
 * server/client, l'anello di fuoco, la superficie pubblica — tre copie della stessa lettura sono
 * la cosa che la regola sul copiare vieta.
 */
export const sorgenti: readonly Sorgente[] = readdirSync(SRC, {
  recursive: true,
  encoding: 'utf8',
})
  .filter((name) => name.endsWith('.ts') || name.endsWith('.tsx'))
  .map((name) => name.split('\\').join('/'))
  .sort()
  .map((name) => ({
    name,
    module: name.replace(/\.tsx?$/, ''),
    text: readFileSync(join(SRC, name), 'utf8'),
  }));

/** Il testo di `src/index.ts`. Vuoto vuol dire che la cartella non è quella giusta. */
export const indice: string = sorgenti.find(({ name }) => name === 'index.ts')?.text ?? '';

/**
 * Una clausola di riesportazione dell'indice, nelle due forme che ci stanno dentro:
 * `export { A, type B } from './x';` e `export type { C } from './y';`, su una riga o su molte.
 *
 * ⚠️ Quello che questa espressione **non** riconosce non è un buco silenzioso: il guard conta le
 * clausole lette contro le righe che cominciano per `export`, quindi una forma nuova lo fa
 * diventare rosso invece di sfuggirgli.
 */
const CLAUSOLA = /^export\s+(type\s+)?\{([\s\S]*?)\}\s*from\s*'([^']+)';/gm;

/** Un nome che esce dall'indice. Quello che non sta qui non esiste per chi installa il pacchetto. */
export interface Pubblico {
  readonly name: string;
  /** Il modulo da cui esce, nella forma di {@link Sorgente.module}: senza `./` e senza estensione. */
  readonly module: string;
  /** Se esce come tipo — `type X` — cioè se di lui a runtime non resta niente. */
  readonly isType: boolean;
}

const clausole = [...indice.matchAll(CLAUSOLA)];

/** Da dove riesporta l'indice, una voce per clausola e nell'ordine in cui stanno scritte. */
export const moduliRiesportati: readonly string[] = clausole.map(([, , , from]) => from);

/** La superficie pubblica: ogni nome che esce dall'indice, col modulo che lo tiene. */
export const superficie: readonly Pubblico[] = clausole.flatMap(([, tipo, nomi, from]) =>
  nomi
    .split(',')
    .map((pezzo) => pezzo.trim())
    .filter((pezzo) => pezzo.length > 0)
    .map((pezzo) => ({
      name: pezzo.replace(/^type\s+/, ''),
      module: from.replace(/^\.\//, ''),
      isType: Boolean(tipo) || pezzo.startsWith('type '),
    })),
);

/**
 * I componenti pubblici: un nome che è anche il nome del suo file.
 *
 * È la definizione esatta invece di una regola sulle maiuscole — `RAT_LIVERIES` esce da `Rat.tsx` e
 * un componente non è — ed è la lista che il guard delle storie leggerà: ogni componente ha la sua
 * storia, ogni storia nomina un componente che esiste. I due guard chiudono lo stesso anello dai
 * due lati.
 */
export const componenti: readonly Pubblico[] = superficie.filter(
  ({ name, module, isType }) => !isType && module.split('/').at(-1) === name,
);
