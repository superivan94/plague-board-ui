'use client';

import { ToggleButton, ToggleButtonGroup } from '@heroui/react';
import { TechLabel } from 'plague-board-ui';
import { useEffect, useRef, useState } from 'react';

import { isStoryHeight } from '@/app/cornice/frameMessage';

interface Format {
  readonly key: 'phone' | 'tablet' | 'full';
  readonly label: string;
  /**
   * La larghezza della **finestra** della variante, cioè dell'iframe senza il bordo — quella che le
   * media query leggono. `null` è la colonna intera.
   */
  readonly width: number | null;
  /**
   * L'altezza sotto la quale la cornice non scende.
   *
   * ⚠️ **A 768 e a pieno è 30rem, e non per estetica.** La variante `pb-roomy` di `theme.css`
   * guarda larghezza **e** altezza — un telefono coricato è largo 844 px e alto 390 — quindi una
   * cornice larga 768 ma alta quanto una barra sarebbe per la libreria un telefono coricato, e la
   * barra si compatterebbe proprio nella cornice che dovrebbe mostrarla piena. A 360 la larghezza
   * basta già a dire «telefono», e l'altezza può seguire il contenuto.
   */
  readonly minHeight: number;
}

const FORMATS: readonly Format[] = [
  { key: 'phone', label: '360', width: 360, minHeight: 0 },
  { key: 'tablet', label: '768', width: 768, minHeight: 480 },
  { key: 'full', label: 'pieno', width: null, minHeight: 480 },
];

const THEMES = [
  { key: 'light', label: 'chiaro' },
  { key: 'dark', label: 'scuro' },
] as const;

/** Quanto è alta una cornice prima che la variante dica quanto le serve. */
const FIRST_HEIGHT = 120;

/**
 * Una cornice: la variante in un iframe, alta quanto il suo contenuto.
 *
 * ⚠️ L'altezza la **manda la cornice**, con un messaggio, invece di leggerla da qui: un
 * `ResizeObserver` di questa finestra puntato dentro un altro documento è una di quelle cose che
 * funzionano finché non smettono, mentre dentro la cornice osserva il suo e basta.
 */
function Frame({
  src,
  title,
  caption,
  width,
  minHeight,
}: {
  src: string;
  title: string;
  caption: string;
  width: number | null;
  minHeight: number;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [contentHeight, setContentHeight] = useState(FIRST_HEIGHT);

  useEffect(() => {
    const onMessage = (event: MessageEvent<unknown>) => {
      if (event.source !== frame.current?.contentWindow || event.origin !== window.location.origin) return;
      if (isStoryHeight(event.data)) setContentHeight(event.data.height);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <figure className={`flex shrink-0 flex-col gap-1 ${width === null ? 'w-full' : ''}`}>
      <figcaption className="flex items-center justify-between gap-2">
        <TechLabel className="text-muted">{caption}</TechLabel>
        {/* Per le varianti che si vedono una volta sola: il ratto che attraversa, il fumetto che se
            ne va. Ricaricare la cornice è ricominciare la variante, e nient'altro. */}
        <button
          type="button"
          onClick={() => frame.current?.contentWindow?.location.reload()}
          aria-label={`Ricomincia: ${title}`}
          className="rounded px-1.5 text-xs text-muted hover:text-foreground focus-visible:focus-ring"
        >
          ricomincia
        </button>
      </figcaption>
      {/* ⚠️ Il bordo sta sull'involucro e la misura sull'iframe: con `border-box` i due pixel del
          bordo si mangerebbero la finestra della variante — 358 invece di 360, misurato — e
          l'altezza, con una barra di scorrimento in ogni cornice. */}
      <div className="overflow-hidden rounded-lg border border-border">
        <iframe
          ref={frame}
          src={src}
          title={title}
          loading="lazy"
          className="block max-w-none"
          style={{ width: width ?? '100%', height: Math.max(minHeight, contentHeight) }}
        />
      </div>
    </figure>
  );
}

/**
 * Le varianti di una storia, un formato alla volta e nei due temi affiancati.
 *
 * ⚠️ **I formati sono iframe, non riquadri stretti.** `PlagueBar`, `PlagueFootBar` e `PlagueAvatar`
 * rispondono alla finestra, e dentro un `<div>` largo 360 px si vestirebbero da desktop: un
 * componente guardato così sembra a posto al telefono senza esserci mai stato.
 */
export function StoryFrames({
  name,
  variants,
  frameHeight = 0,
}: {
  name: string;
  variants: readonly string[];
  frameHeight?: number;
}) {
  const [formatKey, setFormatKey] = useState<Format['key']>('phone');
  const format = FORMATS.find((candidate) => candidate.key === formatKey) ?? FORMATS[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-3">
        <TechLabel className="text-muted">formato</TechLabel>
        <ToggleButtonGroup
          size="sm"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[format.key]}
          onSelectionChange={(keys) => {
            const next = FORMATS.find((candidate) => keys.has(candidate.key));
            if (next) setFormatKey(next.key);
          }}
          aria-label="Formato"
        >
          {FORMATS.map((candidate) => (
            <ToggleButton key={candidate.key} id={candidate.key}>
              <TechLabel>{candidate.label}</TechLabel>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>

      {variants.map((variant, index) => (
        <section key={variant} className="flex flex-col gap-2">
          <h2 className="text-sm font-medium">{variant}</h2>
          {/* ⚠️ La riga trabocca invece di stringere le cornici: una cornice da 768 che diventa da
              600 perché la pagina è stretta non è più il formato che dice di essere. */}
          <div className="flex flex-wrap gap-4 overflow-x-auto pb-1">
            {THEMES.map((theme) => (
              <Frame
                key={theme.key}
                src={`/cornice/${name}/${index}/${theme.key}`}
                title={`${name} · ${variant} · ${theme.label}`}
                caption={theme.label}
                width={format.width}
                minHeight={Math.max(format.minHeight, frameHeight)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
