'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { RatIcon } from '../icons/RatIcon.js';

/** Da che lato dello schermo sta: in alto e in basso in orizzontale, ai lati in verticale. */
export type PlagueDockPlacement = 'bottom' | 'top' | 'left' | 'right';

export interface PlagueDockProps {
  /** Le voci: {@link PlagueDockItem}, da tre a cinque. */
  children: ReactNode;
  /** Da che lato sta. Di serie in basso, dove arriva il pollice. */
  placement?: PlagueDockPlacement;
  /** Il nome della navigazione per chi non la vede. Di serie «Navigazione principale». */
  label?: string;
  /**
   * Dopo quanti millisecondi senza un gesto sulla navigazione si ritira. Di serie 8000 (utente,
   * 2026-09-23); `0` la tiene sempre aperta.
   */
  autoHideMs?: number;
  /** Il nome del comando che la fa ricrescere. Di serie «Mostra la navigazione». */
  expandLabel?: string;
  /** Il segno di quel comando. Di serie il marchio pieno. */
  expandIcon?: ReactNode;
  /**
   * Quanto staccarla dal bordo, oltre al margine suo e all'incavo del telefono — una lunghezza CSS.
   * Serve a farla stare **sopra** il piede: gli si passa l'altezza del piede.
   */
  edgeOffset?: string;
  /** Classi aggiuntive sulla navigazione. */
  className?: string;
}

/**
 * Il posto di ogni lato: il bordo a cui si attacca, il verso in cui centra, e il margine che tiene
 * conto dell'incavo e di `edgeOffset`.
 *
 * ⚠️ **Scritte per esteso**, perché Tailwind le classi le cerca nel testo; e il `+` di un `calc`
 * vuole gli spazi, che in un valore arbitrario si scrivono `_` — la stessa regola del piede.
 */
const POSTO: Record<PlagueDockPlacement, string> = {
  bottom:
    'inset-x-0 bottom-0 justify-center pb-[calc(var(--spacing)*3_+_var(--pb-dock-offset,0px)_+_env(safe-area-inset-bottom))]',
  top: 'inset-x-0 top-0 justify-center pt-[calc(var(--spacing)*3_+_var(--pb-dock-offset,0px)_+_env(safe-area-inset-top))]',
  left: 'inset-y-0 left-0 items-center pl-[calc(var(--spacing)*3_+_var(--pb-dock-offset,0px)_+_env(safe-area-inset-left))]',
  right:
    'inset-y-0 right-0 items-center pr-[calc(var(--spacing)*3_+_var(--pb-dock-offset,0px)_+_env(safe-area-inset-right))]',
};

/**
 * **La navigazione fissa dei Ludoratti**: le sezioni principali di un'applicazione in una fila, con
 * lo stile della barra, attaccata a un lato dello schermo — in basso o in alto in orizzontale, a
 * sinistra o a destra in verticale. Nasce dalla fila in fondo a RattInventario, che si usa col
 * pollice durante un evento, ed è stata **migliorata** su richiesta dell'utente (2026-09-23).
 *
 * **Si ritira da sola**: dopo `autoHideMs` senza un gesto **sulla navigazione** — non sulla pagina:
 * si ritira anche mentre si lavora altrove (utente) — si raccoglie verso il proprio centro e lascia
 * al suo posto un comando col marchio; premuto, la navigazione ricresce.
 *
 * ⚠️ **Non si ritira mai col puntatore sopra o col fuoco dentro**: chi la sta usando da tastiera
 * la perderebbe a metà di una tabulazione. Ritirata è `inert`, quindi fuori dall'ordine di
 * tabulazione e dall'albero di accessibilità anche mentre l'animazione la fa ancora vedere.
 *
 * ⚠️ **Ricrescendo porta il fuoco alla prima voce, ma solo da tastiera.** Il comando sparisce, e
 * chi l'ha premuto con Invio se lo ritroverebbe sul `body`; col mouse invece il fuoco lasciato su
 * una voce la terrebbe aperta per sempre, perché col fuoco dentro non si ritira. La differenza la
 * dice `detail` del clic: zero quando lo sintetizza la tastiera.
 *
 * ⚠️ **Con «meno movimento» il ritiro è uno scambio secco**: le transizioni le spegne una regola
 * sua in `animations.css`, perché quella delle animazioni non le tocca.
 *
 * @example
 * ```tsx
 * <PlagueDock edgeOffset="3rem">
 *   <PlagueDockItem href="/catalogo" icon={<DiceIcon />} label="Catalogo" isCurrent
 *     render={(props) => <Link {...props} />} />
 *   <PlagueDockItem href="/prestiti" icon={<PoisonIcon />} label="Prestiti"
 *     render={(props) => <Link {...props} />} />
 * </PlagueDock>
 * ```
 */
