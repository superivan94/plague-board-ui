import { BiohazardIcon, PulseDot, RatIcon } from 'plague-board-ui';

// I candidati per il segno che sta a sinistra del marchio nella barra. ⚠️ Vivono qui e non nella
// libreria finché non è scelto: tre di loro moriranno, e un componente pubblicato non si toglie
// più senza rompere chi l'ha importato.

export const MARK_KEYFRAMES = `
/* La goccia appesa: sta, si gonfia, si stacca, e se ne forma un'altra. */
@keyframes mark-hang {
  0%, 55%   { transform: translateY(0) scaleY(1);      opacity: 1; }
  67%       { transform: translateY(0) scaleY(1.3);    opacity: 1; }
  82%       { transform: translateY(16px) scaleY(1.7); opacity: 0; }
  83%       { transform: translateY(0) scaleY(0.5);    opacity: 0; }
  93%, 100% { transform: translateY(0) scaleY(1);      opacity: 1; }
}
/* La bolla dentro la pozione: sale dal fondo e scoppia in superficie. */
@keyframes mark-bubble {
  0%       { transform: translateY(2px);  opacity: 0; }
  25%, 70% { opacity: 1; }
  100%     { transform: translateY(-4px); opacity: 0; }
}
`;

/** La goccia appesa al filo della barra. */
function HangingDrop() {
  return (
    <svg
      width="7"
      height="14"
      viewBox="0 0 8 20"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0 text-brand"
      style={{ animation: 'mark-hang 6s ease-in infinite', transformOrigin: 'top center' }}
    >
      <path d="M4 20C4 20 8 13.68 8 8.82C8 3.96 4 0 4 0C4 0 0 3.96 0 8.82C0 13.68 4 20 4 20Z" />
    </svg>
  );
}

/**
 * La pozione: una boccetta col tappo, il liquido sul fondo e una bolla che sale.
 *
 * ⚠️ Il vetro è a tratto, il liquido è pieno: a 12px il segno che si legge per primo è **la macchia
 * verde in basso**, e il contorno serve solo a dirle che forma ha. Invertendo i due — vetro pieno
 * e liquido a tratto — a questa misura si vedrebbe una patacca.
 *
 * ⚠️ Ed è **12px e non 10**, guardandola a grandezza vera: una boccetta è alta e stretta, e alla
 * misura del pallino il collo e il tappo sparivano, lasciando solo la macchia.
 */
function Potion({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={(size / 14) * 20}
      viewBox="0 0 14 20"
      aria-hidden="true"
      className="shrink-0 text-brand"
    >
      {/* Il tappo, pieno: è il dettaglio che fa leggere «boccetta» invece di «cerchio». */}
      <rect x="4.6" y="0.5" width="4.8" height="2.2" rx="0.9" fill="currentColor" opacity="0.65" />
      <path
        d="M5.7 2.7v3.6M8.3 2.7v3.6"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.7"
        fill="none"
      />
      <circle
        cx="7"
        cy="13"
        r="5.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.7"
      />
      <path d="M1.76 14.3A5.4 5.4 0 0 0 12.24 14.3Z" fill="currentColor" />
      {/* La bolla che sale e scoppia: dice «viva» senza mai sparire del tutto. */}
      <circle
        cx="5.6"
        cy="16.4"
        r="0.85"
        fill="#030712"
        style={{ animation: 'mark-bubble 2.4s ease-in-out infinite' }}
      />
    </svg>
  );
}

export interface MarkCandidate {
  id: string;
  title: string;
  note: string;
  Mark: () => React.ReactElement;
}

export const MARK_CANDIDATES: readonly MarkCandidate[] = [
  {
    id: 'dot',
    title: 'Il pallino, com’è adesso',
    note: 'onesto e illeggibile come marchio: è il segno di stato di qualunque cruscotto.',
    Mark: () => <PulseDot size={8} />,
  },
  {
    id: 'mark',
    title: 'Il marchio che batte',
    note: 'l’emblema di ludoratti.it — a prima vista un cuore, poi due che si abbracciano, infine il muso di un ratto — con un battito piccolo e lento. Dice «vivo» raccontando la prima delle sue tre letture.',
    // ⚠️ 20px e non 18, guardato a grandezza vera: il tratto interno è 1,5 su una griglia da 24,
    // quindi a 18 scende sotto il pixel e il cuore si assottiglia fino a sembrare un graffio. Le
    // orecchie reggono anche più in basso — è la parte piena — ma da sole non raccontano niente.
    Mark: () => <RatIcon size={20} className="animate-heartbeat shrink-0 text-brand" />,
  },
  {
    id: 'potion',
    title: 'La pozione che ribolle',
    note: 'una boccetta col liquido sul fondo e una bolla che sale e scoppia. Non sparisce mai, e sta esattamente nella direzione Laboratorio.',
    Mark: () => <Potion />,
  },
  {
    id: 'drop',
    title: 'La goccia che si stacca',
    note: 'sta appesa, si gonfia, cade, e se ne forma un’altra. È già nostra, ma per sei decimi ogni sei secondi la barra resta senza segno.',
    Mark: HangingDrop,
  },
  {
    id: 'biohazard',
    title: 'Il contagio che ondeggia',
    note: 'l’emblema della famiglia, a 13px e con l’oscillazione lenta. Si riconosce, ma ha già un mestiere: dice «roba della peste», non «acceso».',
    Mark: () => <BiohazardIcon size={13} className="animate-biohazard-sway shrink-0 text-brand" />,
  },
];
