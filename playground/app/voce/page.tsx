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

// ⚠️ Pagina `'use client'` per intero: `useRandomPhrase` è un hook, e un hook gira solo di là.
// Quando arriverà `TalkingMascot` le due colonne qui sotto si riducono a una riga, perché è
// esattamente questo cablaggio che quel componente incapsula.

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

const RULES = [
  [
    'È un messaggio, non una descrizione',
    'Il fumetto è una regione viva: si legge quando arriva e poi non c’è più. Un tooltip invece lega il testo a chi lo dice per sempre, e lo ripete a ogni fuoco.',
  ],
  [
    'Dura 2,5 secondi, animazione compresa',
    'Il tempo e la durata dell’animazione sono lo stesso numero: due valori diversi darebbero un fumetto che svanisce e resta lì, o che sparisce prima di comparire.',
  ],
  [
    'Una frase nuova è un fumetto nuovo',
    'Premendo di nuovo prima della fine, il conto riparte da zero — e con lui l’animazione. Non si accumulano fumetti: ce n’è uno solo per chi parla.',
  ],
  [
    'Non si clicca per chiuderlo',
    'Se ne va da sé. Un comando «chiudi» addosso al fumetto ruberebbe il posto alla frase nel nome accessibile, che è l’unica cosa che il fumetto esiste per dire.',
  ],
];

/**
 * Una voce sola: il segno, il fumetto appeso sotto, e il comando che la fa parlare.
 *
 * ⚠️ Lo stato «sta parlando» è di qui, non dell'hook: `useRandomPhrase` tiene l'ultima frase e non
 * la dimentica più. Dire e *smettere di dire* sono due cose.
 */
function VoiceDemo({ name, Mark, phrases, action }: Voice) {
  const { phrase, pick } = useRandomPhrase(phrases);
  const [isTalking, setIsTalking] = useState(false);

  const say = () => {
    pick();
    setIsTalking(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-border p-6">
      <TechLabel className="text-muted">{name}</TechLabel>

      {/* ⚠️ Il `relative` sta stretto **attorno al segno**: il fumetto si appende a chi parla, e
          appeso a una scatola grande uscirebbe dal suo bordo inferiore, cioè addosso al pulsante.
          L'altezza fissa qui fuori è il posto che si lascia al fumetto, così le colonne non ballano
          quando compare. */}
      <span className="flex h-32 items-start justify-center">
        <span className="relative">
          <Mark size={56} className="text-brand" />
          <SpeechBubble message={isTalking ? phrase : null} onHide={() => setIsTalking(false)} />
        </span>
      </span>

      <Button variant="primary" onPress={say}>
        {action}
      </Button>

      <TechLabel className="text-muted">{phrases.length} frasi</TechLabel>
    </div>
  );
}

export default function VoicePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-10 px-4 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">La voce</h1>
        <p className="text-sm text-muted">
          Due pezzi separati, perché il <em>meccanismo</em> e il <em>contenuto</em> lo sono.{' '}
          <code>useRandomPhrase</code> pesca una frase e non ripete mai quella appena detta;{' '}
          <code>SpeechBubble</code> la mostra e se ne va da solo. Le frasi di casa —{' '}
          <code>RAT_PHRASES</code> e <code>DEV_PHRASES</code> — viaggiano con la libreria, ma
          chiunque può passare le sue.
        </p>
      </div>

      <TechRule>le due voci</TechRule>

      <div className="grid gap-4 sm:grid-cols-2">
        {VOICES.map((voice) => (
          <VoiceDemo key={voice.name} {...voice} />
        ))}
      </div>

      <TechRule>le regole</TechRule>

      <dl className="flex max-w-2xl flex-col gap-4">
        {RULES.map(([title, body]) => (
          <div key={title} className="flex flex-col gap-1">
            <dt className="text-sm font-semibold">{title}</dt>
            <dd className="text-sm text-muted">{body}</dd>
          </div>
        ))}
      </dl>

      <p className="max-w-2xl text-sm text-muted">
        ⚠️ Il fumetto è <strong>bianco nei due temi</strong>: è un fumetto da fumetto, e cambiargli
        colore col tema lo farebbe sembrare un pannello. Su pagina chiara lo tengono su il contorno
        e l&apos;ombra.
      </p>
    </main>
  );
}
