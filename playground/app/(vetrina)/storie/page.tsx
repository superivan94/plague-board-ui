import type { Metadata } from 'next';
import Link from 'next/link';
import { TechLabel, TechRule } from 'plague-board-ui';

import { STORIES, STORY_NAMES } from '@/stories';

import { withInlineCode } from './withInlineCode';

export const metadata: Metadata = { title: 'Le storie — plague-board-ui' };

const isIcon = (name: string) => name.endsWith('Icon') || name === 'IconBase';

const GROUPS = [
  { title: 'i componenti', names: STORY_NAMES.filter((name) => !isIcon(name)) },
  { title: 'le icone', names: STORY_NAMES.filter(isIcon) },
];

export default function StoriesPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Le storie</h1>
        <p className="text-sm text-muted">
          Ogni componente della libreria da solo, nelle sue varianti. Ogni variante si guarda alla
          larghezza di un telefono, di un tablet e della finestra intera, con il tema chiaro e lo
          scuro affiancati. Le altre pagine spiegano a che cosa serve un pezzo e lo mostrano insieme
          agli altri; qui si controlla che regga da solo.
        </p>
        <p className="text-sm text-muted">
          <strong>Ogni componente esportato ha la sua storia</strong>: uno senza fa fallire il
          controllo dei tipi del playground, che lo nomina.
        </p>
      </div>

      {GROUPS.map((group) => (
        <section key={group.title} className="flex flex-col gap-4">
          <TechRule>{group.title}</TechRule>
          <ul className="grid gap-3 sm:grid-cols-2">
            {group.names.map((name) => {
              const story = STORIES[name];
              const count = story.variants.length;
              return (
                <li key={name}>
                  <Link
                    href={`/storie/${name}`}
                    className="flex h-full flex-col gap-1 rounded-lg border border-border p-4 transition-colors hover:border-brand-ink focus-visible:focus-ring"
                  >
                    <span className="font-mono text-sm font-medium">{name}</span>
                    <span className="text-xs text-muted">{withInlineCode(story.description)}</span>
                    <TechLabel className="mt-auto pt-1 text-muted">
                      {count} {count === 1 ? 'variante' : 'varianti'}
                    </TechLabel>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
}
