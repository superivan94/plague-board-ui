import {
  GlitchText,
  MusicProvider,
  MusicToggle,
  MusicVolume,
  PlagueBackground,
  PlaguePulse,
  PoisonIcon,
  PulseDot,
  TechLabel,
  ToxicBubbles,
  ToxicLevelProvider,
  ToxicLevelSwitch,
  type ToxicLevel,
} from 'plague-board-ui';

import { MusicFromOutside } from './demos/MusicFromOutside';
import { WithAccessibleName } from './demos/WithAccessibleName';
import { defineStory, type StoryDecorator } from './types';

/**
 * Il livello tossico da cui parte la variante.
 *
 * ⚠️ Il fondale, le bolle e il selettore non hanno una prop per il livello: lo leggono dal
 * provider, ed è apposta — sono tre pezzi che devono dire la stessa cosa, e un livello passato a
 * ognuno si scollerebbe dagli altri al primo cambio.
 */
function atLevel(level: ToxicLevel): StoryDecorator {
  return function withLevel(variant) {
    return <ToxicLevelProvider defaultLevel={level}>{variant}</ToxicLevelProvider>;
  };
}

export const toxicLevelProviderStory = defineStory(ToxicLevelProvider, {
  description:
    'Tiene il livello tossico della pagina. Il fondale, le bolle e il selettore lo leggono da lui, quindi cambiano insieme.',
  variants: [
    {
      name: 'parte da medio',
      args: {
        defaultLevel: 'medium',
        children: (
          <div className="flex flex-col gap-4">
            <ToxicLevelSwitch />
            <PlagueBackground className="h-48 rounded-xl" />
          </div>
        ),
      },
    },
    {
      name: 'parte spento',
      args: {
        defaultLevel: 'off',
        children: (
          <div className="flex flex-col gap-4">
            <ToxicLevelSwitch />
            <PlagueBackground className="h-48 rounded-xl" />
          </div>
        ),
      },
    },
  ],
});

export const toxicLevelSwitchStory = defineStory(ToxicLevelSwitch, {
  description:
    'Il comando che dice quanta peste ci deve essere: quattro livelli che si escludono, come un gruppo di radio.',
  variants: [
    { name: 'le parole di casa', args: {} },
    {
      name: 'le parole dell’applicazione',
      args: {
        label: 'Livello delle emissioni',
        labels: { off: 'Aria pulita', low: 'Nebbia', medium: 'Smog', high: 'Nube tossica' },
      },
    },
  ],
  decorators: [atLevel('medium')],
});

/** Un contenuto qualunque sopra il fondale, coi colori del tema: di giorno chiaro, di notte scuro. */
const panelOnScene = (
  <div className="mx-auto max-w-sm rounded-xl border border-brand-ink/40 bg-surface/70 p-6 backdrop-blur-sm">
    <span className="flex items-center gap-2">
      <PulseDot />
      <TechLabel className="text-brand-ink">rete della peste</TechLabel>
    </span>
    <p className="mt-3 font-mono text-2xl text-foreground">Rattoteca</p>
  </div>
);

export const plagueBackgroundStory = defineStory(PlagueBackground, {
  description:
    'Il fondale della peste: il marchio al centro, la città, le gocce, le bolle e i versi, dentro il riquadro che lo ospita. Segue il tema: di notte la città buia, di giorno una nebbia verde-grigia. Una pagina intera si ottiene con `min-h-dvh`.',
  layout: 'fullscreen',
  variants: [
    { name: 'livello alto', args: { className: 'min-h-80' }, decorators: [atLevel('high')] },
    { name: 'livello basso', args: { className: 'min-h-80' }, decorators: [atLevel('low')] },
    {
      name: 'spento',
      note: 'Il livello spegne il gas — velo, icone, gocce, bolle e versi. La città e il marchio restano: sono il posto, non il gas.',
      args: { className: 'min-h-80' },
      decorators: [atLevel('off')],
    },
    { name: 'con un contenuto sopra', args: { className: 'min-h-80 p-8', children: panelOnScene }, decorators: [atLevel('medium')] },
    {
      name: 'scuro anche nel tema chiaro',
      note: 'Avvolto in un contenitore `dark text-foreground`: la scena e quello che ci sta sopra restano di notte in tutti e due i temi, senza nessuna prop.',
      args: { className: 'min-h-80 p-8', children: panelOnScene },
      decorators: [
        atLevel('medium'),
        function inDarkIsland(variant) {
          return <div className="dark text-foreground">{variant}</div>;
        },
      ],
    },
  ],
});

