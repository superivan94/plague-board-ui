'use client';

import { Dropdown } from '@heroui/react';
import type { ReactNode } from 'react';

import { LUDORATTI_COPY } from '../data/copy.js';
import { SkullIcon } from '../icons/SkullIcon.js';
import { PlagueAvatar } from './PlagueAvatar.js';
import { ThematicBadge, type ThematicBadgeColor } from './ThematicBadge.js';

/**
 * La chiave dell'uscita dentro il menù, con un prefisso che nessuna applicazione scriverebbe per una
 * voce sua. `onAction` non la riceve mai: fuori di qui non esiste.
 */
const ESCI = '__plague-profile-sign-out__';

/** Una voce dell'applicazione nel menù del profilo. */
export interface ProfileMenuItem {
  /** Come la riconosce `onAction`. */
  readonly key: string;
  /** Che cosa c'è scritto, che è anche il nome con cui si annuncia. */
  readonly label: string;
  /** Il segno accanto, se l'applicazione ne vuole uno. */
  readonly icon?: ReactNode;
}

/** Il grado di chi è entrato: il nome del piano, e il colore della sua pastiglia. */
export interface ProfileMenuRank {
  /** «Signore Dabbonico», «Ratto di fogna». Il nome lo decide l'applicazione. */
  readonly label: string;
  /** Il colore della pastiglia. Di serie `default`. */
  readonly color?: ThematicBadgeColor;
}

export interface ProfileMenuProps {
  /** Il nome di chi è entrato. */
  name: string;
  /** L'email, in testa al menù aperto. */
  email?: string;
  /** L'indirizzo del ritratto. Senza, le iniziali di `PlagueAvatar`. */
  avatarSrc?: string;
  /** Il grado, accanto al nome e in testa al menù. */
  rank?: ProfileMenuRank;
  /** Le voci dell'applicazione — «La tua cartella clinica», «Impostazioni» — prima dell'uscita. */
  items?: readonly ProfileMenuItem[];
  /** Una voce dell'applicazione è stata scelta: arriva la sua chiave. */
  onAction?: (key: string) => void;
  /** L'uscita è stata scelta. Sta in un canale suo, non in `onAction`. */
  onSignOut: () => void;
  /** Il nome del comando nell'intestazione. Di serie «Profilo di» e il nome. */
  label?: string;
  /** Le parole dell'uscita. Di serie la voce `signOut` del lessico di casa. */
  signOutLabel?: string;
  /** Classi aggiuntive sul comando. */
  className?: string;
}

/**
 * **Il comando del profilo nell'intestazione**: il ritratto inanellato col nome e il grado, che
 * apre un menù con in testa chi è entrato, poi le voci dell'applicazione, poi l'uscita.
 *
 * Copre le due applicazioni: in Rattoteca apre già un menù con «Esci», in RattInventario apre la
 * scheda del profilo — che qui diventa una voce, e la scheda la apre l'applicazione in `onAction`.
 * Sopra il `Dropdown` di HeroUI, il cui grilletto è già un `<button>` di react-aria: niente `render`
 * da passare, al contrario di `Popover.Trigger`.
 *
 * ⚠️ **L'uscita ha un canale suo**, `onSignOut`, e non una chiave riservata dentro `onAction`: una
 * chiave magica è una chiave che l'applicazione potrebbe usare per una voce sua, e allora una voce
 * qualunque farebbe uscire.
 *
 * ⚠️ **Il nome si vede da `sm` in su**, e sul telefono resta il ritratto: il nome del comando lo
 * dice comunque, e un'intestazione stretta non ha posto per tutti e due.
 *
 * ⚠️ **Dichiara `'use client'`**, come l'intestazione che lo monta: le voci chiamano funzioni.
 */
export function ProfileMenu({
  name,
  email,
  avatarSrc,
  rank,
  items = [],
  onAction,
  onSignOut,
  label = `Profilo di ${name}`,
  signOutLabel = LUDORATTI_COPY.signOut.house,
  className = '',
}: ProfileMenuProps) {
  const pastiglia = rank ? (
    <ThematicBadge color={rank.color}>{rank.label}</ThematicBadge>
  ) : null;

  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label={label}
        className={`flex items-center gap-2 rounded-full focus-visible:focus-ring ${className}`}
      >
        <PlagueAvatar src={avatarSrc} name={name} size="sm" />
        <span className="hidden items-center gap-2 sm:flex">
          <span className="text-sm text-foreground">{name}</span>
          {pastiglia}
        </span>
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end">
        <div className="flex flex-col gap-1 border-b border-border px-3 py-2">
          <span className="text-sm font-medium text-foreground">{name}</span>
          {email ? <span className="text-xs text-muted">{email}</span> : null}
          {pastiglia ? <span className="mt-1">{pastiglia}</span> : null}
        </div>
        <Dropdown.Menu
          aria-label={label}
          onAction={(chiave) => {
            if (chiave === ESCI) onSignOut();
            else onAction?.(String(chiave));
          }}
        >
          {items.length > 0 ? (
            <Dropdown.Section>
              {items.map((voce) => (
                <Dropdown.Item key={voce.key} id={voce.key} textValue={voce.label}>
                  <span data-slot="label" className="flex items-center gap-2">
                    {voce.icon}
                    {voce.label}
                  </span>
                </Dropdown.Item>
              ))}
            </Dropdown.Section>
          ) : null}
          <Dropdown.Section>
            <Dropdown.Item id={ESCI} textValue={signOutLabel} variant="danger">
              {/* ⚠️ Il rosso della variante `danger` HeroUI lo scrive solo su `[data-slot="label"]`:
                  il testo lasciato nudo nella voce restava del colore delle altre, e il teschio con
                  lui. Misurato: `menu-item--danger` presente, `color` uguale alle voci accanto. */}
              <span data-slot="label" className="flex items-center gap-2">
                <SkullIcon size={16} className="size-4" />
                {signOutLabel}
              </span>
            </Dropdown.Item>
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
