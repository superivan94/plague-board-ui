import { describe, expect, it } from 'vitest';

import { animazioni, blocco, tema } from './fogli';
import { sorgenti } from './sorgenti';

/**
 * I colori della scena del fondale: `--pb-scene…` in `theme.css`, uno per pezzo e per tema.
 *
 * ⚠️ Un guard e non un test di componente: guarda il progetto, non un rendering. I colori li usano
 * i sorgenti di `src/` e le classi di `animations.css`, e li dichiarano i due blocchi del tema.
 */

/** I nomi `--pb-scene…` che compaiono in un testo. Il nome finisce su una lettera. */
const nomi = (testo: string) => new Set(testo.match(/--pb-scene(?:-[a-z]+)*/g) ?? []);

const usate = new Set([...sorgenti.flatMap(({ text }) => [...nomi(text)]), ...nomi(animazioni)]);

const dichiarate = (intestazione: string) =>
  new Set([...blocco(tema, intestazione).matchAll(/(--pb-scene(?:-[a-z]+)*)\s*:/g)].map(([, nome]) => nome));

describe('la scena nei due temi', () => {
  it('ogni colore della scena è dichiarato in tutti e due i temi, e nessuno di più', () => {
    // ⚠️ Una variabile che manca in un blocco non dà nessun errore: in quel tema vale il suo valore
    // iniziale, cioè niente, e il pezzo sparisce — trasparente, o del colore del testo. Si vede solo
    // col chiaro accanto allo scuro. E una dichiarata che nessuno usa è un colore che qualcuno
    // ritoccherà credendo di cambiare qualcosa.
    expect(usate.size).toBeGreaterThan(10);
    expect(dichiarate("[data-theme='light'] {")).toEqual(usate);
    expect(dichiarate("[data-theme='dark'] {")).toEqual(usate);
  });
});
