'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlagueBar, RatIcon, TechLabel } from 'plague-board-ui';

import { PLAYGROUND_PAGES, type PlaygroundPage } from './pages';

/**
 * La barra del playground.
 *
 * ⚠️ **La barra è della libreria, quello che ci sta dentro è dell'applicazione.** `PlagueBar` è la
 * lastra; il marchio, le voci e gli indirizzi li mette questo file, perché sono roba di questo
 * playground e di nessun altro. È la stessa regola per cui nella libreria non entra un header.
 */
function NavLink({ page, isCurrent }: { page: PlaygroundPage; isCurrent: boolean }) {
  return (
    <Link
      href={page.href}
      // ⚠️ Niente `title`: il nome che uno screen reader annuncia diventerebbe la frase lunga
      // invece di «Tavolozza», e il collegamento si leggerebbe in due modi diversi.
      aria-current={isCurrent ? 'page' : undefined}
      className={`text-sm transition-colors ${
        isCurrent
          ? 'text-brand-ink underline decoration-brand/60 underline-offset-8'
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {page.title}
    </Link>
  );
}

export function PlaygroundNav() {
  const pathname = usePathname();
  const demos = PLAYGROUND_PAGES.filter((page) => page.kind === 'demo');
  const essentials = PLAYGROUND_PAGES.filter((page) => page.kind === 'essenziale');

  return (
    <PlagueBar>
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3">
        {/* Il marchio, e batte. ⚠️ Scelto fra cinque candidati il 2026-09-17, e il motivo non è
            estetico: quel segno a prima vista è un cuore, poi due che si abbracciano, e solo per
            via delle orecchie il muso di un ratto. Un cuore che batte dice «acceso» raccontando
            la prima delle sue tre letture, invece di aggiungerne una quarta — che era il difetto
            del pallino che stava qui prima. ⚠️ A 20px: sotto, il tratto interno sparisce. */}
        <span className="flex items-center gap-2">
          <RatIcon size={20} className="animate-heartbeat shrink-0 text-brand" />
          <TechLabel className="text-gray-500">plague-board-ui</TechLabel>
        </span>

        {demos.map((page) => (
          <NavLink key={page.href} page={page} isCurrent={pathname === page.href} />
        ))}

        {essentials.length > 0 && (
          <span className="flex items-center gap-4">
            <span className="h-4 w-px bg-gray-700" aria-hidden="true" />
            <TechLabel className="text-[10px] text-brand/60">filosofia</TechLabel>
            {essentials.map((page) => (
              <NavLink key={page.href} page={page} isCurrent={pathname === page.href} />
            ))}
          </span>
        )}
      </nav>
    </PlagueBar>
  );
}
