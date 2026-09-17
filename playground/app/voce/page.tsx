import {
  CodeIcon,
  DEV_PHRASES,
  RAT_PHRASES,
  RatIcon,
  TalkingMascot,
  TechLabel,
  TechRule,
} from 'plague-board-ui';
import type { ComponentType } from 'react';

// ⚠️ Pagina **server**, senza `'use client'`: il cablaggio fra sorteggio e fumetto sta tutto dentro
// `TalkingMascot`, quindi qui non c'è nessun hook e nessuno stato. È la misura di che cosa fa quel
// componente — prima questa stessa pagina doveva essere client per intero.

interface Voice {
  readonly name: string;
  readonly Mark: ComponentType<{ size?: number; className?: string }>;
  readonly phrases: readonly string[];
  readonly label: string;
}

const VOICES: readonly Voice[] = [
  { name: 'il ratto', Mark: RatIcon, phrases: RAT_PHRASES, label: 'Sveglia il ratto' },
  { name: 'lo sviluppatore', Mark: CodeIcon, phrases: DEV_PHRASES, label: 'Chiedi al collega' },
];

const RULES = [
  [
    'Si preme, non ci si passa sopra',
    'Il passaggio del mouse non esiste su un telefono: un easter egg appeso all’hover è invisibile a chi usa l’app dal palmo della mano. Qui il grilletto è un pulsante vero, quindi risponde anche a Invio e Spazio.',
  ],
  [
    'Il nome del comando è obbligatorio',
    'La mascotte non disegna niente di suo, e le icone della libreria sono decorative: senza un nome dichiarato resterebbe un pulsante muto. Per questo la prop è obbligatoria — il nome non può dipendere da che cosa capita di avvolgere.',
  ],
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

const PIECES = [
  ['useRandomPhrase', 'pesca una frase e non ripete mai quella appena detta'],
  ['SpeechBubble', 'la mostra appesa a chi parla, e se ne va da solo'],
  ['TalkingMascot', 'mette insieme i due e ci attacca il grilletto'],
];

/** Una voce sola: la faccia che si preme, e quante battute conosce. */
function VoiceDemo({ name, Mark, phrases, label }: Voice) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-border p-6">
      <TechLabel className="text-muted">{name}</TechLabel>

      {/* L'altezza fissa è il posto che si lascia al fumetto, così le colonne non ballano quando
          compare. Il `relative` che lo ancora ce l'ha `TalkingMascot` addosso. */}
      <span className="flex h-32 items-start justify-center">
        <TalkingMascot label={label} phrases={phrases}>
          {/* ⚠️ `brand-ink` e non `brand`: il lime grezzo su una pagina chiara fa **1,38** di
              contrasto e la faccia sparisce. Dentro la barra il lime va bene perché quella è
              un'isola scura; qui siamo sul fondo della pagina, che cambia col tema. */}
          <Mark size={56} className="text-brand-ink" />
        </TalkingMascot>
      </span>

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
          Una mascotte che al clic dice la sua. <code>TalkingMascot</code> avvolge{' '}
          <strong>qualunque figlio</strong> — un SVG, il logo in PNG, una foto — e non disegna
          niente di suo: è la faccia di chi lo usa a parlare. Le frasi di casa —{' '}
          <code>RAT_PHRASES</code> e <code>DEV_PHRASES</code> — viaggiano con la libreria, ma
          chiunque può passare le sue.
        </p>
      </div>

      <TechRule>premile</TechRule>

      <div className="grid gap-4 sm:grid-cols-2">
        {VOICES.map((voice) => (
          <VoiceDemo key={voice.name} {...voice} />
        ))}
      </div>

      <TechRule>i tre pezzi</TechRule>

      <section className="flex flex-col gap-3">
        <p className="max-w-2xl text-sm text-muted">
          Meccanismo, forma e cablaggio sono separati, perché servono a tre momenti diversi: chi
          vuole solo il sorteggio prende il primo, chi ha già uno stato suo prende i primi due, chi
          vuole la mascotte e basta prende il terzo.
        </p>

        <dl className="flex max-w-2xl flex-col gap-2">
          {PIECES.map(([name, body]) => (
            <div key={name} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="shrink-0 text-sm font-semibold text-brand-ink sm:w-44">
                <code>{name}</code>
              </dt>
              <dd className="text-sm text-muted">{body}</dd>
            </div>
          ))}
        </dl>
      </section>

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
