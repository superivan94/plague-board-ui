/**
 * I messaggi fra una cornice e il catalogo: l'altezza della variante, e la domanda per averla.
 *
 * ⚠️ Stanno in un modulo suo, **senza** `'use client'`, perché li leggono due lati: la cornice che
 * risponde e la pagina del catalogo che chiede. Un messaggio arriva come `unknown` — chiunque può
 * scrivere a una finestra — quindi prima di usarlo si controlla che abbia la forma giusta.
 *
 * ⚠️ **La domanda esiste perché il primo messaggio si può perdere.** L'iframe è già nell'HTML del
 * server e comincia a caricarsi subito: una cornice veloce manda la sua altezza **prima** che la
 * pagina idrati e si metta in ascolto, e il suo `ResizeObserver` non la rimanda più, perché
 * l'altezza non cambia. Misurato il 2026-09-22: la prima cornice di `HoverEmitter` restava a 120
 * px con le altre cinque, identiche, a 214. Così la pagina, appena ascolta, chiede.
 */
const STORY_HEIGHT = 'pb-story-height';
const STORY_HEIGHT_REQUEST = 'pb-story-height-request';

export interface StoryHeightMessage {
  readonly type: typeof STORY_HEIGHT;
  readonly height: number;
}

export interface StoryHeightRequest {
  readonly type: typeof STORY_HEIGHT_REQUEST;
}

export const storyHeight = (height: number): StoryHeightMessage => ({ type: STORY_HEIGHT, height });

export const storyHeightRequest = (): StoryHeightRequest => ({ type: STORY_HEIGHT_REQUEST });

const hasType = (data: unknown, type: string): data is { readonly type: string } =>
  typeof data === 'object' && data !== null && 'type' in data && data.type === type;

export function isStoryHeight(data: unknown): data is StoryHeightMessage {
  return hasType(data, STORY_HEIGHT) && 'height' in data && typeof data.height === 'number';
}

export function isStoryHeightRequest(data: unknown): data is StoryHeightRequest {
  return hasType(data, STORY_HEIGHT_REQUEST);
}
