import { fireEvent } from '@testing-library/react';

/**
 * Emette la fine di un'animazione CSS su un nodo, col suo nome.
 *
 * ⚠️ jsdom non ha `AnimationEvent`, e la cosa costa due volte. `fireEvent.animationEnd` ripiega su
 * `Event`, che **scarta** `animationName`: l'evento si costruisce a mano, con la proprietà aggiunta
 * sopra. E React, non trovando `AnimationEvent` in `window`, registra `onAnimationEnd` sul nome
 * **col prefisso** — `webkitAnimationEnd`, perché `WebkitAnimation` sta in `style` — quindi un
 * `animationend` liscio non arriva a nessun handler. Misurato con una sonda il 2026-09-18: si
 * emette il nome che React ascolta, deciso come lo decide lui.
 */
export const fineAnimazione = (target: Element, animationName: string) => {
  const type = 'AnimationEvent' in window ? 'animationend' : 'webkitAnimationEnd';
  const event = new Event(type, { bubbles: true });
  Object.defineProperty(event, 'animationName', { value: animationName });
  fireEvent(target, event);
};

/**
 * La traversata finita di un ratto in corsa: il nome dell'animazione dipende dal lato da cui è
 * entrato, e il nodo lo dichiara nella sua classe.
 */
export const fineTraversata = (ratto: Element) => {
  const verso = ratto.classList.contains('pb-rat-run--right') ? 'right' : 'left';
  fineAnimazione(ratto, `pb-rat-cross-${verso}`);
};
