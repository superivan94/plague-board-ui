'use client';

import { Toast } from '@heroui/react';

import { PlagueLoader } from './PlagueLoader.js';
import { statusIcon } from './statusIcons.js';

/** Dove compaiono le notifiche: gli stessi sei angoli e bordi di HeroUI. */
export type PlagueToastPlacement = 'top' | 'top start' | 'top end' | 'bottom' | 'bottom start' | 'bottom end';

export interface PlagueToastRegionProps {
  /** Dove compaiono. Di serie in basso a destra, lontano dall'intestazione. */
  placement?: PlagueToastPlacement;
  /** Il nome della croce di ogni notifica. Di serie «Chiudi»: quella di HeroUI nasce «Close». */
  closeLabel?: string;
  /** Classi aggiuntive sulla regione. */
  className?: string;
}

/**
 * **La regione delle notifiche a comparsa**, coi segni della peste: il teschio per un errore, il
 * biohazard per un avviso, il marchio pieno per un successo, e il marchio che batte per un'attesa.
 * Sopra il `Toast.Provider` di HeroUI, che tiene la coda, i tempi, l'impilamento e l'accessibilità.
 *
 * Si monta **una volta**, in cima all'applicazione, e le notifiche si mandano da dovunque con
 * `toast()` di HeroUI — `toast.success('Sigillato')`, `toast.danger('Il ceppo è degenerato')`,
 * `toast('Importo…', { isLoading: true })`.
 *
 * ⚠️ **`toast()` si importa da `@heroui/react`, non da qui**: le peer si dichiarano, non si
 * riesportano, e una seconda porta per la stessa funzione farebbe credere che siano due cose.
 *
 * ⚠️ **Il disegno di ogni notifica è riscritto qui**, ed è il prezzo dei segni nostri: HeroUI sceglie
 * l'icona **predefinita** dentro la sua funzione di disegno — chi manda una notifica può passarne
 * una sua con `indicator`, ma per cambiarle tutte bisogna disegnare la notifica da sé. Quello
 * che si perde è la sua distinzione fra telefono e schermo largo per il comando d'azione, che qui sta
 * sempre sotto il testo.
 *
 * ⚠️ **Dichiara `'use client'`**: la regione vive nel browser, e la coda con lei.
 */
export function PlagueToastRegion({
  placement = 'bottom end',
  closeLabel = 'Chiudi',
  className,
}: PlagueToastRegionProps) {
  return (
    <Toast.Provider placement={placement} className={className}>
      {({ toast: notifica }) => {
        const { title, description, indicator, isLoading, variant = 'default', actionProps } = notifica.content ?? {};

        return (
          <Toast toast={notifica} placement={placement} variant={variant} className="border border-brand-ink/40">
            {indicator === null ? null : (
              <Toast.Indicator variant={variant}>
                {/* Muta: a dire che si aspetta è il titolo, dentro una notifica che si annuncia già. */}
                {isLoading ? (
                  <span aria-hidden="true" className="inline-flex text-xl leading-none">
                    <PlagueLoader />
                  </span>
                ) : (
                  (indicator ?? statusIcon(variant))
                )}
              </Toast.Indicator>
            )}
            <Toast.Content>
              {title ? <Toast.Title>{title}</Toast.Title> : null}
              {description ? <Toast.Description>{description}</Toast.Description> : null}
              {actionProps?.children ? <Toast.ActionButton {...actionProps} /> : null}
            </Toast.Content>
            <Toast.CloseButton aria-label={closeLabel} />
          </Toast>
        );
      }}
    </Toast.Provider>
  );
}
