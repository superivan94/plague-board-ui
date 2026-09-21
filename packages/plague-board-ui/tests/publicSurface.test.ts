import { existsSync, readFileSync } from 'node:fs';
import { join, posix } from 'node:path';
import { describe, expect, it } from 'vitest';

import { componenti, indice, moduliRiesportati, sorgenti, superficie } from './sorgenti';

/** I moduli che l'indice manda fuori: tutto il resto di `src/` è roba di casa. */
const pubblici = new Set(superficie.map(({ module }) => module));

/**
 * I file con l'iniziale maiuscola: per convenzione tengono un componente, e un componente esiste
 * per essere montato da fuori.
 *
 * ⚠️ La convenzione vale in **un** verso solo, e non è un'imprecisione: un file minuscolo può
 * essere pubblico — `hoverEffects.ts`, `plagueBarSizes.ts`, `toxicLevel.ts` escono tutti — perché
 * lì dentro ci sono dati e ganci, non componenti. È il maiuscolo a promettere qualcosa.
 */
const conIniziale = sorgenti.filter(({ name }) => /^[A-Z]/.test(name.split('/').at(-1) ?? ''));

/** I moduli di casa: quelli che l'indice non nomina. */
const privati = sorgenti.filter(({ name, module }) => name !== 'index.ts' && !pubblici.has(module));

/** Ogni modulo nominato da un `from './…'` o `from '../…'` di un altro sorgente. */
const importati = new Set(
  sorgenti.flatMap(({ name, text }) =>
    [...text.matchAll(/from '(\.[^']*)'/g)].map(([, spec]) =>
      posix.normalize(posix.join(posix.dirname(name), spec)),
    ),
  ),
);

const PACCHETTO: {
  readonly files: readonly string[];
  readonly exports: Readonly<Record<string, unknown>>;
} = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));

/** Gli indirizzi che `exports` promette, appiattiti: le voci sono una stringa o un oggetto. */
const promesse = Object.values(PACCHETTO.exports).flatMap((voce) =>
  typeof voce === 'string' ? [voce] : Object.values(voce as Record<string, string>),
);

