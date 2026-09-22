'use client';

import Link from 'next/link';
import { TechLabel, TechRule } from 'plague-board-ui';
import { useEffect, useSyncExternalStore } from 'react';

import { readLastStory } from './catalogMemory';
import { withInlineCode } from './withInlineCode';

export interface StoryCardGroup {
  readonly title: string;
  readonly stories: readonly { readonly name: string; readonly description: string; readonly count: number }[];
}

/** L'ultima storia non cambia mentre si guarda l'indice: non c'è niente da ascoltare. */
const noSubscription = () => () => {};

const cardId = (name: string) => `storia-${name}`;

/**
 * Le schede dell'indice, con l'ultima storia visitata accesa e portata in vista.
 *
 * ⚠️ **Accesa col segno della voce corrente della barra** — il filo, il fondo, la scritta — perché
 * è lo stesso fatto detto in un altro posto: «eri qui». Tornando all'indice dopo dieci storie
 * sfogliate con «Prossima», è la scheda da cui ripartire, e in un elenco di cinquantatré non la si
 * ritrova a occhio.
 */
export function StoryCards({ groups }: { groups: readonly StoryCardGroup[] }) {
  const last = useSyncExternalStore(noSubscription, readLastStory, () => null);

  // Porta in vista la scheda, non la pagina: è un effetto sul DOM, niente stato da scrivere.
  useEffect(() => {
    if (last) document.getElementById(cardId(last))?.scrollIntoView({ block: 'center' });
  }, [last]);

  return groups.map((group) => (
    <section key={group.title} className="flex flex-col gap-4">
      <TechRule>{group.title}</TechRule>
      <ul className="grid gap-3 sm:grid-cols-2">
        {group.stories.map(({ name, description, count }) => {
          const isLast = name === last;
          return (
            <li key={name} id={cardId(name)}>
              <Link
                href={`/storie/${name}`}
                aria-current={isLast ? 'true' : undefined}
                className={`flex h-full flex-col gap-1 rounded-lg border p-4 transition-colors focus-visible:focus-ring ${
                  isLast ? 'border-brand-ink bg-brand/10' : 'border-border hover:border-brand-ink'
                }`}
              >
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-mono text-sm font-medium">{name}</span>
                  {isLast ? <TechLabel className="text-brand-ink">l’ultima vista</TechLabel> : null}
                </span>
                <span className="text-xs text-muted">{withInlineCode(description)}</span>
                <TechLabel className="mt-auto pt-1 text-muted">
                  {count} {count === 1 ? 'variante' : 'varianti'}
                </TechLabel>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  ));
}
