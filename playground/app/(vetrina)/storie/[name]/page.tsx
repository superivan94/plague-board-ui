import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PLAYGROUND_PAGES } from '@/app/pages';
import { STORIES, STORY_NAMES, isStoryName } from '@/stories';

import { StoryFrames } from '../StoryFrames';
import { withInlineCode } from '../withInlineCode';

type Params = Promise<{ name: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return STORY_NAMES.map((name) => ({ name }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { name } = await params;
  return { title: `${name} — le storie di plague-board-ui` };
}

/** Una storia: il componente, a che cosa serve, dove lavora, e le sue varianti nelle cornici. */
export default async function StoryPage({ params }: { params: Params }) {
  const { name } = await params;
  if (!isStoryName(name)) notFound();

  const story = STORIES[name];
  // ⚠️ Il registro delle pagine dice quali componenti mostra ognuna: qui si legge al rovescio, per
  // portare dalla storia — che controlla — alla pagina che spiega.
  const pages = PLAYGROUND_PAGES.filter((page) => page.components.includes(name));

  return (
    <main className="flex flex-col gap-8 px-4 py-12 sm:px-8">
      <div className="flex max-w-3xl flex-col gap-2">
        <Link href="/storie" className="w-fit text-sm text-muted hover:text-foreground focus-visible:focus-ring">
          ← tutte le storie
        </Link>
        <h1 className="font-mono text-2xl font-semibold">{name}</h1>
        <p className="text-sm text-muted">{withInlineCode(story.description)}</p>
        {pages.length > 0 && (
          <p className="text-sm text-muted">
            Si vede al lavoro in{' '}
            {pages.map((page, index) => (
              <span key={page.href}>
                {index > 0 && ' · '}
                <Link href={page.href} className="text-brand-ink underline underline-offset-4">
                  {page.title}
                </Link>
              </span>
            ))}
            .
          </p>
        )}
      </div>

      {/* Solo nomi e note, cioè testo: gli `args` possono portare funzioni, e una funzione non
          attraversa il confine verso un componente client. */}
      <StoryFrames
        name={name}
        variants={story.variants.map(({ name: variantName, note }) => ({ name: variantName, note }))}
        frameHeight={story.frameHeight}
      />
    </main>
  );
}
