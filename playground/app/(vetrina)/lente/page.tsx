import { TechRule } from 'plague-board-ui';

import { Lente } from './Lente';

export default function LentePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-6xl flex-col gap-8 px-4 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">La lente</h1>
        <p className="max-w-3xl text-sm text-muted">
          Il ratto da solo, grande quanto serve, fermo all&apos;istante del passo che si vuole guardare.
          È lo strumento per giudicare le cuciture del pupazzo: i giunti dove le zampe lasciano il
          corpo, i cinque segmenti della coda, il tappo dell&apos;ampolla in cima al sobbalzo. Livrea e
          kit si scelgono come farebbe uno sciame.
        </p>
      </div>

      <TechRule>il soggetto</TechRule>

      <Lente />
    </main>
  );
}