export function PlagueDock({
  children,
  placement = 'bottom',
  label = 'Navigazione principale',
  autoHideMs = 8000,
  expandLabel = 'Mostra la navigazione',
  expandIcon,
  edgeOffset,
  className = '',
}: PlagueDockProps) {
  const [ritirata, setRitirata] = useState(false);
  const idPannello = useId();
  const pannello = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Chi la sta usando adesso: finché uno dei due è vero, il conto non parte.
  const dentro = useRef({ puntatore: false, fuoco: false });
  const fuocoAllaPrima = useRef(false);
  const verticale = placement === 'left' || placement === 'right';

  const arma = useCallback(() => {
    clearTimeout(timer.current);
    if (autoHideMs <= 0 || dentro.current.puntatore || dentro.current.fuoco) return;
    timer.current = setTimeout(() => setRitirata(true), autoHideMs);
  }, [autoHideMs]);

  const ferma = () => clearTimeout(timer.current);

  // Il conto parte a navigazione aperta, e riparte ogni volta che ricresce.
  useEffect(() => {
    if (!ritirata) arma();
    return () => clearTimeout(timer.current);
  }, [ritirata, arma]);

  useEffect(() => {
    if (ritirata || !fuocoAllaPrima.current) return;
    fuocoAllaPrima.current = false;
    pannello.current?.querySelector<HTMLElement>('a[href], button')?.focus();
  }, [ritirata]);

  const ricresci = (evento: MouseEvent<HTMLButtonElement>) => {
    fuocoAllaPrima.current = evento.detail === 0;
    setRitirata(false);
  };

  const esceIlFuoco = (evento: FocusEvent<HTMLDivElement>) => {
    if (evento.currentTarget.contains(evento.relatedTarget)) return;
    dentro.current.fuoco = false;
    arma();
  };

  const stile = edgeOffset ? ({ '--pb-dock-offset': edgeOffset } as CSSProperties) : undefined;

  return (
    <nav
      aria-label={label}
      data-placement={placement}
      style={stile}
      className={`pointer-events-none fixed z-40 flex ${POSTO[placement]} ${className}`}
    >
      <div className="grid place-items-center">
        <div
          ref={pannello}
          id={idPannello}
          data-slot="dock-panel"
          data-orientation={verticale ? 'vertical' : 'horizontal'}
          data-collapsed={ritirata}
          inert={ritirata}
          onPointerEnter={() => {
            dentro.current.puntatore = true;
            ferma();
          }}
          onPointerLeave={() => {
            dentro.current.puntatore = false;
            arma();
          }}
          onPointerDown={arma}
          onKeyDown={arma}
          onFocus={() => {
            dentro.current.fuoco = true;
            ferma();
          }}
          onBlur={esceIlFuoco}
          // ⚠️ `dark` **e** `text-foreground`, come la barra: un'isola scura su una pagina chiara che
          // non si porta dietro il colore del testo scriverebbe scuro su scuro.
          className={`pb-dock-panel dark pointer-events-auto flex gap-1 rounded-2xl border border-brand/20 bg-gray-950/90 p-1.5 text-foreground shadow-lg backdrop-blur-sm [grid-area:1/1] ${
            verticale ? 'flex-col' : 'flex-row'
          }`}
        >
          {children}
        </div>
        {ritirata ? (
          <button
            type="button"
            aria-label={expandLabel}
            aria-expanded={false}
            aria-controls={idPannello}
            onClick={ricresci}
            className="pb-dock-toggle dark pointer-events-auto flex size-11 items-center justify-center rounded-full border border-brand/30 bg-gray-950/90 text-brand shadow-lg backdrop-blur-sm focus-visible:focus-ring [grid-area:1/1]"
          >
            {expandIcon ?? <RatIcon isFilled animateOn="none" size={22} className="size-5.5" />}
          </button>
        ) : null}
      </div>
    </nav>
  );
}
