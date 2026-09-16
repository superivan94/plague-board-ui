'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { PLAYGROUND_PAGES } from './pages';

/**
 * La barra del playground: un posto solo da cui si raggiungono tutte le pagine.
 *
 * ⚠️ Volutamente **spenta**. È la cornice attorno a ciò che si sta giudicando, e una cornice che
 * usa i colori della libreria toglie il fondo neutro contro cui li si guarda: i pezzi qui sotto si
 * confrontano con `rattinventario.ludoratti.it`, non con questa barra.
 */
export function PlaygroundNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-gray-800 bg-black/70 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-1 px-4 py-3">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
          plague-board-ui
        </span>

        {PLAYGROUND_PAGES.map((page) => {
          const current = pathname === page.href;
          return (
            <Link
              key={page.href}
              href={page.href}
              // ⚠️ Niente `title`: il nome che uno screen reader annuncia diventerebbe la frase
              // lunga invece di «Tavolozza», e il collegamento si leggerebbe in due modi diversi.
              // La riga di `blurb` serve all'indice delle storie, non alla barra.
              aria-current={current ? 'page' : undefined}
              className={`text-sm transition-colors ${
                current ? 'text-white underline underline-offset-4' : 'text-gray-400 hover:text-white'
              }`}
            >
              {page.title}
              {page.kind === 'essenziale' && (
                // Il pallino dice «questa pagina spiega, non mostra». Il titolo non lo direbbe.
                <span className="ml-1 align-super text-[8px] text-brand" aria-hidden="true">
                  ●
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
