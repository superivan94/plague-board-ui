'use client';

import { Modal } from '@heroui/react';
import type { ReactNode } from 'react';

import { PLAGUE_SURFACE_CLASS } from './plagueSurface.js';

/** Le taglie del dialogo: quelle di HeroUI, meno le due che occupano lo schermo intero. */
export type PlagueDialogSize = 'xs' | 'sm' | 'md' | 'lg';

export interface PlagueDialogProps {
  /** Se è aperto. Lo tiene chi lo monta: il dialogo dice solo quando vuole chiudersi. */
  isOpen: boolean;
  /** Arriva con `false` quando si preme la croce, Esc, o fuori dal dialogo. */
  onOpenChange: (isOpen: boolean) => void;
  /** Il titolo, che è anche il nome con cui il dialogo si annuncia. */
  title: ReactNode;
  /** Quello che sta dentro. */
  children: ReactNode;
  /** I comandi in fondo — «Salva», «Annulla». Senza, il piede non c'è. */
  footer?: ReactNode;
  /** Quanto è largo. Di serie `md`. */
  size?: PlagueDialogSize;
  /** Il nome della croce in alto. Di serie «Chiudi»: quello di HeroUI nasce «Close». */
  closeLabel?: string;
  /** Classi aggiuntive sulla lastra del dialogo. */
  className?: string;
}

/**
 * **Il dialogo dei Ludoratti**: il `Modal` di HeroUI sulla superficie della peste — lo stesso bordo
 * verde e la stessa sfumatura di {@link PlaguePanel}, perché un dialogo che si apre sopra una scheda
 * è la stessa lastra.
 *
 * Per chiedere una conferma prima di distruggere qualcosa c'è {@link PlagueConfirmDialog}, che è un
 * `alertdialog` e si comporta di conseguenza; questo è per tutto il resto.
 *
 * ⚠️ **Il titolo è un `h2`, e non c'è bisogno di dirglielo**: fuori il `Heading` di react-aria vale
 * `h3`, ma dentro un `Dialog` il livello lo dà il dialogo, e vale 2. Misurato togliendo il livello
 * scritto a mano: il test sul titolo restava verde.
 *
 * ⚠️ **Dichiara `'use client'`**: chi lo apre e lo chiude è per forza un componente client, e i
 * comandi che gli stanno dentro sono funzioni.
 *
 * @example
 * ```tsx
 * <PlagueDialog isOpen={aperto} onOpenChange={setAperto} title="Le tue colonie"
 *   footer={<Button onPress={() => setAperto(false)}>Fatto</Button>}>
 *   <ElencoColonie />
 * </PlagueDialog>
 * ```
 */
export function PlagueDialog({
  isOpen,
  onOpenChange,
  title,
  children,
  footer,
  size = 'md',
  closeLabel = 'Chiudi',
  className = '',
}: PlagueDialogProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container size={size}>
          <Modal.Dialog className={`${PLAGUE_SURFACE_CLASS} ${className}`}>
            <Modal.CloseTrigger aria-label={closeLabel} />
            <Modal.Header>
              <Modal.Heading>{title}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            {footer ? <Modal.Footer>{footer}</Modal.Footer> : null}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
