import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LUDORATTI_COPY, SupportButton, type LudorattiTermKey } from '../src';

// Si importa dal punto d'ingresso pubblico e non dal file: un dizionario che non passa da
// `src/index.ts` non esiste per chi installa.
const voci = Object.entries(LUDORATTI_COPY) as [LudorattiTermKey, { plain: string; house: string }][];

describe('LUDORATTI_COPY', () => {
  it.each(voci)('«%s» porta il generico e la parola di casa, e sono due cose diverse', (_, voce) => {
    expect(voce.plain.trim()).not.toBe('');
    expect(voce.house.trim()).not.toBe('');

    // ⚠️ Una voce in cui le due parole coincidono è una voce **dimenticata a metà**: qualcuno ha
    // aggiunto il termine generico e non ha ancora scritto quello di casa. Non si vede rileggendo
    // il file — è una riga fra ventitré che sembra a posto.
    expect(voce.house).not.toBe(voce.plain);
  });

  it('nessuna parola di casa è usata due volte', () => {
    const casa = voci.map(([, voce]) => voce.house);

    // Due chiavi con la stessa parola addosso vuol dire che una delle due è un copia e incolla a
    // cui nessuno ha cambiato il testo, e a schermo si vede solo se si aprono le due schermate
    // una dopo l'altra.
    expect(new Set(casa).size).toBe(casa.length);
  });

  it('nessun termine generico è usato due volte', () => {
    const generici = voci.map(([, voce]) => voce.plain);

    // Il generico è la chiave di ricerca umana — si cerca la parola che si stava per scrivere. Se
    // due voci la condividono, chi cerca ne trova una a caso.
    expect(new Set(generici).size).toBe(generici.length);
  });
});

it('il comando delle donazioni prende la sua etichetta dal dizionario', () => {
  render(<SupportButton href="https://esempio.test/dona" />);

  // ⚠️ È l'unico punto in cui la libreria **usa** il proprio lessico invece di limitarsi a
  // esportarlo, e per questo è anche l'unico che può divergere: il giorno in cui qualcuno cambia
  // «Offrimi una pozione» nel dizionario e non nel componente — o viceversa — il pacchetto
  // spedisce due parole per la stessa cosa. Il caso è verde solo se sono la stessa stringa.
  expect(screen.getByRole('link', { name: LUDORATTI_COPY.support.house })).toBeInTheDocument();
});
