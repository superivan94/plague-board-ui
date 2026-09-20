import type { ComponentType } from 'react';

import {
  AgeIcon,
  BacillusIcon,
  BiohazardIcon,
  CloudIcon,
  CoccusIcon,
  CodeIcon,
  DiceIcon,
  DifficultyIcon,
  DurationIcon,
  FollowedIcon,
  MoleculeIcon,
  type IconProps,
  PlayersIcon,
  PoisonIcon,
  PotionMugIcon,
  PublisherIcon,
  RatIcon,
  RatingIcon,
  RobotIcon,
  SkullIcon,
  SkullPhonesIcon,
  SkullPhonesOffIcon,
  SparklesIcon,
  VirusIcon,
} from '../src';

/**
 * L'elenco delle icone, e come sono dipinte.
 *
 * Sta in un modulo a parte perché lo leggono in due: `icons.test.tsx` per il contratto comune e
 * `gameIcons.test.tsx` per i sette segni degli attributi di gioco. La tabella è anche l'unico posto
 * che vede **tutte** le icone insieme, ed è quello che permette il controllo sui doppioni: due file
 * quasi identici sono il posto dove un copia e incolla lascia due volte lo stesso tracciato.
 *
 * ⚠️ Si importa da `../src`, cioè dal punto d'ingresso pubblico e non dai file: quello che non passa
 * da `src/index.ts` non esiste per chi installa, quindi un'icona dimenticata lì dev'essere un test
 * rosso.
 *
 * ⚠️ `paint` non è un dettaglio del disegno: un'icona a tratto porta il colore su `stroke` e ha
 * `fill="none"`, e chi le scambia ottiene una macchia nera o un'icona invisibile.
 *
 * ⚠️ Due icone non sono in elenco, e non è una dimenticanza: `DripIcon` non è quadrata e ha il suo
 * blocco in fondo a `icons.test.tsx`, `GoogleIcon` non si tinge e sta in `Login.test.tsx` con gli
 * altri pezzi della schermata di accesso.
 */
export interface IconEntry {
  readonly name: string;
  readonly Icon: ComponentType<IconProps>;
  readonly paint: 'fill' | 'stroke';
}

export const icons: readonly IconEntry[] = [
  { name: 'PoisonIcon', Icon: PoisonIcon, paint: 'fill' },
  { name: 'PotionMugIcon', Icon: PotionMugIcon, paint: 'fill' },
  { name: 'SkullIcon', Icon: SkullIcon, paint: 'fill' },
  { name: 'BiohazardIcon', Icon: BiohazardIcon, paint: 'fill' },
  { name: 'MoleculeIcon', Icon: MoleculeIcon, paint: 'fill' },
  { name: 'VirusIcon', Icon: VirusIcon, paint: 'fill' },
  { name: 'RobotIcon', Icon: RobotIcon, paint: 'fill' },
  { name: 'CodeIcon', Icon: CodeIcon, paint: 'stroke' },
  { name: 'SparklesIcon', Icon: SparklesIcon, paint: 'stroke' },
  { name: 'RatIcon', Icon: RatIcon, paint: 'stroke' },
  { name: 'SkullPhonesIcon', Icon: SkullPhonesIcon, paint: 'fill' },
  { name: 'SkullPhonesOffIcon', Icon: SkullPhonesOffIcon, paint: 'fill' },
  { name: 'BacillusIcon', Icon: BacillusIcon, paint: 'stroke' },
  { name: 'CoccusIcon', Icon: CoccusIcon, paint: 'stroke' },
  { name: 'CloudIcon', Icon: CloudIcon, paint: 'fill' },
  { name: 'DiceIcon', Icon: DiceIcon, paint: 'fill' },
  // I sette attributi di un gioco. Sono tutti a campitura, e non è una preferenza: alla misura a
  // cui si usano — 16px in una scheda — un tratto da 2 su 24 è un pixel e un terzo, e i disegni a
  // tratto della libreria sono infatti quelli col limite più basso (il bacillo si ferma a 20, il
  // cocco a 24). Quello che tiene di ognuna sta in `gameIcons.test.tsx`.
  { name: 'PlayersIcon', Icon: PlayersIcon, paint: 'fill' },
  { name: 'DurationIcon', Icon: DurationIcon, paint: 'fill' },
  { name: 'DifficultyIcon', Icon: DifficultyIcon, paint: 'fill' },
  { name: 'RatingIcon', Icon: RatingIcon, paint: 'fill' },
  { name: 'PublisherIcon', Icon: PublisherIcon, paint: 'fill' },
  { name: 'AgeIcon', Icon: AgeIcon, paint: 'fill' },
  { name: 'FollowedIcon', Icon: FollowedIcon, paint: 'fill' },
];

/**
 * Quanti pezzi staccati ha un tracciato: ogni `M` ne comincia uno.
 *
 * ⚠️ È l'unica misura di un disegno che jsdom concede — `getBBox` lì non esiste, e ogni rettangolo
 * misura zero — quindi la sagoma, i margini e le proporzioni stanno in `COLLAUDI.md`. Quello che si
 * prova qui è che i pezzi ci siano **tutti**: un tracciato che ne perde uno in un copia e incolla
 * continua a disegnare qualcosa di plausibile.
 */
export function pezzi(d: string | null | undefined): number {
  return (d?.match(/M/g) ?? []).length;
}
