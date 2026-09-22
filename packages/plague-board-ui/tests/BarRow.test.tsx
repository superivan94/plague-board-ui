import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BarRow } from '../src';

/**
 * Dà alla riga una geometria: in jsdom ogni misura vale zero, quindi nessuna riga traboccherebbe.
 * `scrollLeft` diventa un campo vero, perché quello di jsdom non si muove.
 */
function riga({ contenuto = 800, larghezza = 300, sinistra = 0 } = {}) {
  const { container } = render(
    <BarRow>
      <span>I manuali</span>
      <span>I vettori ludici</span>
    </BarRow>,
  );
  const elemento = container.firstElementChild as HTMLElement;
  let posizione = sinistra;
  Object.defineProperty(elemento, 'scrollWidth', { configurable: true, value: contenuto });
  Object.defineProperty(elemento, 'clientWidth', { configurable: true, value: larghezza });
  Object.defineProperty(elemento, 'scrollLeft', {
    configurable: true,
    get: () => posizione,
    set: (valore: number) => {
      posizione = valore;
    },
  });
  return elemento;
}

describe('BarRow', () => {
  it('la rotella verticale fa scorrere di lato una riga che trabocca', () => {
    const elemento = riga();

    // `fireEvent` restituisce `false` quando l'evento è stato fermato: la pagina non scende.
    expect(fireEvent.wheel(elemento, { deltaY: 100 })).toBe(false);
    expect(elemento.scrollLeft).toBe(100);
  });

  it('a un estremo la rotella torna alla pagina, invece di restare intrappolata', () => {
    // ⚠️ È la differenza fra una riga comoda e una trappola: chi scende con la rotella e passa
    // sopra la barra non deve restare fermo lì perché la riga non ha più niente da mostrare.
    const inFondo = riga({ sinistra: 500 });
    expect(fireEvent.wheel(inFondo, { deltaY: 100 })).toBe(true);
    expect(inFondo.scrollLeft).toBe(500);

    const inCima = riga({ sinistra: 0 });
    expect(fireEvent.wheel(inCima, { deltaY: -100 })).toBe(true);
  });

  it('non va oltre la fine, anche con un colpo di rotella più lungo del resto', () => {
    const elemento = riga({ sinistra: 450 });

    fireEvent.wheel(elemento, { deltaY: 300 });
    expect(elemento.scrollLeft).toBe(500);
  });

  it('una riga che ci sta lascia la rotella alla pagina', () => {
    expect(fireEvent.wheel(riga({ contenuto: 300, larghezza: 300 }), { deltaY: 100 })).toBe(true);
  });

  it('Maiusc e la rotella di lato restano del browser, che li sa già fare', () => {
    expect(fireEvent.wheel(riga(), { deltaY: 100, shiftKey: true })).toBe(true);
    expect(fireEvent.wheel(riga(), { deltaX: 100, deltaY: 10 })).toBe(true);
  });

  it('una rotella che conta a righe scorre quanto una a pixel', () => {
    // Firefox col mouse manda `deltaMode` 1: tre righe, non tre pixel. Senza la conversione la
    // riga avanzerebbe di un soffio a ogni scatto.
    const elemento = riga();

    fireEvent.wheel(elemento, { deltaY: 3, deltaMode: 1 });
    expect(elemento.scrollLeft).toBe(48);
  });

  it('col mouse la barra di scorrimento si vede, sul telefono no', () => {
    const elemento = riga();
    const classi = elemento.className.split(/\s+/);

    // Base nascosta, e sottile solo con un puntatore preciso: il dito non ne ha bisogno, il mouse
    // senza non saprebbe che la riga continua.
    expect(classi).toContain('scrollbar-none');
    expect(classi).toContain('pointer-fine:scrollbar-thin');
  });
});