export const toxicBubblesStory = defineStory(ToxicBubbles, {
  description:
    'Le bolle di gas che salgono. Stanno già dentro il fondale; da sole servono a chi vuole solo loro, in un riquadro suo.',
  variants: [
    { name: 'livello alto', args: {}, decorators: [atLevel('high')] },
    { name: 'livello basso', args: {}, decorators: [atLevel('low')] },
  ],
  // Il fondo della scena, che segue il tema come i colori delle bolle: su un nero fisso, di giorno,
  // le bolle chiare sarebbero su un fondo che non è il loro.
  decorators: [(variant) => <div className="relative h-64 overflow-hidden rounded-xl bg-(--pb-scene)">{variant}</div>],
});

export const glitchTextStory = defineStory(GlitchText, {
  description:
    'L’effetto glitch sul nome: due copie sfalsate, una ciano e una rosa, che si vedono a fette. Con `reveal`, ogni tre secondi la parola nascosta prende il posto del nome. Va addosso a un titolo scritto dall’applicazione.',
  variants: [
    {
      name: 'con la parola EVIL',
      note: 'Ogni tre secondi la parola EVIL passa due volte a fette e poi compare intera, sfarfallando. Mentre è accesa «E.» si spegne, quindi non serve nessun fondo sotto: vale sul chiaro come sullo scuro.',
      args: { children: 'E.', reveal: 'EVIL', className: 'text-brand-ink' },
    },
    { name: 'solo l’effetto glitch', args: { children: 'E.', className: 'text-brand-ink' } },
    {
      name: 'con la parola EVIL spenta',
      note: 'Le prop della prima più `isRevealEnabled={false}`: resta l’effetto glitch, uguale alla variante senza `reveal`, e la parola non finisce nella pagina.',
      args: { children: 'E.', reveal: 'EVIL', isRevealEnabled: false, className: 'text-brand-ink' },
    },
  ],
  decorators: [
    (variant) => (
      <h2 className="font-mono text-3xl tracking-wide">
        LUDORATTI {variant} CORP
      </h2>
    ),
  ],
});

export const plaguePulseStory = defineStory(PlaguePulse, {
  description: 'Il pulsare che mette l’occhio su un comando: avvolge, non marca.',
  variants: [
    {
      name: 'attorno a un comando',
      args: {
        children: (
          <button type="button" className="flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium text-white">
            <PoisonIcon size={18} />
            Avvia il protocollo
          </button>
        ),
      },
    },
  ],
  decorators: [(variant) => <div className="max-w-xs rounded-xl bg-gray-900 p-6">{variant}</div>],
});

export const pulseDotStory = defineStory(PulseDot, {
  description: 'Il pallino di stato: acceso pulsa, fermo dice che la cosa c’è ma non lavora.',
  variants: [
    { name: 'acceso', args: {} },
    { name: 'fermo', args: { isStatic: true, className: 'bg-muted' } },
    { name: 'più grande', args: { size: 16 } },
  ],
});

/** La musica si governa dal provider, quindi ogni suo comando ne vuole uno sopra. */
const withMusic: StoryDecorator = (variant) => <MusicProvider>{variant}</MusicProvider>;

export const musicProviderStory = defineStory(MusicProvider, {
  description:
    'Tiene la traccia e il suo volume. I comandi la governano da dove li si mette, e uno lo si può scrivere da sé con `useMusic`.',
  variants: [
    {
      name: 'i due comandi di casa e uno scritto da fuori',
      args: {
        children: (
          <div className="flex flex-wrap items-center gap-4">
            <MusicToggle />
            <MusicVolume className="w-40" />
            <MusicFromOutside />
          </div>
        ),
      },
    },
  ],
});

export const musicToggleStory = defineStory(MusicToggle, {
  description:
    'Il teschio con le cuffie: mette e toglie la musica. Suona solo quando lo si preme, mai al primo gesto qualunque. Sotto ogni variante c’è il nome con cui il comando si annuncia, che a schermo non si vede.',
  variants: [
    { name: 'la misura predefinita, 22 px', args: {} },
    { name: 'più grande, 32 px', args: { size: 32 } },
    {
      name: 'le parole dell’applicazione',
      note: 'Cambia solo il nome con cui il comando si annuncia: premilo e passa da «Accendi la radio» a «Spegni la radio». Il segno è lo stesso della prima.',
      args: { playLabel: 'Accendi la radio', pauseLabel: 'Spegni la radio' },
    },
  ],
  // Dal più esterno: la musica, poi il nome, che legge il comando dal DOM.
  decorators: [
    withMusic,
    function withName(variant) {
      return <WithAccessibleName>{variant}</WithAccessibleName>;
    },
  ],
});

export const musicVolumeStory = defineStory(MusicVolume, {
  description: 'Il cursore del volume, per chi vuole governarlo oltre a spegnere.',
  variants: [
    { name: 'a passi di dieci', args: { className: 'w-48' } },
    {
      name: 'a passi di venticinque',
      note: 'Da fermo è uguale alla prima: la differenza si sente con le frecce della tastiera, quattro passi dal silenzio al pieno invece di dieci.',
      args: { step: 25, className: 'w-48' },
    },
  ],
  decorators: [withMusic],
});
