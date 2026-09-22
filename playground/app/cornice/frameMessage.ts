/**
 * Il messaggio con cui una cornice dice al catalogo quanto è alta la sua variante.
 *
 * ⚠️ Sta in un modulo suo, **senza** `'use client'`, perché lo leggono due lati: la cornice che lo
 * manda e la pagina del catalogo che lo riceve. Un messaggio arriva come `unknown` — chiunque può
 * scrivere a una finestra — quindi prima di usarlo si controlla che abbia la forma giusta.
 */
const STORY_HEIGHT = 'pb-story-height';

export interface StoryHeightMessage {
  readonly type: typeof STORY_HEIGHT;
  readonly height: number;
}

export const storyHeight = (height: number): StoryHeightMessage => ({ type: STORY_HEIGHT, height });

export function isStoryHeight(data: unknown): data is StoryHeightMessage {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    data.type === STORY_HEIGHT &&
    'height' in data &&
    typeof data.height === 'number'
  );
}
