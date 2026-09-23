import ts from 'typescript';
import { describe, expect, it } from 'vitest';

import { sorgenti, superficie } from './sorgenti';

/** Il nome con cui una dichiarazione di primo livello si fa trovare, e la dichiarazione. */
type Dichiarata = readonly [string, ts.Node];

/** Le dichiarazioni di primo livello di un modulo, una voce per nome. */
function dichiarazioni(file: string, testo: string): ReadonlyMap<string, ts.Node> {
  const albero = ts.createSourceFile(file, testo, ts.ScriptTarget.Latest, true);

  return new Map(
    albero.statements.flatMap((istruzione): Dichiarata[] => {
      if (ts.isVariableStatement(istruzione)) {
        return istruzione.declarationList.declarations.map((d) => [d.name.getText(albero), d]);
      }
      if (
        ts.isFunctionDeclaration(istruzione) ||
        ts.isInterfaceDeclaration(istruzione) ||
        ts.isTypeAliasDeclaration(istruzione)
      ) {
        return istruzione.name ? [[istruzione.name.text, istruzione]] : [];
      }
      return [];
    }),
  );
}

const moduli = new Map(sorgenti.map(({ name, module, text }) => [module, dichiarazioni(name, text)]));

/** Ogni nome pubblico con la sua dichiarazione; `undefined` vuol dire che il lettore non l'ha vista. */
const pubblici = superficie.map((voce) => ({ ...voce, nodo: moduli.get(voce.module)?.get(voce.name) }));

/**
 * Se il nodo porta un blocco `/** … *\/` che `tsc` gli attacca, cioè che finirà nel `.d.ts`.
 *
 * ⚠️ `getJSDocCommentsAndTags` risponde come risponde il compilatore, ed è il punto: un blocco
 * separato dalla sua dichiarazione da un'altra funzione **resta nel file** e un `grep` lo trova, ma
 * `tsc` non lo lega a niente.
 */
const documentato = (nodo: ts.Node) => ts.getJSDocCommentsAndTags(nodo).some(ts.isJSDoc);

/**
 * Le prop di un componente si documentano una per una, non in testa.
 *
 * ⚠️ Un `/** Le prop di BarRow. *\/` sopra ogni interfaccia sarebbe trentaquattro righe che
 * ripetono il nome: chi passa il puntatore su una prop legge il commento **della prop**, e chi lo
 * passa sul componente legge quello del componente. Per questo il caso sulle intestazioni le lascia
 * fuori e quello sui membri le prende tutte.
 */
const intestazioneFacoltativa = ({ name, nodo }: (typeof pubblici)[number]) =>
  nodo !== undefined && ts.isInterfaceDeclaration(nodo) && name.endsWith('Props');

/** Ogni membro di un'interfaccia pubblica, col nome di chi lo contiene. */
const membri = pubblici.flatMap(({ name, nodo }) =>
  nodo !== undefined && ts.isInterfaceDeclaration(nodo)
    ? nodo.members.map((membro) => ({
        name: `${name}.${membro.name?.getText() ?? '?'}`,
        membro,
      }))
    : [],
);

describe('la documentazione arriva a chi installa', () => {
  it('trova la dichiarazione di ogni nome pubblico', () => {
    // Un nome che il lettore non riconosce — un `export class`, un `enum`, uno spread — non farebbe
    // fallire i casi qui sotto: resterebbe fuori da tutti. Il conto lo impedisce.
    expect(pubblici.length).toBeGreaterThan(100);
    expect(pubblici.filter(({ nodo }) => nodo === undefined).map(({ name }) => name)).toEqual([]);
    expect(membri.length).toBeGreaterThan(150);
  });

  it.each(pubblici.filter((voce) => !intestazioneFacoltativa(voce)))(
    '$name porta la sua documentazione',
    ({ nodo }) => {
      // ⚠️ È il difetto di `GlitchText` del 2026-09-23: il suo blocco stava sopra una funzione di
      // casa, `GlitchSlices`, e il componente pubblico è arrivato nel `.d.ts` senza una riga — con
      // la build verde, i test verdi e il playground a posto. È l'unica documentazione che chi
      // installa legge davvero, perché gliela mostra l'editor.
      //
      // L'alternativa legittima non è un commento vuoto per far tacere il caso: è chiedersi se il
      // nome debba uscire dall'indice.
      expect(nodo !== undefined && documentato(nodo)).toBe(true);
    },
  );

  it.each(membri.filter(({ name }) => !name.endsWith('.children')))(
    '$name porta la sua documentazione',
    ({ membro }) => {
      // `children` resta fuori, ed è l'unica eccezione: in un provider o in un'etichetta è quello
      // che sta dentro, e un commento che lo dice ripete la parola.
      expect(documentato(membro)).toBe(true);
    },
  );
});