describe('la superficie pubblica', () => {
  it('trova i sorgenti e legge tutto l’indice', () => {
    // Un guard che scandaglia zero file è verde per costruzione, e questo ne ha due modi di
    // esserlo: la cartella sbagliata, e un'espressione che non riconosce le clausole che legge.
    expect(sorgenti.length).toBeGreaterThan(5);
    expect(superficie.length).toBeGreaterThan(50);
    expect(componenti.length).toBeGreaterThan(30);

    // ⚠️ Il conto è la parte che tiene in piedi tutti i casi qui sotto. Una clausola scritta in
    // una forma che il lettore non riconosce — `export * from`, un `as`, un default — non
    // farebbe fallire niente: renderebbe **invisibile** quel pezzo di superficie, e i casi sui
    // nomi passerebbero perché quei nomi non ci sono mai arrivati.
    const righe = indice.match(/^export\b/gm) ?? [];
    expect(moduliRiesportati).toHaveLength(righe.length);
  });

  it.each(conIniziale)('$name esce dall’indice', ({ name, module, text }) => {
    // ⚠️ È il caso del pezzo perso, e il modo in cui si perde non somiglia a un difetto: un
    // componente scritto, provato e non aggiunto all'indice **funziona** — i suoi test lo montano
    // dal file, il playground lo vede attraverso il workspace — e l'unica cosa che non fa è
    // esistere per chi installa il pacchetto. Nessuna build diventa rossa.
    //
    // L'alternativa legittima non è spegnere questo caso: è **il nome del file**. Un pezzo che
    // deve restare di casa comincia minuscolo — `effectLayer.tsx`, `plagueChatter.tsx`,
    // `iconBase.tsx` — e questa lista non lo guarda nemmeno. La maiuscola è la promessa.
    const nome = (name.split('/').at(-1) ?? '').replace(/\.tsx?$/, '');

    expect(text).toMatch(new RegExp(`^export (?:function|const|class) ${nome}\\b`, 'm'));
    expect(superficie).toContainEqual({ name: nome, module, isType: false });
  });

  it.each(sorgenti.filter(({ module }) => pubblici.has(module)))(
    '$name manda fuori i tipi delle sue prop',
    ({ module, text }) => {
      // ⚠️ Un componente esportato senza il suo `…Props` è usabile e non è **avvolgibile**: chi
      // installa non può scrivere la firma di un componente che lo contiene, né uno spread tipato,
      // e si ritrova a ricopiare le prop a mano. Costa una parola in una riga già scritta, e si
      // dimentica proprio per quello.
      const dichiarati = [...text.matchAll(/^export (?:interface|type) ([A-Za-z0-9_]*Props)\b/gm)];

      for (const [, nome] of dichiarati) {
        expect(superficie).toContainEqual({ name: nome, module, isType: true });
      }
    },
  );

  it('l’indice non riesporta a blocco', () => {
    // ⚠️ `export *` non è una scorciatoia: è la differenza fra un elenco e una domanda. Con
    // l'asterisco la superficie pubblica diventa «tutto quello che quel file esporta oggi», quindi
    // una costante interna aggiunta domani esce da sé — e il confine del 2026-09-20, dove sette
    // icone di dominio sono state scritte e poi tolte, si sarebbe deciso senza che nessuno lo
    // vedesse in un diff.
    expect(indice).not.toMatch(/^export\s+\*/m);
  });

  it.each(moduliRiesportati)('l’indice riesporta roba nostra: %s', (from) => {
    // Un `export { Button } from '@heroui/react'` compila e sembra un servizio a chi installa. È
    // invece una seconda identità per lo stesso componente: chi lo importa da qui non riconosce
    // più il suo come lo stesso pezzo, e la libreria si mette a promettere l'API di qualcun altro.
    // Le peer si dichiarano, non si riesportano.
    expect(from.startsWith('./')).toBe(true);
  });

  it.each(privati)('$name non resta orfano', ({ module }) => {
    // Un modulo che non esce dall'indice e che nessuno importa è peso morto che compila, passa i
    // test e **viene spedito**: `tsconfig.build.json` compila tutto `src/`, quindi finisce in
    // `dist/` e nel tarball. Si trova solo guardando l'albero da fuori.
    expect([...importati]).toContain(module);
  });

  it('il pacchetto non apre porte di servizio', () => {
    // ⚠️ Senza questo caso, tutto quello che sta sopra difende una regola che `package.json` può
    // annullare in una riga: con un `"./*": "./dist/*"` fra gli `exports`, un
    // `import … from 'plague-board-ui/dist/brand/effectLayer'` funziona, e `src/index.ts` non è
    // più l'unica porta — è solo la più comoda.
    for (const chiave of Object.keys(PACCHETTO.exports)) {
      expect(chiave).not.toContain('*');
    }
    for (const indirizzo of promesse) {
      expect(indirizzo).not.toContain('*');
    }

    expect(PACCHETTO.exports['.']).toStrictEqual({
      types: './dist/index.d.ts',
      default: './dist/index.js',
    });
  });

  it.each(promesse)('`exports` promette %s, e `files` lo spedisce', (indirizzo) => {
    // ⚠️ `files` e `exports` sono due elenchi che parlano della stessa cosa e non si controllano a
    // vicenda: un indirizzo promesso e non spedito è un `Cannot find module` a casa di chi
    // installa, e in casa nostra non si vede — qui il file c'è, ed è il tarball a non averlo.
    // Misurato con `npm pack --dry-run`, che è l'unico posto dove la differenza si vede.
    const radice = indirizzo.replace(/^\.\//, '').split('/')[0];

    expect(PACCHETTO.files).toContain(radice);
    // `dist/` lo fabbrica la build, e i test girano anche prima: di quello si prova la promessa,
    // non il file.
    if (radice !== 'dist') {
      expect(existsSync(join(process.cwd(), indirizzo))).toBe(true);
    }
  });

  it.each(PACCHETTO.files)('`files` non spedisce un indirizzo che non c’è: %s', (voce) => {
    // L'altro verso, e quello che ha trovato qualcosa: `README.md` e `LICENSE` erano in questa
    // lista e **non nella cartella del pacchetto** — stanno nella radice del repository, dove npm
    // non guarda. Il tarball usciva senza documentazione e senza il testo della licenza, che per un
    // pacchetto non commerciale è la cosa che dice a chi lo installa cosa può farne.
    expect(existsSync(join(process.cwd(), voce))).toBe(true);
  });
});
