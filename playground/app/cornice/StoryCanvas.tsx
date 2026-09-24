'use client';

import { useEffect, useRef } from 'react';

import { STORIES } from '@/stories';
import type { ComponentName } from '@/stories/types';

import { isStoryHeightRequest, storyHeight } from './frameMessage';

/**
 * Una variante sola, resa nel client.
 *
 * ⚠️ **È client apposta, e riceve un nome e un numero invece della storia.** Le varianti portano
 * funzioni negli `args` — il `onPress` di un comando, i segni di uno scoppio — e una funzione non
 * attraversa il confine fra una pagina server e un componente client. Qui dentro l'indice si
 * importa dal lato del client, e la variante nasce dove verrà usata.
 *
 * ⚠️ **L'altezza si misura sul contenitore della variante, non sul documento**: il documento non è
 * mai più basso della finestra, quindi la cornice che lo seguisse potrebbe solo crescere, e non
 * tornerebbe mai indietro.
 */
export function StoryCanvas({ name, index }: { name: ComponentName; index: number }) {
  const story = STORIES[name];
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const send = () =>
      window.parent.postMessage(storyHeight(Math.ceil(element.getBoundingClientRect().height)), window.location.origin);

    // Manda appena montata, poi quando la variante cambia misura, e risponde quando il catalogo
    // chiede: il primo messaggio può partire prima che il catalogo ascolti — vedi `frameMessage.ts`.
    // ⚠️ Il primo invio non aspetta il `ResizeObserver`: quello scatta al disegno, e una pagina che
    // il browser non disegna — una scheda in secondo piano — non lo fa scattare mai.
    send();
    const observer = new ResizeObserver(send);
    observer.observe(element);
    const onMessage = (event: MessageEvent<unknown>) => {
      if (event.source === window.parent && event.origin === window.location.origin && isStoryHeightRequest(event.data)) send();
    };
    window.addEventListener('message', onMessage);

    return () => {
      observer.disconnect();
      window.removeEventListener('message', onMessage);
    };
  }, []);

  return (
    <div ref={root} className={story.layout === 'fullscreen' ? '' : 'p-6'}>
      {story.renderVariant(index)}
    </div>
  );
}
