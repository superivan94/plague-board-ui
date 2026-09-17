'use client';

import { Button } from '@heroui/react';
import {
  CodeIcon,
  DEV_PHRASES,
  RAT_PHRASES,
  RatIcon,
  SpeechBubble,
  TechLabel,
  TechRule,
  useRandomPhrase,
} from 'plague-board-ui';
import { type ComponentType, useState } from 'react';

// ⚠️ Questa pagina è `'use client'` per intero, ed è il caso normale: `useRandomPhrase` è un hook,
// e un hook gira solo di là. Quando arriverà `TalkingMascot` le due colonne qui sotto si
// riducono a una riga, perché è esattamente questo cablaggio che quel componente incapsula.

interface Voice {
  readonly name: string;
  readonly Mark: ComponentType<{ size?: number; className?: string }>;
  readonly phrases: readonly string[];
  readonly action: string;
}

const VOICES: readonly Voice[] = [
  { name: 'il ratto', Mark: RatIcon, phrases: RAT_PHRASES, action: 'Sveglia il ratto' },
  { name: 'lo sviluppatore', Mark: CodeIcon, phrases: DEV_PHRASES, action: 'Chiedi al collega' },
];

/**
 * Una voce sola: il segno, il fumetto appeso sotto, e il comando che la fa parlare.
 *
 * ⚠️ **Lo stato «sta parlando» è di qui, non dell'hook.** `useRandomPhrase` tiene l'ultima frase e
 * non la dimentica più: dire e *smettere di dire* sono due cose, e tenerle insieme è il nodo che
 * in RattInventario fa sì che l'invariante «non ripetere» valga solo a fumetto chiuso. Questo
 * cablaggio di tre righe è esattamente quello che `TalkingMascot` incapsulerà.
 */
function VoiceDemo({ name, Mark, phrases, action }: Voice) {
  const { phrase, pick } = useRandomPhrase(phrases);
  const [isTalking, setIsTalking] = useState(false);

  const say = () => {
    pick();
    setIsTalking(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-800 p-6">
      <TechLabel className="text-gray-500">{name}</TechLabel>

      {/* ⚠️ Il `relative` sta stretto **attorno al segno**, non attorno al riquadro: il fumetto si
          appende a chi parla, e se lo si appende a una scatola grande esce dal suo bordo inferiore
          — cioè addosso al pulsante qui sotto. Misurato sbagliandolo, la prima volta.
          L'altezza fissa qui fuori è solo il posto che si lascia al fumetto, così le due colonne
          non ballano quando compare. */}
      <span className="flex h-32 items-start justify-center">
        <span className="relative">
          <Mark size={56} className="text-brand" />
          <SpeechBubble message={isTalking ? phrase : null} onHide={() => setIsTalking(false)} />
        </span>
      </span>

      <Button variant="primary" onPress={say}>
        {action}
      </Button>

      <TechLabel className="text-gray-600">{phrases.length} frasi</TechLabel>
    </div>
  );
}

export default function VoicePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-10 px-4 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">La voce</h1>
        <p className="text-sm text-default-500">
          <code>useRandomPhrase</code> pesca una frase e <strong>non ripete quella appena detta</strong>;{' '}
          <code>SpeechBubble</code> la mostra e se ne va da solo. Sono due cose separate perché il{' '}
          <em>meccanismo</em> e il <em>contenuto</em> lo sono: la libreria porta le frasi di casa —{' '}
          <code>RAT_PHRASES</code> e <code>DEV_PHRASES</code> — e chiunque può passare le sue.
        </p>
      </div>

      <TechRule>le due voci</TechRule>

      <div className="grid gap-4 sm:grid-cols-2">
        {VOICES.map((voice) => (
          <VoiceDemo key={voice.name} {...voice} />
        ))}
      </div>

      <TechRule>perché non è un tooltip</TechRule>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Il fumetto è un messaggio, non una descrizione</h2>
        <p className="max-w-2xl text-sm text-default-500">
          L&apos;inventario teneva aperta una domanda: il <code>Tooltip</code> di HeroUI accetta di
          essere pilotato, quindi si poteva vestire quello. La risposta è arrivata da una sonda, non
          da un ragionamento — <code>isOpen</code> funziona davvero, ma ecco che cosa produce:
        </p>

        <pre className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-950 p-4 font-mono text-[11px] leading-relaxed text-gray-400">
          {`<div role="button" tabindex="0" aria-describedby="react-aria-_r_0_">il ratto</div>
<div data-overlay-container="true">
  <div id="react-aria-_r_0_" role="tooltip" data-placement="top">Squit!</div>
</div>`}
        </pre>

        <p className="max-w-2xl text-sm text-default-500">
          La frase diventa la <strong>descrizione permanente</strong> di chi la dice, riannunciata a
          ogni fuoco: ma «Squit!» non descrive il ratto, è una cosa che il ratto dice una volta. E
          finisce in un contenitore di sovrapposizione fuori dall&apos;albero, mentre questo fumetto
          sta appeso a chi parla. Il ruolo giusto è <code>status</code>, una regione viva che si
          legge quando arriva — e che qui esiste <strong>prima</strong> del contenuto, perché una
          regione che compare già piena può non essere annunciata affatto.
        </p>
      </section>
    </main>
  );
}
