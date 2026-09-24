import * as Library from 'plague-board-ui';

import { googleSignInButtonStory, loginScreenStory, plagueDividerStory } from './access';
import {
  glitchTextStory,
  musicProviderStory,
  musicToggleStory,
  musicVolumeStory,
  plagueBackgroundStory,
  plaguePulseStory,
  pulseDotStory,
  toxicBubblesStory,
  toxicLevelProviderStory,
  toxicLevelSwitchStory,
} from './atmosphere';
import {
  barRowStory,
  creditCardStory,
  creditLineStory,
  plagueBarStory,
  plagueFootBarStory,
  supportButtonStory,
  techLabelStory,
  techRuleStory,
  versionTagStory,
} from './bar';
import { plagueDockItemStory, plagueDockStory } from './dock';
import {
  bacillusIconStory,
  biohazardIconStory,
  cloudIconStory,
  coccusIconStory,
  codeIconStory,
  diceIconStory,
  dripIconStory,
  googleIconStory,
  iconBaseStory,
  moleculeIconStory,
  monitorIconStory,
  moonIconStory,
  poisonIconStory,
  potionMugIconStory,
  ratIconStory,
  robotIconStory,
  skullIconStory,
  skullPhonesIconStory,
  skullPhonesOffIconStory,
  sparklesIconStory,
  sunIconStory,
  virusIconStory,
} from './icons';
import {
  countedChipsStory,
  plagueAvatarStory,
  plaguePanelStory,
  profileMenuStory,
  thematicBadgeStory,
} from './profile';
import { ratMascotStory, ratRunStory, ratStory, ratSwarmStory } from './rat';
import {
  plagueAlertStory,
  plagueConfirmDialogStory,
  plagueDialogStory,
  plagueEmptyStateStory,
  plagueLoaderStory,
  plagueToastRegionStory,
} from './states';
import { themeSwitchStory } from './theme';
import type { ComponentName, StoryIndex } from './types';
import { hoverEmitterStory, particleBurstStory, speechBubbleStory, talkingMascotStory } from './voice';

/**
 * Tutte le storie, una per componente, col nome del componente come chiave.
 *
 * ⚠️ **È l'elenco che il guard legge**, ed è esplicito apposta: un componente nuovo nel pacchetto
 * senza la sua riga qui è un errore di `tsc` che lo nomina, e una riga di troppo pure — vedi
 * {@link StoryIndex}. È anche l'unica forma che Next risolve senza trucchi di bundler.
 */
export const STORIES = {
  BacillusIcon: bacillusIconStory,
  BarRow: barRowStory,
  BiohazardIcon: biohazardIconStory,
  CloudIcon: cloudIconStory,
  CoccusIcon: coccusIconStory,
  CodeIcon: codeIconStory,
  CountedChips: countedChipsStory,
  CreditCard: creditCardStory,
  CreditLine: creditLineStory,
  DiceIcon: diceIconStory,
  DripIcon: dripIconStory,
  GlitchText: glitchTextStory,
  GoogleIcon: googleIconStory,
  GoogleSignInButton: googleSignInButtonStory,
  HoverEmitter: hoverEmitterStory,
  IconBase: iconBaseStory,
  LoginScreen: loginScreenStory,
  MoleculeIcon: moleculeIconStory,
  MonitorIcon: monitorIconStory,
  MoonIcon: moonIconStory,
  MusicProvider: musicProviderStory,
  MusicToggle: musicToggleStory,
  MusicVolume: musicVolumeStory,
  ParticleBurst: particleBurstStory,
  PlagueAlert: plagueAlertStory,
  PlagueAvatar: plagueAvatarStory,
  PlagueBackground: plagueBackgroundStory,
  PlagueBar: plagueBarStory,
  PlagueConfirmDialog: plagueConfirmDialogStory,
  PlagueDialog: plagueDialogStory,
  PlagueDivider: plagueDividerStory,
  PlagueDock: plagueDockStory,
  PlagueDockItem: plagueDockItemStory,
  PlagueEmptyState: plagueEmptyStateStory,
  PlagueFootBar: plagueFootBarStory,
  PlagueLoader: plagueLoaderStory,
  PlaguePanel: plaguePanelStory,
  PlaguePulse: plaguePulseStory,
  PlagueToastRegion: plagueToastRegionStory,
  PoisonIcon: poisonIconStory,
  PotionMugIcon: potionMugIconStory,
  ProfileMenu: profileMenuStory,
  PulseDot: pulseDotStory,
  Rat: ratStory,
  RatIcon: ratIconStory,
  RatMascot: ratMascotStory,
  RatRun: ratRunStory,
  RatSwarm: ratSwarmStory,
  RobotIcon: robotIconStory,
  SkullIcon: skullIconStory,
  SkullPhonesIcon: skullPhonesIconStory,
  SkullPhonesOffIcon: skullPhonesOffIconStory,
  SparklesIcon: sparklesIconStory,
  SpeechBubble: speechBubbleStory,
  SunIcon: sunIconStory,
  SupportButton: supportButtonStory,
  TalkingMascot: talkingMascotStory,
  TechLabel: techLabelStory,
  TechRule: techRuleStory,
  ThematicBadge: thematicBadgeStory,
  ThemeSwitch: themeSwitchStory,
  ToxicBubbles: toxicBubblesStory,
  ToxicLevelProvider: toxicLevelProviderStory,
  ToxicLevelSwitch: toxicLevelSwitchStory,
  VersionTag: versionTagStory,
  VirusIcon: virusIconStory,
} satisfies StoryIndex;

/** I nomi delle storie, nell'ordine dell'indice. */
export const STORY_NAMES: readonly ComponentName[] = Object.keys(STORIES).filter(
  (name): name is ComponentName => name in STORIES,
);

/** Se un segmento di indirizzo nomina una storia: le pagine del catalogo lo ricevono come testo. */
export function isStoryName(name: string): name is ComponentName {
  return name in STORIES;
}

/**
 * Il guard che il compilatore non può fare: la storia sotto il nome giusto.
 *
 * ⚠️ Per `tsc` due componenti con le stesse prop sono lo stesso tipo — le diciannove icone hanno
 * tutte `IconProps`, e `BarRow`, `TechLabel` e `PlaguePanel` prendono tutti un figlio e una classe
 * — quindi `CloudIcon: dripIconStory` compila, e la pagina di `CloudIcon` mostrerebbe una goccia.
 * Questo controllo gira al primo import dell'indice: a ogni `next build`, e in sviluppo alla prima
 * pagina del catalogo.
 */
const LIBRARY: Readonly<Record<string, unknown>> = Library;
const MISNAMED = STORY_NAMES.filter((name) => LIBRARY[name] !== STORIES[name].component);
if (MISNAMED.length > 0) {
  throw new Error(`Storie sotto il nome di un altro componente: ${MISNAMED.join(', ')}.`);
}
