import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DEV_PHRASES, RAT_PHRASES, useRandomPhrase } from '../src';

// Gli array stanno **fuori** da ogni corpo di funzione, qui come nella libreria: sono il caso
// d'uso vero, e un array costruito dentro il test non proverebbe la stabilità di `pick`.
const TRE = ['uno', 'due', 'tre'] as const;
const UNA = ['sola'] as const;
const NESSUNA: readonly string[] = [];
const TUTTE_UGUALI = ['eco', 'eco', 'eco'] as const;

describe('useRandomPhrase', () => {
  it('prima di chiedere non ha detto niente', () => {
    const { result } = renderHook(() => useRandomPhrase(TRE));

    // `null` e non la prima frase: «non ha ancora parlato» e «sta dicendo la prima» sono due stati
    // diversi, e chi rende un fumetto deve poterli distinguere.
    expect(result.current.phrase).toBeNull();
  });

  it('non ripete mai quella appena detta', () => {
    const { result } = renderHook(() => useRandomPhrase(TRE));
    const dette: (string | null)[] = [];

    for (let i = 0; i < 200; i += 1) {
      act(() => result.current.pick());
      dette.push(result.current.phrase);
    }

    // ⚠️ Duecento giri e non una soglia probabilistica: l'invariante è **strutturale**, non
    // statistica. Con tre frasi, un'estrazione a caso senza vincolo ripeterebbe circa una volta su
    // tre, quindi un caso che gira una volta sola sarebbe verde due volte su tre anche col vincolo
    // rotto.
    const ripetizioni = dette.filter((frase, i) => i > 0 && frase === dette[i - 1]);
    expect(ripetizioni).toStrictEqual([]);
    expect(new Set(dette)).toStrictEqual(new Set(TRE));
  });

  it('con una frase sola la ripete, invece di girare a vuoto', () => {
    const { result } = renderHook(() => useRandomPhrase(UNA));

    // ⚠️ È il caso che fa entrare in ciclo infinito chi implementa «non ripetere» **estraendo
    // finché non esce diversa**: con una frase sola quel `while` non esce mai. Qui la frase si
    // sceglie fra quelle che restano, e se non ne restano si tiene quella che c'è.
    act(() => result.current.pick());
    expect(result.current.phrase).toBe('sola');

    act(() => result.current.pick());
    expect(result.current.phrase).toBe('sola');
  });

  it('con frasi tutte uguali non si blocca', () => {
    const { result } = renderHook(() => useRandomPhrase(TUTTE_UGUALI));

    act(() => result.current.pick());
    act(() => result.current.pick());

    expect(result.current.phrase).toBe('eco');
  });

  it('senza frasi non dice niente e non esplode', () => {
    const { result } = renderHook(() => useRandomPhrase(NESSUNA));

    act(() => result.current.pick());

    expect(result.current.phrase).toBeNull();
  });

  it('`pick` non cambia identità a ogni render', () => {
    const { result, rerender } = renderHook(() => useRandomPhrase(TRE));
    const primo = result.current.pick;

    rerender();
    act(() => result.current.pick());
    rerender();

    // ⚠️ È il difetto dell'originale, e vale la pena dire **come** si manifesta: là l'array stava
    // dentro il corpo dell'hook e si ricostruiva a ogni render, quindi la funzione che lo leggeva
    // cambiava identità a ogni render. Chi la mette fra le dipendenze di un `useEffect` si ritrova
    // l'effetto che riparte di continuo. Qui `pick` non dipende nemmeno dalla frase corrente,
    // perché la legge dall'aggiornamento funzionale invece che dalla chiusura.
    expect(result.current.pick).toBe(primo);
  });
});

describe('le frasi di casa', () => {
  it('portano intatte quelle di RattInventario: diciannove e quattordici', () => {
    expect(RAT_PHRASES).toHaveLength(19);

    // ⚠️ Le quattordici dello sviluppatore sono le **prime**, e restano quelle: le otto dopo sono
    // nostre, aggiunte il 2026-09-19 perché con quattordici sole l'emettitore si ripeteva sotto
    // gli occhi di chi guardava. Il caso guarda dove finiscono quelle di là, non quante siano in
    // tutto: così il mazzo può crescere ancora senza che nessuno debba aggiornare un numero.
    expect(DEV_PHRASES.slice(0, 14).at(-1)).toBe('Ma perché `null` è un `object`???');
    expect(DEV_PHRASES.length).toBeGreaterThan(14);
  });

  it('sono corte abbastanza da stare nel fumetto', () => {
    // Il fumetto di `comicBubbles` è largo al massimo 200px e non manda a capo: una frase più
    // lunga esce dal suo riquadro e resta scritta sul niente. In jsdom la larghezza vera non si
    // misura — ogni rettangolo è zero — quindi qui si guardano i **caratteri**, che è un proxy:
    // la più lunga di RattInventario ne ha 34 e misura **179px** sul browser vero, ma è tutta
    // maiuscola. Trentotto in minuscolo ne fanno meno di 170; trentotto in maiuscolo arriverebbero
    // al bordo, e una frase urlata più lunga di così va **misurata** prima di entrare qui.
    const troppoLunghe = DEV_PHRASES.filter((frase) => frase.length > 38);

    expect(troppoLunghe).toStrictEqual([]);
  });

  it('non hanno doppioni', () => {
    // Due copie della stessa frase non romperebbero niente, ma dimezzano la sorpresa di quella
    // frase senza che nessuno se ne accorga leggendo l'elenco.
    expect(new Set(RAT_PHRASES).size).toBe(RAT_PHRASES.length);
    expect(new Set(DEV_PHRASES).size).toBe(DEV_PHRASES.length);
  });
});
