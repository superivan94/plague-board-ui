import Link from 'next/link';
import { TechLabel } from 'plague-board-ui';

import type { ComponentName } from '@/stories/types';

import { neighbours } from './catalog';

/**
 * «Precedente» e «Prossima», per sfogliare le storie senza tornare all'indice.
 *
 * ⚠️ **Due forme, in cima e in fondo.** In cima una riga corta accanto a «tutte le storie», per chi
 * sa già dove vuole andare; in fondo due schede larghe, perché è lì che si arriva dopo aver
 * guardato l'ultima variante — e una storia con sette varianti a 768 è lunga. Il nome della storia
 * accanto alla parola, perché «Prossima» da sola non dice dove si va.
 */
export function StoryPager({ name, placement }: { name: ComponentName; placement: 'top' | 'bottom' }) {
  const { previous, next } = neighbours(name);

  if (placement === 'top') {
    return (
      <nav aria-label="Le storie vicine" className="flex items-center gap-4 text-sm">
        {previous ? (
          <Link href={`/storie/${previous}`} className="text-muted hover:text-foreground focus-visible:focus-ring">
            ‹ <span className="font-mono">{previous}</span>
          </Link>
        ) : null}
        {next ? (
          <Link href={`/storie/${next}`} className="text-muted hover:text-foreground focus-visible:focus-ring">
            <span className="font-mono">{next}</span> ›
          </Link>
        ) : null}
      </nav>
    );
  }

  return (
    <nav aria-label="Le storie vicine" className="grid gap-3 sm:grid-cols-2">
      {previous ? (
        <PagerCard href={`/storie/${previous}`} label="‹ Precedente" name={previous} />
      ) : (
        <span />
      )}
      {next ? <PagerCard href={`/storie/${next}`} label="Prossima ›" name={next} align="end" /> : null}
    </nav>
  );
}

function PagerCard({ href, label, name, align = 'start' }: { href: string; label: string; name: string; align?: 'start' | 'end' }) {
  return (
    <Link
      href={href}
      className={`flex flex-col gap-1 rounded-lg border border-border p-4 transition-colors hover:border-brand-ink focus-visible:focus-ring ${
        align === 'end' ? 'items-end text-right' : ''
      }`}
    >
      <TechLabel className="text-muted">{label}</TechLabel>
      <span className="font-mono text-sm font-medium">{name}</span>
    </Link>
  );
}
