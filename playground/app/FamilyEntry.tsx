import Link from 'next/link';
import { TechLabel } from 'plague-board-ui';

import type { PlaygroundPage } from './pages';

/**
 * Una voce di pagina, nel popover di una famiglia o nel cassetto delle pagine: il nome di casa, i
 * componenti che mostra, e che cosa ci si trova.
 */
export function FamilyEntry({ page, isCurrent, onGo }: { page: PlaygroundPage; isCurrent: boolean; onGo: () => void }) {
  const Icon = page.icon;

  return (
    <Link
      href={page.href}
      aria-current={isCurrent ? 'page' : undefined}
      // ⚠️ Il popover — o il cassetto — si chiude **qui**, sulla pressione del collegamento, e non
      // in un effetto che guarda il percorso: con Next la barra non si smonta cambiando pagina,
      // quindi senza questa riga il menù resterebbe aperto sopra la pagina nuova. Un effetto lo
      // farebbe con un `setState` che `react-hooks/set-state-in-effect` rifiuta, e a ragione.
      onClick={onGo}
      // ⚠️ Tre segni insieme per la pagina corrente — il filo a sinistra, il fondo, e la scritta
      // «sei qui» — perché uno solo non si notava: il fondo `default/40` da solo era una
      // differenza di luminosità che su un pannello chiaro si perde.
      className={`flex flex-col gap-0.5 rounded-lg border-l-2 px-3 py-2 transition-colors ${
        isCurrent ? 'border-brand-ink bg-brand/10' : 'border-transparent hover:bg-default/50'
      }`}
    >
      {/* ⚠️ `whitespace-nowrap` sul nome: senza, «La voce» si spezzava in due righe per fare posto
          all'elenco dei componenti, che è lungo tre nomi. A mandare a capo dev'essere l'elenco,
          che è fatto di pezzi, non il nome, che è una cosa sola. */}
      <span className="flex flex-wrap items-baseline gap-x-2">
        {Icon ? <Icon size={16} className="shrink-0 self-center text-brand-ink" /> : null}
        <span className={`text-sm font-medium whitespace-nowrap ${isCurrent ? 'text-brand-ink' : ''}`}>
          {page.title}
        </span>
        {isCurrent && <TechLabel className="text-brand-ink">sei qui</TechLabel>}
        {page.components.length > 0 && <TechLabel className="text-muted">{page.components.join(' · ')}</TechLabel>}
      </span>
      <span className="text-xs text-muted">{page.blurb}</span>
    </Link>
  );
}
