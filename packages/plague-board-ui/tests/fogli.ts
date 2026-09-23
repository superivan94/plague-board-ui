import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Un foglio di `styles/`, **senza commenti**.
 *
 * ⚠️ Senza commenti perché i commenti di questi fogli nominano classi e variabili per spiegarle:
 * un guard che le cercasse nel testo intero le troverebbe anche dove non fanno niente. Il percorso
 * si ricava dalla cartella di lavoro per la stessa ragione di `sorgenti.ts`.
 */
const leggi = (nome: string) =>
  readFileSync(join(process.cwd(), 'styles', nome), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

export const animazioni: string = leggi('animations.css');
export const tema: string = leggi('theme.css');

/** Il corpo del blocco `{…}` che segue la prima `intestazione`, graffe annidate comprese. */
export function blocco(foglio: string, intestazione: string): string {
  const inizio = foglio.indexOf(intestazione);
  if (inizio < 0) throw new Error(`Nel foglio non c'è «${intestazione}»`);
  const apre = foglio.indexOf('{', inizio);
  let profondita = 0;
  for (let i = apre; i < foglio.length; i++) {
    if (foglio[i] === '{') profondita++;
    if (foglio[i] === '}' && --profondita === 0) return foglio.slice(apre + 1, i);
  }
  throw new Error(`Il blocco «${intestazione}» non si chiude`);
}

/**
 * I selettori che la regola di «meno movimento», in fondo ad `animations.css`, ferma.
 *
 * ⚠️ Serve perché le classi nostre quella regola non le prende da sé: `[class*='animate-']` vale
 * per le utility di Tailwind, e ogni classe che anima qualcosa va aggiunta a mano.
 */
export const fermatiDaMenoMovimento: string =
  /@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)\{\s*animation: none !important/.exec(animazioni)?.[1] ?? '';
