'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TechLabel } from 'plague-board-ui';

import { PLAYGROUND_PAGES } from '../pages';

/**
 * Se un nome del registro è quello di un componente: l'iniziale maiuscola, e non tutto maiuscolo.
 *
 * ⚠️ È lo stesso criterio di `ComponentName` in `stories/types.ts`, detto a runtime, e basta a
 * sapere che la storia c'è: il guard garantisce che ogni componente ne abbia una. Si ripete qui
 * invece di importare l'indice delle storie perché l'indice porta con sé la libreria intera, e
 * questo pezzo sta in ogni pagina.
 */
const isComponentName = (name: string) => /^[A-Z]/.test(name) && name !== name.toUpperCase();

/**
 * In fondo a ogni pagina, le storie dei componenti che mostra: dalla pagina che spiega a quella che
 * controlla. Il verso opposto lo fa la storia, che nomina la pagina in cui il componente lavora.
 */
export function PageStories() {
  const pathname = usePathname();
  const names = PLAYGROUND_PAGES.find((page) => page.href === pathname)?.components.filter(isComponentName) ?? [];
  if (names.length === 0) return null;

  return (
    <nav aria-label="Le storie di questa pagina" className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-3 gap-y-1 px-4 pb-12">
      <TechLabel className="text-muted">le storie</TechLabel>
      {names.map((name) => (
        <Link key={name} href={`/storie/${name}`} className="font-mono text-sm text-brand-ink underline underline-offset-4">
          {name}
        </Link>
      ))}
    </nav>
  );
}
