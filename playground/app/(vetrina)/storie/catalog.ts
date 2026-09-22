import { STORY_NAMES } from '@/stories';
import type { ComponentName } from '@/stories/types';

const isIcon = (name: string) => name.endsWith('Icon') || name === 'IconBase';

/** I due gruppi dell'indice: i componenti, poi le icone. */
export const STORY_GROUPS = [
  { title: 'i componenti', names: STORY_NAMES.filter((name) => !isIcon(name)) },
  { title: 'le icone', names: STORY_NAMES.filter(isIcon) },
];

/**
 * L'ordine in cui le storie si sfogliano con «Precedente» e «Prossima».
 *
 * ⚠️ È quello dell'indice, gruppo dopo gruppo, e non l'alfabetico di `STORIES`: chi scorre le
 * storie una dopo l'altra deve incontrarle nell'ordine in cui le vede elencate, o «Prossima»
 * salterebbe da `BarRow` a `BiohazardIcon`.
 */
export const STORY_ORDER: readonly ComponentName[] = STORY_GROUPS.flatMap((group) => group.names);

/** La storia prima e quella dopo; `undefined` agli estremi, dove l'elenco finisce e non gira. */
export function neighbours(name: ComponentName): { previous?: ComponentName; next?: ComponentName } {
  const index = STORY_ORDER.indexOf(name);
  return { previous: STORY_ORDER[index - 1], next: STORY_ORDER[index + 1] };
}
