import { describe, expect, it } from 'vitest';

import { sorgenti } from './sorgenti';

const isClientModule = ({ text }: { text: string }) => text.split('\n')[0] === "'use client';";

describe('il confine server/client', () => {
  it('trova i sorgenti da controllare', () => {
    // Se un giorno la cartella cambia nome, il caso qui sotto passerebbe su zero file senza dire
    // niente: un guard che non guarda nulla è verde per costruzione.
    expect(sorgenti.length).toBeGreaterThan(5);
  });

  it.each(sorgenti.filter(({ text }) => text.includes('render={')))(
    'chi passa `render` a HeroUI dichiara `use client`: $name',
    ({ text }) => {
      // ⚠️ Misurato il 2026-09-17 con `next build`, e il modo in cui si è visto è la parte
      // importante: `Surface` è un componente client, quindi la funzione passata a `render` è una
      // prop che attraversa il confine — e le funzioni non si serializzano. In jsdom non succede
      // niente, i test restano verdi, e il difetto compare solo quando qualcuno usa il componente
      // da una pagina server. Che per una barra è il caso normale: le intestazioni vivono in
      // `layout.tsx`, che è server di default.
      //
      // Dichiarando `use client` è il nostro modulo a essere il confine, e la funzione nasce di
      // là: non attraversa più niente.
      expect(text.split('\n')[0]).toBe("'use client';");
    },
  );

  it.each(sorgenti.filter(isClientModule))('$name non esporta dati, solo componenti', ({ text }) => {
    // ⚠️ L'altra metà dello stesso confine, e la più insidiosa perché **nessuna build diventa
    // rossa**. Un modulo `'use client'` non consegna a un componente server i valori che esporta:
    // gli consegna un riferimento al modulo. Per un componente è il meccanismo giusto; per una
    // tabella di numeri vuol dire che chi la indicizza ottiene `undefined`, in silenzio — e la
    // pagina esce con un buco al posto della misura. Visto il 2026-09-17 su `/barra`, dove
    // `next build` era verde e l'etichetta diceva «segno px».
    //
    // L'alternativa legittima non è spegnere questo caso: è mettere il dato in un modulo accanto
    // **senza** la direttiva, come `plagueBarSizes.ts`, e lasciare qui solo il componente.
    const dataExports = [...text.matchAll(/^export const ([A-Z0-9_]+)\b/gm)].map((m) => m[1]);

    expect(dataExports).toStrictEqual([]);
  });
});
