import { Avatar, Badge } from '@heroui/react';
import type { ReactNode } from 'react';

import { BiohazardIcon } from '../icons/BiohazardIcon.js';
import { SkullIcon } from '../icons/SkullIcon.js';

/** Le tre taglie di HeroUI, in pixel. ⚠️ `md` è la base e **non ha una classe**: `.avatar--md` non esiste. */
export const PLAGUE_AVATAR_SIZE = { sm: 32, md: 40, lg: 48 } as const;

/** Una delle tre taglie del ritratto: `sm`, `md` o `lg`. */
export type PlagueAvatarSize = keyof typeof PLAGUE_AVATAR_SIZE;

export interface PlagueAvatarProps {
  /** L'indirizzo del ritratto. Senza, o se non si carica, si vede il ripiego. */
  src?: string;
  /**
   * Chi è ritratto: diventa l'`alt` dell'immagine.
   *
   * ⚠️ Va scritto anche quando accanto c'è già il nome, perché l'immagine e il nome sono due
   * elementi diversi: chi legge con uno screen reader sente prima questo.
   */
  name?: string;
  /** `sm` 32px · `md` 40px · `lg` 48px. Per altre misure, una classe: le utility vincono. */
  size?: PlagueAvatarSize;
  /** Che cosa si vede quando l'immagine non c'è. Senza, il teschio. */
  fallback?: ReactNode;
  /** Il segno nell'angolo. `null` lo toglie. Senza, il biohazard. */
  badge?: ReactNode | null;
  /** Il segno nell'angolo pulsa. Spento, perché un ritratto non è un allarme. */
  isPulsing?: boolean;
  /** Classi aggiuntive sull'ancora, che è il riquadro esterno. */
  className?: string;
}

/**
 * **Il ritratto di chi è dentro la rete della peste**: cerchio, anello verde, e un segno
 * nell'angolo.
 *
 * Sopra `Avatar` e `Badge` di HeroUI — che portano il caricamento dell'immagine, il ripiego e il
 * posizionamento della pastiglia — con addosso le due cose che sono nostre: la **forma tonda** e
 * l'**anello del marchio**.
 *
 * ⚠️ **HeroUI fa un quadrato stondato, non un cerchio**: `.avatar` ha
 * `border-radius: calc(var(--radius) * 3)`, misurato nel suo CSS. Il `rounded-full` che lo
 * raddrizza è una utility, e le utility stanno in `@layer utilities` mentre i suoi componenti
 * stanno in `@layer components`: vince la nostra senza dipendere dall'ordine degli import.
 *
 * ⚠️ **L'anello è un `ring`, non un `border`**, e la differenza si vede sul layout: un bordo
 * entra nella misura dell'elemento e farebbe un avatar da 48 px largo 54, mentre l'anello è
 * un'ombra e non sposta niente. Il colore è `brand-ink`, cioè il verde che **cambia col tema** —
 * lime-700 in chiaro, lime pieno in scuro — perché un ritratto vive tanto su una lastra scura
 * quanto su una scheda chiara.
 *
 * ⚠️ **Il disco resta scuro nei due temi**, ed è un'isola dichiarata come la barra: un ritratto è
 * un buco nella pagina, non una superficie che la continua, e il teschio verde dentro un disco
 * chiaro sparirebbe. Misurato il 2026-09-20 in tema chiaro: il teschio sul disco fa **9,73**, e il
 * disco sulla pagina **13,46**. Non è traslucido, che è l'altra metà della stessa regola.
 *
 * ⚠️ **In jsdom l'immagine non compare mai.** `Avatar` di HeroUI è `@radix-ui/react-avatar`, che
 * mostra l'`<img>` **solo dopo che si è caricata davvero**: nei test si vede sempre il ripiego, e
 * `src`/`alt` si guardano nel playground. È un confine dichiarato, non una svista. (Nel browser
 * succede il contrario: a caricamento finito il ripiego viene **tolto** dal DOM.)
 *
 * @example
 * ```tsx
 * <PlagueAvatar src={utente.foto} name={utente.nome} size="lg" />
 * <PlagueAvatar badge={null} />
 * ```
 */
export function PlagueAvatar({
  src,
  name,
  size = 'md',
  fallback,
  badge,
  isPulsing = false,
  className = '',
}: PlagueAvatarProps) {
  const segno = badge === undefined ? <BiohazardIcon size={10} /> : badge;

  return (
    <Badge.Anchor className={className}>
      <Avatar size={size} className="rounded-full bg-gray-800 ring-2 ring-brand-ink">
        {src ? <Avatar.Image src={src} alt={name} className="rounded-full object-cover" /> : null}
        {/* ⚠️ Il ripiego c'è **sempre**: Radix lo mostra mentre l'immagine carica e quando fallisce,
            quindi non è un ramo alternativo ma quello che si vede per primo. */}
        <Avatar.Fallback className="rounded-full bg-gray-800 text-brand">
          {fallback ?? <SkullIcon size={PLAGUE_AVATAR_SIZE[size] / 2} />}
        </Avatar.Fallback>
      </Avatar>
      {segno === null ? null : (
        <Badge
          size="sm"
          placement="bottom-right"
          className={`border-gray-950 bg-brand text-gray-950 ${isPulsing ? 'animate-pulse' : ''}`}
        >
          {segno}
        </Badge>
      )}
    </Badge.Anchor>
  );
}
