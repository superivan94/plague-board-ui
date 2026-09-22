import {
  CodeIcon,
  DEV_PHRASES,
  DiceIcon,
  HoverEmitter,
  ParticleBurst,
  RAT_PHRASES,
  Rat,
  RatIcon,
  RatMascot,
  RobotIcon,
  SpeechBubble,
  TalkingMascot,
  binaryRain,
  comicBubbles,
  type ParticleBurstHandle,
} from 'plague-board-ui';
import type { ReactNode } from 'react';

import { WithHandle } from './demos/WithHandle';
import { defineStory } from './types';

export const speechBubbleStory = defineStory(SpeechBubble, {
  description:
    'Il fumetto: compare sotto a chi parla e se ne va da solo. È una regione viva, quindi chi usa un lettore di schermo sente la frase.',
  variants: [
    { name: 'una frase', args: { message: 'Squit! Chi ha lasciato aperto il tombino?' } },
    { name: 'resta più a lungo', args: { message: 'Il contagio è una forma di affetto.', autoHideMs: 8000 } },
  ],
  // ⚠️ Il fumetto è `absolute` sotto il suo antenato: la cornice gli lascia sotto lo spazio, che
  // lui non occupa.
  decorators: [
    (variant) => (
      <div className="flex justify-center pb-28">
        <span className="relative">
          <RatMascot size={64} />
          {variant}
        </span>
      </div>
    ),
  ],
});

export const talkingMascotStory = defineStory(TalkingMascot, {
  description:
    'Avvolge una faccia qualunque e al clic la fa parlare: pesca una frase mai uguale all’ultima e la mostra nel fumetto. Su un telefono basta toccarla.',
  variants: [
    {
      name: 'la mascotte, le frasi del ratto',
      args: { label: 'Fai parlare il ratto', phrases: RAT_PHRASES, children: <RatMascot size={96} /> },
    },
    {
      name: 'il ratto, le frasi dello sviluppatore',
      args: { label: 'Fai parlare lo sviluppatore', phrases: DEV_PHRASES, children: <Rat size={96} /> },
    },
  ],
  decorators: [(variant) => <div className="flex justify-center pb-28">{variant}</div>],
});

/** Una scheda autore da sfiorare: un segno e un nome. */
function authorCard(icon: ReactNode, name: string) {
  return (
    <span className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium">
      {icon}
      {name}
    </span>
  );
}

export const hoverEmitterStory = defineStory(HoverEmitter, {
  description:
    'L’easter egg che si accende finché lo sfiori, e che su un telefono parte al tocco per tre secondi. Da fermo fa un cenno.',
  variants: [
    {
      name: 'i fumetti',
      args: { effect: comicBubbles(DEV_PHRASES), children: authorCard(<CodeIcon size={20} className="text-brand-ink" />, 'Superivan94') },
    },
    {
      name: 'la pioggia binaria',
      args: {
        effect: { ...binaryRain(), className: 'pb-binary-digit text-plague-ink' },
        children: authorCard(<RobotIcon size={20} className="text-plague-ink" />, 'AI-Dev'),
      },
    },
    {
      name: 'col cenno sfasato di due secondi',
      args: {
        effect: { ...binaryRain(), className: 'pb-binary-digit text-plague-ink' },
        hintDelayMs: 2000,
        children: authorCard(<RobotIcon size={20} className="text-plague-ink" />, 'AI-Dev'),
      },
    },
  ],
  // I fumetti nascono sopra la scheda: lo spazio in cima è loro.
  decorators: [(variant) => <div className="flex justify-center pt-24 pb-8">{variant}</div>],
});

export const particleBurstStory = defineStory(ParticleBurst, {
  description:
    'Una fontana di segni che parte una volta sola, quando glielo si chiede col riferimento. Chi la chiama sa quanto dura.',
  variants: [
    { name: 'i segni della peste', args: { children: <span className="text-sm font-medium">Qui sotto c’è una fontana</span> } },
    {
      name: 'segni scelti, più fitta',
      args: {
        icons: [DiceIcon, RatIcon],
        count: 24,
        particleClassName: 'text-brand-ink',
        children: <span className="text-sm font-medium">Dadi e ratti</span>,
      },
    },
  ],
  decorators: [
    (variant) => (
      <div className="flex justify-center pt-32">
        <WithHandle<ParticleBurstHandle> label="Sprigiona" onPress={(scoppio) => scoppio.burst()}>
          {variant}
        </WithHandle>
      </div>
    ),
  ],
});
