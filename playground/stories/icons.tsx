import {
  BacillusIcon,
  BiohazardIcon,
  CloudIcon,
  CoccusIcon,
  CodeIcon,
  DiceIcon,
  DripIcon,
  GoogleIcon,
  IconBase,
  MoleculeIcon,
  PoisonIcon,
  PotionMugIcon,
  RatIcon,
  RobotIcon,
  SkullIcon,
  SkullPhonesIcon,
  SkullPhonesOffIcon,
  SparklesIcon,
  VirusIcon,
  type IconProps,
} from 'plague-board-ui';
import type { ComponentType } from 'react';

import { defineStory, type StoryDecorator, type StoryVariant } from './types';

/**
 * Le tre misure della tavolozza: in un fondale, accanto a un testo, dentro una riga di stato. Sono
 * le stesse della tabella dei segni su `/`, e lì c'è scritto sotto quale ognuna smette di reggere.
 */
const SIZE_VARIANTS: readonly StoryVariant<IconProps>[] = [
  { name: 'in un fondale, 56 px', args: { size: 56 } },
  { name: 'accanto a un testo, 24 px', args: { size: 24 } },
  { name: 'in una riga di stato, 16 px', args: { size: 16 } },
];

/** Le icone non hanno un colore loro: prendono quello del testo che le contiene, e qui è questo. */
const inPlagueInk: StoryDecorator = (variant) => <span className="flex text-plague-ink">{variant}</span>;

/** La storia di un segno che non ha niente oltre a `IconProps`: le tre misure, e basta. */
function iconStory(icon: ComponentType<IconProps>, description: string) {
  return defineStory(icon, { description, variants: SIZE_VARIANTS, decorators: [inPlagueInk] });
}

export const bacillusIconStory = iconStory(
  BacillusIcon,
  'Il bacillo: un batterio con un verso, da mettere accanto a una parola.',
);

export const biohazardIconStory = iconStory(
  BiohazardIcon,
  'Il cartello del pericolo biologico: dice «qui c’è la peste», non «un contagio».',
);

export const cloudIconStory = iconStory(
  CloudIcon,
  'La cappa di smog: si usa grande e tenue, dietro tutto, non accanto a un testo.',
);

export const coccusIconStory = iconStory(
  CoccusIcon,
  'Il cocco: un batterio senza verso, che galleggia in un fondale senza sembrare storto.',
);

export const codeIconStory = iconStory(CodeIcon, 'Il segno dell’autore umano, nella firma del piede.');

export const diceIconStory = iconStory(
  DiceIcon,
  'Il dado: il terzo termine del marchio, dopo la peste e i ratti. Sta dove si nomina il gioco.',
);

export const dripIconStory = defineStory(DripIcon, {
  description:
    'La goccia che cade dal fondale: l’unica icona non quadrata, alta due volte e mezzo la sua larghezza.',
  variants: [
    { name: 'la misura predefinita, 8 px', args: {} },
    { name: 'larga 16', args: { size: 16 } },
    { name: 'allungata dalla caduta', args: { size: 16, height: 72 } },
  ],
  decorators: [inPlagueInk],
});

export const googleIconStory = defineStory(GoogleIcon, {
  description:
    'Il marchio di Google nei suoi quattro colori. Non si tinge: il tipo non accetta `color`.',
  variants: SIZE_VARIANTS,
});

/** Due persone, a campitura: un segno di dominio, cioè di quelli che la libreria non avrà mai. */
const PLAYERS_PATH =
  'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-6 8a6 6 0 0 1 12 0v1H3v-1Zm13.5-8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM17 20v-1a7.9 7.9 0 0 0-1.6-4.8A5 5 0 0 1 21 19v1h-4Z';

export const iconBaseStory = defineStory(IconBase, {
  description:
    'L’involucro con cui un’applicazione disegna le icone sue: griglia 24×24, il colore del testo, e la regola su `title`. Si passa solo il tracciato.',
  variants: [
    { name: 'a campitura: i giocatori', args: { size: 56, children: <path d={PLAYERS_PATH} /> } },
    {
      name: 'a tratto: la durata',
      args: {
        size: 56,
        paint: 'stroke',
        children: (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </>
        ),
      },
    },
  ],
  decorators: [inPlagueInk],
});

export const moleculeIconStory = iconStory(
  MoleculeIcon,
  'La molecola: fra i segni della peste è quello che regge meglio il piccolo, perché i suoi dischi sono staccati.',
);

export const poisonIconStory = iconStory(
  PoisonIcon,
  'L’ampolla della mascotte: un accento su un’azione, il comando che manda o che apre.',
);

/** L'antenato che accende le bolle: senza, la tazza resta ferma. */
const live: StoryDecorator = (variant) => <span className="pb-potion-live flex">{variant}</span>;

export const potionMugIconStory = defineStory(PotionMugIcon, {
  description:
    'La tazza del comando delle donazioni. Le bolle si muovono solo dentro un antenato `.pb-potion-live`: fuori, la stessa tazza resta ferma.',
  variants: [
    { name: 'ferma, 56 px', args: { size: 56 } },
    { name: 'animata, 56 px', args: { size: 56 }, decorators: [live] },
    { name: 'animata, 24 px', args: { size: 24 }, decorators: [live] },
  ],
  decorators: [inPlagueInk],
});

export const ratIconStory = defineStory(RatIcon, {
  description:
    'Il marchio: un cuore che è anche il muso di un ratto. Ha due stati — vuoto e pieno, come un preferito — e batte da sé.',
  variants: [
    { name: 'vuoto', args: { size: 56 } },
    { name: 'pieno', args: { size: 56, isFilled: true } },
    { name: 'pieno, col muso intero', args: { size: 96, isFilled: true, muzzle: 'full' } },
    { name: 'batte solo il cuore', args: { size: 56, beat: 'inner' } },
    { name: 'fermo', args: { size: 56, animateOn: 'none' } },
  ],
  decorators: [(variant) => <span className="flex text-brand-ink">{variant}</span>],
});

export const robotIconStory = iconStory(RobotIcon, 'Il segno dell’autore AI, nella firma del piede.');

export const skullIconStory = iconStory(SkullIcon, 'Il teschio: la peste che uccide.');

export const skullPhonesIconStory = iconStory(
  SkullPhonesIcon,
  'Il teschio con le cuffie: la musica che suona, nel comando dell’audio.',
);

export const skullPhonesOffIconStory = iconStory(
  SkullPhonesOffIcon,
  'Lo stesso teschio con la sbarra: la musica spenta. Da sola non basta, il comando porta anche `aria-pressed`.',
);

export const sparklesIconStory = iconStory(SparklesIcon, 'Le scintille: l’accento «AI» del marchio.');

export const virusIconStory = iconStory(
  VirusIcon,
  'Il virione: l’unico contagio a campitura piena, che resta riconoscibile anche quando il dettaglio è sparito.',
);
