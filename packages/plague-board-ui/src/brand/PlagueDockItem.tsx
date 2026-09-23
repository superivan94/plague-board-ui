import type { ComponentPropsWithRef, ReactNode } from 'react';

/** Quello che una voce passa al suo collegamento, quando lo si sostituisce con `render`. */
export type PlagueDockLinkProps = ComponentPropsWithRef<'a'>;

export interface PlagueDockItemProps {
  /** Il segno sopra la parola. È decorativo: il nome della voce è `label`. */
  icon: ReactNode;
  /** La parola sotto il segno, che è anche il nome con cui la voce si annuncia. */
  label: string;
  /** Dove porta. Con `href` la voce è un collegamento; senza, un bottone che chiama `onPress`. */
  href?: string;
  /** Che cosa fa, se non porta a una pagina — cambiare vista, aprire lo scanner. */
  onPress?: () => void;
  /** Se è la sezione in cui si è adesso: `aria-current="page"`, e il verde del marchio. */
  isCurrent?: boolean;
  /**
   * Il collegamento al posto dell'`<a>` predefinito — `(props) => <Link {...props} />` per
   * `next/link`. È la stessa forma del `render` di HeroUI, e come quello è una funzione: chi la
   * passa dichiara `'use client'`.
   */
  render?: (props: PlagueDockLinkProps) => ReactNode;
  /** Classi aggiuntive sulla voce. */
  className?: string;
}

/**
 * La forma di una voce: il segno sopra la parola, la sezione corrente nel verde del marchio. Si
 * scrive `text-brand` e non `text-brand-ink` perché la voce vive dentro {@link PlagueDock}, che è
 * un'isola scura in tutti e due i temi — lì il lime grezzo è quello giusto.
 *
 * ⚠️ **Scritta per esteso**, come tutte le classi della libreria: Tailwind le cerca nel testo.
 */
const VOCE =
  'flex min-w-14 flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-muted transition-colors hover:text-foreground focus-visible:focus-ring aria-[current=page]:bg-brand/15 aria-[current=page]:text-brand';

/**
 * **Una voce della navigazione fissa**: un segno, una parola, e lo stato di sezione corrente.
 *
 * ⚠️ **Il collegamento resta dell'applicazione.** La libreria non sa che cosa sia `next/link`: di
 * serie la voce è un `<a href>`, e chi naviga senza ricaricare passa il suo con `render`. Senza
 * `href` la voce è un `<button>` — RattInventario cambia vista senza cambiare pagina.
 *
 * ⚠️ **Non dichiara `'use client'`**: con un `href` la si scrive anche da una pagina server, e
 * dentro {@link PlagueDock} — che è client — ci arriva già resa.
 */
export function PlagueDockItem({ icon, label, href, onPress, isCurrent = false, render, className = '' }: PlagueDockItemProps) {
  const classi = `${VOCE} ${className}`;
  const corrente = isCurrent ? ('page' as const) : undefined;
  const contenuto = (
    <>
      {/* `size-5` sui segni di dentro: un `size` scritto sull'icona non basterebbe dove una regola
          di HeroUI sostituisce l'attributo, e qui le voci le monta chi vuole. */}
      <span aria-hidden="true" className="flex [&_svg]:size-5">
        {icon}
      </span>
      <span>{label}</span>
    </>
  );

  if (href === undefined) {
    return (
      <button type="button" onClick={onPress} aria-current={corrente} className={classi}>
        {contenuto}
      </button>
    );
  }

  const props: PlagueDockLinkProps = { href, 'aria-current': corrente, className: classi, children: contenuto };
  return render ? render(props) : <a {...props} />;
}
