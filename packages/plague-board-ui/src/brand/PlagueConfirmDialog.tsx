'use client';

import { AlertDialog, Button } from '@heroui/react';
import type { ReactNode } from 'react';

import { LUDORATTI_COPY } from '../data/copy.js';
import { PlagueLoader } from './PlagueLoader.js';
import { PLAGUE_SURFACE_CLASS } from './plagueSurface.js';
import { statusIcon } from './statusIcons.js';

/** Se la conferma distrugge qualcosa o no: cambia il colore del comando, il segno e le parole. */
export type PlagueConfirmTone = 'danger' | 'primary';

export interface PlagueConfirmDialogProps {
  /** Se è aperta. Lo tiene chi la monta. */
  isOpen: boolean;
  /** La domanda, che è anche il nome con cui si annuncia: «Estingui il ceppo», «Esci dalla colonia». */
  title: ReactNode;
  /** Che cosa succede se si conferma, detto in chiaro. */
  message: ReactNode;
  /** `danger` per ciò che non si può disfare, `primary` per il resto. Di serie `danger`. */
  tone?: PlagueConfirmTone;
  /** Il comando che conferma. Di serie «Elimina» in `danger` e «Conferma» in `primary`. */
  confirmLabel?: string;
  /** Il comando che lascia com'era. Di serie «Annulla». */
  cancelLabel?: string;
  /**
   * La conferma è partita e si sta aspettando la risposta. Il dialogo non si chiude più — né con
   * Esc, né con «Annulla» — e il comando mostra l'attesa.
   */
  isPending?: boolean;
  /** Il segno in testa. Di serie il teschio in `danger` e l'ampolla in `primary`. */
  icon?: ReactNode;
  /** Si è confermato. Chiudere il dialogo, a risposta arrivata, è di chi lo monta. */
  onConfirm: () => void;
  /** Si è lasciato perdere: «Annulla», o Esc. */
  onCancel: () => void;
}

/**
 * **La conferma prima di un'azione che non si disfa**: il dialogo che le due applicazioni
 * disegnano ognuna a modo suo, e RattInventario in un punto ancora col `window.confirm` del
 * browser. La forma viene dal `ConfirmDialog` di Rattoteca, che regge; sotto c'è l'`AlertDialog`
 * di HeroUI.
 *
 * ⚠️ **È un `alertdialog`, non un `dialog`**: chi legge con la voce sente «avviso» e sa che gli si
 * chiede di decidere. E non si chiude cliccando fuori — una decisione non si prende per sbaglio —
 * mentre Esc annulla, come si aspetta chiunque usi la tastiera.
 *
 * ⚠️ **In `danger` il comando dice che cosa fa in chiaro**: è la regola della voce `delete` del
 * lessico, l'unica che si usa col generico accanto. Il titolo può essere di casa — «Estingui il
 * ceppo» — ma «Elimina» è quello che si preme sapendo che cosa succede.
 *
 * ⚠️ **In attesa non si chiude**: chiuderlo a metà vorrebbe dire non sapere più se l'azione è
 * avvenuta. Il comando usa `isPending` e non `isDisabled`, così il fuoco resta dov'è.
 *
 * @example
 * ```tsx
 * <PlagueConfirmDialog
 *   isOpen={daEliminare !== null}
 *   title="Estingui il ceppo"
 *   message="La scheda di PARKS verrà eliminata, e non si torna indietro."
 *   isPending={eliminazione.isPending}
 *   onConfirm={() => eliminazione.mutate(daEliminare)}
 *   onCancel={() => setDaEliminare(null)}
 * />
 * ```
 */
export function PlagueConfirmDialog({
  isOpen,
  title,
  message,
  tone = 'danger',
  confirmLabel = tone === 'danger' ? LUDORATTI_COPY.delete.plain : 'Conferma',
  cancelLabel = 'Annulla',
  isPending = false,
  icon,
  onConfirm,
  onCancel,
}: PlagueConfirmDialogProps) {
  const distrugge = tone === 'danger';

  return (
    <AlertDialog
      isOpen={isOpen}
      onOpenChange={(aperto) => {
        if (!aperto && !isPending) onCancel();
      }}
    >
      <AlertDialog.Backdrop isKeyboardDismissDisabled={isPending}>
        <AlertDialog.Container size="sm">
          <AlertDialog.Dialog className={PLAGUE_SURFACE_CLASS}>
            <AlertDialog.Header>
              <AlertDialog.Icon status={distrugge ? 'danger' : 'accent'}>
                {icon ?? statusIcon(distrugge ? 'danger' : 'accent')}
              </AlertDialog.Icon>
              <AlertDialog.Heading>{title}</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>{message}</AlertDialog.Body>
            <AlertDialog.Footer>
              <Button variant="tertiary" isDisabled={isPending} onPress={onCancel}>
                {cancelLabel}
              </Button>
              <Button variant={distrugge ? 'danger' : 'primary'} isPending={isPending} onPress={onConfirm}>
                {/* Muta, come nel comando di Google: l'attesa la annuncia già react-aria. */}
                {isPending ? (
                  <span aria-hidden="true" className="inline-flex">
                    <PlagueLoader />
                  </span>
                ) : null}
                {confirmLabel}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
