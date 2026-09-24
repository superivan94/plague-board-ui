'use client';

import { ToggleButton, ToggleButtonGroup } from '@heroui/react';
import { TechLabel } from 'plague-board-ui';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { isStoryHeight, storyHeightRequest } from '@/app/cornice/frameMessage';

import { readFormat, subscribe, writeFormat, type FormatKey } from './catalogMemory';
import { withInlineCode } from './withInlineCode';

interface Format {
  readonly key: FormatKey;
  readonly label: string;
  /**
   * La larghezza della **finestra** della variante, cioè dell'iframe senza il bordo — quella che le
   * media query leggono. `null` è la colonna intera.
   */
  readonly width: number | null;
  /**
   * L'altezza sotto la quale la **finestra** della variante non scende — l'iframe, non quello che
   * se ne vede.
   *
   * ⚠️ **A 768 e a pieno è 30rem, e non per estetica.** La variante `pb-roomy` di `theme.css`
   * guarda larghezza **e** altezza — un telefono coricato è largo 844 px e alto 390 — quindi una
   * cornice larga 768 ma alta quanto una barra sarebbe per la libreria un telefono coricato, e la
   * barra si compatterebbe proprio nella cornice che dovrebbe mostrarla piena. A 360 la larghezza
   * basta già a dire «telefono», e l'altezza può seguire il contenuto.
   */
  readonly windowHeight: number;
}

const FORMATS: readonly Format[] = [
  { key: 'phone', label: '360', width: 360, windowHeight: 0 },
  { key: 'tablet', label: '768', width: 768, windowHeight: 480 },
  { key: 'full', label: 'pieno', width: null, windowHeight: 480 },
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
 *
 * ⚠️ **Le altezze sono due, e non per pignoleria.** L'iframe è alto almeno `windowHeight`, perché è
 * la finestra che le media query leggono; l'involucro invece è alto quanto il contenuto e taglia il
 * resto, che è vuoto. Con una sola altezza, a 768 ogni variante si prendeva uno schermo intero di
 * niente e la seconda finiva sotto il bordo: sulla firma si vedeva soltanto la forma lunga.
 */
function Frame({
  src,
  title,
  caption,
  width,
  windowHeight,
  minHeight,
}: {
  src: string;
  title: string;
  caption: string;
  width: number | null;
  /** Il minimo della finestra della variante: vedi {@link Format.windowHeight}. */
  windowHeight: number;
  /** Il minimo di quello che si vede: la `frameHeight` della storia, per chi occupa la finestra. */
  minHeight: number;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [contentHeight, setContentHeight] = useState(FIRST_HEIGHT);
  const windowFloor = Math.max(windowHeight, minHeight, contentHeight);
  // ⚠️ **Chi vive nella finestra la mostra tutta.** Una storia dichiara `frameHeight` proprio perché
  // quello che mostra sta in `position: fixed`, cioè attaccato alla **finestra** e non al contenuto:
  // con l'involucro alto `frameHeight` e la finestra alta 480, tutto quello che si attacca al fondo
  // finiva sotto il taglio. Misurato il 2026-09-23 sulla navigazione fissa: finestra 480, involucro
  // 361, pannello a 406–468 — le tre varianti in basso erano riquadri vuoti, e le notifiche pure.
  const visibleHeight = minHeight > 0 ? windowFloor : Math.max(minHeight, contentHeight);

  useEffect(() => {
    const onMessage = (event: MessageEvent<unknown>) => {
      if (event.source !== frame.current?.contentWindow || event.origin !== window.location.origin) return;
      if (isStoryHeight(event.data)) setContentHeight(event.data.height);
    };
    window.addEventListener('message', onMessage);
    // ⚠️ Appena si ascolta, si chiede: una cornice già caricata prima dell'idratazione ha mandato
    // la sua altezza a nessuno. Se invece è ancora in caricamento la domanda va persa, ma allora
    // la cornice manderà la sua quando c'è, e qui qualcuno ascolta già.
    frame.current?.contentWindow?.postMessage(storyHeightRequest(), window.location.origin);
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
      {/* `box-content`: l'altezza scritta è quella del contenuto, e il bordo si aggiunge fuori. Con
          `border-box` i due pixel si toglievano all'area visibile e la barra usciva mozzata. */}
      <div
        className="box-content overflow-hidden rounded-lg border border-border"
        style={{ height: visibleHeight }}
      >
        <iframe
          ref={frame}
          src={src}
          title={title}
          loading="lazy"
          className="block max-w-none"
          style={{ width: width ?? '100%', height: windowFloor }}
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
  /** Solo quello che si legge sopra la cornice: la variante vera la rende la cornice. */
  variants: readonly { readonly name: string; readonly note?: string }[];
  frameHeight?: number;
}) {
  // ⚠️ Il formato non è uno stato della pagina: resta scelto passando da una storia all'altra con
  // «Prossima», che è il modo in cui si controlla il catalogo intero a 768. Vedi `catalogMemory.ts`.
  const formatKey = useSyncExternalStore(subscribe, readFormat, (): FormatKey => 'phone');
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
            if (next) writeFormat(next.key);
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
        <section key={variant.name} className="flex flex-col gap-2">
          <h2 className="text-sm font-medium">{variant.name}</h2>
          {variant.note ? <p className="max-w-2xl text-xs text-muted">{withInlineCode(variant.note)}</p> : null}
          {/* ⚠️ La riga trabocca invece di stringere le cornici: una cornice da 768 che diventa da
              600 perché la pagina è stretta non è più il formato che dice di essere. */}
          <div className="flex flex-wrap gap-4 overflow-x-auto pb-1">
            {THEMES.map((theme) => (
              <Frame
                key={theme.key}
                src={`/cornice/${name}/${index}/${theme.key}`}
                title={`${name} · ${variant.name} · ${theme.label}`}
                caption={theme.label}
                width={format.width}
                windowHeight={format.windowHeight}
                minHeight={frameHeight}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
