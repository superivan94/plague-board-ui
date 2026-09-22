import type { Metadata } from 'next';

import { STORIES } from '@/stories';

import { STORY_GROUPS } from './catalog';
import { StoryCards, type StoryCardGroup } from './StoryCards';

export const metadata: Metadata = { title: 'Le storie — plague-board-ui' };

// Solo testo verso le schede, che sono client: una storia porta componenti e funzioni.
const GROUPS: readonly StoryCardGroup[] = STORY_GROUPS.map((group) => ({
  title: group.title,
  stories: group.names.map((name) => ({
    name,
    description: STORIES[name].description,
    count: STORIES[name].variants.length,
  })),
}));

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

      <StoryCards groups={GROUPS} />
    </main>
  );
}
